import React from 'react';

export default (props) => {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  const buttonClicked = () => {
    props.btn(!props.bt);
    
  };

  return (
    <span>
      {props.value==null  || props.value==="" ? "" :"Y" } &nbsp;
      <button onClick={() => buttonClicked()}>수정</button>
    </span>
  );
};

//     <span>{props.bt} &nbsp; {cellValue}</span>
