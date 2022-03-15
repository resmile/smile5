import Amplify, { Auth, API, graphqlOperation} from 'aws-amplify';
import React, { forwardRef, useImperativeHandle, useState, memo, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as lib from "../lib/aggridFun";

import { GridApi, ColumnApi } from 'ag-grid-community';
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from 'react-hot-toast';

Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>회원리스트</h3>
          <Tabs defaultActiveKey="noneTab" id="uncontrolled-tab-example" >
            <Tab eventKey="noneTab" title="미분류">
              <Table mode="none" modeKr="미분류" groupMemNameKr="입급자명 ( , 로 구분 입력)"/>
            </Tab>
            <Tab eventKey="buyerTab" title="매출처">
              <Table mode="buyer" modeKr="매출처" groupMemNameKr="입급자명 ( , 로 구분 입력)"/>
            </Tab>
            <Tab eventKey="sellerTab" title="매입처">
              <Table mode="seller" modeKr="매입처" groupMemNameKr="입급자명 ( , 로 구분 입력)"/>
            </Tab>
            <Tab eventKey="deliveryTab" title="배송기사">
              <Table mode="delivery" modeKr="배송" groupMemNameKr="식당명"/>
            </Tab>
            <Tab eventKey="smileTab" title="스마일">
              <Table mode="smile" modeKr="스마일" groupMemNameKr="식당명"/>
            </Tab>
          </Tabs>
      </Suspense> 
  );
}

function Table({
  mode, modeKr, groupMemNameKr
}) {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [addRows, setAddRows] = useState([]);
  const [addRowNo, setAddRowNo] = useState(0);
  const [updateRows, setUpdateRows] = useState([]);
  //const [editedRows, setEditedRows] = useState([]);
  const [delRows, setDelRows] = useState([]);
  const [isEditted, setIsEditted] = useState(true);
  const notify = (msg) => toast.error(msg);
  
  const [columnDefs, setColumnDefs] = useState([
    { field: 'id',headerName : '아이디', filter:'agTextColumnFilter'},
    { field: 'name', 
      headerName : '담당자명', 
      filter:'agTextColumnFilter',
      //headerCheckboxSelection: true,
      //headerCheckboxSelectionFilteredOnly: true,
      //checkboxSelection: true,
      valueParser: lib.CheckRegExp.name,
    },
    { field: 'email', headerName : '이메일', filter:'agTextColumnFilter', editable: true, valueParser: lib.CheckRegExp.email},
    { field: 'phone_number', headerName : '휴대폰', minWidth: 200, filter:'agTextColumnFilter', editable: true, valueFormatter: p => lib.Format.phone(p),valueParser: lib.CheckRegExp.phone_number},
    { field: 'company',headerName : '회사명', filter:'agTextColumnFilter', editable: true, valueParser: lib.CheckRegExp.company},
    { field: 'brand',headerName : '브랜드', filter:'agTextColumnFilter', editable: true, valueParser: lib.CheckRegExp.brand},
    { field: 'ceoName',headerName : '대표자명', filter:'agTextColumnFilter', editable: true, valueParser: lib.CheckRegExp.ceoName},
    { field: 'ceoPhone',headerName : '대표자 휴대폰', filter:'agTextColumnFilter', editable: true, valueFormatter: p => lib.Format.ceoPhone(p),valueParser: lib.CheckRegExp.ceoPhone},
    { field: 'bizNum',headerName : '사업자등록번호',  minWidth: 180, filter:'agTextColumnFilter', editable: true, valueFormatter: p => lib.Format.bizNum(p),valueParser: lib.CheckRegExp.bizNum},
    { field: 'bizAddr',headerName : '사업자주소', minWidth: 200, filter:'agTextColumnFilter', editable: true, valueParser: lib.CheckRegExp.bizAddr},
    { field: 'stateName',headerName : '분류', filter:'agTextColumnFilter'},
  
    { field: 'createAt',headerName : '가입일', filter:'agTextColumnFilter'},    

  ]);

  /*
{ field: 'bizLicName',
      headerName : '사업자등록증',
      filter:'agTextColumnFilter',
      cellRenderer: LinkComponent,
      editable: false,
    },
  */
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => params.api.setRowData(data);
    listAllUsers();
    updateData(rowData);
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
    console.log("User---->",rest.Users);

    
    const users = rest.Users.map((ele) => {
      const { Attributes } = ele;
      let u=Attributes.reduce((agg, {Name, Value}) => {
        console.log("ele--->",ele)
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
    console.log("users->",users);
    setRowData(users);
    return rest;
  }

  async function handleQuickFilter(e){
    gridApi.setQuickFilter(e.target.value);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      resizable: true,
      floatingFilter: true,
      sortable: true,
    };
  }, []);


let modeType = mode;

const isExternalFilterPresent = useCallback(() => {
  return modeType !== 'all';
}, []);

const doesExternalFilterPass = useCallback(
  (node) => {
    switch (modeType) {
      case 'buyer': return node.data.type == "매출처";
      case 'seller': return node.data.type == "매입처";
      case 'none': return node.data.type == "미분류";
      case 'admin': return node.data.type == "스마일";
      default: return true;
    }
  },
  [modeType]
);



  return (
    <div className="ag-theme-alpine" style={{height: 600, width: "100%"}}>
    <Row className="align-items-center mb-3 mt-5">
        <Col xs="auto">
          <input type="text" placeholder="통합 검색" onChange={handleQuickFilter} className={`form-control`} />
        </Col>
        <Col xs="auto">
        <p>{mode}</p>
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
              //onCellEditingStopped={onCellEditingStopped}
              undoRedoCellEditing={true}
              undoRedoCellEditingLimit={20}
              //onCellKeyPress={onCellKeyPress}
              //isExternalFilterPresent={isExternalFilterPresent}
              //doesExternalFilterPass={doesExternalFilterPass}
              >
         </AgGridReact>
    </div>
  );
}
/*
const Users1 = () => {

  


  


  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      resizable: true,
      floatingFilter: true,
      editable: true,
      sortable: true,
    };
  }, []);


  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => params.api.setRowData(data);
    listAllUsers();
    updateData(rowData);
  };
  const [loading, setLoading]=useState(true);
  const onSelectionChanged = () => {
    const data = gridApi.getSelectedRows();

    if (data.length > 0) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
    setSelectedRows(gridApi.getSelectedRows());
  };

  const onCellValueChanged = (e) => {

    const colId = e.column.getId();
    if(colId==='stateName'){
    //  
    }
    console.log("cellChange e->",e);
    console.log("changed", e.data);
    console.log("allData", rowData);
    
    if(e.newValue != e.oldValue){
      delete e.data.createdAt;
      delete e.data.updatedAt;
      setEditedRows(editedRows => [...editedRows, e.data])

      if(editedRows.length!=0){
        let temp1=editedRows.reverse();

        let temp = temp1.filter((item1, idx1)=>{
          return temp1.findIndex((item2, idx2)=>{
              console.log(item1.id == item2.id);
           
              return item1.sub == item2.sub;
          }) == idx1;
      });

      setEditedRows(temp)
      console.log("changed rows", temp);  


      }else{
        delete e.data.createdAt;
        delete e.data.updatedAt;
        
      console.log("changed rows", editedRows);  

      }


   
    }
  };


  async function onEditedRowsSave() {
    try {
     console.log(editedRows);
      
    } catch (err) {
      console.log({ err })
    }

  }

  const onAddRow = () => {
    
    gridApi.updateRowData({
      add: [{ email: '', phone_number: '+8210', company: '', brand: '', ceoName:'', ceoPhone:'010', bizNum:'', bizAddr:'', stateName:'미분류', bizLicName:'' }]
        , addIndex:0 });
}

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
    console.log("User---->",rest.Users);

    
    const users = rest.Users.map((ele) => {
      const { Attributes } = ele;
      let u=Attributes.reduce((agg, {Name, Value}) => {
        console.log("ele--->",ele)
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
    console.log("users->",users);
    setRowData(users);
    setLoading(false);
    return rest;
  }

  const CommonGrid = {
    defaultBlank : " - ",
    formatCurrency : function (param){
      if(!param.value && param.value != "0") {
          return CommonGrid.defaultBlank;
      }    
      return parseInt(param.value).format();
    },
    formatBizNum : function (param){
      if(!param.value && param.value != "0") {
          return CommonGrid.defaultBlank;
      }    
      return param.value.substr(0, 3) + "-" + param.value.substr(3, 2) + "-" + param.value.substr(5);
    },
    formatCeoPhone : function (param){
      let num=param.value;
      let result="";
      if(num.substr(0, 2) === '02') {
        if(num.substr(2).length==7){ result=num.substr(0,2)+"-"+num.substr(2,3)+"-"+num.substr(5); }
        else{result=num.substr(0,2)+"-"+num.substr(2,4)+"-"+num.substr(6); }
        return result
      }else{
        if(num.substr(3).length==7){ result=num.substr(0,3)+"-"+num.substr(3,3)+"-"+num.substr(6); }
        else{result=num.substr(0,3)+"-"+num.substr(3,4)+"-"+num.substr(7); }
        return result
      }
    },
    formatPhone : function (param){
      let num=param.value;
      let result="";
        if(num.substr(5).length==7){ result=num.substr(0,3)+"-"+num.substr(3,2)+"-"+num.substr(5,3)+"-"+num.substr(8); }
        else{result=num.substr(0,3)+"-"+num.substr(3,2)+"-"+num.substr(5,4)+"-"+num.substr(9); }
        return result
    }
  }

  async function handleQuickFilter(event){
    gridApi.setQuickFilter(event.target.value);
  };

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
    {editedRows.length} 건 수정
    </Col>
 
    <Col xs="auto">
     
    <Button
          block
          type="button"
          onClick={onAddRow}
        >
          신규 등록
        </Button>
    </Col>

  </Row>
        <AgGridReact
            rowData={rowData}
            rowSelection={"multiple"}
            columnDefs={columnDefs}
            suppressRowClickSelection={false}
            floatingFiltersHeight ={30}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            onCellEditingStopped={(e) => {
              onCellValueChanged(e);
            }}
            localeText= {{noRowsToShow : '조회 결과가 없습니다.'}}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            enableCellChangeFlash={true}
            onRowDataUpdated={(e) => {
              console.log("변경->",e);
            }}
          >
     
          </AgGridReact>
          
      </div>
  );
}
*/
const Users = () => { return (<LoadTable />); }
export default Users;