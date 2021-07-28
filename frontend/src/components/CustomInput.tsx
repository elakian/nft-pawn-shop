import React from "react";

import "./styles/customInput.scss";

interface Props {
  placeholder?: string;
}

function CustomInput(props: Props) {
  return (
    <div>
      <input className="custom-input" placeholder={props.placeholder} />
    </div>
  );
}

export default CustomInput;
