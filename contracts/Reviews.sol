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

contract Reviews is Ownable {
    mapping(uint256 => Review) public reviews;
    uint256 public reviewsCount;

    mapping(address => uint256[]) public userAddedReviews;
    mapping(uint256 => uint256[]) public userReceivedReviews;

    event ReviewCreated(uint256 fid, uint256 timestamp, string text, bool isPositive);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createReview(uint256 fid, string memory text, bool isPositive) external payable {
        require(msg.value >= 0.0001 ether, "Not enough ETH");
        require(fid > 0, "Invalid FID");
        require(bytes(text).length > 0 && bytes(text).length <= 100, "Invalid text");

        reviews[reviewsCount] = Review(msg.sender, fid, block.timestamp, text, isPositive);
        userAddedReviews[msg.sender].push(reviewsCount);
        userReceivedReviews[fid].push(reviewsCount);

        reviewsCount++;

        emit ReviewCreated(fid, block.timestamp, text, isPositive);
    }

    function getReview(uint256 idx) public view returns (Review memory) {
        return reviews[idx];
    }

    function getAddedReview(address addr, uint256 idx) public view returns (Review memory) {
        uint256 reviewIdx = userAddedReviews[addr][idx];
        return reviews[reviewIdx];
    }

    function getReceivedReview(uint256 fid, uint256 idx) public view returns (Review memory) {
        uint256 reviewIdx = userReceivedReviews[fid][idx];
        return reviews[reviewIdx];
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
