const hre = require("hardhat");

async function main() {
	const grom = await hre.ethers.getContractFactory("grom");
	const gromContract = await grom.deploy();

	await gromContract.deployed();

	console.log("GROM deployed to:", gromContract.address);

	await gromContract.setMerkleRoot("0x4896200e90d547016548ec0405838dbbf4e6665d8df9f5b216cb7e93fc022463")
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});