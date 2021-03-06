import React, { useState, useEffect } from "react";
import web3 from "web3";
import ListCardItem from "./ListCardItem";

import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { formatAddress, statusText } from "./utils/utils";

import { useHistory } from "react-router-dom";

import "./styles/home.scss";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
}

function MyLoans(props: Props) {
  const [loans, setLoans] = useState([]);
  const history = useHistory();

  const { contractState } = props;
  useEffect(() => {
    const func = async () => {
      try {
        const currLoans = await contractState.nftPawnShopContract.getLoans(
          props.accountState.selectedAddress
        );
        setLoans(currLoans);
      } catch (e: any) {
        console.log("error in setting loans: ", e);
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
      startTime,
      duration,
      borrower,
      _lender,
      status,
      index,
    ] = term;
    const endTime = new Date(
      Number(startTime) * 1000 + Number(duration) * 1000
    );
    const onClickClaim = async (
      status: number,
      index: any,
      borrower: string
    ) => {
      const indexNum = index.toNumber();
      switch (statusText(status)) {
        case "Active": {
          if (endTime <= new Date()) {
            buttonLabel = "Claim";
            try {
              const tx =
                await props.contractState.nftPawnShopContract.claimCollateral(
                  indexNum
                );
              await tx.wait();
            } catch (e: any) {
              console.log("error", e);
            }
          } else {
            buttonLabel = null;
          }
          break;
        }
      }
      history.go(0);
    };
    let buttonLabel = undefined;
    switch (statusText(status)) {
      case "Active": {
        if (endTime <= new Date()) {
          buttonLabel = "Claim";
        }
        break;
      }
    }

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
