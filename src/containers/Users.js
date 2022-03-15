import React, { useCallback, useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Popup from '../components/Popup';
import toast, { Toaster } from 'react-hot-toast';

import gqlsuspense from 'graphql-suspense'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { listGroups } from '../graphql/customQueries'

import * as lib from "../lib/aggridFun";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/dist/main.css';
import 'ag-grid-enterprise';
import { createGroups, updateGroups, deleteGroups } from '../graphql/customMutations'

Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>회원리스트</h3>    
          <Table />
      </Suspense> 
  );
}

const Table = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [addRows, setAddRows] = useState([]);
  const [updateRows, setUpdateRows] = useState([]);
  const [delRows, setDelRows] = useState([]);
  const [isEditted, setIsEditted] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const data = gqlsuspense(API.graphql(graphqlOperation(listGroups)));
  const x = data.data.listGroups.items;
  const sourceLists = data.data.listGroups.items;
  //console.log("sourceLists->",sourceLists);
  const lists = sourceLists.map(({ name: label, ...rest }) => ({ label, ...rest }));
  const pre=lists.filter((v,i,a)=>a.findIndex(t=>(t.type === v.type))===i)
  const dropdownData=pre.map(a => a.type)
  const autopcompleteData = lists.map((a) => { return {label:a.label}})
  //console.log(dropdownData);

  const  LinkComponent=(props)=> {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://smile195110-dev.s3.ap-northeast-2.amazonaws.com/public/" + props.value}
      >
        {props.value==null  || props.value==="" ? "":"Y" }
      </a>
    );
  }

  const [columnDefs, setColumnDefs] = useState([
    {checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, floatingFilter: false, },
    { field: 'id',headerName : '아이디', filter:'agTextColumnFilter', editable: false},
    { field: 'name',  headerName : '담당자명', filter:'agTextColumnFilter', valueParser: lib.CheckRegExp.name},
    { field: 'email', headerName : '이메일', minWidth: 180, filter:'agTextColumnFilter',valueParser: lib.CheckRegExp.email},
    { field: 'phone_number', headerName : '휴대폰', minWidth: 150, filter:'agTextColumnFilter', valueFormatter: p => lib.Format.phone(p),valueParser: lib.CheckRegExp.phone_number},
    {
      field: "company", headerName: "회사명", filter:'agTextColumnFilter',   
      cellEditor: AutocompleteSelectCellEditor,minWidth: 200, 
      cellEditorParams: { required: true, selectData: autopcompleteData, placeholder: "그룹명을 입력해주세요."},
      valueFormatter: params => { if (params.value) { return params.value.label; } return ""; },
      valueParser: lib.CheckRegExp.company
    },
    { field: 'brand',headerName : '브랜드', filter:'agTextColumnFilter',valueParser: lib.CheckRegExp.brand},
    { field: 'ceoName',headerName : '대표자명', filter:'agTextColumnFilter',valueParser: lib.CheckRegExp.ceoName},
    { field: 'ceoPhone',headerName : '대표자 휴대폰', minWidth: 130, filter:'agTextColumnFilter', valueFormatter: p => lib.Format.ceoPhone(p),valueParser: lib.CheckRegExp.ceoPhone},
    { field: 'bizNum',headerName : '사업자등록번호',  minWidth: 180, filter:'agTextColumnFilter', valueFormatter: p => lib.Format.bizNum(p),valueParser: lib.CheckRegExp.bizNum},
    { field: 'bizAddr', headerName : "사업자주소", minWidth: 300, filter:'agTextColumnFilter',valueParser: lib.CheckRegExp.bizAddr,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
    },
    { field: 'stateName', headerName: "그룹", editable: true, filter:'agTextColumnFilter', minWidth : 120,
      cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
      cellEditorParams: { cellHeight: 50, values: dropdownData }
    },
    { field: 'bizLicName', headerName : '사업자등록증', minWidth: 120, filter:'agTextColumnFilter', cellRenderer: LinkComponent, editable: false, },
    { field: 'createAt', headerName : '가입일시', filter: "agDateColumnFilter", sort: 'desc', minWidth: 200, 
      cellRenderer: (data) => {
      return data.value ? (new Date(data.value)).toLocaleString() : ''; //toLocaleDateString
      },
      filterParams: {
        comparator: function(filterLocalDateAtMidnight, cellValue) {
          var dateAsString = cellValue;
          if (dateAsString == null) return -1;
          const y=dateAsString.substr(0,4) //2022
          const m=dateAsString.substr(5,2) //03
          const d=dateAsString.substr(8,2) //06
          var cellDate = new Date(Number(y), Number(m)-1, Number(d));        
          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) { return 0; }
          if (cellDate < filterLocalDateAtMidnight) { return -1; }
          if (cellDate > filterLocalDateAtMidnight) { return 1; }
        },
        browserDatePicker: true
      }
    },
  
  ]);

  let stateNameType = '미분류';

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      editable: true,
      resizable: true,
      floatingFilter: true,
      sortable: true,
    };
  }, []);


  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => params.api.setRowData(data);
    listAllUsers();
    updateData(rowData);
    const columnIds = [];
    params.columnApi.getAllColumns().forEach(column => {
      columnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(columnIds);
  };

  async function handleQuickFilter(event){
    gridApi.setQuickFilter(event.target.value);
  };

  let nextToken;
  async function listAllUsers(limit){
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let myInit = { 
        queryStringParameters: {
          //"groupname": "admin",
          //"Filter": "",
          "Limit": 10,
          //"UserPoolId": "ap-northeast-2_Xc0NzEeIU"
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    //console.log("User---->",rest.Users);
    
    
    const users = rest.Users.map((ele) => {
      const { Attributes } = ele;
      let u=Attributes.reduce((agg, {Name, Value}) => {
        //console.log("ele--->",ele)
        if (Name === 'name') { agg.name = Value; }
        if (Name === 'email') { agg.email = Value; }
        if (Name === 'phone_number') { agg.phone_number = Value; }
        if (Name === 'custom:company') { agg.company = Value; }
        if (Name === 'custom:bizNum') { agg.bizNum = Value; }
        if (Name === 'custom:bizAddr') { agg.bizAddr = Value; }
        if (Name === 'custom:brand') { agg.brand = Value; }
        if (Name === 'custom:ceoName') { agg.ceoName = Value; }
        if (Name === 'custom:ceoPhone') { agg.ceoPhone = Value; }
        if (Name === 'custom:stateName') { agg.stateName = Value; }
        if (Name === 'custom:bizLicName') { agg.bizLicName = Value; }
        if (Name === 'sub') { agg.sub = Value; }                
        return agg;        
      }, {});
      
      u.createAt=ele.UserCreateDate;
      u.id=ele.Username;

      return u;      
    });
    //console.log("users->",users);
    setRowData(users);

    return rest;
  }


  async function handleQuickFilter(e){
    gridApi.setQuickFilter(e.target.value);
  };

  async function onBtAddRow(){
    setIsOpen(!isOpen);
  }

  async function onBtSave() {
    const tempUpdateRow=[];
    gridRef.current.api.stopEditing();
    gridRef.current.api.forEachNodeAfterFilterAndSort( function(rowNode, index) {
        if(rowNode.data.edit){
          tempUpdateRow.push(rowNode.data);
        }
    });
    console.log("updateRows-->",tempUpdateRow);
    setUpdateRows(updateRows => [...updateRows, tempUpdateRow]);

    if(tempUpdateRow.length!=0){
      for (const [index, value] of tempUpdateRow.entries()) {
        try {

          const attributes=[
            { Name: 'phone_number', Value: value.phone_number },
            { Name: 'name', Value: value.name },
            { Name: 'email', Value: value.email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'custom:company', Value: value.company },
            { Name: 'custom:brand', Value: value.brand },
            { Name: 'custom:bizNum', Value: value.bizNum },
            { Name: 'custom:bizAddr', Value: value.bizAddr },
            { Name: 'custom:bizLicName', Value: value.bizLicName },
            { Name: 'custom:stateName', Value: value.stateName },
            { Name: 'custom:ceoName', Value: value.ceoName },
            { Name: 'custom:ceoPhone', Value: value.ceoPhone },
          ]
          //console.log(value);
           //'custom:groupName' : groupName,
          await updateUser(value.id, attributes)
          .then((d) => { console.log(d); })
          .catch(() => { console.log("update Row fail"); });


        } catch (error) { console.log(error); }
      };
    }

    if(delRows.length!=0){
      for (const [index, value] of delRows.entries()) {
        try {
        //console.log(value.sub);
         await deleteUser(value.id)
          .then((d) => { console.log(d); })
          .catch(() => { console.log("delete Row fail"); });
          //await API.graphql({ query: deleteGroups, variables: { input: { id: value.id } }})
          
        } catch (error) { console.log(error); }
      };
    }
    //window.location.replace("/users");
  }

  async function onBtDelete() {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log("selectedRows->",selectedRows);
    if(selectedRows.length==0){
      alert("삭제할 건을 선택해주세요.");
    }else{
      selectedRows.forEach( function(selectedRow, index) {
        setDelRows(delRows => [...delRows, selectedRow]);
        gridApi.applyTransaction({remove: [selectedRow]});
      });
      setIsEditted(false);
    }
    //console.log("delRows->>",delRows);
}

const createUser = async (username, userAttributes) => {
  const apiName = 'AdminQueries';
  const path = '/createUser';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body: {
      username,
      userAttributes,
    },
  };
  return await API.post(apiName, path, params);
};

const updateUser = async (username, userAttributes) => {
  const apiName = 'AdminQueries';
  const path = '/updateUser';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body: {
      username,
      userAttributes,
    },
  };
  return await API.post(apiName, path, params);
};

const deleteUser = async (username) => {
  const apiName = 'AdminQueries';
  const path = '/deleteUser';
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body: { username },
  };
  return await API.post(apiName, path, params);
};


  async function onCellEditingStopped(e){
    gridRef.current.api.stopEditing();
    const data=e.data;
      setIsEditted(false);
      data.edit = true;
      if(updateRows.some(v => v.id === data.id)){
        setUpdateRows(updateRows.filter(updateRows => updateRows.id !== data.id));
      }
      setUpdateRows(updateRows => [...updateRows, data]);
    
    //console.log("updateRows->",updateRows);
    //console.log("currentRows->",data);
    //console.log("currentRows label->",data.label.label); 
    
  }  

  const externalFilterChanged = useCallback((newValue) => {
    stateNameType = newValue;
    gridRef.current.api.onFilterChanged();
  }, []);

  const isExternalFilterPresent = useCallback(() => { return stateNameType !== 'all'; }, []);

  const doesExternalFilterPass = useCallback(
    (node) => {
      switch (stateNameType) {
        case 'none':
          return node.data.stateName == "미분류";
          case 'mem':
            return node.data.stateName != "미분류";
        default:
          return true;
      }
    },
    [stateNameType]
  );

  return (

      <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
        <Toaster/>
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <input
                type="text"
                placeholder="통합 검색"
                onChange={handleQuickFilter}
                className={`form-control`}
              />
          </Col>
          <Col xs="auto">
            <div className="filterHeader">
            <input type="radio" name="filter" id="all" defaultChecked onChange={() => externalFilterChanged('all')} />
            <span className="mr-4">전체</span> 
            <input type="radio" name="filter" id="none" onChange={() => externalFilterChanged('none')} />
            <span className="mr-4">임시회원</span>
            <input type="radio" name="filter" id="mem" onChange={() => externalFilterChanged('mem')} />
            <span >정회원</span>
            </div>
          </Col>
          <Col xs="auto">
          <ButtonGroup>
            <Button type="button" onClick={onBtAddRow}>신규등록</Button>
            <Button type="button" onClick={onBtDelete}>선택건 삭제</Button>
            <Button type="button" onClick={onBtSave} disabled={isEditted}>서버저장</Button>
          </ButtonGroup>
          </Col>
    
        </Row>
        <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            defaultColDef={defaultColDef}
            rowSelection={'multiple'}
            localeText= {{noRowsToShow : '조회 결과가 없습니다.'}}
            onCellEditingStopped={onCellEditingStopped}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}


            //suppressRowClickSelection={false}
            //floatingFiltersHeight ={30}
            //onSelectionChanged={onSelectionChanged}
            //onCellEditingStopped={(e) => {onCellValueChanged(e);}}
     
            //enableCellChangeFlash={true}
            //onRowDataUpdated={(e) => { console.log("변경->",e); }}
          >
     
          </AgGridReact>
          {isOpen && <Popup
            content={<>
              <b>Design your Popup</b>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <button>Test button</button>
            </>}
            handleClose={onBtAddRow}
          />}
      </div>
  );
}

const Users = () => { return (<LoadTable />); }
export default Users;