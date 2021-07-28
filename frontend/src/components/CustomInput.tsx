import React from "react";

import "./styles/customInput.scss";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: Function;
}

function CustomInput(props: Props) {
  const onChange = (e: any) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };
  return (
    <div>
      <input
        className="custom-input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={onChange}
      />
    </div>
  );
}

export default CustomInput;
