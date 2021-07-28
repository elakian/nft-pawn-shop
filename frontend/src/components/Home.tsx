import React from "react";

import ActionButton from "./ActionButton";
import ListCardItem from "./ListCardItem";

import "./styles/home.scss";

function Home() {
  return (
    <div>
      <div style={{ paddingLeft: "16px", paddingTop: "24px" }}>
        <ActionButton label="+ Pawn NFT" onClick={() => {}} />
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

export default Home;
