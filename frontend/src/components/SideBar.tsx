import React from "react";
import classNames from "classnames";

import { useHistory } from "react-router-dom";

import "./styles/sideBar.scss";

export interface Tab {
  name: string;
  url: string;
}

export const tabs: Array<Tab> = [
  {
    name: "Home",
    url: "home",
  },
  {
    name: "Pawned NFTs",
    url: "pawned",
  },
  {
    name: "Loans Given",
    url: "loans",
  },
];

interface Props {}

function SideBar(props: Props) {
  const history = useHistory();
  const selectedTab = history.location.pathname.split("/")[1];

  const options = [];
  console.log("selectedTab", selectedTab);

  for (let i = 0; i < tabs.length; i++) {
    const onClickTab = () => {
      history.push("/" + tabs[i].url);
    };
    const isSelected = tabs[i].url === selectedTab;
    options.push(
      <div key={i}>
        <div
          className={classNames({
            "side-bar-nav-tab-item": true,
            "side-bar-nav-tab-item-selected": isSelected,
          })}
          onClick={onClickTab}
        >
          <div
            className={classNames({
              "side-bar-nav-tab-item-contents": true,
              "side-bar-nav-tab-item-contents-selected": isSelected,
            })}
          >
            <div className="side-bar-nav-tab-item-contents-name">
              {tabs[i].name}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="side-bar-container">
      <div className="side-bar-nav-tabs-all">
        <div>{options}</div>
      </div>
    </div>
  );
}

export default SideBar;
