import React,{ Suspense } from 'react';

function LoadTable() {
  return (
      <Suspense
        fallback={<div className="Container"><span>데이터를 불러오는 중입니다. 잠시만 기다려 주세요.</span></div>}>
           <h3>수금일월보</h3>
      </Suspense> 
  );
}

const Paidsales = () => { return (<LoadTable />); }
export default Paidsales;