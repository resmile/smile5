import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import "./Signup.css";
import { API, Auth, Storage, graphqlOperation } from "aws-amplify";
import { ListGroup } from "react-bootstrap";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

export default function Signup({ adminMode }) {
  const schema = Yup
    .object()
    .shape({
    id: Yup.string()
      .required('아이디를 입력해주세요.')
      .matches(/^[a-zA-Z0-9]*$/, '영어와 숫자만 입력 가능합니다.')
      .min(6, '6글자 이상 입력해주세요.')
      .max(20, '20글자 이하로 입력해주세요.'),
      pwd: Yup.string() 
      .required('비밀번호를 입력해주세요.')
      .min(6, '6글자 이상 입력해주세요.')
      .max(20, '20글자 이하로 입력해주세요.'),
    confirmPwd: Yup.string()
      .required('비밀번호를 입력해주세요.')
      .min(6, '6글자 이상 입력해주세요.')
      .max(20, '20글자 이하로 입력해주세요.')
      .oneOf([Yup.ref('pwd'), null], '기존 비밀번호와 일치하지 않습니다.'),
    name: Yup.string()
      .required('이름을 입력해주세요.')
      .matches(/^[가-힣a-zA-Z]+$/, '한글 또는 영어만 입력 가능합니다.')
      .min(3, '3글자 이상 입력해주세요.')
      .max(20, '20글자 이하로 입력해주세요.'),
    email: Yup.string()
      .required('이메일을 입력해주세요.')
      .email('이메일 형식(user@domain.kr)으로 입력해주세요.'),    
    phone: Yup.string()
      .required('휴대폰 번호를 입력해주세요.')
      //.typeError('you must specify a number')
      //.matches(/^[0-9]*$/, '휴대폰 번호는 숫자만 입력해주세요.(예: 01023456789)')    
      .min(9, '9글자 이상 입력해주세요.')
      .max(11, '11글자를 초과할 수 없습니다.'),
    brand: Yup.string() 
    .required('브랜드명을 입력해주세요.')
    .min(1, '1글자 이상 입력해주세요.')
    .max(35, '35글자 이하로 입력해주세요.'),
    company: Yup.string() 
      .required('회사명을 입력해주세요.')
      .min(1, '1글자 이상 입력해주세요.')
      .max(35, '35글자 이하로 입력해주세요.'),
    ceoName: Yup.string()
      .required('대표자명을 입력해주세요.')
      .min(3, '3글자 이상 입력해주세요.')
      .max(30, '30글자 이하로 입력해주세요.'),
    ceoPhone: Yup.string()
      .required('대표자 연락처를 입력해주세요.')
      //.typeError('you must specify a number')
      //.matches(/^[0-9]*$/, '휴대폰 번호는 숫자만 입력해주세요.(예: 01023456789)')    
      .min(9, '9글자 이상 입력해주세요.')
      .max(11, '11글자를 초과할 수 없습니다.'),
    bizNum: Yup.string()
      .required('사업자 번호를 입력해주세요.')
      //.typeError('you must specify a number')
      //.matches(/^[0-9]*$/, '사업자 번호는 숫자만 입력해주세요.(예: 2208893187)')
      .min(10, '10글자로 입력해주세요.')
      .max(10, '10글자를 초과할 수 없습니다.'),
    bizAddr: Yup.string() 
      .required('사업장주소를 입력해주세요.')
      .min(5, '5글자 이상 입력해주세요.')
      .max(100, '100글자 이하로 입력해주세요.'),
    bizLic: Yup.string()
    .required('사업자등록증을 첨부해주세요.'),
    acceptTerms: Yup.bool().oneOf([true], '이용약관에 동의해주세요.')
  })
  .required();
  
//.matches(/^[가-힣a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]*$/, '회사명은 한글, 영문 또는 숫자, 특수문자만 입력가능합니다.')
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  //const [mode, setMode] = useState({screen:"userType", userType:0});
  const [mode, setMode] = useState("userType");
  const [groupNo, setGroupNo] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [stateName, setStateName] = useState("");
  const [stateNo, setStateNo] = useState(0);
  const [code, setCode] = useState("");
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isUploadedFile, setIsUploadedFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");


  useEffect(() => {
    if(mode=="signUp10" || mode=="signUp20" || mode=="signUp21"){
      if(mode=="signUp10") { setGroupNo(10); setGroupName("매입처"); }
      else if(mode=="signUp20") { setGroupNo(20); setGroupName("매출처"); }
      else { setGroupNo(21); setGroupName("매출처"); }
      reset({
      id : '',
      pwd : '',
      confirmPwd : '',
      name : '',
      email : '',
      phone : '',
      company : '',
      brand:'없음',
      bizAddr : '',
      bizNum : '',
      ceoName : '',
      ceoPhone : '',
      bizLic : ''
    });
    }else if(mode=="signUp1"){
      setGroupNo(1);
      setGroupName("배송");
      reset({
        id : '',
        pwd : '',
        confirmPwd : '',
        name : '',
        email : '',
        phone : '',
        company : '(주)스마일푸드',
        brand:'없음',
        bizAddr : '경기도 하남시 검단산로126번길 22(창우동)',
        bizNum : '4838801177',
        ceoName : '최상민, 정선민, 이경우',
        ceoPhone : '0317960434',
        bizLic : 'temp.jpg'
      });
    }else if(mode=="signUp22"){
      setGroupName("매출처");
      setGroupNo(22);
        reset({
          id : '',
          pwd : '',
          confirmPwd : '',
          name : '',
          email : '',
          phone : '',
          company : '',
          brand:'',
          bizAddr : '',
          bizNum : '',
          ceoName : '',
          ceoPhone : '',
          bizLic : ''
        });

      }else{
      return 0;
    }
  }, [mode]);

  /*
  function handleChange(evt) {
    const value = evt.target.value;
    setU({
      ...u,
      [evt.target.name]: value
    });
  }
*/

    
  const onSubmit = (data) => {
    setErrorMsg("");
    // bizLic.name.replace(/\s/g, '-').toLowerCase();
    let u=getValues();
    let ph=u.phone.substr(1);
    const phone = "+82"+ph;
    const gName = (mode=="signUp1" ? u.groupName : groupName);
    try {
      const newUser = Auth.signUp({
        username: u.id,
        password: u.pwd,
        attributes: {
          phone_number : phone,
          name : u.name,
          email : u.email,
          'custom:company' : u.company,
          'custom:brand' : u.brand,
          'custom:bizNum' : u.bizNum,
          'custom:bizAddr' : u.bizAddr,
          'custom:bizLicName' : uploadedFileName,
          'custom:bizLic' : uploadedFileUrl,
          'custom:groupName' : groupName,
          //'custom:groupNo' : groupNo,
          ...(adminMode=="admin" ? {'custom:stateName': gName }: {'custom:stateName': "미분류" }),
          //'custom:stateNo' : 0,
          'custom:ceoName' : u.ceoName,
          'custom:ceoPhone' : u.ceoPhone,
          } 
      });
       setMode("confirm");
    } catch (e) {
      const msg=onError(e);      
      switch (msg) {
        case "UserNotFoundException: User does not exist.":
          setErrorMsg("존재하지 않는 유저입니다.");
          break;
        case "NotAuthorizedException: Incorrect username or password.":
          setErrorMsg("아이디 또는 비밀번호가 일치하지 않습니다.");
          break;
        case "SerializationException: NUMBER_VALUE can not be converted to a String":
          setErrorMsg("문자는 숫자 형식으로 변경할 수 없습니다.");
          break;
        case "UsernameExistsException: User already exists":
          setErrorMsg("기존에 가입된 유저입니다.");
          break;
          default:
          setErrorMsg("일시적으로 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      }
      console.log(msg);
    }
    

  };


  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setErrorMsg("");
    
    let u=getValues();
    /*
    const gName = (mode=="signUp1" ? u.groupName : "미분류");
    let groupName="";
    if(gName==="매출처") { groupName="buyer"}
    else if(gName==="매입처") { groupName="seller"}
    else if(gName==="배송" || gName==="피킹" || gName==="일반") { groupName="general"}
    else if(gName==="미분류") { groupName="none"}
    else{ groupName="admin"}
    */
    try {
      await Auth.confirmSignUp(u.id, code).then(() => {
        //addUserToGroup(u.id, groupName);
        if(adminMode=="admin"){ setMode("completedAdmin");}
        else{ setMode("completed"); } 
      })
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
          //addUserToGroup(u.id, groupName);
          if(adminMode=="admin"){ setMode("completedAdmin");}
          else{ setMode("completed"); }  
          //setErrorMsg("일시적으로 알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  }
  

  async function handleUserType(event, userType) {
    event.preventDefault();
    //updateUser("group", userType);
    switch (userType) {
      case 1:
        setMode("signUp1");
        break;
      case 10:
        setMode("signUp10");
        break;
      case 20:
        setMode("signUp20");
      break;
      case 21:
        setMode("signUp21");        
      break;
      case 22:
        setMode("signUp22");        
      break;
      default:
        //setMode("signUp");
    }
  }

  async function handleUploadFile(e) {
    const file = e.target.files[0];
    const fileName = file.name;

    await Storage.put(fileName, file).then(() => {
      setUploadedFileName(fileName);
      handleGetFile();
      setIsUploadedFile(true); 
      reset({
        bizLic : fileName
      });
    });
    
  }
  async function handleGetFile() {
    let fileKey= await Storage.list('')
    const signedUrl = await Storage.get(fileKey.key);
    //const preUrl = signedUrl.split('?')[0];
    setUploadedFileUrl("https://smile195110-dev.s3.ap-northeast-2.amazonaws.com/public/"+uploadedFileName);    
  }

  async function handleDelFile(event) {
    event.preventDefault();
    await Storage.remove(uploadedFileName).then(() => {
      setIsUploadedFile(false);
      setUploadedFileUrl("");
      setUploadedFileName("");
      reset({
        bizLic : ''
      });
    });
  }

  const addUserToGroup = async (username, groupname) => {
    const apiName = 'AdminQueries';
    const path = '/addUserToGroup';
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      body: {
        username,
        groupname,
      },
    };
    return await API.post(apiName, path, params);
  };
  
  const render = {
    userType : (
      <div className="lander">
        <h3>회원유형</h3>
        <p className="text-muted">회원 유형을 선택해주세요.</p>
        <ListGroup size="lg">
          <ListGroup.Item size="lg"  onClick={ (e) => handleUserType(e,22)} >
            프랜차이즈식당
          </ListGroup.Item>
          <ListGroup.Item size="lg" onClick={ (e) => handleUserType(e,21)} >
            개인식당
          </ListGroup.Item>
          <ListGroup.Item size="lg" onClick={ (e) => handleUserType(e,20)} >
            일반 개인사업자
          </ListGroup.Item>
          <ListGroup.Item size="lg"  onClick={ (e) => handleUserType(e,10)} >
            매입처
          </ListGroup.Item>
          <ListGroup.Item size="lg" onClick={ (e) => handleUserType(e,1)} >
            스마일푸드
          </ListGroup.Item>
        </ListGroup>
      </div>
    ),
    signUp20 : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원가입</h3>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="6글자 이상"
            {...register('id')}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>비밀번호</label>
        <input
            type="password"
            placeholder="8글자 이상"
            {...register('pwd')}
            className={`form-control ${errors.pwd ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.pwd?.message}</div>
        </div>
        <div className="form-group col">
        <label>비밀번호 확인</label>
        <input
            name="confirmPwd"
            type="password"
            {...register('confirmPwd')}
            className={`form-control ${
              errors.confirmPwd ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPwd?.message}
          </div>
        </div>
        
      </div>
      <h6>발주담당자 정보</h6>
      <hr/>
      <div className="row">
        <div className="form-group col">
        <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group col">
        <label>휴대폰</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        
      </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            placeholder="user@domain.kr"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <h6>회사정보</h6>
        <hr/>
        <div className="form-group">
          <label>회사명</label>
          <input
            type="text"
            placeholder="예: 회사명"
            {...register('company')}
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.company?.message}</div>
        </div>
        {mode!="signUp20"&& (
        <div className="form-group">
          <label>브랜드</label>
          <input
            type="text"
            placeholder="예: 연안식당"
            {...register('brand')}
            className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.brand?.message}</div>
        </div>
        )}
        <div className="row">
        <div className="form-group col">
        <label>대표자명</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('ceoName')}
            className={`form-control ${errors.ceoName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoName?.message}</div>
        </div>
        <div className="form-group col">
        <label>대표자 연락처</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('ceoPhone')}
            className={`form-control ${errors.ceoPhone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoPhone?.message}</div>
        </div>
      </div>
        <div className="form-group">
          <label>사업자번호</label>
          <input
            type="text"
            placeholder="예: 2208893187"
            {...register('bizNum')}
            className={`form-control ${errors.bizNum ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizNum?.message}</div>
        </div>
        <div className="form-group">
          <label>사업장주소</label>
          <input
            type="text"
            placeholder="예: 경기도 하남시 검단산로126번길 22"
            {...register('bizAddr')}
            className={`form-control ${errors.bizAddr ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizAddr?.message}</div>
        </div>
        <div>
          <label>사업자등록증 첨부</label>
          <input
            type="file"
            {...register('bizLic')}
            onChange={handleUploadFile} disabled={isUploadedFile}
            className={`form-control ${errors.bizLic ? 'is-invalid' : ''}`}
          />
          {isUploadedFile && (
        <Button
          block
          size="sm"
          type="submit"
          onClick={ (e) => handleDelFile(e)}
        >
          파일 삭제
        </Button>
        )}
          <div className="invalid-feedback">{errors.bizLic?.message}</div>
          
        </div>
 
        

        <div className="form-group form-check mt-3">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
          <a href="/agreement" target="_blank">이용약관</a>, <a href="#" target="_blank">개인정보처리방침</a>에 모두 동의합니다.
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>

        <Button
          block
          size="lg"
          type="submit"
        >
          회원가입
        </Button>
        {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </form>
    ),
    signUp10 : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원가입</h3>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="6글자 이상"
            {...register('id')}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>비밀번호</label>
        <input
            type="password"
            placeholder="8글자 이상"
            {...register('pwd')}
            className={`form-control ${errors.pwd ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.pwd?.message}</div>
        </div>
        <div className="form-group col">
        <label>비밀번호 확인</label>
        <input
            name="confirmPwd"
            type="password"
            {...register('confirmPwd')}
            className={`form-control ${
              errors.confirmPwd ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPwd?.message}
          </div>
        </div>
        
      </div>
      <h6>발주승인 담당자 정보</h6>
      <hr/>
      <div className="row">
        <div className="form-group col">
        <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group col">
        <label>휴대폰</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        
      </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            placeholder="user@domain.kr"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <h6>회사정보</h6>
        <hr/>
        <div className="form-group">
          <label>회사명</label>
          <input
            type="text"
            placeholder="예: (주)OO농수산"
            {...register('company')}
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.company?.message}</div>
        </div>
        {mode!="signUp10"&& (
        <div className="form-group">
          <label>브랜드</label>
          <input
            type="text"
            placeholder="예: 연안식당"
            {...register('brand')}
            className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.brand?.message}</div>
        </div>
        )}
        <div className="row">
        <div className="form-group col">
        <label>대표자명</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('ceoName')}
            className={`form-control ${errors.ceoName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoName?.message}</div>
        </div>
        <div className="form-group col">
        <label>대표자 연락처</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('ceoPhone')}
            className={`form-control ${errors.ceoPhone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoPhone?.message}</div>
        </div>
      </div>
        <div className="form-group">
          <label>사업자번호</label>
          <input
            type="text"
            placeholder="예: 2208893187"
            {...register('bizNum')}
            className={`form-control ${errors.bizNum ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizNum?.message}</div>
        </div>
        <div className="form-group">
          <label>사업장주소</label>
          <input
            type="text"
            placeholder="예: 경기도 하남시 검단산로126번길 22"
            {...register('bizAddr')}
            className={`form-control ${errors.bizAddr ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizAddr?.message}</div>
        </div>
        <div>
          <label>사업자등록증 첨부</label>
          <input
            type="file"
            {...register('bizLic')}
            onChange={handleUploadFile} disabled={isUploadedFile}
            className={`form-control ${errors.bizLic ? 'is-invalid' : ''}`}
          />
          {isUploadedFile && (
        <Button
          block
          size="sm"
          type="submit"
          onClick={ (e) => handleDelFile(e)}
        >
          파일 삭제
        </Button>
        )}
          <div className="invalid-feedback">{errors.bizLic?.message}</div>
          
        </div>
 
        

        <div className="form-group form-check mt-3">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
          <a href="/agreement" target="_blank">이용약관</a>, <a href="#" target="_blank">개인정보처리방침</a>에 모두 동의합니다.
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>

        <Button
          block
          size="lg"
          type="submit"
        >
          회원가입
        </Button>
        {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </form>
    ),
    signUp1 : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원가입</h3>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="6글자 이상"
            {...register('id')}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>비밀번호</label>
        <input
            type="password"
            placeholder="8글자 이상"
            {...register('pwd')}
            className={`form-control ${errors.pwd ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.pwd?.message}</div>
        </div>
        <div className="form-group col">
        <label>비밀번호 확인</label>
        <input
            type="password"
            {...register('confirmPwd')}
            className={`form-control ${
              errors.confirmPwd ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPwd?.message}
          </div>
        </div>
        
      </div>
      <h6>담당자정보</h6>
      <hr/>
      <div className="row">
        <div className="form-group col">
        <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group col">
        <label>휴대폰</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        
      </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            placeholder="user@domain.kr"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>     

        <div className="form-group">
          <label>분류</label>
          <select className="form-control" {...register('groupName')}>
            <option disabled>그룹을 선택해주세요.</option>
            <option>일반</option>
            <option>배송</option>
            <option>피킹</option>
          </select>
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>      

        <div className="form-group form-check mt-3">
          <input
            name="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
          <a href="/agreement" target="_blank">이용약관</a>, <a href="#" target="_blank">개인정보처리방침</a>에 모두 동의합니다.
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>
        <Button
          block
          size="lg"
          type="submit"
        >
          회원가입
        </Button>
                {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </form>
    ),
    signUp22 : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원가입</h3>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="6글자 이상"
            {...register('id')}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>비밀번호</label>
        <input
            type="password"
            placeholder="8글자 이상"
            {...register('pwd')}
            className={`form-control ${errors.pwd ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.pwd?.message}</div>
        </div>
        <div className="form-group col">
        <label>비밀번호 확인</label>
        <input
            name="confirmPwd"
            type="password"
            {...register('confirmPwd')}
            className={`form-control ${
              errors.confirmPwd ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPwd?.message}
          </div>
        </div>
        
      </div>
      <h6>발주담당자 정보</h6>
      <hr/>
      <div className="row">
        <div className="form-group col">
        <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group col">
        <label>휴대폰</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        
      </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            placeholder="user@domain.kr"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <h6>식당정보</h6>
        <hr/>
        <div className="form-group">
          <label>식당명</label>
          <input
            type="text"
            placeholder="예: 연안식당 하남미사역점"
            {...register('company')}
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.company?.message}</div>
        </div>
        <div className="form-group">
          <label>브랜드</label>
          <input
            type="text"
            placeholder="예: 연안식당"
            {...register('brand')}
            className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.brand?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>대표자명</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('ceoName')}
            className={`form-control ${errors.ceoName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoName?.message}</div>
        </div>
        <div className="form-group col">
        <label>대표자 연락처</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('ceoPhone')}
            className={`form-control ${errors.ceoPhone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoPhone?.message}</div>
        </div>
      </div>
        <div className="form-group">
          <label>사업자번호</label>
          <input
            type="text"
            placeholder="예: 2208893187"
            {...register('bizNum')}
            className={`form-control ${errors.bizNum ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizNum?.message}</div>
        </div>
        <div className="form-group">
          <label>사업장주소</label>
          <input
            type="text"
            placeholder="예: 경기도 하남시 검단산로126번길 22"
            {...register('bizAddr')}
            className={`form-control ${errors.bizAddr ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizAddr?.message}</div>
        </div>
        <div>
          <label>사업자등록증 첨부</label>
          <input
            type="file"
            {...register('bizLic')}
            onChange={handleUploadFile} disabled={isUploadedFile}
            className={`form-control ${errors.bizLic ? 'is-invalid' : ''}`}
          />
          {isUploadedFile && (
        <Button
          block
          size="sm"
          type="submit"
          onClick={ (e) => handleDelFile(e)}
        >
          파일 삭제
        </Button>
        )}
          <div className="invalid-feedback">{errors.bizLic?.message}</div>
          
        </div>
        

        <div className="form-group form-check mt-3">
          <input
            name="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
           <a href="/agreement" target="_blank">이용약관</a>, <a href="#" target="_blank">개인정보처리방침</a>에 모두 동의합니다.
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>

        <Button
          block
          size="lg"
          type="submit"
        >
          회원가입
        </Button>
                {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </form>
    ),
    signUp21 : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원가입</h3>
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            placeholder="6글자 이상"
            {...register('id')}
            className={`form-control ${errors.id ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
        <div className="row">
        <div className="form-group col">
        <label>비밀번호</label>
        <input
            type="password"
            placeholder="8글자 이상"
            {...register('pwd')}
            className={`form-control ${errors.pwd ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.pwd?.message}</div>
        </div>
        <div className="form-group col">
        <label>비밀번호 확인</label>
        <input
            name="confirmPwd"
            type="password"
            {...register('confirmPwd')}
            className={`form-control ${
              errors.confirmPwd ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPwd?.message}
          </div>
        </div>
        
      </div>
      <h6>발주담당자 정보</h6>
      <hr/>
      <div className="row">
        <div className="form-group col">
        <label>이름</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="form-group col">
        <label>휴대폰</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('phone')}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        
      </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            placeholder="user@domain.kr"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <h6>식당정보</h6>
        <hr/>
        <div className="form-group">
          <label>식당명</label>
          <input
            type="text"
            placeholder="예: 연안식당 하남미사역점"
            {...register('company')}
            className={`form-control ${errors.company ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.company?.message}</div>
        </div>
        {mode!="signUp21"&& (
        <div className="form-group">
          <label>브랜드</label>
          <input
            type="text"
            placeholder="예: 연안식당"
            {...register('brand')}
            className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.brand?.message}</div>
        </div>
        )}
        <div className="row">
        <div className="form-group col">
        <label>대표자명</label>
          <input
            type="text"
            placeholder="홍길동"
            {...register('ceoName')}
            className={`form-control ${errors.ceoName ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoName?.message}</div>
        </div>
        <div className="form-group col">
        <label>대표자 연락처</label>
          <input
            type="text"
            placeholder="01012345678"
            {...register('ceoPhone')}
            className={`form-control ${errors.ceoPhone ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.ceoPhone?.message}</div>
        </div>
      </div>
        <div className="form-group">
          <label>사업자번호</label>
          <input
            type="text"
            placeholder="예: 2208893187"
            {...register('bizNum')}
            className={`form-control ${errors.bizNum ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizNum?.message}</div>
        </div>
        <div className="form-group">
          <label>사업장주소</label>
          <input
            type="text"
            placeholder="예: 경기도 하남시 검단산로126번길 22"
            {...register('bizAddr')}
            className={`form-control ${errors.bizAddr ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.bizAddr?.message}</div>
        </div>
        <div>
          <label>사업자등록증 첨부</label>
          <input
            type="file"
            {...register('bizLic')}
            onChange={handleUploadFile} disabled={isUploadedFile}
            className={`form-control ${errors.bizLic ? 'is-invalid' : ''}`}
          />
          {isUploadedFile && (
        <Button
          block
          size="sm"
          type="submit"
          onClick={ (e) => handleDelFile(e)}
        >
          파일 삭제
        </Button>
        )}
          <div className="invalid-feedback">{errors.bizLic?.message}</div>
          
        </div>
        

        <div className="form-group form-check mt-3">
          <input
            name="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
           <a href="/agreement" target="_blank">이용약관</a>, <a href="#" target="_blank">개인정보처리방침</a>에 모두 동의합니다.
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>

        <Button
          block
          size="lg"
          type="submit"
        >
          회원가입
        </Button>
                {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </form>
    ),
    confirm : (
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
          />
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
        >
          본인인증
        </Button>

          {errorMsg && (
        <div className="alert alert-danger mt-3" role="alert">
        {errorMsg}
        </div>
        )}
      </Form>
    ),
    completed : (
      <div className="lander">
        <h3>회원가입완료</h3>
        <p className="text-muted" style={{marginTop:50}}>{`스마일푸드의 식자재 발주앱은
회원승인이 필요한 서비스입니다.

가입 후 영업일+2일 내에
담당자 확인 후 승인처리됩니다.
`}</p>
        
      </div>
    ),
    completedAdmin : (
      <div className="lander">
        <h3>회원가입완료</h3>
        <p className="text-muted" style={{marginTop:50}}>{`[우측 상단의 [X]버튼을 눌러 창을 닫아주세요.

가입된 회원은 미분류 회원으로분류됩니다.
회원리스트에서 승인처리해주세요.
`}</p>
        
      </div>
    )
  }

  return (
    <div className="Signup">
      {render[mode]}
    </div>
  );
}