import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Button from "react-bootstrap/Button";

const PopupCont = props => {
  const [selected, setSelected] = useState(props.curRow);

  async function onBtSubmit(){
    
    props.setIsOpen(!props.isOpen);

  }

  async function onBtCancel(){
    props.setIsOpen(!props.isOpen);
  }

  async function onSelect(){
    props.setCurRow(selected);
  }


  return (
    <div>
     {props.curRow}
     
     <Multiselect
      options={props.multiSelect}
      isObject={false}
      selectedValues={selected}
      onSelect={onSelect}
/>
<Button type="button" onClick={onBtSubmit}>적용</Button>&nbsp;&nbsp;&nbsp;
<Button type="button" onClick={onBtCancel}>취소</Button>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};
 
export default PopupCont;