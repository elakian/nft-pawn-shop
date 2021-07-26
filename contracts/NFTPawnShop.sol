pragma solidity ^0.8.1;

contract NFTPawnShop {

    enum CollateralStatus{ WAITING, ACTIVE, RETURNED, DEFAULTED }

    struct Terms {
        address nftAddress;
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