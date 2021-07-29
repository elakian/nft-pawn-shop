# NFT Pawn Shop

## Overview

Simple implementation allowing users to get a loan using their NFT as collateral. We created a smart contract to act as the pawn shop.

## Contracts

* PawnNFT.sol: Mint sample ERC721 NFTs to test out contract functions
* NFTPawnShop.sol: Acting as intermediate pawn shop - users can pawn their NFTs, and other users can lend them money. 

Key functions:
* pawn(): setting terms for loan and NFT you want to use as collateral and the smart contract takes intermediary control of NFT
* undoTerm(): cancel offering if nobody has accepted terms, borrower can cancel it and the contract will transfer NFT back to them
* acceptTerms(): allows loaner to accept terms for a particular borrower
* payBackTerm(): within duration of loan, borrower can pay back principal + interest, upon which smart contract transfers NFT back to them
* claimCollateral(): for expired loans, loaner can claim their collateral, which transfers NFT from smart contract to loaner

## Frontend

We built a React app on top of the smart contracts with basic functionality as described above. 

![Sample Screen](https://github.com/elakian/nft-pawn-shop/blob/main/sample_screen.png)

## Potential additions

Frontend 
* Better user experience in choosing NFTs
* Using more redux for contract interactions
* Better error handling

Backend
* More complicated loan structures
* Other types of collateral 
* Deploy to Mainnet
