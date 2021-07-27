import React from 'react';
import { ethers } from "ethers";
import { connect } from "react-redux";
import { setAccountDetails } from "../redux/actions";

interface Props {
    setAccountDetails: Function,
}

function ConnectWallet(props: Props) {

    const connectWallet = async () => {
        const [selectedAddress] = await (window as any).ethereum.enable();
        const selectedNetwork = (window as any).ethereum.networkVersion;
        props.setAccountDetails({selectedAddress, selectedNetwork});
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
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWallet);