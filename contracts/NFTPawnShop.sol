pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTPawnShop is IERC721Receiver, ERC721Holder {

    enum CollateralStatus{ WAITING, ACTIVE, RETURNED, DEFAULTED }

    struct Terms {
        IERC721 nftAddress;
        uint nftTokenID;
        uint amountInWei;
        ufixed interestRate;
        address borrower;
        address lender;
        CollateralStatus status;
    }

    mapping(address => Terms[]) borrowersToTerms;
    mapping(address => Terms[]) lendersToTerms;

    constructor() {
    }

}