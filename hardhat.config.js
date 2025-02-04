require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.ETH_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
