//fectching data and auto select box
//add, edit, del rows
import React, { useState, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import gqlsuspense from 'graphql-suspense'
import { API, graphqlOperation } from 'aws-amplify'
import { listGroups } from '../graphql/customQueries'

import * as lib from "../lib/aggridFun";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-enterprise';
import * as XLSX from 'xlsx/xlsx.mjs';


function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>회원대량등록</h3>
              <Table/>
      </Suspense> 
  );
}


function Table() {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [addRows, setAddRows] = useState([]);
  const [updateRows, setUpdateRows] = useState([]);
  const [delRows, setDelRows] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [items, setItems] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const data = gqlsuspense(API.graphql(graphqlOperation(listGroups)));
  const x = data.data.listGroups.items;
  const sourceLists=[];
  for(let i=0;i<x.length;i++){
    const y=data.data.listGroups.items[i].groupMem.items;
    if(Array.isArray(y) && y.length === 0){
      sourceLists.push({
        id : x[i].id,
        name : x[i].name,
        type: x[i].type,
        createdAt : x[i].createdAt,
        updatedAt : x[i].updatedAt,
        groupsGroupMemId : "",
        groupMemId : "",
        groupMemName : ""
      });
    }else{
      //const temp=[];
      for(let j=0;j<y.length;j++){
        
        sourceLists.push({
          id : x[i].id,
          name : x[i].name,
          type: x[i].type,
          createdAt : x[i].createdAt,
          updatedAt : x[i].updatedAt,
          groupsGroupMemId : y[j].groupsGroupMemId,
          groupMemId : y[j].id,
          groupMemName : y[j].name
        });
        
        //temp.push(y[j].name);
      }
      /*
      sourceLists.push({
        id : x[i].id,
        name : x[i].name,
        type: x[i].type,
        createdAt : x[i].createdAt,
        updatedAt : x[i].updatedAt,
        groupsGroupMemId : "",
        groupMemId : "",
        groupMemName :  temp.join(", ")
      });
      */

    }

  }

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setIsUpload(true);
      setItems(d);
      alert(d.length+"건이 정상적으로 업로드되었습니다. [대량 회원가입] 버튼을 눌러주세요.");
      //onSubmit();
      //populateGrid(d);
      //d.map((data)=>{
        //console.log(data["athlete"]);
      //})
      
      //console.log(d[0]["이메일"]);


    });
  };


  //console.log(sourceLists);
  const lists = items.map(({ name: label, ...rest }) => ({ label, ...rest }));
  const pre=lists.filter((v,i,a)=>a.findIndex(t=>(t.type === v.type))===i)
  const dropdownData=pre.map(a => a.type)
  const autopcompleteData = lists.map((a) => { return {label:a.label}})

  const [columnDefs, setColumnDefs] = useState([
    {checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, floatingFilter: false, },
    { field: 'athlete', minWidth: 180 },
    { field: 'age' },
    { field: 'country', minWidth: 150 },
    { field: 'year' },
    { field: 'date', minWidth: 130 },
    { field: 'sport', minWidth: 100 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    //window.resize(() =>params.api.getWidthForSizeColsToFit() && params.api.sizeColumnsToFit())
    /*const columnIds = [];
    params.columnApi.getAllColumns().forEach(column => {
      columnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(columnIds);*/
  };

  async function handleQuickFilter(e){
    gridApi.setQuickFilter(e.target.value);
  };

  async function onBtAddRow(){
    console.log("----new---");
    
    gridApi.applyTransaction({
      add: [{createdAt: null, groupMemId: null, groupMemName: "", groupsGroupMemId: null, id: null, name: "", type: "", updatedAt:null}]
        , addIndex:0 });
  }

  async function onBtAddCsvRow(){
    console.log("----new Excel---");
    
  }

  async function onBtSave() {
    const temp=[];
    gridRef.current.api.stopEditing();
    gridRef.current.api.forEachNodeAfterFilterAndSort( function(rowNode, index) {
        if(rowNode.data.edit){
            temp.push(rowNode.data);
        }else{

        }
    });
    console.log("updateRows-->",temp);
    setUpdateRows(updateRows => [...updateRows, temp]);

  }

  async function onBtDelete() {
    const temp=[];
    const selectedRows = gridRef.current.api.getSelectedRows();
    selectedRows.forEach( function(selectedRow, index) {
      temp.push(selectedRow);
      gridApi.applyTransaction({remove: [selectedRow]});
    });
    setDelRows(delRows => [...delRows, temp]);
    console.log("delRows->>",delRows);
}
  async function onCellEditingStopped(e){
    gridRef.current.api.stopEditing();
    const data=e.data;
    if("e--->",e.data.id===null){
      data.new = true;
      if(addRows.some(v => v.id === data.id)){
        setAddRows(addRows.filter(addRows => addRows.id !== data.id));
      }
      setAddRows(addRows => [...addRows, data]);
      
    }else{
      data.edit = true;
      if(updateRows.some(v => v.id === data.id)){
        setUpdateRows(updateRows.filter(updateRows => updateRows.id !== data.id));
      }
      setUpdateRows(updateRows => [...updateRows, data]);
  
    }

    console.log("addRows->",addRows); 
    console.log("updateRows->",updateRows);
    console.log("currentRows->",data);
    
  }  
  
  const getRowData = useCallback(() => {
    const rowData = [];
    gridRef.current.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    console.log('Row Data:');
    console.log(rowData);
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      resizable: true,
      floatingFilter: true,
      sortable: true,
    };
  }, []);


  async function onCellKeyPress(e) {
    //console.log('onCellKeyPress', e);
    if (e.event) {
      const keyPressed = e.event.key;
      if (keyPressed === 'n' || keyPressed === 'N') {
        onBtAddRow();
      }else if (keyPressed === 'd' || keyPressed === 'D') {
        onBtDelete();
      }
      
    }
}



  return (
    <div className="ag-theme-alpine" style={{height: 600, width: "100%"}}>
      <Row className="align-items-center mb-3 mt-5">
          <Col xs="auto">
          <input type="file" onChange={(e) => { const file = e.target.files[0]; readExcel(file); }} className={`form-control`}  />
          </Col>
          <Col xs="auto">
          
          <ButtonGroup>
            <Button type="button" onClick={onBtSave}>저장</Button>
            <Button type="button" onClick={onBtDelete}>삭제</Button>
          </ButtonGroup>
          </Col>
        </Row>
        <AgGridReact
                ref={gridRef}
                rowData={lists}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                rowSelection={'multiple'}
                localeText= {{noRowsToShow : '조회 결과가 없습니다.'}}
                onCellEditingStopped={onCellEditingStopped}
                undoRedoCellEditing={true}
                undoRedoCellEditingLimit={20}
                onCellKeyPress={onCellKeyPress}
                >
           </AgGridReact>
      </div>
  );
}

const Groups = () => { return (<LoadTable />); }
export default Groups;

/*

       <Col xs="auto">
          <Button
                block
                type="button"
                onClick={getRowData}
              >
                get Rows
              </Button>
          </Col>
*/