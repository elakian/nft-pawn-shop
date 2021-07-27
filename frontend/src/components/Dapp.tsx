import React from 'react';
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import ConnectWallet from "./ConnectWallet";
import NFTPawnShopJSON from "../NFTPawnShop.json";

interface Props {
  accountState: AccountState,
  contractState: ContractState,
}

function Dapp(props: Props) {
  if (!props.accountState.selectedAddress || !props.contractState.nftPawnShopContract) {
    return (
      <ConnectWallet />
    );
  }
  return (
    <div>
  <div> 
  Connected! address is : {props.accountState.selectedAddress} <b></b>
  and network is : {props.accountState.selectedNetwork}
  </div>
  <div>
    Pawnshop contract address is this: {props.contractState.nftPawnShopContract.address} <b></b>
    and NFT contract address is this: {props.contractState.pawnNftContract.address}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);