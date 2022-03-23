import React, {useRef} from 'react';
import Button from "react-bootstrap/Button";

export default (props) => {
  //console.log("props->",props);
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
  const fileRef = useRef();



  const handleModify = () => {
    alert(`${cellValue} 수정`);
    //props.setValue("aaaa");
  };

  const handleUpload = () => {
    alert(`업로드`);
  };



  const handleChange = (e) => {
    const [file] = e.target.files;
    
    if(e.target.id=="add"){
      props.setValue(file.name);
      props.data.newBizLicFileName=e.target.files[0];
      props.data.edit = true;
    }else{
      //cellValue를 old 파일명으로 지정
      console.log("oldFileName", cellValue);
      props.setValue(file.name);
      props.data.newBizLicFileName=e.target.files[0];
      props.data.oldBizLicName=cellValue;
      props.data.edit = true;
    }
    console.log("after props->",props);

  };

  

  return (
    <span>
    { cellValue ?
    (<span>
        <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://smile195110-dev.s3.ap-northeast-2.amazonaws.com/public/" + props.value}
        >
        {props.value==null  || props.value==="" ? "":"Y" }
      </a> &nbsp;&nbsp;
      <input
        ref={fileRef}
        onChange={handleChange}
        multiple={false}
        type="file"
        id="edit"
        hidden
      />
    
    <Button type="button" size="sm" onClick={() => fileRef.current.click()}>수정</Button>
    
    </span>
    ):
    (<span>
      <input
        ref={fileRef}
        onChange={handleChange}
        multiple={false}
        type="file"
        id="add"
        hidden
      />
        <Button type="button" size="sm" onClick={() => fileRef.current.click()}>업로드</Button>
    </span>

    )    
    }
</span>
  );
};


/*
<Button type="button" size="sm" onClick={() => handleModify()}>수정</Button>
*/