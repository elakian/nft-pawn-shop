import React from "react";
import ConnectWallet from "./ConnectWallet";

import { getAccountState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";

import { connect } from "react-redux";

import "./styles/topBar.scss";

interface Props {
  accountState: AccountState;
}

function TopBar(props: Props) {
  let connectButton = null;
  if (!props.accountState.selectedAddress) {
    connectButton = <ConnectWallet />;
  }
  return (
    <div className="top-bar">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div style={{ paddingRight: "16px", paddingTop: "6px" }}>
          {connectButton}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  accountState: getAccountState(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
