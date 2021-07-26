// SPDX-License-Identifier: NFTPawnShop
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PawnNFT is ERC721 {
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function mint(address _to, uint256 _tokenId) external {
        super._mint(_to, _tokenId);
    }
}
