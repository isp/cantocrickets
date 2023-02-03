import React from "react"
import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'
import MerkleTree from "merkletreejs"
import keccak256 from "keccak256"

import { ContractAbi } from "../contract.js"
import { Whitelist } from "../whitelist"

const WHITELIST = Whitelist

function GetMerkleTree() {
	const leafNodes = WHITELIST.map(addr => keccak256(addr))
	const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true})

	return merkleTree
}

console.log(GetMerkleTree().getRoot().toString("hex"))

function GetMerkleProof(address) {
	const leafNode = keccak256(address)
	const merkleTree = GetMerkleTree()

	return merkleTree.getHexProof(leafNode)
}

function IsWhitelisted(address) {
	return WHITELIST.map(value => value.toLowerCase()).includes(address.toLowerCase())
}

const CONTRACT_ADDRESS = "0x932f297E8920D1385739B58E10fF9824a91f520a"

export default class Minting extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			walletConnected: false,
			mintAmount: 1,
		}

		this.connectWallet = this.connectWallet.bind(this)
		this.startApp = this.startApp.bind(this)
		this.mint = this.mint.bind(this)
		this.displayMessage = this.displayMessage.bind(this)
		this.throwError = this.throwError.bind(this)

		this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
		this.handleChainChanged = this.handleChainChanged.bind(this)
	}

	async componentDidMount() {
		const provider = await detectEthereumProvider()

		if (provider) {
			await this.startApp(provider)
		} else {
			this.throwError("Cannot find Metamask! Make sure either you've installed it in your browser or the website is open in the app.")
		}
	}

	throwError(err) {
		this.setState({error: err})
		setTimeout(() => this.setState({error: undefined}), 5000)
	}

	displayMessage(message) {
		this.setState({message: message})
		setTimeout(() => this.setState({message: undefined}), 10000)
	}

	handleAccountsChanged() {
		window.location.reload()
	}

	handleChainChanged(_chainId) {
		window.location.reload()
	}

	async connectWallet() {
		ethereum
			.request({ method: 'eth_requestAccounts' })
			.then(accounts => {
				this.setState({walletConnected: true})
				this.setState({account: accounts[0]})

				ethereum.on('chainChanged', this.handleChainChanged);
				ethereum.on('accountsChanged', this.handleAccountsChanged);
			})
			.catch(err => {
				if (err.code === 4001) {
					this.throwError("Please connect to MetaMask.")
				} else {
					console.log(err)
					this.throwError(`${err.message || err.code}`)
				}
			});
	}

	async startApp(provider) {
		const chainId = await ethereum.request({ method: 'eth_chainId' })
		if (chainId != 0x1E14) {
			this.throwError("Please switch to Canto network.")
			return
		}

		const web3 = new Web3(provider)
		const contract = new web3.eth.Contract(ContractAbi, CONTRACT_ADDRESS)

		const supply = await contract.methods.totalSupply().call()
		const maxSupply = await contract.methods.maxSupply().call()

		this.setState({
			contract: contract, 
			web3: web3, 
			supply: supply,
			maxSupply: maxSupply
		})
	}

	async mint() {
		const web3 = this.state.web3
		const account = this.state.account
		const contract = this.state.contract
		const amount = web3.utils.toBN(this.state.mintAmount)

		const isWhitelisted = IsWhitelisted(account)

		const saleActive = await contract.methods.publicSale().call()
		const whitelistActive = await contract.methods.whitelistSale().call()
		const totalSupply = await contract.methods.totalSupply().call()
		const maxSupply = await contract.methods.maxSupply().call()

		if (totalSupply == maxSupply) {
			this.throwError("Collection has sold out!")
			return
		}

		if (!saleActive) {
			if (isWhitelisted) {
				if (!whitelistActive) {
					this.throwError("Whitelist sale not live yet! Please check back later.")
					return
				}
			} else {
				this.throwError("Public sale is not live, and you're not on the whitelist!")
				return
			}
		}

		const tokenPrice = await contract.methods.price().call()
		const alreadyMinted = await contract.methods.minted(account).call()
		const balance = web3.utils.toBN(await web3.eth.getBalance(account))
		const totalPrice = web3.utils.toBN(tokenPrice).mul(alreadyMinted == 0 && isWhitelisted ? amount - 1 : amount)
		const enoughBalance = totalPrice.gt(balance)

		if (enoughBalance) {
			this.throwError("You don't have enough balance in your wallet to mint!")
			return
		}

		if (isWhitelisted && !saleActive) {
			const proof = GetMerkleProof(account)

			contract.methods.whitelistMint(amount, proof).send({from: account, value: totalPrice})
				.on("receipt", () => this.displayMessage("Mint successful!"))
		} else {
			contract.methods.mint(amount).send({from: account, value: totalPrice})
				.on("receipt", () => this.displayMessage("Mint successful!"))
		}
	}

	render() {
		const walletConnected = this.state.walletConnected
		const err = this.state.error
		const message = this.state.message
		
		const currentSupply = this.state.supply;
		const maxSupply = this.state.maxSupply;

		if (err) {
			return (
				<>
					<p className="text-base text-center sm:text-lg font-bold text-error mx-4">An error has occurred: {err}</p>
				</>
			)
		}

		if (maxSupply > 0 && currentSupply == maxSupply) {
			return (
				<>
					<button className="btn btn-disabled text-success mb-4">
						SOLD OUT!
					</button>
				</>
			)
		}

		return (<div className="flex flex-col">
			{message ? <>
				<p className="text-lg font-bold text-green-600 mb-4">
					{message}
				</p>
			</> : <></>}

			{walletConnected ?
				<div className="flex flex-col justify-center">
					<div className="flex flex-col justify-center">
						<p className="font-bold text-center">{`${currentSupply}/${maxSupply}`}</p>
						<progress className={`progress ${currentSupply == 0 ? "" : "progress-success"} mb-4`} value={currentSupply} max={maxSupply} />
					</div>

					<input 
						type="range" 
						value={this.state.mintAmount} 
						min="1" 
						max={5} 
						className="range" 
						step="1"
						onChange={(ev) => {this.setState({mintAmount: ev.target.value})}} 
					/>

					<div className="w-full flex justify-between text-xs px-2 mb-4">
						<span className="font-bold">1</span>
						<span className="font-bold">2</span>
						<span className="font-bold">3</span>
						<span className="font-bold">4</span>
						<span className="font-bold">5</span>
					</div>

					<button className="btn btn-secondary" onClick={this.mint}>Mint</button>
				</div>
			:<> 
				<button className="btn btn-secondary" onClick={this.connectWallet}>Connect Wallet</button>
			</>}
		</div>)
	}
}
