import React from "react";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { connect } from "react-redux";
import { setAccountDetails, setContractDetails } from "../redux/actions";
import { getAccountState, getContractState } from "../redux/selectors";

import ActionButton from "./ActionButton";
import CustomInput from "./CustomInput";

import "./styles/mint.scss";

interface Props {
  setAccountDetails: Function;
  setContractDetails: Function;
  accountState: AccountState;
  contractState: ContractState;
}

function Mint(props: Props) {
  console.log(props.accountState);
  console.log(props.contractState);
  //   if (props.accountState.selectedAddress == "") {
  //     return (
  //       <div className="mint-not-connected">Please connect your wallet!</div>
  //     );
  //   }

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ paddingBottom: "12px" }} className="mint-token-text">
        {" "}
        Token ID
      </div>
      <CustomInput placeholder="Enter number" />
      <div style={{ paddingTop: "12px" }}>
        <ActionButton label="Submit" onClick={() => {}} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
  accountState: getAccountState(state),
  contractState: getContractState(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAccountDetails: (params: any) => dispatch(setAccountDetails(params)),
    setContractDetails: (params: any) => dispatch(setContractDetails(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mint);
