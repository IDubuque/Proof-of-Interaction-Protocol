let hre;
const assert = require("assert");
const { program } = require("commander");

program
  .requiredOption('-c, --contract-address <address>', 'The POIP address')
  .requiredOption('--network <network-name>', 'E.g. maticTest', 'hardhat')
  .requiredOption('-f --event-fee <event-fee>', 'The cost of creating a POIP event in USD');
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

  const currentEventFee = await POIP.getEventFeeUSD();
  console.log(parseFloat(options.eventFee));
  const newEventFee = Math.floor(parseFloat(options.eventFee) * Math.pow(10, FIAT_DECIMALS)); 
  
  console.log(
    `Changing event fee from ${formatFee(currentEventFee)} to ${formatFee(newEventFee)} usd`
  );
  
  const txnOpts = {
    nonce: await signer.getTransactionCount(),
    gasPrice: (await signer.getGasPrice()).mul(2),
    gasLimit: (await POIP.estimateGas.setEventFeeUSD(newEventFee)).mul(2)
  };

  const receipt = await POIP.connect(signer).setEventFeeUSD(newEventFee, txnOpts);
  await receipt.wait();

  console.log(`Get Event Fee USD: ${(await POIP.getEventFeeUSD()).toString()}`);
  console.log(`New Event Fee: ${newEventFee}`);

  assert(
    (await POIP.getEventFeeUSD()).eq(newEventFee),
    "Event fee not expected"
  );

  console.log(`=== EVENT FEE CHANGE SUCCESS! ===`);
  console.log(`Event Fee Matic: ${hre.ethers.utils.formatEther(await POIP.getEventFee())}`);
  console.log(`Event Fee USD: ${formatFee(await POIP.getEventFeeUSD())}`);
}

main().then(() => process.exit(0)).catch((error) => {
  console.log(error);
  process.exit(1);
});