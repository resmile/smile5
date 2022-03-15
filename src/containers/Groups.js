//fectching data and auto select box
//add, edit, del rows
import React, { forwardRef, useImperativeHandle, useState, memo, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';
import ReactDOM, {render} from 'react-dom';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast';

import gqlsuspense from 'graphql-suspense'
import { API, graphqlOperation } from 'aws-amplify'
import { listGroups } from '../graphql/customQueries'
import { createGroups, updateGroups, deleteGroups } from '../graphql/customMutations'
//import * as subscriptions from '../graphql/subscriptions';
import {onUpdateGroups} from '../graphql/subscriptions';

import * as lib from "../lib/aggridFun";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-enterprise';

const options = [
  { label: "Grapes", value: "grapes1" },
  { label: "Mango", value: "mango1" },
  { label: "Strawberry", value: "strawberry1" },

  { label: "Grapes", value: "grapes2" },
  { label: "Mango", value: "mango2" },
  { label: "Strawberry", value: "strawberry2" }, { label: "Grapes", value: "grapes" },
  { label: "Mango", value: "mango" },
  { label: "Strawberry", value: "strawberry3" }, { label: "Grapes", value: "grapes" },
  { label: "Mango", value: "mango" },
  { label: "Strawberry", value: "strawberry4" }, { label: "Grapes", value: "grapes" },
  { label: "Mango", value: "mango" },
  { label: "Strawberry", value: "strawberry5" },
];
function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>그룹관리</h3>
          <Tabs defaultActiveKey="buyerTab" id="uncontrolled-tab-example" >
            <Tab eventKey="buyerTab" title="매출처">
              <Table mode="buyer" modeKr="매출처" groupMemNameKr="입급자명 ( , 로 구분 입력)"/>
            </Tab>
            <Tab eventKey="sellerTab" title="매입처">
              <Table mode="seller" modeKr="매입처" groupMemNameKr="입급자명 ( , 로 구분 입력)"/>
            </Tab>
            <Tab eventKey="deliveryTab" title="배송기사">
              <Table mode="delivery" modeKr="배송" groupMemNameKr="식당명"/>
            </Tab>
            <Tab eventKey="pickingTab" title="분류팀">
              <Table mode="picking" modeKr="피킹" groupMemNameKr="식당명"/>
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
  const [addRows, setAddRows] = useState([]);
  const [addRowNo, setAddRowNo] = useState(0);
  const [updateRows, setUpdateRows] = useState([]);
  const [delRows, setDelRows] = useState([]);
  const [isEditted, setIsEditted] = useState(true);
  const notify = (msg) => toast.error(msg);

  const data = gqlsuspense(API.graphql(graphqlOperation(listGroups)));

  useEffect(() => {

    const subscription = API.graphql(graphqlOperation(onUpdateGroups))
    .subscribe({
      next: ({value})=>{
        const data=value.data.onUpdateGroups;
        //console.log("new data->",data);
        gqlsuspense(API.graphql(graphqlOperation(listGroups)));
      },
      error: error => console.warn(error)
    })
    return () => {subscription.unsubscribe()}
    

  }, []);

  const x = data.data.listGroups.items;
  //const sourceLists = data.data.listGroups.items;
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


  //console.log(sourceLists);
  const lists = sourceLists.map(({ name: label, ...rest }) => ({ label, ...rest }));
  const pre=lists.filter((v,i,a)=>a.findIndex(t=>(t.type === v.type))===i)
  const dropdownData=pre.map(a => a.type)
  const autopcompleteData = lists.map((a) => { return {label:a.label}})
  //console.log("autopcompleteData", autopcompleteData);
  
const groupMemEditor = memo(forwardRef((props, ref) => {
    const isHappy = value => value === 'Happy';
    const [selected, setSelected] = useState([]);
    const [interimValue, setInterimValue] = useState(isHappy(props.value));
    const [happy, setHappy] = useState(null);
    const refContainer = useRef(null);

    useImperativeHandle(ref, () => {
      console.log(ref);
      console.log(selected);
      let result = selected.map(a => a.value);
      let b=result.join(", ");
      
        return {
            getValue() {
                return selected.length>=1 ? b : '';
            }
        };
    });

    const mood = {
        textAlign: 'center',
    };

    return (
        <div ref={refContainer}
             style={mood}
             tabIndex={1} // important - without this the key presses wont be caught
        >
        

<Select
        defaultValue={selected}
        onChange={setSelected}
        options={options}
        isMulti={true}
        autoFocus={true}
        isSearchable={true}
      />
        </div>
    );
}));

let groupMemNameObj = {
  ...(mode=="delivery" && { field: 'groupMemName', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: groupMemEditor,
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
  }),
  ...(mode=="picking" && { field: 'groupMemName', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: groupMemEditor,
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
  }),
  ...(mode=="buyer" && { field: 'groupMemName', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: 'agLargeTextCellEditor',
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
}),
  ...(mode=="seller" && { field: 'groupMemName', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: 'agLargeTextCellEditor',
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
})
} 

  const [columnDefs, setColumnDefs] = useState([
    {checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, floatingFilter: false, },
    {
      field: "label", headerName: "그룹명", editable: true, filter:'agTextColumnFilter',   
      cellEditor: AutocompleteSelectCellEditor,
      cellEditorParams: { required: true, selectData: autopcompleteData, placeholder: "그룹명을 입력해주세요."},
      valueFormatter: params => { if (params.value) { return params.value.label; } return ""; },
    },
    { field: 'type', headerName: "분류", editable: true, filter:'agTextColumnFilter', minWidth : 120,
      cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
      cellEditorParams: { cellHeight: 50, values: dropdownData }
    },
    groupMemNameObj
    ,
    { field: 'createdAt', headerName : '생성일시', filter: "agDateColumnFilter", sort: 'desc',
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

  /*
    { field: 'id', headerName : '번호', filter:'agTextColumnFilter'},   
    { field: 'groupMemName', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
    },
    
  */

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
    setAddRowNo(addRowNo + 1);
    gridApi.applyTransaction({
      add: [{createdAt: new Date(), groupMemId: null, groupMemName: "", groupsGroupMemId: null, id: addRowNo + 1, name: "", type: modeKr, updatedAt:new Date()}]
        , addIndex:0 });
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
          await API.graphql(graphqlOperation(updateGroups, { input: { id: value.id, name : value.name, type : value.type }}))
          .then((d) => { console.log(d); })
          .catch(() => { console.log("update Row fail"); });
        } catch (error) { console.log(error); }
      };
    }
  
    if(addRows.length!=0){
      for (const [index, value] of addRows.entries()) {
        try {
          await API.graphql({ query: createGroups, variables: { input: { name : value.name, type : value.type } } })
          .then((d) => { console.log(d); })
          .catch(() => { console.log("add Row fail"); });
        } catch (error) { console.log(error); }
      };
    }
    if(delRows.length!=0){
      for (const [index, value] of delRows.entries()) {
        try {
          await API.graphql({ query: deleteGroups, variables: { input: { id: value.id } }})
          .then((d) => { console.log(d); })
          .catch(() => { console.log("del Row fail"); });
        } catch (error) { console.log(error); }
      };
    }

    //const data = gqlsuspense(await API.graphql(graphqlOperation(listGroups)));
    //console.log("new Data->",data);
    //gridApi.refreshCells({force : true});
    window.location.replace("/groups");
  }

  async function onBtDelete() {
    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log("selectedRows->",selectedRows);
    if(selectedRows.length==0){
      alert("삭제할 건을 선택해주세요.");
      //notify("삭제할 건을 선택해주세요.");
    }else{
      selectedRows.forEach( function(selectedRow, index) {
        setDelRows(delRows => [...delRows, selectedRow]);
        gridApi.applyTransaction({remove: [selectedRow]});
      });
      setIsEditted(false);
    }
    //console.log("delRows->>",delRows);
}
  async function onCellEditingStopped(e){
    gridRef.current.api.stopEditing();
    const data=e.data;
    if("e--->",e.data.id===(addRowNo)){
      setIsEditted(false);
      data.new = true;
      if(addRows.some(v => v.id === data.id)){
        setAddRows(addRows.filter(addRows => addRows.id !== data.id));
      }
      setAddRows(addRows => [...addRows, data]);
      
    }else{
      setIsEditted(false);
      data.edit = true;
      if(updateRows.some(v => v.id === data.id)){
        setUpdateRows(updateRows.filter(updateRows => updateRows.id !== data.id));
      }
      setUpdateRows(updateRows => [...updateRows, data]);
  
    }
    
    console.log("addRows->",addRows); 
    console.log("updateRows->",updateRows);
    console.log("currentRows->",data);
    //console.log("currentRows label->",data.label.label); 
    
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

let modeType = mode;

const isExternalFilterPresent = useCallback(() => {
  return modeType !== 'all';
}, []);

const doesExternalFilterPass = useCallback(
  (node) => {
    switch (modeType) {
      case 'buyer': return node.data.type == "매출처";
      case 'seller': return node.data.type == "매입처";
      case 'delivery': return node.data.type == "배송";
      case 'picking': return node.data.type == "피킹";
      default: return true;
    }
  },
  [modeType]
);


/*
  const onCellKeyPress = useCallback((e) => {
    //console.log('onCellKeyPress', e);
    if (e.event) {
      const keyPressed = e.event.key;
      //console.log('Key Pressed = ' + keyPressed);
      if (keyPressed === 'n') {
        onBtAddRow();
      }
    }
  }, []);
  */  
 

  return (
    <div className="ag-theme-alpine" style={{height: 600, width: "100%"}}>
      <Row className="align-items-center mb-3 mt-5">
          <Col xs="auto">
            <input type="text" placeholder="통합 검색" onChange={handleQuickFilter} className={`form-control`} />
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
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
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