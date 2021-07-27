import { ethers } from "hardhat";
import fs from "fs";

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account address: ", deployer.address);

  const NFTPawnShop = await ethers.getContractFactory("NFTPawnShop");
  const pawnShop = await NFTPawnShop.deploy();
  console.log("NFTPawnShop Contract Address: ", pawnShop.address);

  const dataPS = {
    address: pawnShop.address,
    abi: JSON.parse(String(pawnShop.interface.format("json"))),
  };

  fs.writeFileSync("frontend/src/NFTPawnShop.json", JSON.stringify(dataPS));

  const PawnNFT = await ethers.getContractFactory("PawnNFT");
  const pawnNFT = await PawnNFT.deploy("PawnNFT", "PWN");
  console.log("PawnNFT Contract Address: ", pawnNFT.address);

  const dataPN = {
    address: pawnNFT.address,
    abi: JSON.parse(String(pawnNFT.interface.format("json"))),
  };

  fs.writeFileSync("frontend/src/PawnNFT.json", JSON.stringify(dataPN));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
