import React, { useEffect, useState } from "react";

import web3 from "web3";
import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";
import { formatAddress, statusText } from "./utils/utils";

import ListCardItem from "./ListCardItem";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
}

function MyPawnedNFTs(props: Props) {
  const [pawnedTerms, setPawnedTerms] = useState([]);
  const { contractState } = props;
  useEffect(() => {
    const func = async () => {
      try {
        const terms = await contractState.nftPawnShopContract.getPawnedTerms(
          props.accountState.selectedAddress
        );
        setPawnedTerms(terms);
      } catch (e: any) {
        console.log("e", e);
      }
    };
    if (contractState && contractState.nftPawnShopContract) {
      func();
    }
  }, [contractState]);
  console.log("pawned terms", pawnedTerms);
  const pawnedTermsComps = pawnedTerms.map((term, i) => {
    const [
      nftAddress,
      nftTokenID,
      amountInWei,
      interestRate,
      _startTime,
      duration,
      borrower,
      lender,
      status,
      index,
    ] = term;
    let ctaLabel = undefined;
    let onClickCta = undefined;
    const headers = [
      //   "Account",
      "NFT",
      "Token ID",
      "Loan Amount (ether)",
      "Interest Rate",
      "Duration",
      "Status",
    ];
    const statusFormatted = statusText(status);
    const content = [
      //   formatAddress(borrower),
      formatAddress(nftAddress),
      String(nftTokenID),
      web3.utils.fromWei(String(amountInWei), "ether"),
      String(interestRate / 100) + "%",
      String(duration / 2592000) + " months",
      statusFormatted,
    ];
    if (statusFormatted === "Waiting") {
      ctaLabel = "Cancel";
      onClickCta = async () => {
        const tx = await contractState.nftPawnShopContract.undoTerm(
          borrower,
          index
        );
        await tx.wait();
      };
    } else if (statusFormatted !== "Cancelled") {
      headers.push("Lender");
      content.push(formatAddress(lender));
    }
    if (statusFormatted === "Active") {
      ctaLabel = "Pay";
      onClickCta = async () => {
        const tx = await contractState.nftPawnShopContract.paybackTerm(
          borrower,
          index,
          { value: amountInWei }
        );
        await tx.wait();
      };
    }

    return (
      <div key={i} style={{ paddingBottom: "12px" }}>
        <ListCardItem
          headers={headers}
          content={content}
          ctaLabel={ctaLabel}
          onClickCta={onClickCta}
        />
      </div>
    );
  });
  return (
    <div>
      <div style={{ paddingLeft: "16px", paddingTop: "16px" }}>
        <div className="home-pawn-list-title">Pawned NFTs</div>
        <div>{pawnedTermsComps}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPawnedNFTs);
