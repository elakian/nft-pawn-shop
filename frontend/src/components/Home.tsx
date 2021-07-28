import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { getAccountState, getContractState } from "../redux/selectors";
import { AccountState } from "../redux/reducers/AccountReducer";
import { ContractState } from "../redux/reducers/ContractReducer";

import ActionButton from "./ActionButton";
import AddPawnDialog from "./AddPawnDialog";
import ListCardItem from "./ListCardItem";

import "./styles/home.scss";

interface Props {
  accountState: AccountState;
  contractState: ContractState;
}

function Home(props: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const { contractState } = props;
  useEffect(() => {
    const func = async () => {
      try {
        const terms = await contractState.nftPawnShopContract.getWaitingTerms();
        console.log("terms", terms);
      } catch (e: any) {
        console.log("e", e);
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
  return (
    <div>
      <AddPawnDialog show={showDialog} onClose={onClose} />
      <div style={{ paddingLeft: "16px", paddingTop: "24px" }}>
        <ActionButton label="+ Pawn NFT" onClick={onClickPawn} />
      </div>

      <div style={{ paddingLeft: "16px", paddingTop: "36px" }}>
        <div className="home-pawn-list-title">NFTs Looking to be Pawned</div>
        <div style={{ paddingTop: "16px" }}>
          <ListCardItem
            headers={[
              "Account",
              "NFT/ID",
              "Loan Amount (ether)",
              "Interest Rate",
              "Duration",
            ]}
            content={[
              "0xf39F...2266",
              "0xf39F...2266/1",
              "1.1",
              "5.3%",
              "5 months",
            ]}
            ctaLabel="Accept"
            onClickCta={() => {}}
          />
        </div>
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
