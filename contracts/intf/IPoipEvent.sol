pragma solidity ^0.8.5;

/**
 * Interface for IPoipEvent 
 * This contract handles the event specific logic for POIP
 */
interface IPoipEvent 
{
  /* event for EventCreation to track `creator` of `eventId` */
  event EventCreation(address creator, uint256 eventId);

  /* returns the number of chips for `eventId` */
  function eventNumberOfChips(uint256 eventId) 
    external view returns (uint256);

  /* returns chipId for the `eventId` by `index` */
  function eventChipIdByIndex(uint256 eventId, uint256 index) 
    external view returns (bytes32);

  /* returns whether `eventId` has `chipId` */
  function eventHasChipId(uint256 eventId, bytes32 chipId) 
    external view returns (bool);

  /* returns the event start time in unix timestamp */
  function eventStart(uint256 eventId) 
    external view returns (uint64);

  /* returns the event finish time in unix timestamp */
  function eventFinish(uint256 eventId) 
    external view returns (uint64);

  /* returns whether the event is live */
  function eventIsLive(uint256 eventId) 
    external view returns (bool);

  /* returns the number of events by `creator` */
  function numberOfEventsByCreator(address creator) 
    external view returns (uint256);
  
  /* returns the eventId for `creator` by `index` */
  function eventOfCreatorByIndex(address creator, uint256 index) 
    external view returns (uint256);

  /* returns the creator of `eventId` */
  function eventCreator(uint256 eventId) 
    external view returns (address);
  
  /* returns the total number of events */
  function totalEvents() external view returns (uint256);
}