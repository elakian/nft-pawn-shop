import React, { useState, useEffect } from "react";
import web3 from "web3";
import AddPawnDialog from "./AddPawnDialog";
import ListCardItem from "./ListCardItem";

import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { formatAddress, statusText} from "./utils/utils";
import ActionButton from "./ActionButton";


import "./styles/home.scss";

interface Props {
    accountState: AccountState;
    contractState: ContractState;
}

function MyLoans(props: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const onClickPawn = () => {
    setShowDialog(!showDialog);
  };
  const onClose = () => {
    setShowDialog(false);
  };

  const [loans, setLoans] = useState([]);

  const { contractState } = props;
  useEffect(() => {
    const func = async () => {
      try {
        console.log("trying to get curr loans, this is props.accountState.selectedAddress: ", props.accountState.selectedAddress);
        const currLoans =
          await contractState.nftPawnShopContract.getLoans(props.accountState.selectedAddress);
        setLoans(currLoans);
        console.log("this is loans: ", currLoans);
      } catch (e: any) {
        console.log("e", e);
      }
    };
    if (contractState.nftPawnShopContract) {
      func();
    }
  }, [contractState]);

  const loanComponents = loans.map((term, i) => {
    const [
      nftAddress,
      nftTokenID,
      amountInWei,
      interestRate,
      _startTime,
      duration,
      borrower,
      _lender,
      status,
      index,
    ] = term;
    const onClickClaim = async (status : number, index: any, borrower: string) => {
      const indexNum = index.toNumber();
      switch (statusText(status)) {
        case "Returned": {
          buttonLabel = "claim";
          try {
            const tx = await props.contractState.nftPawnShopContract.paybackTerm(
              borrower,
              indexNum,
              {from: props.accountState.selectedAddress}
            );
            await tx.wait();
            console.log("Claimed returned payment!");
          } catch (e: any) {
            console.log("error", e);
          }
          break;
        }
        case "Defaulted": {
          buttonLabel = "claim collateral";
          try {
            const tx = await props.contractState.nftPawnShopContract.claimCollateral(
              indexNum,
              {from: props.accountState.selectedAddress}
            );
            await tx.wait();
            console.log("Claimed collateral for default!");
          } catch (e: any) {
            console.log("error", e);
          }
          break;
        }
        case "Active": {
          buttonLabel = null;
          break;
        }
        default: {
          buttonLabel = null;
        } 
      };
    };
    var buttonLabel;
    switch (statusText(status)) {
      case "Returned": {
        buttonLabel = "claim";
        break;
      }
      case "Defaulted": {
        buttonLabel = "claim collateral";
        break;
      }
      case "Active": {
        buttonLabel = "";
        break;
      }
      default: {
        buttonLabel = "";
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
            "Status",
          ]}
          content={[
            formatAddress(borrower),
            formatAddress(nftAddress),
            String(nftTokenID),
            web3.utils.fromWei(String(amountInWei), "ether"),
            String(interestRate / 100) + "%",
            String(duration / 2592000) + " months",
            statusText(status),
          ]}
          ctaLabel={buttonLabel}
          onClickCta={() => onClickClaim(status, index, borrower)}
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
        <div className="home-pawn-list-title">Your Loans</div>
        {connectedMessage}
        <div>{loanComponents}</div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(MyLoans);
  
