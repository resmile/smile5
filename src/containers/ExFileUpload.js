import React, { useState, useEffect, useMemo } from "react";
import "./Home.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Storage } from 'aws-amplify';


export default function ExFileUpload() {
  const [isUploadedFile, setIsUploadedFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  async function handleUploadFile(e) {
    const file = e.target.files[0];
    const fileName = file.name;
    await Storage.put(fileName, file).then(() => {
      setUploadedFileName(fileName);
      handleGetFile();
      setIsUploadedFile(true); 
    });
    
  }
  async function handleGetFile() {
    let fileKey= await Storage.list('')
    const signedUrl = await Storage.get(fileKey.key);
    setUploadedFileUrl(signedUrl);    
  }

  async function handleDelFile(event) {
    event.preventDefault();  
    await Storage.remove(uploadedFileName).then(() => {
      setIsUploadedFile(false);
      setUploadedFileUrl("");
      setUploadedFileName("");
    });
  }

    return (
      <div>
        <p>Pick a file</p>
        <input type="file" onChange={handleUploadFile} disabled={isUploadedFile}/>
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
      </div>
    );
}

/*

export default function Home() {
  
  const [fileName, setFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState([]);
 
  async function fetchImages() {
    let fileKeys= await Storage.list('')
    fileKeys= await Promise.all(fileKeys.map(async k => {
      const signedUrl = await Storage.get(k.key)
      const afterStr = signedUrl.split('?')[0];
      const a=afterStr.substr(afterStr.length-3,3);
      console.log(a);
      return signedUrl;
    }));
    console.log('imageKeys2-> ', fileKeys);
    setUploadedFile(fileKeys);
    
  }
  async function  onChange(e) {
    const file = e.target.files[0];
    console.log("file->",file);
    setFileName(file);
    const result=await Storage.put(file.name, file);
    console.log("result->", result);
    fetchImages();
    
  }
  return (
    <div className="Home">
      <div className="lander">
        <h3>홈</h3>
        <input type="file"
          onChange={onChange}
          accept="image/*,application/pdf"
        />
        
        {
          uploadedFile.map(f =>(
            <img src={f} key={f} style={{ width : 400, height : 200, marginBottom : 10}} />
          ))
        }

      </div>
    </div>
  );
}
*/