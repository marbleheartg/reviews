// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract ContractName is ERC1155, Ownable {
    uint256 public constant PRICE = 0.0000843 ether;

    constructor(address initialOwner) ERC1155("ipfs://[CID]/{id}.json") Ownable(initialOwner) {}

    function mint() public payable {
        require(msg.value >= PRICE, "Not enough ETH");
        _mint(msg.sender, 0, 1, "");
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
