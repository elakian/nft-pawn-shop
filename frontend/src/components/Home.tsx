import React, { useState, useEffect } from "react";
import web3 from "web3";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { formatAddress } from "./utils/utils";

import ActionButton from "./ActionButton";
import AddPawnDialog from "./AddPawnDialog";
import ListCardItem from "./ListCardItem";

import { useHistory } from "react-router-dom";

import "./styles/home.scss";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
}

function Home(props: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [terms, setTerms] = useState([]);
  const history = useHistory();

  const { contractState } = props;
  useEffect(() => {
    const func = async () => {
      try {
        const [terms, _] =
          await contractState.nftPawnShopContract.getWaitingTerms();
        setTerms(terms);
      } catch (e: any) {
        console.log("error getting waiting terms: ", e);
      }
    };
    if (contractState.nftPawnShopContract) {
      func();
    }
  }, [contractState]);
  const onClickPawn = () => {
    setShowDialog(!showDialog);
  };
  const onClose = () => {
    setShowDialog(false);
  };

  const termComponents = terms.map((term, i) => {
    const [
      nftAddress,
      nftTokenID,
      amountInWei,
      interestRate,
      _startTime,
      duration,
      borrower,
      _lender,
      _status,
      index,
    ] = term;
    const onClickAccept = async (
      borrower: string,
      index: any,
      amountInWei: string
    ) => {
      const indexNum = index.toNumber();
      const wei = BigInt(amountInWei.toString());
      try {
        const tx = await props.contractState.nftPawnShopContract.acceptTerms(
          borrower,
          indexNum,
          { from: props.accountState.selectedAddress, value: wei }
        );
        await tx.wait();
        history.push("/loans");
        history.go(0);
      } catch (e: any) {
        console.log("error", e);
      }
    };
    return (
      <div key={i} style={{ paddingTop: "12px", paddingBottom: "12px" }}>
        <ListCardItem
          headers={[
            "Account",
            "NFT",
            "Token ID",
            "Loan Amount (ether)",
            "Interest Rate",
            "Duration",
          ]}
          content={[
            formatAddress(borrower),
            formatAddress(nftAddress),
            String(nftTokenID),
            web3.utils.fromWei(String(amountInWei), "ether"),
            String(interestRate / 100) + "%",
            String(duration / 2592000) + " months",
          ]}
          ctaLabel="Accept"
          value={borrower}
          onClickCta={() => onClickAccept(borrower, index, amountInWei)}
        />
      </div>
    );
  });
  let connectedMessage = null;
  if (!contractState.nftPawnShopContract) {
    connectedMessage = (
      <div className="home-pawn-list-not-connected-text">
        Please connect your wallet!
      </div>
    );
  }
  return (
    <div>
      <AddPawnDialog show={showDialog} onClose={onClose} />
      <div style={{ paddingLeft: "16px", paddingTop: "24px" }}>
        <ActionButton label="+ Pawn NFT" onClick={onClickPawn} />
      </div>

      <div style={{ paddingLeft: "16px", paddingTop: "36px" }}>
        <div className="home-pawn-list-title">NFTs Looking to be Pawned</div>
        {connectedMessage}
        <div>{termComponents}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
