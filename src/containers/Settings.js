import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "../lib/errorLib";
import Amplify, { Auth, Hub } from "aws-amplify";

export default function Settings() {
  const history = useHistory();
  const [mode, setMode] = useState("view");
  const [user, setUser] = useState({});
  const [uid, setUid] = useState("");

  useEffect(() => {
    onLoad();
  }, []);


  async function onLoad() {
    try {
      let user = await Auth.currentAuthenticatedUser();
      const { attributes, username } = user;
      console.log(attributes, username);
      setUser(attributes);
      setUid(username);    
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

  }


  const render = {
    view : (
      <div>
      <h3 className="mb-5">프로필</h3>
      <p><b>{uid}</b></p>        
      <hr />
      <p><b>담당자 정보</b></p>
      <ul>
        <li>이름 : {user.name}</li>
        <li>핸드폰 : {user.phone_number}</li>
        <li>이메일 : {user.email}</li>
      </ul>        
      <hr />
      <p><b>회사정보</b></p>
      <ul>
        <li>회사명 : {user["custom:company"]}</li>
        <li>회사주소 : {user["custom:bizAddr"]}</li>
        <li>사업자번호 : {user["custom:bizNum"]}</li>


      </ul>        
      <hr />

      </div>

    ),
    edit : (
      <div>
      <h3 className="mb-5">프로필</h3>
      </div>
      
    ) 
  }

  return (
    <div className="Container">
    {render[mode]}
    </div>
  );
}