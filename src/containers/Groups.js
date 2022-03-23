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
import Multiselect from 'multiselect-react-dropdown';
import Popup from '../components/Popup';
import PopupCont from '../components/PopupCont';
//import SelectDinerBtn1 from '../components/SelectDinerBtn1';
import SelectDinerBtn from '../components/SelectDinerBtn';


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
//import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-enterprise';

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
  const [curRow, setCurRow] = useState({});
  const [isEditted, setIsEditted] = useState(true);
  const notify = (msg) => toast.error(msg);
  const [isOpen, setIsOpen] = useState(false);
  
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
        mem: x[i].mem,
        tax: x[i].tax,
        memId: x[i].memId,
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
          mem: x[i].mem,
          tax: x[i].tax,
          memId: x[i].memId,
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
  
  let filterBuyer = lists.filter(it => new RegExp('매출처', "i").test(it.type));
  const multiSelect = filterBuyer.map((a) => { return a.label})
  //const multiSelect = filterBuyer.map((a) => { return {desc:a.label, value:a.label}})
  //console.log("filterBuyer", filterBuyer);
  //console.log("multiSelect", multiSelect);
  
const groupMemEditor = memo(forwardRef((props, ref) => {
    console.log("props.value-->",props.value)
    const [selected, setSelected] = useState([]);
    const [interimValue, setInterimValue] = useState(props.value);
    const [happy, setHappy] = useState(null);
    const refContainer = useRef(null);
    console.log("refCon->",refContainer)
    
    let selectedVConvertObj="";
    if(props.value!=null){
      let preSelectedVConvertObj = props.value.split(',');
      selectedVConvertObj = preSelectedVConvertObj.map((a) => { return {name:a, id:a}})  
    }


    //console.log("ref-->",ref);
    console.log("props-->",props);

    useImperativeHandle(ref, () => {
      
      //console.log(selected);
      let result = selected.map(a => a.name);
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

    const handleChange = (e) => { 
      console.log(e);
      //setSelected(e);
      setSelected(pre => [...pre, e])
     //let dropdownData1=e.map(d => d.name);
     //let dd=dropdownData1.join(", ");
     
     //console.log("dd->", dd);
     //props.setValue(dd);
     //setSelected(pre => [...pre, e.target.value])
    };

    return (
        <div ref={refContainer}
             style={mood}
             tabIndex={1} // important - without this the key presses wont be caught
        >
      <Multiselect
options={multiSelect} // Options to display in the dropdown
selectedValues={selectedVConvertObj} // Preselected value to persist in dropdown
//onSelect={handleChange} // Function will trigger on select event
onSelect={handleChange} // Function will trigger on select event
//onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name" // Property name to display in the dropdown options
/>
</div>
    );
}));
/*
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
}*/

let memberObj = {
  ...(mode=="buyer" && { field: 'mem', headerName : groupMemNameKr, minWidth: 120, floatingFilter: false, cellRenderer: SelectDinerBtn, editable: false, hide: true,}),
  ...(mode=="seller" && { field: 'mem', headerName : groupMemNameKr, minWidth: 120, floatingFilter: false, cellRenderer: SelectDinerBtn, editable: false,hide: true, }),
  ...(mode=="delivery" && { field: 'mem', headerName : groupMemNameKr, minWidth: 120, floatingFilter: false, cellRenderer: SelectDinerBtn, editable: false, cellRendererParams: {color: 'irishGreen', bt: isOpen,btn : onBtnSelectDiner} }),
  ...(mode=="picking" && { field: 'mem', headerName : groupMemNameKr, minWidth: 120, floatingFilter: false, cellRenderer: SelectDinerBtn, editable: false, cellRendererParams: {color: 'aa', bt: isOpen,btn : onBtnSelectDiner}}),
} 


/*
let memberObj = {
  ...(mode=="delivery" && { field: 'mem', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: groupMemEditor,
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
  }),
  ...(mode=="picking" && { field: 'mem', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: groupMemEditor,
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
  }),
  ...(mode=="buyer" && { field: 'mem', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: 'agLargeTextCellEditor',
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
}),
  ...(mode=="seller" && { field: 'mem', headerName : groupMemNameKr, editable: true, filter:'agTextColumnFilter',
  cellEditor: 'agLargeTextCellEditor',
  cellEditorPopup: true,
  cellEditorParams: { maxLength: '300', cols: '50', rows: '6',},
})
} */

let taxObj = {
  ...(mode=="buyer" && { field: 'tax', headerName: "과세구분", editable: true, filter:'agTextColumnFilter', minWidth : 50,
  cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
  cellEditorParams: { cellHeight: 50, values: ["과세","면세"] }
  }),
  ...(mode=="seller" && { field: 'tax', headerName: "과세구분", editable: true, filter:'agTextColumnFilter', minWidth : 50,
  cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
  cellEditorParams: { cellHeight: 50, values: ["과세","면세"] }
  }),
  ...(mode=="delivery" && { field: 'tax', headerName: "과세구분", editable: true, filter:'agTextColumnFilter', minWidth : 50,
  cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true, hide: true,
  cellEditorParams: { cellHeight: 50, values: ["과세","면세"] }
  }),
  ...(mode=="picking" && { field: 'tax', headerName: "과세구분", editable: true, filter:'agTextColumnFilter', minWidth : 50,
  cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true, hide: true,
  cellEditorParams: { cellHeight: 50, values: ["과세","면세"] }
  })
} 

let nickName = {
  ...(mode=="buyer" && { field: 'nickName', headerName: "닉네임", editable: true, filter:'agTextColumnFilter', minWidth : 50 }),
  ...(mode=="seller" && { field: 'nickName', headerName: "닉네임", editable: true, filter:'agTextColumnFilter', minWidth : 50, hide: true, }),
  ...(mode=="delivery" && { field: 'nickName', headerName: "닉네임", editable: true, filter:'agTextColumnFilter', minWidth : 50, hide: true, }),
  ...(mode=="picking" && { field: 'nickName', headerName: "닉네임", editable: true, filter:'agTextColumnFilter', minWidth : 50, hide: true, }),
} 




  const [columnDefs, setColumnDefs] = useState([
    {checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, floatingFilter: false, },
    {
      field: "label", headerName: "그룹명", editable: true, filter:'agTextColumnFilter',   
      //cellEditor: agTextColumnFilter,
      //cellEditorParams: { required: true, selectData: autopcompleteData, placeholder: "그룹명을 입력해주세요."},
      //valueFormatter: params => { if (params.value) { return params.value.label; } return ""; },
    },
    nickName,
    { field: 'type', headerName: "분류", editable: true, filter:'agTextColumnFilter', minWidth : 120,
      cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
      cellEditorParams: { cellHeight: 50, values: dropdownData }
    },
    memberObj,
    taxObj,
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
      add: [{createdAt: new Date(), groupMemId: null, mem:"", tax:"",groupMemName: "", groupsGroupMemId: null, id: addRowNo + 1, name: "", type: modeKr, updatedAt:new Date()}]
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
          await API.graphql(graphqlOperation(updateGroups, { input: { id: value.id, name : value.label, type : value.type, mem:value.mem, tax:value.tax }}))
          .then((d) => { console.log(d); })
          .catch(() => { console.log("update Row fail"); });
        } catch (error) { console.log(error); }
      };
    }
  
    if(addRows.length!=0){
      for (const [index, value] of addRows.entries()) {
        try {
          await API.graphql({ query: createGroups, variables: { input: { name : value.name, type : value.type, mem:value.mem, tax:value.tax } } })
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
  
  async function onBtnSelectDiner(){
    setIsOpen(!isOpen);
    const selectedRows = gridRef.current.api.getSelectedRows();
    //const a=gridRef.current.api.getRowNode("d1c0a08c-f4e5-41dc-8fac-e2ab1fbad418");
    //const a=gridRef.current.api.getRowNode(selectedRows[0].id);
    //a.setDataValue('mem', "adasds");
    //console.log("a->",a);
    console.log("selectedRows->",selectedRows);
    console.log("selectedRows[0]->",selectedRows[0]);
    //let rowNode = gridRef.current.api.getRowNode(selectedRows[0].id);
    //console.log("rowNode->",rowNode);
    //setDataOnFord();
    if(selectedRows[0].mem !=null){
      setCurRow(selectedRows[0].mem.split(','));
      //setCurRow(selectedRows[0]);
    }else{setCurRow([]); }
    //if(isOpen){ window.location.replace("/grous");}
  }

  async function onBtExportExcel(){
    gridRef.current.api.exportDataAsExcel();
  }

  const setDataOnFord = useCallback(() => {
    var rowNode = gridRef.current.api.getRowNode("d1c0a08c-f4e5-41dc-8fac-e2ab1fbad418");
    console.log(rowNode)
  }, []);

  const getSelectedRowData = () => {
    let selectedNodes = gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    console.log(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    console.log(selectedData[0].label);
    return selectedData[0].label;
  };
  
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

const getRowId = useCallback(function (params) {
  console.log("getId->",params.data.id);
  return params.data.id;
}, []);


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
          <Col xs="auto">
          <Button type="button" onClick={onBtExportExcel}>엑셀다운</Button>
          </Col>
          <Col xs="auto">
          <Button type="button" onClick={getSelectedRowData}>현재 행</Button>
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
                getRowId={getRowId}
                >
           </AgGridReact>
           {isOpen && <Popup
            content={<PopupCont setCurRow={setCurRow} curRow={curRow} multiSelect={multiSelect} isOpen={isOpen} setIsOpen={setIsOpen}/>}
            handleClose={onBtnSelectDiner}
          />}
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