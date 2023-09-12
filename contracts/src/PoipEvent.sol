pragma solidity ^0.8.5;

/* Interface */
import "../intf/IPoipEvent.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
 * PoipEvent contract to handle all the event specific logic
 */
contract PoipEvent is Initializable, ContextUpgradeable, IPoipEvent
{
  /*** STRUCTS ***/
  struct EventChipIds 
  {
    bytes32[] _chipIds;
    mapping(bytes32 => uint256) _chipIdIndexes;
  }

  struct EventTimeWindow
  {
    uint64 _start;
    uint64 _finish;
  }

  /*** CONSTANTS ***/
  uint256 private _MAX_CHIPS_PER_EVENT;
  uint256 private _DEFAULT_BLOCK_RECENCY_WINDOW;

  /*** STORAGE ***/

  /* event count / next eventId */
  uint256 internal _eventCount;

  /* eventId => creator mapping */
  mapping(uint256 => address) _eventCreators;

  /* eventId => eventURI */
  mapping(uint256 => string) _eventURIs;

  /* chipIds */
  mapping(uint256 => EventChipIds) _eventChipIds;
  
  /* eventId => timeWindow */
  mapping(uint256 => EventTimeWindow) _eventTimeWindows;

  /* creator mapping to list of owned events */
  mapping(address => uint256[]) _creatorEventList;

  /* mapping of event to creator index */
  mapping(uint256 => uint256) _eventCreatorIndex;

  /*** APIs ***/

  /*** INIT ***/ 
  function __PoipEvent_init() internal onlyInitializing {
    __PoipEvent_init_unchained();
  }

  function __PoipEvent_init_unchained() internal onlyInitializing {
    _MAX_CHIPS_PER_EVENT = 50;
    _DEFAULT_BLOCK_RECENCY_WINDOW = 100;
  }

  /*** CHIP ID APIS ***/
  /* sets chipIds for the event */
  function _setEventChipIds(uint256 eventId, bytes32[] memory chipIds) internal
  {
    require(_eventChipIds[eventId]._chipIds.length < _MAX_CHIPS_PER_EVENT, 
      "PoipEvent: chip limit exceeded");
    
    for(uint256 i = 0; i < chipIds.length; i++)
    {
      _eventChipIds[eventId]._chipIdIndexes[chipIds[i]] = i;
      _eventChipIds[eventId]._chipIds.push(chipIds[i]);
    }
  }

  /* returns number of chips for the eventId */
  function eventNumberOfChips(uint256 eventId) 
    public override view returns (uint256)
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return _eventChipIds[eventId]._chipIds.length;
  }
  
  /* returns chipdId for the event by index */
  function eventChipIdByIndex(uint256 eventId, uint256 index) 
    public override view returns (bytes32)
  {
    require(index < eventNumberOfChips(eventId), "PoipEvent: index out of bounds");
    return _eventChipIds[eventId]._chipIds[index];
  }

  /* returns if eventId has chipId */
  function eventHasChipId(uint256 eventId, bytes32 chipId) 
    public override view returns (bool)
  {
    require(eventNumberOfChips(eventId) > 0, "PoipEvent: chip does not exist");
    uint256 _chipIdIndex = _eventChipIds[eventId]._chipIdIndexes[chipId];
    return _eventChipIds[eventId]._chipIds[_chipIdIndex] == chipId;
  }

  /* is valid chipid signature for the event */
  function _eventIsValidChipSignature(uint256 eventId, bytes32 chipId, 
    bytes32 hash, bytes calldata signature) internal view returns (bool)
  {
    require(eventHasChipId(eventId, chipId), "PoipEvent: chip does not exist");

    address signer;
    bytes32 r;
    bytes32 s;
    uint8 v;

    /* Implementation for Kong Halo Chip 2021 Edition */
    require(signature.length == 65, "PoipEvent: invalid sig length");

    /* unpack v, s, r */
    r = bytes32(signature[0:32]);
    s = bytes32(signature[32:64]);
    v = uint8(signature[64]);

    if(uint256(s) > 
      0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0)
    {
      revert("PoipEvent: invalid sig `s`");
    }

    if(v != 27 && v != 28)
    {
      revert("PoipEvent: invalid sig `v`");
    }

    signer = ecrecover(hash, v, r, s);
    
    require(signer != address(0x0), "PoipEvent: invalid signer");

    return signer == address(uint160(uint256(chipId)));
  }

  /*** TIME WINDOW ***/
  
  /* sets the time window for the event */
  function _setEventTimeWindow(uint256 eventId, uint64 start, 
    uint64 finish) internal
  { 
    _eventTimeWindows[eventId]._start = start;
    _eventTimeWindows[eventId]._finish = finish;
  }

  /* returns the event start time */
  function eventStart(uint256 eventId) 
    public override view returns (uint64)
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return _eventTimeWindows[eventId]._start;
  }

  /* returns the event finish time */
  function eventFinish(uint256 eventId) 
    public override view returns (uint64)
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return _eventTimeWindows[eventId]._finish;
  }

  /* returns whether the event is live */
  function eventIsLive(uint256 eventId) 
    public override view returns (bool)
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return (block.timestamp >= _eventTimeWindows[eventId]._start) &&
      (block.timestamp <= _eventTimeWindows[eventId]._finish);
  }

  /* checks whether event exists and is live */
  modifier onlyLiveEvent(uint256 eventId) {
    require(eventIsLive(eventId), "PoipEvent: event not live");
    _;
  }

  /*** EVENT CREATOR ENUMERABLE ***/
  /* returns the number of events by the creator */
  function numberOfEventsByCreator(address creator) 
    public override view returns (uint256)
  {
    return _creatorEventList[creator].length;
  }

  /* returns the event of a creator by index */
  function eventOfCreatorByIndex(address creator, uint256 index) 
    public override view returns (uint256)
  {
    require(index < numberOfEventsByCreator(creator), 
      "PoipEvent: index out of bounds");
    return _creatorEventList[creator][index];
  }

  function _addEventCreation(address creator, uint256 eventId) internal
  {
    _eventCreatorIndex[eventId] = _creatorEventList[creator].length;
    _creatorEventList[creator].push(eventId);
  }

  /*** RECENCY ***/
  /* returns whether blockhash is recent */
  function _isRecentBlockHash(bytes32 blockHash) internal view returns (bool)
  {
    uint256 currentBlock = block.number;
    uint256 _minRecentBlock = currentBlock - _DEFAULT_BLOCK_RECENCY_WINDOW;

    for(currentBlock; currentBlock >= _minRecentBlock; currentBlock--)
    {
      if(blockHash == blockhash(currentBlock))
      {
        return true;
      }
    }

    return false;
  }

  /*** EVENT ***/
  /* returns creator of the eventId */
  function eventCreator(uint256 eventId) public override view returns (address)
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return _eventCreators[eventId];
  }

  /* returns the URI of the eventId */
  function _eventURI(uint256 eventId) internal view returns (string memory) 
  {
    require(_eventExists(eventId), "PoipEvent: event does not exist");
    return _eventURIs[eventId];
  } 
  
  /* overrides whether event exists */
  function _eventExists(uint256 eventId) internal view returns (bool) 
  {
    return _eventCreators[eventId] != address(0);
  }

  /* returns the next event Id */
  function totalEvents() public override view returns (uint256)
  {
    return _eventCount;
  }

  /* create an event with all the toppings */
  function _createEvent(bytes32[] memory chipIds, string memory eventURI, 
    uint64 startTime, uint64 finishTime) internal
  {
    _eventCreators[_eventCount] = _msgSender();
    _eventURIs[_eventCount] = eventURI;
    _setEventChipIds(_eventCount, chipIds);
    _setEventTimeWindow(_eventCount, startTime, finishTime);
    _addEventCreation(_msgSender(), _eventCount);

    emit EventCreation(_msgSender(), _eventCount);

    _eventCount = _eventCount + 1;
  }

  uint256[41] private ______gap;
}