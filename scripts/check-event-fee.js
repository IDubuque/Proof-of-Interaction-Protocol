let hre;
const { program } = require("commander");

program
  .requiredOption("-c, --contract-address <address>", "The POIP address")
  .requiredOption("--network <network-name>", "E.g. maticTest", "hardhat")
program.parse(process.argv)
const options = program.opts();

const FIAT_DECIMALS = 8;

const formatFee = (fee) => {
  const feeF = parseFloat(fee.toString()) / Math.pow(10, FIAT_DECIMALS);
  return feeF.toString();
}

async function main()
{
  process.env.HARDHAT_NETWORK = options.network;

  hre = require("hardhat");

  const signers = (await hre.ethers.getSigners());
  const signer = signers[0];

  const contract = await hre.ethers.getContractFactory("Poip");
  const POIP = contract.attach(options.contractAddress);

  console.log(`=== CHECKING EVENT! ===`);
  console.log(`Event Fee Matic: ${hre.ethers.utils.formatEther(await POIP.getEventFee())}`);
  console.log(`Event Fee USD: ${formatFee(await POIP.getEventFeeUSD())}`);
}

main().then(() => process.exit(0)).catch((error) => {
  console.log(error);
  process.exit(1);
})