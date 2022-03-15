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
                  <Nav.Link href="/dashboard">Home</Nav.Link>
                  <NavDropdown title="수발주관리" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/ords">수주관리</NavDropdown.Item>
                    <NavDropdown.Item href="/sells">발주관리</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/deliPick">배송집계표 출력</NavDropdown.Item>
                    <NavDropdown.Item href="/delis">코스별 리스트 출력</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="매입관리" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/puchas">매입리스트</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/paidPuchas">지급일월보</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="매출관리" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/addSales">매출등록</NavDropdown.Item>
                    <NavDropdown.Item href="/sales">매출리스트</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/paidSales">수금일월보</NavDropdown.Item>
                    <NavDropdown.Item href="/profits">판매이익조회</NavDropdown.Item>
                    <NavDropdown.Item href="/trans">거래명세서 출력</NavDropdown.Item>
                    <NavDropdown.Item href="/tax">세금계산서 내역조회</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="품목/재고관리" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/prods">품목리스트</NavDropdown.Item>
                    <NavDropdown.Item href="/stocks">재고리스트</NavDropdown.Item>
                    <NavDropdown.Item href="/inout">입/출고리스트</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="회원관리" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/users">회원리스트</NavDropdown.Item>
                    <NavDropdown.Item href="/groups">그룹관리</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="설정" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/notis">공지사항</NavDropdown.Item>
                    <NavDropdown.Item href="/price">매출단가 기준관리</NavDropdown.Item>
                    <NavDropdown.Item href="/noOrds">주문불가일 관리</NavDropdown.Item>
                    <NavDropdown.Item href="/delivery">배송사진 조회</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="프로필" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/profile">내정보변경</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>로그아웃</NavDropdown.Item>
                  </NavDropdown>
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

/*


<LinkContainer to="/prods">
  <Nav.Link>품목리스트</Nav.Link>
</LinkContainer>
<LinkContainer to="/groups">
  <Nav.Link>그룹리스트</Nav.Link>
</LinkContainer>
<LinkContainer to="/users">
  <Nav.Link>유저리스트</Nav.Link>
</LinkContainer>
<LinkContainer to="/settings">
  <Nav.Link>프로필</Nav.Link>
</LinkContainer>

*/