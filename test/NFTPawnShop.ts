import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Pawning", () => {
  let accounts: Signer[];
  let pawnShop: Contract;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
  });

  const basicPawn = async () => {
    console.log("starting basic pawn");

    const owner = await accounts[0].getAddress();
    console.log("this is owner address: ");
    console.log(owner);

    const NFTPawnShop = await ethers.getContractFactory("NFTPawnShop");
    const PawnNFT = await ethers.getContractFactory("PawnNFT");

    pawnShop = await NFTPawnShop.deploy();
    const pawnNFT = await PawnNFT.deploy("PawnNFT", "PWN");

    console.log("made pawnNFT");
    console.log("this is panwShop address: ");
    console.log(pawnShop.address);

    await pawnNFT.deployed();
    expect(await pawnNFT.name()).to.equal("PawnNFT");
    expect(await pawnNFT.symbol()).to.equal("PWN");

    console.log("checked basic NFT");

    // NFT mint to owner
    const pawnNFTxn = await pawnNFT.mint(owner, 1, { from: owner });
    await pawnNFTxn.wait();
    console.log("good with pawnNFTxn");

    expect(await pawnNFT.ownerOf(1)).to.equal(owner);
    console.log("starting pawnNFTApprove");

    // Approve pawnShop address from owner
    const pawnNFTApprove = await pawnNFT.approve(pawnShop.address, 1, {
      from: owner,
    });
    await pawnNFTApprove.wait();
    console.log("good with pawnNFTApprove");

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

    console.log("good with pawnTX");

    console.log("pawnNFT owner of 1: ", pawnNFT.ownerOf(1));
    console.log("pawnShop address: ", pawnShop.address);

    expect(await pawnNFT.ownerOf(1)).to.equal(pawnShop.address);
    console.log("DONE");
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
});
