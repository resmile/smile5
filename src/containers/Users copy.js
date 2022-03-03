import Amplify, { Auth, API, graphqlOperation} from 'aws-amplify';
import React, { useState, useEffect, useRef } from 'react';

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GridApi, ColumnApi } from 'ag-grid-community';
//import { listPost2s } from './graphql/queries'
import Spinner from "react-bootstrap/Spinner";

const Users = () => {

  const [posts, setPosts] = useState([]);
  const [modelVisibility, setModelVisibility] = useState(true);
  const [loading, setLoading]=useState(true);
  const [columnDefs, setColumnDefs] = useState([
    { headerName : '담당자명', field : 'name', sortable:true, filter:true, checkboxSelection:true },
    { headerName : '이메일', field : 'email', sortable:true, filter:true },
    { headerName : '휴대폰', field : 'phone_number', sortable:true, filter:true },
    { headerName : '회사명', field : 'company', sortable:true, filter:true },
    { headerName : '브랜드', field : 'brand', sortable:true, filter:true },
    { headerName : '대표자명', field : 'ceoName', sortable:true, filter:true },
    { headerName : '대표자 휴대폰', field : 'ceoPhone', sortable:true, filter:true },
    { headerName : '사업자등록번호', field : 'bizNum', sortable:true, filter:true },
    { headerName : '사업자주소', field : 'bizAddr', sortable:true, filter:true },

  ]);

  const onSelectedRows= () =>{
    const selectedNodes = GridApi.getSelectedNodes();
    const selectedRows = selectedNodes.map(rows => rows.data);
    const selectedRowsData = selectedRows
      .map(rows => `${rows.ceoName} ${rows.email}`).join('. ');      
    alert(selectedRowsData);
  }

  const onGridReady= (params) =>{

    GridApi = params.api;
    ColumnApi = params.ColumnApi;

  }

  const onHideColumn= () =>{
    setModelVisibility(!modelVisibility);    
  }

  
  //async function fetchPosts() {
    //try {
      //const postData = await API.graphql({ query: listPost2s });
      //setPosts(postData.data.listPost2s.items); // result: { "data": { "listPost2s": { "items": [/* ..... */] } } }
    //} catch (err) {
      //console.log({ err })
    //}
  //}


  useEffect(() => {

    //ColumnApi.setColumnVisible('custom:ceoPhone', modelVisibility);
    //ColumnApi.setColumnVisible('custom:ceoPhone', false);
    listAllUsers();
    //fetchPosts();
/*
    const subscription = API.graphql(graphqlOperation(onUpdatePost2))
    .subscribe({
      next: ({value})=>{
        const post=value.data.onUpdatePost2;
        console.log("new post->",post);
        fetchPosts();
      },
      error: error => console.warn(error)
    })
    return () => {subscription.unsubscribe()}
    */

  }, []);

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

        
        return agg;        
      }, {});      
    });
    console.log("users->",users);
    setPosts(users);
    setLoading(false);
    return rest;
  }
  return (

      <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
        <button type="button" onClick={onSelectedRows}>select Rows</button>
        <button type="button" onClick={onHideColumn}>HideColumn</button>

        {loading? 
        ( <Spinner animation="border" role="status"/>
        ) : 
        <AgGridReact
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={posts}
          rowSelection="multiple"
          >
        
        </AgGridReact>
        }
      </div>
  );
}

export default Users;