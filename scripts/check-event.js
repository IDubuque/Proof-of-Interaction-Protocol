let hre;
const { program } = require("commander");

program
  .requiredOption("-c, --contract-address <address>", "The POIP Address")
  .requiredOption("--network <network-name>", "E.g. maticTest", "hardhat")
  .requiredOption("--event-id <event-id>", "The Event ID")
program.parse(process.argv);

const options = program.opts();

async function main()
{
  process.env.HARDHAT_NETWORK = options.network;

  hre = require("hardhat");

  
  const signers = (await hre.ethers.getSigners());
  const signer = signers[0];

  const contract = await hre.ethers.getContractFactory("Poip");
  const POIP = contract.attach(options.contractAddress);

  const eventId = parseInt(options.eventId);

  console.log(`
    URI: ${await POIP.uri(eventId)},
    eventStart: ${await POIP.eventStart(eventId)}
    eventFinish: ${await POIP.eventFinish(eventId)}
    eventCreator: ${await POIP.eventCreator(eventId)}
    number of devices: ${await POIP.eventNumberOfChips(eventId)},
    event is live: ${await POIP.eventIsLive(eventId)}
  `)
}

main().then(() => process.exit(0)).catch((error) => {
  console.log(error);
  process.exit(1);
});