import React from 'react';
import { connect } from "react-redux";
import { getAccountState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import ConnectWallet from "./ConnectWallet";

interface Props {
  accountState: AccountState,
}

function Dapp(props: Props) {
  if (!props.accountState.selectedAddress) {
    return (
      <ConnectWallet />
    );
  }
  return (
  <div> 
  Connected! address is : {props.accountState.selectedAddress}
  and network is : {props.accountState.selectedNetwork}</div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  accountState: getAccountState(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);
