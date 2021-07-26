// SPDX-License-Identifier: NFTPawnShop
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTPawnShop is IERC721Receiver, ERC721Holder {
    enum CollateralStatus {
        WAITING,
        ACTIVE,
        RETURNED,
        DEFAULTED
    }

    struct Terms {
        IERC721 nftAddress;
        uint256 nftTokenID;
        uint256 amountInWei;
        uint256 interestRate;
        uint256 startTime;
        uint256 duration;
        address borrower;
        address lender;
        CollateralStatus status;
    }

    mapping(address => Terms[]) borrowersToTerms;
    mapping(address => Terms[]) lendersToTerms;

    constructor() {}

    function pawn(
        IERC721 _nftAddress,
        uint256 _nftTokenID,
        uint256 _amountInWei,
        uint256 _duration,
        uint256 _interestRate
    ) external {
        Terms memory t = Terms(
            _nftAddress,
            _nftTokenID,
            _amountInWei,
            _interestRate,
            0,
            _duration,
            msg.sender,
            address(0x0),
            CollateralStatus.WAITING
        );

        _nftAddress.safeTransferFrom(msg.sender, address(this), _nftTokenID);
        borrowersToTerms[msg.sender].push(t);
    }
}
