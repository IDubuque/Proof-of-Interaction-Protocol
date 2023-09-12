let hre;
const assert = require("assert");
const { program } = require("commander");
const fs = require('fs');
const readline = require("readline");

program
  .requiredOption('-c, --contract-address <address>', 'The POIP address')
  .requiredOption('--network <network-name>', 'E.g. maticTest', 'hardhat')
  .requiredOption('-m, --metadata <metadata>', 'The metadata for the event')
  .option('-k, --public-keys <public-keys...>', 'Uncompressed chip pub key starting with 04')
  .option('-p, --public-key-path <public-key-path>', "The text file list of public keys for the event")
  .option('-s, --start-time <start-time>', 'the start-time of the event in unix timestamp')
  .option('-f, --finish-time <finish-time>', 'the end-time of the event in unix timetamp')
  .option('-l, --token-limit <token-limit>', 'The token limit for the event')
program.parse(process.argv)
const options = program.opts();

const formatHex = (bytes) => (bytes.slice(0, 2) == "0x") ? bytes : "0x" + bytes;
const chipIdFromPublicKey = (publicKey) => hre.ethers.utils.keccak256('0x' + hre.ethers.utils.computePublicKey(formatHex(publicKey)).slice(4));
const chipIdsFromPublicKeys = (publicKeys) => publicKeys.map(pk => chipIdFromPublicKey(pk));

async function chipIdsFromFile(path) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    console: false
  });

  let chipIds = [];

  for await (const publicKey of rl) {
    chipIds.push(chipIdFromPublicKey(publicKey));
  }

  return chipIds;
}

async function main() 
{
  process.env.HARDHAT_NETWORK = options.network;
  hre = require("hardhat");
  
  const signers = (await hre.ethers.getSigners());
  const signer = signers[0];

  console.log("Creating an event with signer: ", signer.address);

  const contract = await hre.ethers.getContractFactory("Poip");
  const POIP = contract.attach(options.contractAddress);

  let chipIds = [];
  if(options.publicKeys)
  {
    chipIds = chipIdsFromPublicKeys(options.publicKeys);
  }
  else if(options.publicKeyPath)
  {
    chipIds = await chipIdsFromFile(options.publicKeyPath);
  }
  else
  {
    throw `No public key option fulfilled!`;
  }

  const startTime = options.startTime || 0;
  const endTime = options.finishTime || 2^63;
  const tokenLimit = options.tokenLimit || 1000000;
  const eventURI = options.metadata;

  const eventCost = await POIP.getEventFee();
  const creatorNumEvents = await POIP.numberOfEventsByCreator(signer.address);
  const txnOpts = {
      nonce: await signer.getTransactionCount(),
      gasPrice: (await signer.getGasPrice()).mul(2),
      gasLimit: 1000000,/*(await POIP.estimateGas.createEvent(tokenLimit, eventURI, chipIds, 
        startTime, endTime)).mul(2),*/
      value: eventCost,
  };

  console.log(`
    Event Creator: ${signer.address}
    Event Index: ${creatorNumEvents}
    Event URI: ${eventURI}
    Token Limit: ${tokenLimit}
    Start Time: ${startTime}
    End Time: ${endTime}
    Number of Chips: ${chipIds.length}
    Event Cost (ETH): ${hre.ethers.utils.formatEther( eventCost ) }
    Gas Cost (ETH): ${hre.ethers.utils.formatEther(txnOpts.gasPrice.mul(txnOpts.gasLimit))}
  `);

  let receipt = await POIP.connect(signer).createEvent(tokenLimit, eventURI, chipIds, 
    startTime, endTime, txnOpts);

  await receipt.wait();
  
  console.log("Event created! Confirming details...");
  const eventId = await POIP.eventOfCreatorByIndex(signer.address, creatorNumEvents);

  assert(
    (await POIP.uri(eventId)) == eventURI,
    "Event URI does not match"
  );

  assert(
    (await POIP.eventStart(eventId)) == startTime,
    "Event start time does not match"
  );;

  assert(
    (await POIP.eventFinish(eventId)) == endTime,
    "Event finish time does not match"
  );

  assert(
    (await POIP.eventCreator(eventId)) == signer.address,
    "Event creator does not match"
  );


  console.log(`
    === EVENT CREATION SUCCESS! ===
    event id: ${eventId}
  `);
}


main().then(() => process.exit(0)).catch((error) => {
  console.log(error);
  process.exit(1);
})