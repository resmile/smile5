import Amplify, { Auth, API, graphqlOperation} from 'aws-amplify';
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { GridApi, ColumnApi } from 'ag-grid-community';
//import { listPost2s } from './graphql/queries'
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from 'react-hot-toast';

Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

const Users = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [listPosts, setListPosts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [btndisabled, setBtnDisabled] = useState(true);


  const notify = (msg) => toast.error(msg);

  const CheckRegExp ={
    name : function (p){
      const regExp=/^[가-힣a-zA-Z]+$/
      if(p.newValue===""){
        notify("담당자명을 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("한글 또는 영어만 입력 가능합니다.");
        return p.oldValue;
      }else if(p.newValue.length < 3 || p.newValue.length > 20){
        notify("3글자 이상, 20글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    email : function (p){
      const regExp=/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      if(p.newValue===""){
        notify("이메일을 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("이메일 형식(user@domain.kr)으로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    phone_number : function (p){
      const regExp=/\+821\d{8,9}/
      if(p.newValue===""){
        notify("휴대폰 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("휴대폰번호 형식(+821012345678)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 12 || p.newValue.length > 13){
        notify("12글자 이상, 13글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    brand : function (p){
      if(p.newValue===""){
        notify("브랜드명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 1 || p.newValue.length > 35){
        notify("1글자 이상, 35글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    company : function (p){
      if(p.newValue===""){
        notify("회사명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 1 || p.newValue.length > 35){
        notify("1글자 이상, 35글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    ceoName : function (p){
      if(p.newValue===""){
        notify("대표자명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 3 || p.newValue.length > 30){
        notify("3글자 이상, 30글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    ceoPhone : function (p){
      const regExp=/(\d){9,11}/
      if(p.newValue===""){
        notify("휴대폰 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("휴대폰번호 형식(01012345678)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 9 || p.newValue.length > 11){
        notify("9글자 이상, 11글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    bizNum : function (p){
      const regExp=/\d{10}/
      if(p.newValue===""){
        notify("사업자 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("숫자형식(10글자)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 10 || p.newValue.length > 10){
        notify("10글자로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    bizAddr : function (p){
      if(p.newValue===""){
        notify("사업장주소를 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 5 || p.newValue.length > 100){
        notify("5글자 이상, 100글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },



  }

  const  LinkComponent=(props)=> {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://smile210113-dev.s3.ap-northeast-2.amazonaws.com/public/" + props.value}
      >
        {props.value==null  || props.value==="" ? "":"Y" }
      </a>
    );
  }

  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', 
      headerName : '담당자명', 
      filter:'agTextColumnFilter',
      //headerCheckboxSelection: true,
      //headerCheckboxSelectionFilteredOnly: true,
      //checkboxSelection: true,
      valueParser: CheckRegExp.name,
    },
    { field: 'email', headerName : '이메일', filter:'agTextColumnFilter',valueParser: CheckRegExp.email},
    { field: 'phone_number', headerName : '휴대폰', minWidth: 200, filter:'agTextColumnFilter', valueFormatter: params => CommonGrid.formatPhone(params),valueParser: CheckRegExp.phone_number},
    { field: 'company',headerName : '회사명', filter:'agTextColumnFilter',valueParser: CheckRegExp.company},
    { field: 'brand',headerName : '브랜드', filter:'agTextColumnFilter',valueParser: CheckRegExp.brand},
    { field: 'ceoName',headerName : '대표자명', filter:'agTextColumnFilter',valueParser: CheckRegExp.ceoName},
    { field: 'ceoPhone',headerName : '대표자 휴대폰', filter:'agTextColumnFilter', valueFormatter: params => CommonGrid.formatCeoPhone(params),valueParser: CheckRegExp.ceoPhone},
    { field: 'bizNum',headerName : '사업자등록번호',  minWidth: 180, filter:'agTextColumnFilter', valueFormatter: params => CommonGrid.formatBizNum(params),valueParser: CheckRegExp.bizNum},
    { field: 'bizAddr',headerName : '사업자주소', minWidth: 200, filter:'agTextColumnFilter',valueParser: CheckRegExp.bizAddr},
    { field: 'stateName',headerName : '분류', filter:'agTextColumnFilter'},
    { field: 'bizLicName',
      headerName : '사업자등록증',
      filter:'agTextColumnFilter',
      cellRenderer: LinkComponent,
      editable: false,
    },

    

  ]);



  


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
          "AttributesToGet": [],
          "Filter": "",
          "Limit": 10,
          "UserPoolId": "ap-northeast-2_UzQp7Bmy0"
        },
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
    nextToken = NextToken;
    console.log(rest.Users);
    const users = rest.Users.map((ele) => {
      const { Attributes } = ele;
      return Attributes.reduce((agg, {Name, Value}) => {
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
    });
    console.log("users->",users);
    setRowData(users);
    setListPosts(users);
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
          onClick={onEditedRowsSave}
        >
          저장
        </Button>
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
    <Col xs="auto">
     
    <Button
          block
          type="button"
          onClick={onAddRow}
        >
          삭제
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

export default Users;