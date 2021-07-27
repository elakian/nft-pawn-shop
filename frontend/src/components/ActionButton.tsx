import React from "react";

import "./styles/actionButton.scss";

interface Props {
  isAlt?: boolean;
  label: String;
  onClick: Function;
}

function ActionButton(props: Props) {
  let className = "action-button";
  const onClick = () => {
    props.onClick();
  };
  if (props.isAlt) {
    className = "action-button-alt";
  }
  return (
    <div className={className} onClick={onClick}>
      {props.label}
    </div>
  );
}

export default ActionButton;
