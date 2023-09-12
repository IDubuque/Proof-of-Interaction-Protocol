require('dotenv').config();
const { PRIVATE_KEY, COINMARKETCAP, ALCHEMY_API } = process.env || null;
require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-contract-sizer');
require("solidity-docgen");
require("hardhat-gas-reporter");

module.exports = {

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API}`,
      }
    },

    maticTest: {
      url: "https://rpc-mumbai.maticvigil.com", // mumbai testnet
      accounts: [PRIVATE_KEY],
      gasMultiplier: 2,
    },

    maticMain: {
      url: "https://polygon-rpc.com",
      accounts: [PRIVATE_KEY],
      gasMultiplier: 2
    },
  },


  solidity: {
    compilers: 
    [
      {
        version: "0.8.5"
      },
      {
        version: "0.6.12"
      }
    ],

    settings: 
    {
      optimizer: 
      {
        enabled: true,
        runs: 200
      }
    },
  },

  docgen: {},

  gasReporter: {
    currency: "USD",
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    coinmarketcap: COINMARKETCAP
  },
};