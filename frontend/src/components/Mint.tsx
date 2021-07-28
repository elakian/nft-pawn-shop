import React, { useState } from "react";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";

import ActionButton from "./ActionButton";
import CustomInput from "./CustomInput";

import "./styles/mint.scss";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
}

function Mint(props: Props) {
  console.log(props.accountState);
  console.log(props.contractState);
  const [tokenID, setTokenID] = useState("");
  if (props.accountState.selectedAddress === "") {
    return (
      <div className="mint-not-connected">Please connect your wallet!</div>
    );
  }
  const onClickMint = async () => {
    try {
      const tx = await props.contractState.pawnNftContract.mint(
        props.accountState.selectedAddress,
        Number(tokenID)
      );
      await tx.wait();
      console.log("Minted!");
    } catch (e: any) {
      console.log("error", e);
    }
  };
  const onChangeTokenID = (e: any) => {
    setTokenID(e.target.value);
  };

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ paddingBottom: "12px" }} className="mint-token-text">
        {" "}
        Token ID
      </div>
      <CustomInput
        placeholder="Enter number"
        value={tokenID}
        onChange={onChangeTokenID}
      />
      <div style={{ paddingTop: "12px" }}>
        <ActionButton label="Mint" onClick={onClickMint} />
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Mint);
