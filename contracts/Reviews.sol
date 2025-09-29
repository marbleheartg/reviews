// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

struct Review {
    address author;
    uint256 targetFID;
    uint256 timestamp;
    string text;
    bool isPositive;
}

struct User {
    uint256 reviewsCount;
    uint256 positiveReviewsCount;
    uint256 negativeReviewsCount;
    uint256[] reviews;
}

contract Reviews is Ownable {
    mapping(uint256 => Review) public reviews;
    uint256 public reviewsCount;

    mapping(address => User) public userSentReviews;
    mapping(uint256 => User) public userReceivedReviews;

    event ReviewCreated(uint256 fid, uint256 timestamp, string text, bool isPositive);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createReview(uint256 fid, string memory text, bool isPositive) external payable {
        require(msg.value >= 0.0001 ether, "Not enough ETH");
        require(fid > 0, "Invalid FID");
        require(bytes(text).length > 0 && bytes(text).length <= 100, "Invalid text");

        reviews[reviewsCount] = Review(msg.sender, fid, block.timestamp, text, isPositive);

        userSentReviews[msg.sender].reviews.push(reviewsCount);
        userSentReviews[msg.sender].reviewsCount++;

        userReceivedReviews[fid].reviews.push(reviewsCount);
        userReceivedReviews[fid].reviewsCount++;

        if (isPositive) userReceivedReviews[fid].positiveReviewsCount++;
        else userReceivedReviews[fid].negativeReviewsCount++;

        reviewsCount++;

        emit ReviewCreated(fid, block.timestamp, text, isPositive);
    }

    function getReview(uint256 idx) public view returns (Review memory) {
        return reviews[idx];
    }

    function getSentReview(address addr, uint256 idx) public view returns (Review memory) {
        uint256 reviewIdx = userSentReviews[addr].reviews[idx];
        return reviews[reviewIdx];
    }

    function getSentReviewsCount(address addr) public view returns (uint256) {
        return userSentReviews[addr].reviewsCount;
    }

    function getReceivedReview(uint256 fid, uint256 idx) public view returns (Review memory) {
        uint256 reviewIdx = userReceivedReviews[fid].reviews[idx];
        return reviews[reviewIdx];
    }

    function getReceivedReviewsCount(uint256 fid) public view returns (uint256) {
        return userReceivedReviews[fid].reviewsCount;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
