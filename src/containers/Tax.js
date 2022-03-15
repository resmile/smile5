import React,{ Suspense } from 'react';

function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>세금계산서 내역조회</h3>
      </Suspense> 
  );
}

const Tax = () => { return (<LoadTable />); }
export default Tax;