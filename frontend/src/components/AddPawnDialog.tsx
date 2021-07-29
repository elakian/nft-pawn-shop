import React, { useState } from "react";
import { ethers } from "ethers";
import web3 from "web3";

import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";

import ActionButton from "./ActionButton";
import CustomInput from "./CustomInput";
import { Modal } from "react-bootstrap";

import NFTPawnShopJSON from "../NFTPawnShop.json";
import PawnNFTJSON from "../PawnNFT.json";

import { useHistory } from "react-router-dom";

import "./styles/addPawnDialog.scss";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
  show: boolean;
  onClose: Function;
}

function AddPawnDialog(props: Props) {
  const { show } = props;
  const [nftAddress, setNftAddress] = useState("");
  const [nftTokenID, setNftTokenID] = useState("");
  const [amountEther, setAmountEther] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [dialogState, setDialogState] = useState("approve");
  const history = useHistory();

  const onChangeNftAddress = (e: any) => {
    setNftAddress(e.target.value);
  };
  const onChangeNftTokenID = (e: any) => {
    setNftTokenID(e.target.value);
  };
  const onChangeAmountEther = (e: any) => {
    setAmountEther(e.target.value);
  };
  const onChangeInterestRate = (e: any) => {
    setInterestRate(e.target.value);
  };
  const onChangeDuration = (e: any) => {
    setDuration(e.target.value);
  };
  const clearFields = () => {
    setNftAddress("");
    setNftTokenID("");
    setAmountEther("");
    setInterestRate("");
    setDuration("");
    setDialogState("approve");
  };

  const onClose = () => {
    props.onClose();
  };
  let body = null;
  let title = null;
  let button = null;
  if (props.accountState.selectedAddress === "") {
    title = "Pawn NFT";
    body = (
      <div className="add-pawn-dialog-title">Please connect your wallet!</div>
    );
  } else if (dialogState === "approve") {
    title = "Approve Shop to Handle your NFT";
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "any"
    );
    const onClickApprove = async () => {
      const nftContract = new ethers.Contract(
        PawnNFTJSON.address,
        PawnNFTJSON.abi,
        provider.getSigner()
      );
      const tx = await nftContract.approve(NFTPawnShopJSON.address, nftTokenID);
      await tx.wait();
      setDialogState("terms");
    };
    button = <ActionButton isAlt label="Approve" onClick={onClickApprove} />;
    body = (
      <div>
        <div style={{ paddingBottom: "12px" }}>
          <div className="add-pawn-dialog-form-text">NFT Address</div>
          <CustomInput
            placeholder="Enter NFT Address"
            value={nftAddress}
            onChange={onChangeNftAddress}
          />
        </div>
        <div style={{ paddingBottom: "12px" }}>
          <div className="add-pawn-dialog-form-text">NFT Token ID</div>
          <CustomInput
            placeholder="Enter NFT Token ID"
            value={nftTokenID}
            onChange={onChangeNftTokenID}
          />
        </div>
      </div>
    );
  } else if (dialogState === "terms") {
    title = "Set the Terms";
    const onClickPawn = async () => {
      const tx = await props.contractState.nftPawnShopContract.pawn(
        nftAddress,
        nftTokenID,
        web3.utils.toWei(amountEther, "ether"),
        String(Number(duration) * 2592000),
        String(Number(interestRate)*100)
      );
      await tx.wait();
      clearFields();
      onClose();
      history.push("/pawned");
    };
    button = <ActionButton isAlt label="Pawn" onClick={onClickPawn} />;
    body = (
      <div>
        <div style={{ paddingBottom: "12px" }}>
          <div className="add-pawn-dialog-form-text">Loan Amount (ether)</div>
          <CustomInput
            placeholder="Enter amount in ether"
            value={amountEther}
            onChange={onChangeAmountEther}
          />
        </div>
        <div style={{ paddingBottom: "12px" }}>
          <div className="add-pawn-dialog-form-text">Interest Rate (%)</div>
          <CustomInput
            placeholder="Enter interest rate"
            value={interestRate}
            onChange={onChangeInterestRate}
          />
        </div>
        <div style={{ paddingBottom: "12px" }}>
          <div className="add-pawn-dialog-form-text">Duration (months)</div>
          <CustomInput
            placeholder="Enter loan duration"
            value={duration}
            onChange={onChangeDuration}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title className="add-pawn-dialog-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>{button}</Modal.Footer>
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPawnDialog);
