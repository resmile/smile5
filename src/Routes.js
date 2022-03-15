import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ForgotPwd from "./containers/ForgotPwd";
import Profile from "./containers/Profile";
import DashBoard from "./containers/DashBoard";
import Agreement from "./containers/Agreement";

import Ords from './containers/Ords';
import Sells from './containers/Sells';
import Delipick from './containers/Delipick';
import Delis from './containers/Delis';
import Puchas from './containers/Puchas';
import Paidpuchas from './containers/Paidpuchas';
import Addsales from './containers/Addsales';
import Sales from './containers/Sales';
import Paidsales from './containers/Paidsales';
import Profits from './containers/Profits';
import Trans from './containers/Trans';
import Tax from './containers/Tax';
import Prods from './containers/Prods';
import Stocks from './containers/Stocks';
import Inout from './containers/Inout';
import Users from './containers/Users';
import Groups from './containers/Groups';
import Notis from './containers/Notis';
import Price from './containers/Price';
import Noords from './containers/Noords';
import Delivery from './containers/Delivery';

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
<AuthenticatedRoute exact path="/profile">
  <Profile />
</AuthenticatedRoute>
<AuthenticatedRoute exact path="/dashboard">
  <DashBoard />
</AuthenticatedRoute>


<AuthenticatedRoute exact path='/ords'>
<Ords />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/sells'>
<Sells />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/deliPick'>
<Delipick />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/delis'>
<Delis />
</AuthenticatedRoute>

<AuthenticatedRoute exact path='/puchas'>
<Puchas />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/paidPuchas'>
<Paidpuchas />
</AuthenticatedRoute>

<AuthenticatedRoute exact path='/addSales'>
<Addsales />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/sales'>
<Sales />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/paidSales'>
<Paidsales />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/profits'>
<Profits />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/trans'>
<Trans />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/tax'>
<Tax />
</AuthenticatedRoute>

<AuthenticatedRoute exact path='/prods'>
<Prods />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/stocks'>
<Stocks />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/inout'>
<Inout />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/users'>
<Users />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/groups'>
<Groups />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/notis'>
<Notis />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/price'>
<Price />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/noOrds'>
<Noords />
</AuthenticatedRoute>
<AuthenticatedRoute exact path='/delivery'>
<Delivery />
</AuthenticatedRoute>

<Route>
  <NotFound />
</Route>
    </Switch>
  );
}