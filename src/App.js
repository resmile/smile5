import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import { AppContext } from "./lib/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "./lib/errorLib";
import config from './aws-exports';
import Amplify, { Auth, Hub } from "aws-amplify";
Amplify.configure(config);

/*
Amplify.configure({
  Auth: {
      identityPoolId: "ap-northeast-2:0d29170a-e9a8-4586-ad6d-37a26b111cfd",
      region: 'ap-northeast-2', // REQUIRED - Amazon Cognito Region
      userPoolId: 'ap-northeast-2_Xc0NzEeIU', //OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: '42smb1q8kp40q1rrivu8nd9j1t', //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
      AWSS3: {
          bucket: 'smile195110-dev', //REQUIRED -  Amazon S3 bucket name
          region: 'ap-northeast-2', //OPTIONAL -  Amazon service region
      }
  }
});
*/


function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [pathName, setPathName] = useState("");
  const history = useHistory();

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
  
    history.push("/login");
  }

  useEffect(() => {
    onLoad();
    console.log(window.location.pathname);
    setPathName(window.location.pathname);
  }, []);
  
  async function onLoad() {
    try {
      //await Auth.currentAuthenticatedUser();
      //const user = Auth.currentAuthenticatedUser();
      //console.log("user->", user);
      
      let user = await Auth.currentAuthenticatedUser();
      const { attributes, username } = user;
      console.log(attributes, username);
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
<Container fluid>
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              ???????????????
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated && pathName!="/unapproved"? (
                <>
                  <Nav.Link href="/dashboard">Home</Nav.Link>
                  <NavDropdown title="???????????????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/ords">????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/sells">????????????</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/deliPick">??????????????? ??????</NavDropdown.Item>
                    <NavDropdown.Item href="/delis">????????? ????????? ??????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="????????????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/puchas">???????????????</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/paidPuchas">???????????????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="????????????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/addSales">????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/sales">???????????????</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/paidSales">???????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/profits">??????????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/trans">??????????????? ??????</NavDropdown.Item>
                    <NavDropdown.Item href="/tax">??????????????? ????????????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="??????/????????????" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/prods">???????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/stocks">???????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/inout">???/???????????????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="????????????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/users">???????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/groups">????????????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="??????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/notis">????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/price">???????????? ????????????</NavDropdown.Item>
                    <NavDropdown.Item href="/noOrds">??????????????? ??????</NavDropdown.Item>
                    <NavDropdown.Item href="/delivery">???????????? ??????</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="?????????" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/profile">???????????????</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>????????????</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>????????????</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>?????????</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
        </Container>
    )
  );
}

export default App;

/*


<LinkContainer to="/prods">
  <Nav.Link>???????????????</Nav.Link>
</LinkContainer>
<LinkContainer to="/groups">
  <Nav.Link>???????????????</Nav.Link>
</LinkContainer>
<LinkContainer to="/users">
  <Nav.Link>???????????????</Nav.Link>
</LinkContainer>
<LinkContainer to="/settings">
  <Nav.Link>?????????</Nav.Link>
</LinkContainer>

*/