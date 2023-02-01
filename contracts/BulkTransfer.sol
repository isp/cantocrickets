// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract BulkTransfer {
    constructor() {}

	function Transfer(address token, uint256[][] calldata tokenIds, address[] calldata receivers) external {
		IERC721 tokenContract = IERC721(token);

		require(tokenContract.isApprovedForAll(msg.sender, address(this)), "transfer contract not approved");
		require(tokenIds.length == receivers.length, "tokens to send and receivers must be the same");

		for (uint64 receiverindex = 0; receiverindex < receivers.length; receiverindex++) {
			address receiver = receivers[receiverindex];
			uint256[] calldata idsToSend = tokenIds[receiverindex];

			for (uint64 i = 0; i < idsToSend.length; i++) {
				uint256 tokenId = idsToSend[i];

				tokenContract.safeTransferFrom(msg.sender, receiver, tokenId);
			}
		}
	}
}