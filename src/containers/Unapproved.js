import React,{ Suspense } from 'react';

function LoadTable() {
  return (
    <div className="Container">
    <h3>아직 회원승인이 되지 않았습니다. </h3>
    <p className="txt-center">가입 후 영업일+2일 내에 담당자확인 후 승인처리됩니다.</p>   
  </div>
  );
}

const Unapproved = () => { return (<LoadTable />); }
export default Unapproved;