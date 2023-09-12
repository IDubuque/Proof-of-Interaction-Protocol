const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");

const EVENT_URI = "https://www.verilinkblockchain.com/";
const NAME = "Proof of Interaction Protocol";
const SYMBOL = "POIP";

const devicesToChipId = (devices) => 
{
  return devices.map((val) => ethers.utils.hexZeroPad(val.address, 32).toLowerCase());
}

const getCurrentUTC = (offset) => {
  return Math.floor(Date.now() / 1000) + offset;
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

describe("Poip Event Creation", function() {
    let contract;
    let poip;
    let deployer;
    let device1, device2, device3;
    let creator1, creator2, creator3;
    let signers;
    
    beforeEach(async function () {
      [deployer, creator1, creator2, creator3, device1, device2, device3, ...signers] = await ethers.getSigners();

      contract = await ethers.getContractFactory("Poip");
      poip = await upgrades.deployProxy(contract, [deployer.address, "0xab594600376ec9fd91f8e885dadf0ce036862de0", NAME, SYMBOL])
      await poip.deployed();
    });

    describe("Basic Event Creation", function () {
        it("Should create a basic event", async function () 
        {
          let start = 0;
          let finish = getCurrentUTC(180);
          let creator = creator1;
          let devices = [device1];

          await expectEventCreation(
            poip, creator, 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);
        });

        it("Should create multiple events for a single creator", async function ()
        {
          let start = 0;
          let finish = getCurrentUTC(180);
          let creator = creator1;
          let devices = [device1];

          for(let i = 0; i < 10; i++)
          {
            await expectEventCreation(
              poip, creator, 100, EVENT_URI, 
              devicesToChipId(devices),
              start, finish);
            expect(await poip.totalEvents()).to.equal(i+1);
          }
        });

        it("Should create an event for multiple creators", async function () {
          let start = 0;
          let finish = getCurrentUTC(180);
          let devices = [device1];
          /* Creator 1 Event */
          await expectEventCreation(
            poip, creator1, 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);
          expect(await poip.totalEvents()).to.equal(1);

          /* Creator 2 Event */
          await expectEventCreation(
            poip, creator2, 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);
          expect(await poip.totalEvents()).to.equal(2);

          /* Creator 3 Event */
          await expectEventCreation(
            poip, creator3, 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);
          expect(await poip.totalEvents()).to.equal(3);
        });

        it("Should create multiple events for multiple creators", async function () {
          let start = 0;
          let finish = getCurrentUTC(180);
          let creators = [creator1, creator2, creator3];
          let creatorEvents = [0, 0, 0];
          let devices = [device1];

          for(let i = 0; i < 30; i++)
          {
            let creatorIdx = (i%3);
            let creator = creators[creatorIdx];
            await expectEventCreation(
              poip, creators[creatorIdx], 100, EVENT_URI, 
              devicesToChipId(devices),
              start, finish);

            creatorEvents[creatorIdx] += 1;

            expect(await poip.numberOfEventsByCreator(creator.address)).to.equal(creatorEvents[creatorIdx]);
            expect(await poip.eventOfCreatorByIndex(creator.address, creatorEvents[creatorIdx]-1)).to.equal(i);
            expect(await poip.eventCreator(i)).to.equal(creator.address);
            expect(await poip.totalEvents()).to.equal(i+1);
          }
        });
    });

    describe("Event Creation Creator APIs", function () {
      
      it("Should enumerate events for a single creator", async function() {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let devices = [device1];
        let eventsPerCreator = 10;

        for(let i = 0; i < eventsPerCreator; i++)
        {
          await expectEventCreation(
            poip, creator, 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);
            expect(await poip.numberOfEventsByCreator(creator.address)).to.equal(i+1);
            expect(await poip.eventOfCreatorByIndex(creator.address, i)).to.equal(i);
        }

        let numEvents = await poip.numberOfEventsByCreator(creator.address);
        expect(numEvents).to.equal(eventsPerCreator);

        for(let i = 0; i < numEvents; i++)
        {
          expect(await poip.eventOfCreatorByIndex(creator.address, i)).to.equal(i);
        }

      });

      it("Should enumerate events for multiple creators", async function() {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creators = [creator1, creator2, creator3];
        let creatorEvents = [0, 0, 0];
        let devices = [device1];
        let numEvents = 10;

        for(let i = 0; i < 10*creators.length; i++)
        {
          let creatorIdx = (i%creators.length);
          let creator = creators[creatorIdx];
          await expectEventCreation(
            poip, creators[creatorIdx], 100, EVENT_URI, 
            devicesToChipId(devices),
            start, finish);

          creatorEvents[creatorIdx] += 1;

          expect(await poip.numberOfEventsByCreator(creator.address)).to.equal(creatorEvents[creatorIdx]);
          expect(await poip.eventOfCreatorByIndex(creator.address, creatorEvents[creatorIdx]-1)).to.equal(i);
        }

        for(let creatorIdx = 0; creatorIdx < creators.length; creatorIdx++)
        {
          let creator = creators[creatorIdx];
          let creatorNumEvents = (await poip.numberOfEventsByCreator(creator.address));
          expect(creatorNumEvents).to.equal(numEvents);

          for(let i = 0; i < creatorNumEvents; i++)
          {
            expect(await poip.eventOfCreatorByIndex(creator.address, i)).to.equal((i*creators.length+creatorIdx));
          }
        }
      });

      it("Should revert for index out of bounds", async function () {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let devices = [device1];

        await expect(poip.eventOfCreatorByIndex(creator.address, 0)).to.be.revertedWith("PoipEvent: index out of bounds");

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        await expect(poip.eventOfCreatorByIndex(creator.address, 1)).to.be.revertedWith("PoipEvent: index out of bounds");
      });

    });

    describe("Device APIs", function () {
      it("Should enumerate a single device", async function () 
      {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let chipIds = devicesToChipId([device1]);

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);
        
        let numberOfChips = await poip.eventNumberOfChips(0);
        expect(numberOfChips).to.equal(chipIds.length);

        for(let i = 0; i < numberOfChips; i++)
        {
          expect(await poip.eventChipIdByIndex(0, i)).to.equal(chipIds[i]);
        }
      });

      it("Should enumerate multiple devices", async function () {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let chipIds = devicesToChipId([device1, device2, device3]);

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);
        
        let numberOfChips = await poip.eventNumberOfChips(0);
        expect(numberOfChips).to.equal(chipIds.length);

        for(let i = 0; i < numberOfChips; i++)
        {
          expect(await poip.eventChipIdByIndex(0, i)).to.equal(chipIds[i]);
        }

      });
    
      it("Should revert device enumeration for non-existing event", async function ()
      {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let devices = [device1, device2];

        await expect(poip.eventNumberOfChips(0)).to.be.revertedWith("PoipEvent: event does not exist");
        await expect(poip.eventChipIdByIndex(0, 0)).to.be.revertedWith("PoipEvent: event does not exist");

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        await expect(poip.eventNumberOfChips(1)).to.be.revertedWith("PoipEvent: event does not exist");
        await expect(poip.eventChipIdByIndex(1, 0)).to.be.revertedWith("PoipEvent: event does not exist");
      });

      it("Should revert device enumeration for device index out of bounds", async function () {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let devices = [device1, device2];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        await expect(poip.eventChipIdByIndex(0, 2)).to.be.revertedWith("PoipEvent: index out of bounds");

        devices = [];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        await expect(poip.eventChipIdByIndex(1, 0)).to.be.revertedWith("PoipEvent: index out of bounds");
      });

      it("Should return true for event containing chipIds", async function() {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let chipIds = devicesToChipId([device1]);

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);

        for(let i = 0; i < chipIds.length; i++)
        {
          expect(await poip.eventHasChipId(0, chipIds[i])).to.equal(true);
        }

        chipIds = devicesToChipId([device1, device2, device3]);

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);

        for(let i = 0; i < chipIds.length; i++)
        {
          expect(await poip.eventHasChipId(1, chipIds[i])).to.equal(true);
        }
      });

      it("Should return false for event not containing chipIds", async function () {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let chipIds = devicesToChipId([device1]);

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);
        
        chipIds = devicesToChipId([device1, device2, device3]);
        for(let i = 1; i < chipIds.length; i++)
        {
          expect(await poip.eventHasChipId(0, chipIds[i])).to.equal(false);
        }
      });

      it("Should revert for event contain chipId query for non-existent event", async function () {
        let chipIds = devicesToChipId([device1]);
        await expect(poip.eventHasChipId(0, chipIds[0])).to.be.revertedWith("PoipEvent: event does not exist");
      });

      it("Should revert for event contain chipId query for event with no chips", async function () {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let chipIds = [];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          chipIds, start, finish);

          chipIds = devicesToChipId([device1]);
        await expect(poip.eventHasChipId(0, chipIds[0])).to.be.revertedWith("PoipEvent: chip does not exist");
      });

    })

    describe("Time Window APIs", function () {

      it("Should revert for start query of non-existent event", async function ()
      {
        await expect(poip.eventStart(0)).to.be.revertedWith("PoipEvent: event does not exist");
      });

      it("Should revert for finish query of non-existent event", async function ()
      {
        await expect(poip.eventFinish(0)).to.be.revertedWith("PoipEvent: event does not exist");
      });

      it("Should return true for live event", async function ()
      {
        let start = 0;
        let finish = getCurrentUTC(180);
        let creator = creator1;
        let devices = [device1];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        expect(await poip.eventIsLive(0)).to.equal(true);
      });

      it("Should return false for event after finish", async function ()
      {
        let start = 0;
        let finish = getCurrentUTC(-5);
        let creator = creator1;
        let devices = [device1];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        expect(await poip.eventIsLive(0)).to.equal(false);
      });

      it("Should return false for event before start", async function () {
        let start = getCurrentUTC(180);
        let finish = getCurrentUTC(360);
        let creator = creator1;
        let devices = [device1];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        expect(await poip.eventIsLive(0)).to.equal(false);
      });

      it("Should return false for event before start and after finish", async function () {
        let start = getCurrentUTC(180);
        let finish = getCurrentUTC(-1);
        let creator = creator1;
        let devices = [device1];

        await expectEventCreation(
          poip, creator, 100, EVENT_URI, 
          devicesToChipId(devices),
          start, finish);
        
        expect(await poip.eventIsLive(0)).to.equal(false);
      })


      it("Should revert for event live query on non-existent event", async function () {
        await expect(poip.eventIsLive(0)).to.be.revertedWith("PoipEvent: event does not exist");
      });


    })
});