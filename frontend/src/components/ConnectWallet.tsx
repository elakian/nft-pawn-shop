import React from "react";
import { ethers } from "ethers";
import { connect } from "react-redux";
import { setAccountDetails, setContractDetails } from "../redux/actions";
import NFTPawnShopJSON from "../NFTPawnShop.json";
import PawnNFTJSON from "../PawnNFT.json";

import "./styles/connectWallet.scss";

interface Props {
  setAccountDetails: Function;
}

function ConnectWallet(props: Props) {
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "any"
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const selectedAddress = await signer.getAddress();
    const selectedNetwork = (window as any).ethereum.networkVersion;
    props.setAccountDetails({ selectedAddress, selectedNetwork });
  };

  return (
    <div>
      <div className="connect-wallet-button" onClick={connectWallet}>
        Connect
      </div>
    </div>
  );
}

const mapStateToProps = (state: any, ownProps: any) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAccountDetails: (params: any) => dispatch(setAccountDetails(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet);
