import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

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
      identityPoolId: "ap-northeast-2:52525c8a-1b28-44fc-be77-978263de265c",
      region: 'ap-northeast-2', // REQUIRED - Amazon Cognito Region
      userPoolId: 'ap-northeast-2_UzQp7Bmy0', //OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: '9pfdjpuh0t7vl447f6p80b0fr', //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
      AWSS3: {
          bucket: 'smile210113-dev', //REQUIRED -  Amazon S3 bucket name
          region: 'ap-northeast-2', //OPTIONAL -  Amazon service region
      }
  }
});
*/


function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
  
    history.push("/login");
  }

  useEffect(() => {
    onLoad();
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
              스마일푸드
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/dashboard">
                    <Nav.Link>대시보드</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/users">
                    <Nav.Link>유저리스트</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/settings">
                    <Nav.Link>프로필</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>회원가입</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>로그인</Nav.Link>
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
