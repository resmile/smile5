import React, { Component, Suspense } from 'react'
import gqlsuspense from 'graphql-suspense'
import { API, graphqlOperation } from 'aws-amplify'
import { listGroups } from './graphql/queries'
import config from './aws-exports';
import Amplify, { Auth, Hub } from "aws-amplify";
Amplify.configure(config);


class Data extends React.Component {
  render() {
    const data = gqlsuspense(API.graphql(graphqlOperation(listGroups)))
    return data.data.listGroups.items.map((t, i) => <p key={i}>Yo! {t.name}</p>)
  }
}

const App = () => (
  <Suspense fallback={<div>loading...</div>}>
    <Data />
  </Suspense> 
)

export default App;
