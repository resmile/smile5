import React, { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {API } from 'aws-amplify'
import { listGroups } from '../graphql/queries'
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';
import * as lib from "../lib/aggridFun";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AutocompleteSelectCellEditor} from 'ag-grid-autocomplete-editor';
import 'ag-grid-enterprise';

import { fetchProfileData } from "../lib/fakeApi";

const resource = fetchProfileData();


function ProfilePage() {
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails />
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

const selectData = [
  { value: 0, type: "매출처" },
  { value: 1, type: "매입처" },
  { value: 2, type: "배송" },
  { value: 3, type: "피킹" },

];

const selectData1 = [
  { value: 0, label: "호평" },
  { value: 1, label: "호" },
  { value: 2, label: "sparta" },
  { value: 3, label: "yolo" },
  { value: 4, label: "yoloooooo" },
  { value: 5, label: "yola" },
  { value: 6, label: "yoli" },
  { value: 7, label: "yolu" },
  { value: 8, label: "yolp" },
  { value: 9, label: "yolop" },
  { value: 10, label: "yolpo" },
  { value: 11, label: "yolui" },
  { value: 12, label: "yolqw" },
  { value: 13, label: "yolxz" },
  { value: 14, label: "yolcv" },
  { value: 15, label: "yolbn" }
];

const Groups = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState([]);
  const [uniqueData, setUniqueData] = useState([]);
  const [searchItems, setSearchItems] = useState();


  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  
  const [columnDefs, setColumnDefs] = useState([
    { field: 'id', headerName : '번호', filter:'agTextColumnFilter'},
    {
      headerName: "Already present data selector",
      field: "name",
      cellEditor: AutocompleteSelectCellEditor,
      cellEditorParams: {
        required: true,
        selectData: searchItems,
        placeholder: "Select an option"
      },
      valueFormatter: params => {
        if (params.value) {
          return params.value;
        }
        return "";
      },
      editable: true
    },
    
    { field: 'name', headerName : '그룹명', editable: true, filter:'agTextColumnFilter'},
    { field: 'type', headerName: "분류", editable: true, filter:'agTextColumnFilter',
      cellEditor: 'agRichSelectCellEditor', cellEditorPopup: true,
      cellEditorParams: { cellHeight: 50, values: selectData.map(a => a.type) }
    },
    { field: 'createdAt', headerName : '생성일', filter: "agDateColumnFilter",
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    //fetchData();
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

useEffect(() => {
  fetchData();
  console.log("useEffect in App.js called")

    fetch("https://fakestoreapi.com/products")

    .then((res)=>res.json())

    .then((productArray) => {

      //console.log(productArray)

      const searchItems = productArray.map((product) => {

        return product.title

      })
      console.log(searchItems);
      setSearchItems(searchItems)

    })
  
}, [])

  async function fetchData() {
    try {
      //let d = await API.graphql({ query: listGroups, variables: { limit: 100,  filter: {type: {eq: "매출처"}} }});
      let d = await API.graphql({ query: listGroups});
      let dArray = d.data.listGroups.items;
      //console.log(dArray);
      const a=dArray.filter(
        (arr, index, callback) => index === callback.findIndex(t => t.type === arr.type)
      );
      
      const getUnique=dArray.reduce(function(acc, current) {
        if (acc.findIndex(({ type }) => type === current.type) === -1) {
          acc.push(current);
        }
        return acc;
      }, []);

      let getType = getUnique.map(a => a.type);
      setType([...type, getType]);
      setData(dArray);
      setUniqueData(getUnique);
      console.log(getUnique);

    } catch (err) {
      console.log({ err })
    }
  }

  async function handleQuickFilter(event){
    gridApi.setQuickFilter(event.target.value);
  };

  
  const onRowEditingStarted = useCallback((event) => {
    console.log('never called - not doing row editing');
  }, []);

  const onRowEditingStopped = useCallback((event) => {
    console.log('never called - not doing row editing');
  }, []);

  const onCellEditingStarted = useCallback((event) => {
    console.log('cellEditingStarted');
  }, []);

  const onCellEditingStopped = useCallback((event) => {
    console.log('cellEditingStopped');
  }, []);

  
  return (

    <ProfilePage />
  );
}

export default Groups;

/*

      <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <input type="text" placeholder="통합 검색" onChange={handleQuickFilter} className={`form-control`} />
          </Col>
        </Row>
        {searchItems ? (
        <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                localeText= {{noRowsToShow : '조회 결과가 없습니다.'}}
                onRowEditingStarted={onRowEditingStarted}
                onRowEditingStopped={onRowEditingStopped}
                onCellEditingStarted={onCellEditingStarted}
                onCellEditingStopped={onCellEditingStopped}
                >
           </AgGridReact>
           ): (
             <div className="flex-container">데이터 로딩중입니다.</div>
           )}
      </div>
*/