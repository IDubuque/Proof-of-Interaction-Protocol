pragma solidity ^0.8.0;

/* OZ */
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/* ERC1155SupplyUpgradeable to avoid re-writing this functionality */
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";

/* Internal */
import "./PoipEventSampleUpgrade.sol";

/* ChainLink USD / Matic Interface */
import "../External/ChainLinkAggregator.sol";

contract PoipSampleUpgrade is Initializable, ContextUpgradeable, OwnableUpgradeable, PausableUpgradeable, ERC1155SupplyUpgradeable, PoipEventSampleUpgrade
{
  event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber);

  struct EventTokenStats
  {
    uint256 _tokenMints;
    uint256 _tokenLimit;
  }

  uint256 public _MAX_TOKENS_PER_EVENT;
  uint256 private _eventFee;

   /**
   * The chainlink Matic / USD provider
   */
  address private _chainlinkMaticUSD;

  AggregatorV2V3Interface private _chainlinkMaticUSDContract;

  /* mapping from eventIds => tokenMints */
  mapping(uint256 => EventTokenStats) _eventTokenStats;

  // Contract name
  string public name;
  // Contract symbol
  string public symbol;


  function initialize(address owner) external initializer {
    PausableUpgradeable.__Pausable_init();
    PoipEventSampleUpgrade.__PoipEvent_init();
    _transferOwnership(owner);
    _MAX_TOKENS_PER_EVENT = 1000000; // 1M limit for now
  }

  /* Owner can pause */
  function pause() external onlyOwner
  {
    _pause();
  }

  /* Owner can unpause */
  function unpause() external onlyOwner
  {
    _unpause();
  }

  /* owner / approved can burn a token */
  function burn(address account, uint256 id, uint256 value) external
  {
    require(account == _msgSender() || isApprovedForAll(account, _msgSender()),
          "ERC1155: caller is not owner nor approved");
    _burn(account, id, value);
  }

  /**
   * @dev See {ERC1155-_beforeTokenTransfer}.
   * No token transfers when contract is paused
   */
  function _beforeTokenTransfer(
      address operator,
      address from,
      address to,
      uint256[] memory ids,
      uint256[] memory amounts,
      bytes memory data
  ) internal override 
  {
    require(!paused(), "ERC1155Pausable: token transfer while paused");
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  /* create an event with all the toppings */
  function createEvent(uint256 tokenLimit, string memory tokenURI, 
    bytes32[] memory chipIds, uint64 startTime, uint64 finishTime) 
    external whenNotPaused
  {
    uint256 eventId = _nextEventId();

    _eventTokenStats[eventId]._tokenMints = 0;
    _eventTokenStats[eventId]._tokenLimit = tokenLimit;

    /* create the PoipEvent */
    _createEvent(chipIds, tokenURI, startTime, finishTime);
  }

  function uri(uint256 id) public view virtual override returns (string memory) 
  {
     return _eventURI(id);
  }

  function _maxTokensMinted(uint256 eventId) internal view returns (bool)
  {
    return _eventTokenStats[eventId]._tokenMints == _eventTokenStats[eventId]._tokenLimit;
  }

  function mint(uint256 eventId, bytes32 chipId, address to, 
    bytes32 blockHash, bytes calldata signature) external onlyLiveEvent(eventId) whenNotPaused
  {
    bytes32 hash;
    require(!_maxTokensMinted(eventId), "Poip: max tokens minted for event");
    require(isRecentBlockHash(blockHash), "Poip: blockhash is not recent");
    
    /* confirm valid signature */
    hash = keccak256(
      abi.encodePacked(
        "\x19Ethereum Signed Message:\n32",
        keccak256(abi.encodePacked(eventId, chipId, to, blockHash))
      )
    );

    /* signature is from device */
    require(eventIsValidChipSignature(eventId, chipId, hash, signature), "Poip: signature is not valid");

    /* mint the token */
    _mint(to, eventId, 1, "");

    emit EventTokenMinted(eventId, _msgSender(), to, _eventTokenStats[eventId]._tokenMints);

    _eventTokenStats[eventId]._tokenMints = _eventTokenStats[eventId]._tokenMints + 1;
  } 

  uint256[45] private ______gap;
}