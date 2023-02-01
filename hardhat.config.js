require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/d145d5a3c68d4404a330607b3cba8460`,
      accounts: ["0xa1454527cbcb777322de68381883cd47c78bc8c2785a1699eebded09594acc90"]
    }
  }
};