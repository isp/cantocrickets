const hre = require("hardhat");

async function main() {
	const grom = await hre.ethers.getContractFactory("grom");
	const gromContract = await grom.attach("0x65b16AF3E6535cdb59ed2eD9cA4c7085b11EF91c")

	await gromContract.deployed();

	console.log("GROM attached to:", gromContract.address);

	//await gromContract.setWhitelistActive(true)
	const isActive = await gromContract.isActiveWL();
	console.log(isActive)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});