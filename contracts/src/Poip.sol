pragma solidity ^0.8.0;

/* OZ */
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/* ERC1155SupplyUpgradeable to avoid re-writing this functionality */
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";

/* Internal */
import "./PoipEvent.sol";

/* ChainLink USD / Matic Interface */
import "../External/ChainLinkAggregator.sol";

/* Interface */
import "../intf/IPoip.sol";

/**
 * Proof of Interaction Protocol (POIP) 
 * The protocol offers digital tokens as proof of interaction (POI) with a secure smart-tag
 * A POI requires a recent signature from a secure smart-tag validating interaction and recency
 * If the smart-tag is in a specific location, it also validates proof of location 
 * The representation of the POI is determined by the event creator and event
 * For example, an art exhibition event POI may represent viewing of an artwork
 */
contract Poip is Initializable, ContextUpgradeable, OwnableUpgradeable, 
  PausableUpgradeable, ERC1155SupplyUpgradeable, PoipEvent, IPoip
{
  /**
   * Contains the event token stats for tracking POIs
   */
  struct EventTokenStats
  {
    uint256 _tokenMints;
    uint256 _tokenLimit;
  }

  /**
   * The maximum supported tokens per event
   */
  uint256 private _MAX_TOKENS_PER_EVENT;

  /**
   * The cost of event creation for POIP in fiat with 8 decimals
   */
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

  /**
    Initializes the POIP contract and inherited contracts
    Default Values:
      max tokens per event: 1 Million
      cost of event creation: 15 tokens
   */
  function initialize(address owner, address chainlinkMaticUSD, string memory _name, string memory _symbol) 
    external initializer 
  {
    PausableUpgradeable.__Pausable_init();
    PoipEvent.__PoipEvent_init();
    _transferOwnership(owner);
    _MAX_TOKENS_PER_EVENT = 1000000; // 1M limit for now
    _eventFee = 1500000000;
    _chainlinkMaticUSD = chainlinkMaticUSD;
    _chainlinkMaticUSDContract = AggregatorV2V3Interface(chainlinkMaticUSD);
    name = _name;
    symbol = _symbol;
  }

  /**
   * Owner can pause 
   */
  function pause() external onlyOwner
  {
    _pause();
  }

  /**
   * Owner can unpause 
   */
  function unpause() external onlyOwner
  {
    _unpause();
  }

  /**
   * returns the cost of event creation in fiat to 8 decimals
   */
  function getEventFeeUSD() public override view returns (uint256)
  {
    return _eventFee;
  }

  /**
   * returns the current matic fee
   */
  function getEventFee() public override view returns (uint256)
  {
    uint256 maticUSD = (uint256) (_chainlinkMaticUSDContract.latestAnswer());
    return (_eventFee * (10**18)) / maticUSD;
  }

  /**
   * sets the cost of event creation in fiat with 8 decimals
   */
  function setEventFeeUSD(uint256 fee) 
    external override onlyOwner
  {
    _eventFee = fee;
  }

  /**
   * owner can retrieve funds
   */
  function withdrawFunds(address payable to, uint256 amount) 
    external override onlyOwner
  {
    to.transfer(amount);
  }

  /**
   * token owner / approved can burn a token 
   */
  function burn(address account, uint256 id, uint256 value) 
    whenNotPaused external
  {
    require(account == _msgSender() || isApprovedForAll(account, _msgSender()),
          "ERC1155: caller is not owner nor approved");
    _burn(account, id, value);
  }

  /**
   * returns the POI limit for the event
   */
  function eventTokenLimit(uint256 eventId) 
    external override view returns (uint256)
  {
    require(_eventExists(eventId), "Poip: event does not exist");
    return _eventTokenStats[eventId]._tokenLimit;
  }

  /**
   * returns the number of POIs minted for the event
   * mintedTokens != eventTokens as tokens may be burned
   */
  function eventTokensMinted(uint256 eventId) 
    external override view returns (uint256)
  {
    require(_eventExists(eventId), "Poip: event does not exist");
    return _eventTokenStats[eventId]._tokenMints;
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

  /**
   * Creates a POIP event
   */
  function createEvent(uint256 tokenLimit, string memory tokenURI, 
    bytes32[] memory chipIds, uint64 startTime, uint64 finishTime) 
    external override payable whenNotPaused 
  {
    require(_msgValue() >= getEventFee(), "Poip: event fee required");

    uint256 eventId = totalEvents();

    _eventTokenStats[eventId]._tokenMints = 0;
    _eventTokenStats[eventId]._tokenLimit = tokenLimit;

    /* create the PoipEvent */
    _createEvent(chipIds, tokenURI, startTime, finishTime);
  }

  /**
   * returns the URI for the event
   */
  function uri(uint256 id) public view virtual override returns (string memory) 
  {
     return _eventURI(id);
  }

  /** 
   * returns if max tokens are minted
   */
  function _maxTokensMinted(uint256 eventId) internal view returns (bool)
  {
    return _eventTokenStats[eventId]._tokenMints >= _eventTokenStats[eventId]._tokenLimit;
  }

  /**
   * mints a POI for an event
   * validates that signature is from a POI device and the blockhash is recent
   */
  function mint(uint256 eventId, bytes32 chipId, address to, 
    bytes32 blockHash, bytes calldata signature) 
    external override onlyLiveEvent(eventId) whenNotPaused
  {
    bytes32 hash;
    require(!_maxTokensMinted(eventId), "Poip: max tokens minted for event");
    require(_isRecentBlockHash(blockHash), "Poip: blockhash is not recent");

    /* confirm valid signature */
    hash = keccak256(
      abi.encodePacked(
        "\x19Ethereum Signed Message:\n32",
        keccak256(abi.encodePacked(eventId, chipId, blockHash))
      )
    );

    /* signature is from device */
    require(_eventIsValidChipSignature(eventId, chipId, hash, signature), 
      "Poip: signature is not valid");

    /* mint the token */
    _mint(to, eventId, 1, "");

    emit EventTokenMinted(eventId, _msgSender(), to, 
      _eventTokenStats[eventId]._tokenMints);

    _eventTokenStats[eventId]._tokenMints = 
      _eventTokenStats[eventId]._tokenMints + 1;
  } 
  
  /* reserve for future upgrades */
  uint256[45] private ______gap;
}