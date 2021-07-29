import React from "react";

import ActionButton from "./ActionButton";

import "./styles/listCardItem.scss";

interface Props {
  headers: Array<string>;
  content: Array<string>;
  ctaLabel?: string;
  value?: string;
  onClickCta?: Function;
}

function ListCardItem(props: Props) {
  const headers = props.headers.map((ele, i) => (
    <th key={i} align="left">
      {ele}
    </th>
  ));
  const content = props.content.map((ele, i) => <td key={i}>{ele}</td>);
  if (props.ctaLabel && props.onClickCta) {
    headers.push(<th key={headers.length} align="left"></th>);
    content.push(
      <td key={content.length}>
        <ActionButton isAlt label={props.ctaLabel} onClick={props.onClickCta} />
      </td>
    );
  }
  return (
    <div className="list-item-card">
      <div>
        <div>
          <table style={{ width: "100%", padding: "8px" }}>
            <tr>{headers}</tr>
            <tr>{content}</tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListCardItem;
