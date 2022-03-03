import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ForgotPwd from "./containers/ForgotPwd";
import Settings from "./containers/Settings";
import DashBoard from "./containers/DashBoard";
import Agreement from "./containers/Agreement";
import Users from "./containers/Users";



import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";


export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/agreement">
  <Agreement />
</UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/login">
  <Login />
</UnauthenticatedRoute>
<UnauthenticatedRoute exact path="/signup">
  <Signup />
</UnauthenticatedRoute>
<UnauthenticatedRoute exact path="/forgotpwd">
  <ForgotPwd />
</UnauthenticatedRoute>
<AuthenticatedRoute exact path="/settings">
  <Settings />
</AuthenticatedRoute>
<AuthenticatedRoute exact path="/dashboard">
  <DashBoard />
</AuthenticatedRoute>
<AuthenticatedRoute exact path="/users">
  <Users />
</AuthenticatedRoute>
        <Route>
  <NotFound />
</Route>
    </Switch>
  );
}