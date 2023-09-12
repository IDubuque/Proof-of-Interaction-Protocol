let hre;
const { assert } = require("chai");
const { program } = require("commander");

const NAME = "The Proof of Interaction Protocol";
const SYMBOL = "POIP";

program
  .requiredOption("-c, --contract-address <address>", "The POIP address")
  .requiredOption("--network <network-name>", "E.g. maticTest", "hardhat")
program.parse(process.argv)
const options = program.opts();

async function main() {

  process.env.HARDHAT_NETWORK = options.network;

  hre = require("hardhat");
  await hre.run("compile");

  const signers = (await hre.ethers.getSigners());
  const signer = signers[0];

  const contract = await hre.ethers.getContractFactory("Poip");
  const POIP = contract.attach(options.contractAddress);

  console.log(`Testing deploy for contract: ${options.contractAddress}`);

  assert(
    (await POIP.totalEvents()) == 0,
    "Total events not expected"
  );

  assert(
    (await POIP.owner() == signer.address),
    "owner not expected"
  );

  assert(
    (await POIP.symbol() == SYMBOL),
    "symbol not expected"
  );

  assert(
    (await POIP.name() == NAME),
    "name not expected"
  );

  console.log("=== Passed initial inspection! ===");
}

main().then(() => process.exit(0)).catch(error => {
  console.log(error);
  process.exit(1);
})