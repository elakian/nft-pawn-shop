// SPDX-License-Identifier: NFTPawnShop
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTPawnShop is IERC721Receiver, ERC721Holder {
    using SafeMath for uint256;
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
        uint256 index;
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
            borrowersToTerms[msg.sender].length
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
        delete borrowersToTerms[_borrower];
    }

    /// @dev calculate amount of payment required - interest rate in bps
    function calculatePayment(
        uint256 _amountInWei,
        uint256 _interestRate,
        uint256 _startTime
    ) public view returns (uint256 amount) {
        uint256 currentDuration = block.timestamp.sub(_startTime).div(
            1 minutes
        );
        uint256 numPayments = currentDuration.div(1); // per min
        uint256 interest = _amountInWei.mul(_interestRate).div(10**4).mul(
            numPayments
        );
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
            terms.interestRate,
            terms.startTime
        );
        require(payment <= msg.value, "need to send min payback amount");
        uint256 delta = msg.value - payment;
        if (delta > 0) {
            refund(delta);
        }
        payable(terms.lender).transfer(msg.value);
        terms.status = CollateralStatus.RETURNED;
    }

    function getWaitingTerms() external view returns (Terms[] memory, uint) {
        Terms[] memory termsTemp = new Terms[](allTerms.length);
        uint j = 0;
        for (uint i = 0; i < allTerms.length; i++) {
            if (allTerms[i].status == CollateralStatus.WAITING) {
                termsTemp[j] = allTerms[i];
                j++;
            }
        }
        return (termsTemp, j);
    }
}
