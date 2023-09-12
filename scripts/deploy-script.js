let hre;
const assert = require("assert");
const { program } = require("commander");

const NAME = "The Proof of Interaction Protocol";
const SYMBOL = "POIP";

program
  .requiredOption('--network <network-name>', 'E.g. maticTest', 'hardhat')
program.parse(process.argv)
const options = program.opts();

async function main() {
  process.env.HARDHAT_NETWORK = options.network;

  hre = require("hardhat");
  await hre.run("compile");
  const signers = (await hre.ethers.getSigners());
  const signer = signers[0];

  console.log("Deploying POIP from: ", signer.address);

  let chainLinkOracle = null;
  if(options.network == "maticMain")
  {
    chainLinkOracle = process.env.MATIC_MAIN_USD_ORACLE;
  }
  else
  {
    chainLinkOracle = process.env.MATIC_TEST_USD_ORACLE;
  }

  const contract = await hre.ethers.getContractFactory("Poip");
  const poip = await hre.upgrades.deployProxy(contract, [signer.address, chainLinkOracle, NAME, SYMBOL]);
  await poip.deployed();
  console.log("Poip Deployed to: ", poip.address);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
})