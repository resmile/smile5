//get selected rows

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Amplify, {API } from 'aws-amplify'
import { listGroups } from '../graphql/queries'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GridApi, ColumnApi } from 'ag-grid-community';


const Groups = () => {
  const [data, setData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'id', headerName : '번호', filter:'agTextColumnFilter', checkboxSelection: true},
    { field: 'name', headerName : '그룹명', filter:'agTextColumnFilter'},
    { field: 'type', headerName : '분류', filter:'agTextColumnFilter'},
    { field: 'createdAt', headerName : '생성일', filter:'agTextColumnFilter'},

  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => params.api.setRowData(data);
    
  };

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

  async function fetchData() {
    try {
      let d = await API.graphql({ query: listGroups, variables: { limit: 100,  filter: {type: {eq: "매출처"}} }});
      let dArray = d.data.listGroups.items;

      setData(dArray);

    } catch (err) {
      console.log({ err })
    }
  }

  
async function handleQuickFilter(event){
    gridApi.setQuickFilter(event.target.value);
  };
  

  const onButtonClick = e => {
    const selectedNodes = gridRef.current.api.getSelectedNodes()
    const selectedData = selectedNodes.map( node => node.data )
    const selectedDataStringPresentation = selectedData.map( node => `${node.name} ${node.type}`).join(', ')
    alert(`Selected nodes: ${selectedDataStringPresentation}`)
  }

  return (

      <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
      <Row className="align-items-center mb-3">
          <Col xs="auto">
            <input type="text" placeholder="통합 검색" onChange={handleQuickFilter} className={`form-control`} />
          </Col>
          <Col xs="auto">
          <button onClick={onButtonClick}>Get selected rows</button>
          </Col>
        </Row>
        <AgGridReact
                rowData={data}
                ref={gridRef}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                >
           </AgGridReact>
      </div>
  );
}

export default Groups;
