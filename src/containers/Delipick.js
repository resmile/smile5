import React,{ Suspense } from 'react';

function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>배송집계표 출력</h3>
      </Suspense> 
  );
}

const Delipick = () => { return (<LoadTable />); }
export default Delipick;