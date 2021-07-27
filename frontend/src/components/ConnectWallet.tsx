import React from 'react';
import { ethers } from "ethers";
import { connect } from "react-redux";
import { setAccountDetails, setContractDetails } from "../redux/actions";
import NFTPawnShopJSON from "../NFTPawnShop.json";
import PawnNFTJSON from "../PawnNFT.json";

interface Props {
    setAccountDetails: Function,
    setContractDetails: Function,
}

function ConnectWallet(props: Props) {

    const connectWallet = async () => {

        const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const selectedAddress = await signer.getAddress();
        const selectedNetwork = (window as any).ethereum.networkVersion;
        const nftPawnShopContract = new ethers.Contract(NFTPawnShopJSON.address, NFTPawnShopJSON.abi, signer);
        const pawnNftContract = new ethers.Contract(PawnNFTJSON.address, PawnNFTJSON.abi, signer);
        props.setAccountDetails({selectedAddress, selectedNetwork});
        props.setContractDetails({nftPawnShopContract, pawnNftContract});
    }

    return (
        <div className="col-6 p-4 text-center">
        <p>Please connect to your wallet!</p>
        <button
          className="btn btn-warning"
          type="button"
          onClick={connectWallet}
        >
            Connect Wallet
        </button>
      </div>
    );
  }

const mapStateToProps = (state: any, ownProps: any) => ({
    ...ownProps,
});
  
const mapDispatchToProps = (dispatch: any) => {
    return {
        setAccountDetails: (params: any) => dispatch(setAccountDetails(params)),
        setContractDetails: (params: any) => dispatch(setContractDetails(params)),
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet);