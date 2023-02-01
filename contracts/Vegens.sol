// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a/contracts/ERC721A.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Vegens is ERC721A, Ownable {
    constructor() ERC721A("Vegens", "VEGENS") {}

	mapping(address => uint256) public minted;

	bytes32 public merkleRoot;

	uint256 public price = 0.015 ether;
	uint256 public maxQuantity = 5;
	uint256 public maxSupply = 1500;

	bool public publicSale = false;
	bool public whitelistSale = false;

	string baseUri = "";
	string tokenUriSuffix;

	// Public payable functions
	function whitelistMint(uint256 quantity, bytes32[] calldata proof) external payable {
		require(whitelistSale, "whitelist not active");

		require(totalSupply() + quantity <= maxSupply, "max supply exceeded");
		require(quantity <= maxQuantity, "too many");
		require(msg.value >= price * quantity, "insufficient value");
		require(minted[msg.sender] + quantity <= maxQuantity, "already minted max");

		bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
		require(MerkleProof.verify(proof, merkleRoot, leaf), 'not whitelisted');

		minted[msg.sender] = quantity;

		_safeMint(msg.sender, quantity);
	}

    function mint(uint256 quantity) external payable {
		// Special owner mint case
		if (owner() == msg.sender) {
			require(totalSupply() + quantity <= maxSupply, "max supply exceeded");

			_safeMint(msg.sender, quantity);

			return;
		}

		require(publicSale, "sale not active");

		require(totalSupply() + quantity <= maxSupply, "max supply exceeded");
		require(quantity <= maxQuantity, "too many");
		require(msg.value >= price * quantity, "insufficient value");
		require(minted[msg.sender] + quantity <= maxQuantity, "already minted max");

		minted[msg.sender] = quantity;

        _safeMint(msg.sender, quantity);
    }

	// View functions
	function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, _toString(tokenId), tokenUriSuffix)) : '';
    }

	// Admin functions
	function setPrice(uint256 new_price) external onlyOwner {
		price = new_price;
	}

	function setMaxQuantity(uint256 new_max_quantity) external onlyOwner {
		maxQuantity = new_max_quantity;
	}

	function setMerkleRoot(bytes32 merkle_root) external onlyOwner {
		merkleRoot = merkle_root;
	}

	function setSaleActive(bool sale_active) external onlyOwner {
		publicSale = sale_active;
	}

	function setWhitelistActive(bool wl_active) external onlyOwner {
		whitelistSale = wl_active;
	}

	function setBaseUri(string calldata base_uri) external onlyOwner {
		baseUri = base_uri;
	}

	function setUriSuffix(string calldata uri_suffix) external onlyOwner {
		tokenUriSuffix = uri_suffix;
	}
	
	function setMaxSupply(uint max_supply) external onlyOwner {
		if( maxSupply != max_supply ){
			require(max_supply >= totalSupply(), "Specified supply is lower than current balance" );
			maxSupply = max_supply;
		}
	}

	// Admin actions
	function gift(uint[] calldata quantity, address[] calldata recipient) external onlyOwner {
		require(quantity.length == recipient.length, "Must provide equal quantities and recipients" );

		uint totalQuantity = 0;
		uint256 supply = totalSupply();
		for(uint i = 0; i < quantity.length; ++i){
			totalQuantity += quantity[i];
		}
		require( supply + totalQuantity <= maxSupply, "Mint/order exceeds supply" );
		delete totalQuantity;

		for(uint i = 0; i < recipient.length; ++i){
			_safeMint(recipient[i], quantity[i]);
		}
	}

	function withdraw() external onlyOwner {
		Address.sendValue(payable(owner()), address(this).balance);
	}
}