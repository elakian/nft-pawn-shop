// SPDX-License-Identifier: NFTPawnShop
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract NFTPawnShop is IERC721Receiver, ERC721Holder {
    using SafeMath for uint256;
    enum CollateralStatus {
        WAITING,
        ACTIVE,
        RETURNED,
        DEFAULTED,
        CANCELLED
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
        uint256 borrowerIndex;
        uint256 lenderIndex;
        uint256 allTermsIndex;
    }

    mapping(address => Terms[]) borrowersToTerms;
    mapping(address => Terms[]) lendersToTerms;
    Terms[] allTerms;

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
            CollateralStatus.WAITING,
            borrowersToTerms[msg.sender].length,
            0,
            allTerms.length
        );

        _nftAddress.safeTransferFrom(msg.sender, address(this), _nftTokenID);
        borrowersToTerms[msg.sender].push(t);
        allTerms.push(t);
    }

    function acceptTerms(address borrower, uint256 termIndex) public payable {
        Terms storage terms = borrowersToTerms[borrower][termIndex];
        uint256 amount = terms.amountInWei;
        require(amount == msg.value, "need to send the required wei");
        payable(terms.borrower).transfer(msg.value);
        terms.lender = msg.sender;
        terms.status = CollateralStatus.ACTIVE;
        terms.startTime = block.timestamp;
        lendersToTerms[msg.sender].push(terms);
        allTerms[terms.allTermsIndex] = terms;
    }

    function claimCollateral(uint256 termIndex) external {
        Terms storage terms = lendersToTerms[msg.sender][termIndex];
        require(terms.lender == msg.sender, "you must be the lender");
        require(
            block.timestamp > terms.startTime + terms.duration,
            "pay back date should be in past"
        );
        require(terms.status == CollateralStatus.ACTIVE, "should be active");
        terms.nftAddress.safeTransferFrom(
            address(this),
            msg.sender,
            terms.nftTokenID
        );
        terms.status = CollateralStatus.DEFAULTED;
        allTerms[terms.allTermsIndex] = terms;
        borrowersToTerms[terms.borrower][terms.borrowerIndex] = terms;
        lendersToTerms[terms.lender][terms.lenderIndex] = terms;
    }

    /// @dev undo term that has not been accepted yet
    function undoTerm(address _borrower, uint256 termIndex) public {
        Terms storage terms = borrowersToTerms[_borrower][termIndex];
        address lender = terms.lender;
        require(msg.sender == _borrower, "only borrower can call");
        require(lender == address(0x0), "lender already set");
        IERC721 nftAddress = terms.nftAddress;
        uint256 nftTokenID = terms.nftTokenID;
        nftAddress.safeTransferFrom(address(this), _borrower, nftTokenID);
        terms.status = CollateralStatus.CANCELLED;
        allTerms[terms.allTermsIndex] = terms;
        // delete borrowersToTerms[_borrower];
    }

    /// @dev calculate amount of payment required - interest rate is % so divide by 10^4
    function calculatePayment(
        uint256 _amountInWei,
        uint256 _interestRate
    ) public pure returns (uint256 amount) {
        uint256 interest = _amountInWei.mul(_interestRate).div(10**4);
        return _amountInWei.add(interest);
    }

    /// @dev refund
    function refund(uint256 delta) public {
        //TODO
    }

    /// @dev payback term
    function paybackTerm(address _borrower, uint256 termIndex) public payable {
        Terms memory terms = borrowersToTerms[_borrower][termIndex];
        uint256 payment = calculatePayment(
            terms.amountInWei,
            terms.interestRate
        );
        require(payment <= msg.value, "need to send min payback amount");
        uint256 delta = msg.value - payment;
        if (delta > 0) {
            refund(delta);
        }
        payable(terms.lender).transfer(msg.value);
        terms.status = CollateralStatus.RETURNED;
        allTerms[terms.allTermsIndex] = terms;
        borrowersToTerms[terms.borrower][terms.borrowerIndex] = terms;
        lendersToTerms[terms.lender][terms.lenderIndex] = terms;
    }

    function getWaitingTerms() external view returns (Terms[] memory, uint256) {
        uint256 j = 0;
        for (uint256 i = 0; i < allTerms.length; i++) {
            if (allTerms[i].status == CollateralStatus.WAITING) {
                j++;
            }
        }
        Terms[] memory termsTemp = new Terms[](j);
        uint256 k = 0;
        for (uint256 i = 0; i < allTerms.length; i++) {
            if (allTerms[i].status == CollateralStatus.WAITING) {
                termsTemp[k] = allTerms[i];
                k++;
            }
        }
        return (termsTemp, j);
    }

    function getPawnedTerms(address borrower)
        external
        view
        returns (Terms[] memory)
    {
        return borrowersToTerms[borrower];
    }

    function getLoans(address lender) external view returns (Terms[] memory) {
        return lendersToTerms[lender];
    }
}
