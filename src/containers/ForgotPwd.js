import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";

export default function Login() {
  const history = useHistory();
  const [mode, setMode] = useState("process1");
  const [code, setCode] = useState("");
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fields, handleFieldChange] = useFormFields({
    id: "",
    pwd: ""
  });

  function validateForm() {
    return fields.id.length > 0 && fields.pwd.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMsg("");
    try {
      await Auth.forgotPassword(fields.id);
      setMode("process2");
    } catch (e) {
      const msg=onError(e);      
      switch (msg) {
        case "AuthError: Username cannot be empty":
          setErrorMsg("아이디를 입력해주세요.");
          break;
        case "UserNotFoundException: User does not exist.":
          setErrorMsg("존재하지 않는 유저입니다.");
          break;
        case "NotAuthorizedException: Incorrect username or password.":
          setErrorMsg("아이디 또는 비밀번호가 일치하지 않습니다.");
        break;
        default:
          setErrorMsg("일시적으로 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      }
      console.log(msg);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setErrorMsg("");
    console.log("fields : ", fields.id, code);
    try {
      await Auth.forgotPasswordSubmit(fields.id, code, fields.pwd);
      history.push("/dashboard");
    } catch (e) {
      const msg=onError(e);      
      switch (msg) {
        case "UserNotFoundException: User does not exist.":
          setErrorMsg("존재하지 않는 유저입니다.");
          break;
        case "NotAuthorizedException: Incorrect username or password.":
          setErrorMsg("아이디 또는 비밀번호가 일치하지 않습니다.");
        break;
        default:
          //setErrorMsg("일시적으로 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
          history.push("/dashboard");
      }
    }
  }

  const render = {
    process1 : (
      <Form onSubmit={handleSubmit}>
      <h3 className="mb-5">비밀번호 찾기</h3>
        <Form.Group size="lg" controlId="id">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={fields.id}
            onChange={handleFieldChange}
            className="mb-3"
          />
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
        >
          인증번호 전송
        </Button>
        {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}

        <div className="form-group mt-3">
          <button 
            type="submit" 
            className="btn btn-link"
            onClick={ ()=> history.push("/signup")}>
            회원가입
          </button>
          <button
            type="button"
            className="btn btn-link float-right"
            onClick={ ()=> history.push("/login")}>
            로그인
          </button>
        </div>
      </Form>
    ),
    process2 : (
      <Form onSubmit={handleConfirmationSubmit}>
        <h3>본인인증</h3>
        <p className="text-muted">휴대폰으로 전송된 인증번호를 입력해주세요.</p>
        <Form.Group size="lg" controlId="id">
          <Form.Label>인증번호</Form.Label>
          <Form.Control
            autoFocus
            type="number"
            value={code}
            onChange={(e)=>{ setCode(e.target.value)}}
            className="mb-3"
          />
        </Form.Group>
        <Form.Group size="lg" controlId="pwd">
          <Form.Label>신규 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={fields.pwd}
            onChange={handleFieldChange}
            className="mb-3"
          />
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
          className="mb-3"
        >
          비밀번호 변경
        </Button>

          {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </Form>
    ) 
  }

  return (
    <div className="Container">
    {render[mode]}
    </div>
  );
}