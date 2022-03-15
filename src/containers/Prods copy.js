import React, { useState, useEffect, useRef } from 'react';
import Amplify, {API, graphqlOperation, I18n} from 'aws-amplify'
import { listBlogs, listPosts } from '../graphql/queries'
import {onCreateBlog, onUpdateBlog} from '../graphql/subscriptions';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';


import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GridApi, ColumnApi } from 'ag-grid-community';


const data2= {
  data: {
    listBlogs: {
      items: [
        {
          name: "광호 블로그",
          id: "a9da098c-337f-4087-bab2-820d4a0659ae",
          createdAt: "2022-03-04T10:59:40.065Z",
          updatedAt: "2022-03-04T10:59:40.065Z",
          posts: {
            items: [
              {
                blogPostsId: "a9da098c-337f-4087-bab2-820d4a0659ae",
                createdAt: "2022-03-04T13:40:58.558Z",
                id: "94ccdc69-91f0-4285-9da6-a7e594cf1110",
                title: "두번째 포스팅입니다",
                updatedAt: "2022-03-04T13:40:58.558Z"
              },
              {
                blogPostsId: "a9da098c-337f-4087-bab2-820d4a0659ae",
                createdAt: "2022-03-04T13:41:02.692Z",
                id: "0adcd744-59a1-44c9-b39e-fdac508a9710",
                title: "세번째 포스팅입니다",
                updatedAt: "2022-03-04T13:41:02.692Z"
              },
              {
                blogPostsId: "a9da098c-337f-4087-bab2-820d4a0659ae",
                createdAt: "2022-03-04T13:41:12.037Z",
                id: "02679193-dd59-40aa-8b8f-a75a72cbcbbc",
                title: "네번째 포스팅입니다",
                updatedAt: "2022-03-04T13:41:12.037Z"
              },
              {
                blogPostsId: "a9da098c-337f-4087-bab2-820d4a0659ae",
                createdAt: "2022-03-04T13:40:50.855Z",
                id: "a9a554a0-5f67-4de8-8751-80006aab97ec",
                title: "첫번째 포스팅입니다",
                updatedAt: "2022-03-04T13:40:50.855Z"
              }
            ]
          }
        },
        {
          name: "하늘 블로그",
          id: "4c28e30c-b012-47e4-bb7e-15a89e773e0e",
          createdAt: "2022-03-04T10:59:59.879Z",
          updatedAt: "2022-03-04T10:59:59.879Z",
          posts: {
            items: []
          }
        }
      ]
    }
  }
};



const Prods = () => {
  const [posts, setPosts] = useState([]);
  const [listPosts, setListPosts] = useState([]);
  const [modelVisibility, setModelVisibility] = useState(true);
  const [columnDefs, setColumnDefs] = useState([
    { headerName : 'aaa', field : 'name', sortable:true, filter:true, checkboxSelection:true },
  ]);

  const onSelectedRows= () =>{
    const selectedNodes = GridApi.getSelectedNodes();
    const selectedRows = selectedNodes.map(rows => rows.data);
    const selectedRowsData = selectedRows
      .map(rows => `${rows.name} ${rows.id}`).join('. ');      
    alert(selectedRowsData);
  }

  const onGridReady= (params) =>{

    GridApi = params.api;
    ColumnApi = params.ColumnApi;

  }

  const onHideColumn= () =>{
    setModelVisibility(!modelVisibility);    
  }

  useEffect(() => {
    //ColumnApi.setColumnVisible('description', modelVisibility);
    //ColumnApi.setColumnVisible('name', false).
    fetchPosts();

    const subscription = API.graphql(graphqlOperation(onUpdateBlog))
    .subscribe({
      next: ({value})=>{
        const blog=value.data.onUpdateBlog;
        console.log("new blog->",blog);
        fetchPosts();
      },
      error: error => console.warn(error)
    })
    return () => {subscription.unsubscribe()}
    

  }, []);

  
  async function fetchPosts() {
    try {
      const blogData = await API.graphql({ query: listBlogs });
      const temp=[];
      const x=data2.data.listBlogs.items;
      //console.log("ab->",x.length);

      for(let i=0;i<x.length;i++){
        //console.log("a-.",i);
        const y=data2.data.listBlogs.items[i].posts.items;
        for(let j=0;j<y.length;j++){
          temp.push({
            name : x[i].name,
            blogPostsId : y[j].blogPostsId,
            title : y[j].title
          })
        }
        //console.log("zxc->",b);
        //console.log("c->",data2.data.listBlogs.items[i].posts.items.length);
      }

      console.log(temp);
      setPosts(temp);
      

      //console.log("blog->",blogData.data.listBlogs.items);
      //setPosts(blogData.data.listBlogs.items); // result: { "data": { "listPost2s": { "items": [/* ..... */] } } }

      const post = await API.graphql({ query: queries.listPosts });
      setListPosts(post.data.listPosts.items); // result: { "data": { "listPost2s": { "items": [/* ..... */] } } }
      //console.log("post=>",post.data.listPosts.items );

    } catch (err) {
      console.log({ err })
    }
  }
  
  return (
    <div className="Container">
      <h3>상품리스트</h3>
      <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
        <button type="button" onClick={onSelectedRows}>select Rows</button>
        <button type="button" onClick={onHideColumn}>HideColumn</button>

        <AgGridReact
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowData={posts}
          rowSelection="multiple"
          >
        
        </AgGridReact>
      </div>
    </div>
  );
}

export default Prods;