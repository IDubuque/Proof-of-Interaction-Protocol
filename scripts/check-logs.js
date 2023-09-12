let hre;
const { program } = require("commander");

program
  .requiredOption("-c, --contract-address <address>", "The POIP Address")
  .requiredOption("--network <network-name>", "E.g. maticTest", "hardhat")
  .requiredOption("--transaction-hash <transaction-hash>", "The hash of the transaction")
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

  const transaction = await signer.provider.getTransactionReceipt(options.transactionHash)

  console.log(`Transaction: ${JSON.stringify(transaction)}`);
  
  console.log("Logs Length:", transaction.logs.length);

  console.log("POIP:", JSON.stringify(POIP.interface))

  const parseLogs = transaction.logs.map((log) => {

    try
    {
      console.log("POIP");
      return POIP.interface.parseLog(log);
    }
    catch(error)
    {
      console.log(error);
      return null;
    } 
  });

  console.log(`Parse Logs: ${JSON.stringify(parseLogs)}`);
}

main().then(() => process.exit(0)).catch((error) => {
  console.log(error);
  process.exit(1);
})