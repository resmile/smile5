import React,{ Suspense } from 'react';

function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>코스별 리스트 출력</h3>
      </Suspense> 
  );
}

const Delis = () => { return (<LoadTable />); }
export default Delis;