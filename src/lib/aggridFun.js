import toast, { Toaster } from 'react-hot-toast';

const notify = (msg) => toast.error(msg);


export const CheckRegExp ={
    name : function (p){
      const regExp=/^[가-힣a-zA-Z]+$/
      if(p.newValue===""){
        notify("담당자명을 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("한글 또는 영어만 입력 가능합니다.");
        return p.oldValue;
      }else if(p.newValue.length < 3 || p.newValue.length > 20){
        notify("3글자 이상, 20글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    email : function (p){
      const regExp=/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      if(p.newValue===""){
        notify("이메일을 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("이메일 형식(user@domain.kr)으로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    phone_number : function (p){
      const regExp=/\+821\d{8,9}/
      if(p.newValue===""){
        notify("휴대폰 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("휴대폰번호 형식(+821012345678)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 12 || p.newValue.length > 13){
        notify("12글자 이상, 13글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    brand : function (p){
      if(p.newValue===""){
        notify("브랜드명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 1 || p.newValue.length > 35){
        notify("1글자 이상, 35글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    company : function (p){
      if(p.newValue===""){
        notify("회사명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 1 || p.newValue.length > 35){
        notify("1글자 이상, 35글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    ceoName : function (p){
      if(p.newValue===""){
        notify("대표자명을 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 3 || p.newValue.length > 30){
        notify("3글자 이상, 30글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },

    ceoPhone : function (p){
      const regExp=/(\d){9,11}/
      if(p.newValue===""){
        notify("휴대폰 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("휴대폰번호 형식(01012345678)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 9 || p.newValue.length > 11){
        notify("9글자 이상, 11글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    bizNum : function (p){
      const regExp=/\d{10}/
      if(p.newValue===""){
        notify("사업자 번호를 입력해주세요.");
        return p.oldValue;
      }else if(!regExp.test(p.newValue)){
        notify("숫자형식(10글자)으로 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 10 || p.newValue.length > 10){
        notify("10글자로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
    bizAddr : function (p){
      if(p.newValue===""){
        notify("사업장주소를 입력해주세요.");
        return p.oldValue;
      }else if(p.newValue.length < 5 || p.newValue.length > 100){
        notify("5글자 이상, 100글자 이하로 입력해주세요.");
        return p.oldValue;
      }
      return p.newValue;
    },
  }


  export const Format ={
    defaultBlank : " - ",
    currency : function (p){
      if(!p.value && p.value != "0") {
          return Format.defaultBlank;
      }    
      return parseInt(p.value).format();
    },
    bizNum : function (p){
      if(!p.value && p.value != "0") {
          return Format.defaultBlank;
      }    
      return p.value.substr(0, 3) + "-" + p.value.substr(3, 2) + "-" + p.value.substr(5);
    },
    ceoPhone : function (p){
      let num=p.value;
      let result="";
      if(num.substr(0, 2) === '02') {
        if(num.substr(2).length==7){ result=num.substr(0,2)+"-"+num.substr(2,3)+"-"+num.substr(5); }
        else{result=num.substr(0,2)+"-"+num.substr(2,4)+"-"+num.substr(6); }
        return result
      }else{
        if(num.substr(3).length==7){ result=num.substr(0,3)+"-"+num.substr(3,3)+"-"+num.substr(6); }
        else{result=num.substr(0,3)+"-"+num.substr(3,4)+"-"+num.substr(7); }
        return result
      }
    },
    phone : function (p){
      let num=p.value;
      let result="";
        if(num.substr(5).length==7){ result=num.substr(0,3)+"-"+num.substr(3,2)+"-"+num.substr(5,3)+"-"+num.substr(8); }
        else{result=num.substr(0,3)+"-"+num.substr(3,2)+"-"+num.substr(5,4)+"-"+num.substr(9); }
        return result
    }
  }



export function whatsyourname(name) {
    return name? name.length >= 2 : false;
}