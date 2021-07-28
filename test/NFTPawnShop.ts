import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Pawning", () => {
  let accounts: Signer[];
  let pawnShop: Contract;
  let pawnNFT: Contract;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
  });

  const basicPawn = async () => {
    const owner = await accounts[0].getAddress();
    const NFTPawnShop = await ethers.getContractFactory("NFTPawnShop");
    const PawnNFT = await ethers.getContractFactory("PawnNFT");

    pawnShop = await NFTPawnShop.deploy();
    pawnNFT = await PawnNFT.deploy("PawnNFT", "PWN");

    await pawnNFT.deployed();
    expect(await pawnNFT.name()).to.equal("PawnNFT");
    expect(await pawnNFT.symbol()).to.equal("PWN");

    // NFT mint to owner
    const pawnNFTxn = await pawnNFT.mint(owner, 1, { from: owner });
    await pawnNFTxn.wait();

    expect(await pawnNFT.ownerOf(1)).to.equal(owner);

    // Approve pawnShop address from owner
    const pawnNFTApprove = await pawnNFT.approve(pawnShop.address, 1, {
      from: owner,
    });
    await pawnNFTApprove.wait();

    const nftAddress = pawnNFT.address;
    const nftTokenID = 1;
    const amountInWei = 100000000;
    const duration = 3600;
    const interestRate = 10;

    const pawnTX = await pawnShop.pawn(
      nftAddress,
      nftTokenID,
      amountInWei,
      duration,
      interestRate,
      { from: owner }
    );

    // wait for transaction to be mined
    await pawnTX.wait();

    expect(await pawnNFT.ownerOf(1)).to.equal(pawnShop.address);

    const [terms, count] = await pawnShop.getWaitingTerms();
    expect(count).to.equal(1);
  };

  it("basic pawn", async () => {
    await basicPawn();
  });

  it("basic accept terms", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    const prevBalance = await accounts[0].getBalance();
    const acceptTermsTx = await pawnShop
      .connect(accounts[1]) // loaner
      .acceptTerms(borrower, 0, { value: 100000000 });
    await acceptTermsTx.wait();
    const newBalance = await accounts[0].getBalance();
    expect(newBalance.sub(prevBalance).eq(100000000)).to.equal(true);
  });

  it("accept terms not enough", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    try {
      const acceptTermsTx = await pawnShop
        .connect(accounts[1]) // loaner
        .acceptTerms(borrower, 0, { value: 10000 });
      await acceptTermsTx.wait();
      expect(false);
    } catch (e) {
      expect(true);
    }
  });

  it("claim collateral after due date", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    const acceptTermsTx = await pawnShop
      .connect(accounts[1]) // loaner
      .acceptTerms(borrower, 0, { value: 100000000 });
    await acceptTermsTx.wait();
    await network.provider.send("evm_increaseTime", [4000]);
    expect(await pawnNFT.ownerOf(1)).to.not.equal(
      await accounts[1].getAddress()
    );
    const claimTx = await pawnShop
      .connect(accounts[1]) // loaner
      .claimCollateral(0);
    await claimTx.wait();
    expect(await pawnNFT.ownerOf(1)).to.equal(await accounts[1].getAddress());
  });

  it("claim collateral after due date", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    const acceptTermsTx = await pawnShop
      .connect(accounts[1]) // loaner
      .acceptTerms(borrower, 0, { value: 100000000 });
    await acceptTermsTx.wait();
    await network.provider.send("evm_increaseTime", [4000]);
    expect(await pawnNFT.ownerOf(1)).to.not.equal(
      await accounts[1].getAddress()
    );
    const claimTx = await pawnShop
      .connect(accounts[1]) // loaner
      .claimCollateral(0);
    await claimTx.wait();
    expect(await pawnNFT.ownerOf(1)).to.equal(await accounts[1].getAddress());
  });

  it("basic undo term", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    const prevBalance = await accounts[0].getBalance();
    const undoTermsTx = await pawnShop
      .connect(accounts[0]) // borrower
      .undoTerm(borrower, 0);
    await undoTermsTx.wait();
    expect(await pawnNFT.ownerOf(1)).to.equal(borrower);
  });

  it("basic undo must be from borrower", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    try {
      const acceptTermsTx = await pawnShop
        .connect(accounts[1]) // loaner
        .undoTerm(borrower, 0);
      await acceptTermsTx.wait();
      expect(false);
    } catch (e) {
      expect(true);
    }
    expect(await pawnNFT.ownerOf(1)).to.not.equal(
      await accounts[1].getAddress()
    );
  });

  it("basic payment calculations with interest rate ", async () => {
    await basicPawn();
    const currTimeStamp = (Date.now() / 1000) | 0;
    const earlierOneMinTimeStamp = currTimeStamp - 60; // 60 seconds prior (1 cycle) -> interest = 100000*(10/10000)*1 = 100
    const earlierTwoMinTimeStamp = currTimeStamp - 120; // 2 mins prior (2 cycles) -> interest = 100000*(10/10000)*2 = 200

    const paymentAmountOneMin = await pawnShop.calculatePayment(
      100000,
      10,
      10,
      earlierOneMinTimeStamp
    );
    const paymentAmountOneMinInt = await paymentAmountOneMin.toBigInt();
    expect(paymentAmountOneMin.gte(100000 + 100)).to.equal(true);

    const paymentAmountTwoMin = await pawnShop.calculatePayment(
      100000,
      10,
      10,
      earlierTwoMinTimeStamp
    );
    const paymentAmountTwoMinInt = await paymentAmountTwoMin.toBigInt();
    expect(paymentAmountTwoMin.gte(100000 + 200)).to.equal(true);
  });

  it("should do basic payment calc", async () => {
    await basicPawn();
    const borrower = await accounts[0].getAddress();
    const lender = await accounts[1].getAddress();
    const initialBalanceBorrower = await accounts[0].getBalance();
    const initialBalanceLender = await accounts[1].getBalance();
    const initialBalanceBorrowerInt = await initialBalanceBorrower.toBigInt();
    const initialBalanceLenderInt = await initialBalanceLender.toBigInt();
    console.log("initialBalanceBorrowerInt: ", initialBalanceBorrowerInt);
    console.log("initialBalanceLenderInt: ", initialBalanceLenderInt);
    const acceptTermsTx = await pawnShop
      .connect(accounts[1]) // loaner
      .acceptTerms(borrower, 0, { value: 100000000 });
    await acceptTermsTx.wait();
    console.log("done with acceptTermsTx..");
    const acceptBalanceBorrower = await accounts[0].getBalance();
    const acceptBalanceLender = await accounts[1].getBalance();
    const acceptBalanceBorrowerInt = await acceptBalanceBorrower.toBigInt();
    const acceptBalanceLenderInt = await acceptBalanceLender.toBigInt();
    console.log("acceptBalanceBorrowerInt: ", acceptBalanceBorrowerInt);
    console.log("acceptBalanceLenderInt: ", acceptBalanceLenderInt);

    const paybackTermsTx = await pawnShop
      .connect(accounts[0])
      .paybackTerm(borrower, 0, { value: 110000000 });
    await paybackTermsTx.wait();

    const paybackBalanceBorrower = await accounts[0].getBalance();
    const paybackBalanceLender = await accounts[1].getBalance();
    const paybackBalanceBorrowerInt = await paybackBalanceBorrower.toBigInt();
    const paybackBalanceLenderInt = await paybackBalanceLender.toBigInt();

    console.log("paybackBalanceBorrowerInt: ", paybackBalanceBorrowerInt);
    console.log("paybackBalanceLenderInt: ", paybackBalanceLenderInt);
    const finalDiffBorrower = await paybackBalanceBorrower
      .sub(acceptBalanceBorrower)
      .toBigInt();
    console.log("This is final diff for borrower side: ", finalDiffBorrower);
    const finalDiffLender = await paybackBalanceLender
      .sub(acceptBalanceLender)
      .toBigInt();
    console.log("This is final diff for lender side: ", finalDiffLender);
    expect(
      paybackBalanceLender.sub(acceptBalanceLender).eq(110000000)
    ).to.equal(true);
  });
});
