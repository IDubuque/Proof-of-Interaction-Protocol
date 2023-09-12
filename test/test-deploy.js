const { expect } = require("chai");
const { upgrades, ethers } = require("hardhat");

const NAME = "Proof of Interaction Protocol";
const SYMBOL = "POIP";

const ABI = [
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from,address to,uint256 id,uint256 amount,bytes calldata data) external",
  "function safeBatchTransferFrom(address from, address to,uint256[] calldata ids,uint256[] calldata amounts,bytes calldata data) external",
]

const FUNCS = [
  "balanceOf",
  "balanceOfBatch",
  "setApprovalForAll",
  "isApprovedForAll",
  "safeTransferFrom",
  "safeBatchTransferFrom",
]

async function expectInterface(nft, abi, funcs)
{
    let bytes = hre.ethers.utils.arrayify("0x00000000");
    let tmp;
    let iface = new hre.ethers.utils.Interface(abi);

    for(let i = 0; i < abi.length; i++)
    {
        tmp = hre.ethers.utils.arrayify(
            iface.getSighash(funcs[i]));
        for(let j = 0; j < bytes.length; j++)
        {
            bytes[j] = bytes[j] ^ tmp[j];
        }
    }

    expect(await nft.supportsInterface(bytes)).to.equal(true);
}

describe("Poip Deploy", function() {
    let contract;
    let poip;
    let signers;
    let deployer;
    let admin;
    
    beforeEach(async function () {
      [deployer, admin, ...signers] = await ethers.getSigners();

      contract = await ethers.getContractFactory("Poip");
      poip = await upgrades.deployProxy(contract, [deployer.address, "0xab594600376ec9fd91f8e885dadf0ce036862de0", NAME, SYMBOL])
      await poip.deployed();
    });

    describe("Proxy Admin", function () {
        it("Should have admin as proxy admin", async function () 
        {
          await upgrades.admin.changeProxyAdmin(poip.address, admin.address);
          expect(await upgrades.erc1967.getAdminAddress(poip.address)).to.equal(admin.address);
        });
    });

    describe("Upgrade", function () {
      it("Should upgrade to the same contract", async function () {
        const poipSampleUpgrade = await hre.ethers.getContractFactory("PoipSampleUpgrade");
        const upgradePoip = await upgrades.upgradeProxy(poip.address, poipSampleUpgrade);
        expect(upgradePoip.address).to.equal(poip.address);
      });

      it("Should upgrade contract and expose initialized values", async function ()
      {
        const poipSampleUpgrade = await ethers.getContractFactory("PoipSampleUpgrade");
        const upgradePoip = await upgrades.upgradeProxy(poip.address, poipSampleUpgrade);
        expect(upgradePoip.address).to.equal(poip.address);
        expect(await upgradePoip._MAX_TOKENS_PER_EVENT()).to.equal(1000000);
        expect(await upgradePoip._MAX_CHIPS_PER_EVENT()).to.equal(50);
        expect(await upgradePoip._DEFAULT_BLOCK_RECENCY_WINDOW()).to.equal(100);
      });

      it("Should have admin as proxy admin and upgrade the contract", async function () {
        await upgrades.admin.changeProxyAdmin(poip.address, admin.address);
        expect(await upgrades.erc1967.getAdminAddress(poip.address)).to.equal(admin.address);
        const poipSampleUpgrade = await hre.ethers.getContractFactory("PoipSampleUpgrade", admin);
        const upgradePoip = await upgrades.upgradeProxy(poip.address, poipSampleUpgrade);
        expect(upgradePoip.address).to.equal(poip.address);
      });
    })

    describe("Initialize", function () {
      it("Should have owner as deployer", async function () {
        expect(await poip.owner()).to.equal(deployer.address);
      }); 
    })

    describe("ERC1155 Interface", function () {

      it("Should support the ERC1155 Interface", async function () 
      {
        await expectInterface(poip, ABI, FUNCS);
      });

    })
});