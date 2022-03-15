import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import {LicenseManager} from "ag-grid-enterprise";

LicenseManager.setLicenseKey("CompanyName=gwangholee,LicensedGroup=gwangholee,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-026102,ExpiryDate=7_March_2023_[v2]_MTY3ODE0NzIwMDAwMA==35efa692556ea8a02bf6e6f267a0c180");



ReactDOM.render(
     <Router>
      <App />
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*

import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import { fetchProfileData } from "./lib/fakeApi";

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


ReactDOM.render(
  <ProfilePage />,
  document.getElementById('root')
);
*/