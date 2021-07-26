import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("Pawning", () => {
  let accounts: Signer[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
  });

  it("should do basic pawn", async () => {
    // Do something with the accounts
    console.log("starting basic pawn");

    const owner = await accounts[0].getAddress();
    console.log("this is owner address: ");
    console.log(owner);

    const NFTPawnShop = await ethers.getContractFactory("NFTPawnShop");
    const PawnNFT = await ethers.getContractFactory("PawnNFT");

    const pawnShop = await NFTPawnShop.deploy();
    const pawnNFT = await PawnNFT.deploy("PawnNFT", "PWN");

    console.log("made pawnNFT");
    console.log("this is panwShop address: ");
    console.log(pawnShop.address);

    await pawnNFT.deployed();
    expect(await pawnNFT.name()).to.equal("PawnNFT");
    expect(await pawnNFT.symbol()).to.equal("PWN");

    console.log("checked basic NFT");

    // NFT mint to owner 
    const pawnNFTxn = await pawnNFT.mint(owner, 1, {from: owner});
    await pawnNFTxn.wait();
    console.log("good with pawnNFTxn");

    expect(await pawnNFT.ownerOf(1)).to.equal(owner);
    console.log("starting pawnNFTApprove");

    // Approve pawnShop address from owner
    const pawnNFTApprove = await pawnNFT.approve(pawnShop.address, 1, {from: owner});
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
      {from: owner});
    
    // wait for transaction to be mined
    await pawnTX.wait();

    console.log("good with pawnTX");

    console.log("pawnNFT owner of 1: ", pawnNFT.ownerOf(1));
    console.log("pawnShop address: ", pawnShop.address);
    
    expect(await pawnNFT.ownerOf(1)).to.equal(pawnShop.address);
    console.log("DONE");
  });
});