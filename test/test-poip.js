const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");

const EVENT_URI = "https://www.verilinkblockchain.com/";
const DEFAULT_BLOCK_RECENCY_WINDOW = 100;
const NAME = "Proof of Interaction Protocol";
const SYMBOL = "POIP";

const deviceToChipId = (device) => ethers.utils.hexZeroPad(device.address, 32).toLowerCase();

const devicesToChipId = (devices) => 
{
  return devices.map(device => deviceToChipId(device));
}

const getCurrentUTC = (offset) => {
  return Math.floor(Date.now() / 1000) + offset;
}

const expectMint = async (poip, user, eventId, device, blockOffset, expectedBalance=1) =>
{
  let chipId = deviceToChipId(device);
  let blockHash = await getNRecentBlockHash(blockOffset);

  const signature = getDeviceSignature(device, eventId, 
    chipId, user.address, blockHash);

  await poip.connect(user).mint(eventId, chipId, 
    user.address, blockHash, signature);
  
  expect(await poip.balanceOf(user.address, eventId)).to.equal(expectedBalance);
}

const expectMintRevert = async (poip, user, eventId, device, blockOffset, revertStr="") => {
  let chipId = deviceToChipId(device);
  let blockHash = await getNRecentBlockHash(blockOffset);

  const signature = getDeviceSignature(device, eventId, 
    chipId, user.address, blockHash);

  await expect(poip.connect(user).mint(eventId, chipId, 
    user.address, blockHash, signature)).to.be.revertedWith(revertStr);
}

async function getNRecentBlockHash(nBlocksRecent)
{
    let latestBlock = await hre.ethers.provider.getBlockNumber();
    latestBlock = latestBlock - nBlocksRecent;
    let blockHash = hre.ethers.utils.arrayify((await hre.ethers.provider.getBlock(latestBlock)).hash);
    return blockHash;
}

async function skipNBlocks(nBlocks)
{
    for(let i = 0; i < nBlocks; i++)
    {
        await ethers.provider.send('evm_mine');
    }   
}

async function getDeviceSignature(device, eventId, chipId, to,  blockHash)
{
    /* encode ABI */
    let hash = hre.ethers.utils.keccak256(ethers.utils.solidityPack(
        ["uint256", "bytes32", "bytes32"], 
        [eventId, chipId, blockHash]));
    hash = hre.ethers.utils.arrayify(hash);
    /* personal_sign the message */
    const deviceSig = await device.signMessage(hash);
   
    /* Check for test framework failure */
    const prefixedHash = hre.ethers.utils.hashMessage(hash);
    const address = hre.ethers.utils.recoverAddress(prefixedHash , deviceSig);
    expect(address).to.equal(device.address, `Test Framework Failure: recovered address: ${address} != device address: ${device.address}`);
    
    /* split sig to r, s, v and return */
    const sig = hre.ethers.utils.splitSignature(deviceSig);

    /* format sig */
    return hre.ethers.utils.concat([
      hre.ethers.utils.arrayify(sig.r),
      hre.ethers.utils.arrayify(sig.s),
      hre.ethers.utils.arrayify(sig.v)
    ]);
}

async function expectEventCreation(poip, creator, tokenLimit, eventURI, chipIds, start, finish, fee=null)
{
  if(!fee)
  {
    fee = (await poip.getEventFee()).mul(2);
  }

  const txnOpts = {
    value: fee
  };

  const eventId = await poip.totalEvents();
  await poip.connect(creator).createEvent(
    tokenLimit, eventURI, chipIds, start, finish, txnOpts);
  expect(await poip.uri(eventId)).to.equal(EVENT_URI);
  expect(await poip.eventStart(eventId)).to.equal(start);
  expect(await poip.eventFinish(eventId)).to.equal(finish);
  expect(await poip.eventCreator(eventId)).to.equal(creator.address);
  expect(await poip.name()).to.equal(NAME);
  expect(await poip.symbol()).to.equal(SYMBOL);
}

describe("Poip!", function ()
{
  let contract;
  let poip;
  let deployer;
  let device1, device2, device3;
  let creator1, creator2, creator3;
  let user1, user2, user3;

  beforeEach(async function () {
    [
      deployer, 
      creator1, creator2, creator3,
      device1, device2, device3,
      user1, user2, user3, ...signers
    ] = await ethers.getSigners();

    contract = await ethers.getContractFactory("Poip");
    poip = await upgrades.deployProxy(contract, [deployer.address, "0xab594600376ec9fd91f8e885dadf0ce036862de0", NAME, SYMBOL]);
    await poip.deployed();
  })

  describe("Poip Mint", function () {

    it("Should mint an event token", async function () {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);
    });

    it("Should mint an event token to multiple accounts", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);
      await expectMint(poip, user2, 0, device1, 0, 1);
      await expectMint(poip, user3, 0, device1, 0, 1);
    });

    it("Should mint an event token with multiple devices", async function () {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1, device2];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);
      await expectMint(poip, user2, 0, device2, 0, 1);
      await expectMint(poip, user3, 0, device2, 0, 1);
    });

    it("Should fail to mint for non-existent event", async function () {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1, device2];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMintRevert(poip, user1, 1, device1, 0, "PoipEvent: event does not exist");
    });

    it("Should fail to mint for non-existent device", async function () {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMintRevert(poip, user1, 0, device2, 0, "PoipEvent: chip does not exist");
    });

    it("Should fail to mint for invalid signature", async function () {
      let start = 0;
      let finish = getCurrentUTC(180);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      let chipId = deviceToChipId(device1);
      let blockHash = await getNRecentBlockHash(0);
      let eventId = 0;
      let user = user1;

      const signature = getDeviceSignature(device2, eventId, 
        chipId, user.address, blockHash);
      
      await expect(poip.connect(user).mint(eventId, chipId, 
        user.address, blockHash, signature)).to.be.revertedWith("Poip: signature is not valid");
    });

    it("Should fail to mint for non-recent blockhash", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      for(let i = 0; i < DEFAULT_BLOCK_RECENCY_WINDOW; i++)
      {
        await expectMint(poip, user1, 0, device1, i, i+1);
      }
      
      await expectMintRevert(poip, user1, 0, device1, DEFAULT_BLOCK_RECENCY_WINDOW, "Poip: blockhash is not recent");
    });

    it("Should fail to mint for non-live event", async function () {
      let start = 0;
      let finish = getCurrentUTC(-1);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMintRevert(poip, user1, 0, device1, 0, "PoipEvent: event not live");

      start = getCurrentUTC(180);
      finish = getCurrentUTC(360);

      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMintRevert(poip, user1, 0, device1, 0, "PoipEvent: event not live");
    });

    it("Should return the max tokens for the event", async function () {
      let start = 0;
      let finish = 0;
      let creator = creator1;
      let devices = [device1];
      let tokenLimit = 1000;

      await expectEventCreation(
        poip, creator, tokenLimit, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      expect(await poip.eventTokenLimit(0)).to.equal(tokenLimit);

      tokenLimit = 100;

      await expectEventCreation(
        poip, creator, tokenLimit, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      expect(await poip.eventTokenLimit(1)).to.equal(tokenLimit);
    });

    it("Should return the current number of minted tokens", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      for(let i = 0; i < 10; i++)
      {
        await expectMint(poip, user1, 0, device1, 0, i+1);
        expect(await poip.eventTokensMinted(0)).to.equal(i+1);
      }
    });

    it("Should mint up to the max number of tokens", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000000);
      let creator = creator1;
      let devices = [device1];
      let tokenLimit = 100;
      await expectEventCreation(
        poip, creator, tokenLimit, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      for(let i = 0; i < tokenLimit; i++)
      {
        await expectMint(poip, user1, 0, device1, 0, i+1);
        expect(await poip.eventTokensMinted(0)).to.equal(i+1);
      }

      await expectMintRevert(poip, user1, 0, device1, 0, "Poip: max tokens minted for event")
    });

  });
 
  describe("Poip Transactions", function () {

    it("Should transfer a single POIP token", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);

      await poip.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 1, []);
      expect(await poip.balanceOf(user1.address, 0)).to.equal(0);
      expect(await poip.balanceOf(user2.address, 0)).to.equal(1);
    });

    it("Should transfer a batch of POIP tokens", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);

      await expectEventCreation(
        poip, creator, 100, EVENT_URI,
        devicesToChipId(devices),
        start, finish);

      await expectMint(poip, user1, 1, device1, 0, 1);

      await poip.connect(user1).safeBatchTransferFrom(
        user1.address, 
        user2.address, [0, 1], [1, 1],[]);
      expect(await poip.balanceOfBatch(
        [user1.address, user1.address, user2.address, user2.address],
        [0, 1, 0, 1]
      )).to.deep.equal([0, 0, 1, 1].map(val => ethers.BigNumber.from([val])));
    });

    it("Should set approved and transfer POIP tokens", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);

      await poip.connect(user1).setApprovalForAll(user2.address, true);

      await poip.connect(user2).safeTransferFrom(user1.address, user3.address, 0, 1, []);
      expect(await poip.balanceOf(user1.address, 0)).to.equal(0);
      expect(await poip.balanceOf(user3.address, 0)).to.equal(1);
    });

    it("Should burn a POIP token", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);
      expect(await poip.eventTokensMinted(0)).to.equal(1);
      await poip.connect(user1).burn(user1.address, 0, 1);
      expect(await poip.balanceOf(user1.address, 0)).to.equal(0);
      expect(await poip.eventTokensMinted(0)).to.equal(1);
    });
  });

  describe("Poip Supply", function () {
    it("Should return the total supply of tokens", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let tokenLimit = 100;

      await expectEventCreation(
        poip, creator, tokenLimit, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      for(let i = 0; i < tokenLimit; i++)
      {
        await expectMint(poip, user1, 0, device1, 0, i+1);
        expect(await poip.totalSupply(0)).to.equal(i+1);
      }
    });

    it("Should return the total supply of tokens not counting burned tokens", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let tokenLimit = 100;

      await expectEventCreation(
        poip, creator, tokenLimit, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      for(let i = 0; i < tokenLimit; i++)
      {
        await expectMint(poip, user1, 0, device1, 0, i+1);
        expect(await poip.totalSupply(0)).to.equal(i+1);
        expect(await poip.eventTokensMinted(0)).to.equal(i+1);
      }

      for(let i = 0; i < tokenLimit; i++)
      {
        await poip.connect(user1).burn(user1.address, 0, 1);
        expect(await poip.balanceOf(user1.address, 0)).to.equal(tokenLimit-i-1);
        expect(await poip.totalSupply(0)).to.equal(tokenLimit-i-1);
        expect(await poip.eventTokensMinted(0)).to.equal(tokenLimit);
      }
    });
  });

  describe("Poip Pause", function () {
    it("Should revert for mint when Poip is paused", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await poip.pause();

      await expectMintRevert(poip, user1, 0, device1, 0, "Pausable: paused");
    });

    it("Should revert for transfer when Poip is paused", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);

      await poip.pause();

      await expect(poip.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 1, []))
        .to.be.revertedWith("ERC1155Pausable: token transfer while paused");
    });

    it("Should revert for burn when Poip is paused", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await expectMint(poip, user1, 0, device1, 0, 1);

      await poip.pause();

      await expect(poip.connect(user1).burn(user1.address, 0, 1))
        .to.be.revertedWith("Pausable: paused");
    });

    it("Should resume operations when Poip is unpaused", async function ()
    {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];

      await expectEventCreation(
        poip, creator, 100, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      await poip.pause();
      await poip.unpause();
      
      await expectMint(poip, user1, 0, device1, 0, 1);
      await expectMint(poip, user2, 0, device1, 0, 1);

      await poip.connect(user2).burn(user2.address, 0, 1);
      expect(await poip.balanceOf(user2.address, 0)).to.equal(0);
      await poip.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 1, []);
      expect(await poip.balanceOf(user1.address, 0)).to.equal(0);
      expect(await poip.balanceOf(user2.address, 0)).to.equal(1);
    });
  });

  describe("Poip Fee", function () {

    it("Should cost $15 per event", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let balance, newBalance;
      let fee = await poip.getEventFee();

      balance = await hre.ethers.provider.getBalance(poip.address);
      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      newBalance = await hre.ethers.provider.getBalance(poip.address);
      expect(newBalance).to.equal(balance.add(fee.mul(2)));

      balance = newBalance;

      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      newBalance = await hre.ethers.provider.getBalance(poip.address);
      expect(newBalance).to.equal(balance.add(fee.mul(2)));

    });

    it("Should retrieve the protocol fees from the contract", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let balance, newBalance;
      let funds = await poip.getEventFee();

      balance = await hre.ethers.provider.getBalance(user1.address);
      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);
      
      await poip.withdrawFunds(user1.address, funds);

      newBalance = await hre.ethers.provider.getBalance(user1.address);
      expect(newBalance).to.equal(balance.add(funds));
    });

    it("Should retrieve the protocol fees from the contract 2", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let balance, newBalance;
      let funds = (await poip.getEventFee()).mul(2);

      balance = await hre.ethers.provider.getBalance(user1.address);
      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish);

      await poip.withdrawFunds(user1.address, funds);

      newBalance = await hre.ethers.provider.getBalance(user1.address);
      expect(newBalance).to.equal(balance.add(funds));
    });

    it("Should change the event fee", async function () {
      let start = 0;
      let finish = getCurrentUTC(1000);
      let creator = creator1;
      let devices = [device1];
      let balance, newBalance;
      let funds = hre.ethers.BigNumber.from("1500000000"); // $15 per POIP
      let fee = await poip.getEventFee();
      expect(await poip.getEventFeeUSD()).to.equal(funds);

      await poip.setEventFeeUSD(funds.mul(2)); // Now $30 per POIP
      expect(await poip.getEventFeeUSD()).to.equal(funds.mul(2));
      expect(await poip.getEventFee()).to.within(fee.mul(2).sub(1000), fee.mul(2).add(1000));
      balance = await hre.ethers.provider.getBalance(user1.address);

      fee = await poip.getEventFee();
      await expectEventCreation(
        poip, creator, 1000, EVENT_URI, 
        devicesToChipId(devices),
        start, finish, fee);
      
      await poip.withdrawFunds(user1.address, fee);

      newBalance = await hre.ethers.provider.getBalance(user1.address);
      expect(newBalance).to.equal(balance.add(fee));
    })
  });
});