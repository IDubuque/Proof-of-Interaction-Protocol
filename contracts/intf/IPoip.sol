pragma solidity ^0.8.0;

/**
 * Interface for Proof of Interaction Protocol (POIP) 
 * The protocol offers digital tokens as proof of interaction (POI) with a secure smart-tag
 * A POI requires a recent signature from a secure smart-tag validating interaction and recency
 * If the smart-tag is in a specific location, it also validates proof of location 
 * The representation of the POI is determined by the event creator and event
 * For example, an art exhibition event POI may represent viewing of an artwork
 */
interface IPoip
{
  /**
   * Indicates a POI of `tokenId` was redeemed for `eventId` by `by` address to `to`
   */
  event EventTokenMinted(uint256 eventId, address by, address to, uint256 tokenId);

  /**
   * returns the cost of event creation in USD 8 decimals
   */
  function getEventFeeUSD() external view returns (uint256);

  /**
   * returns the cost of event creation in matic
   */
  function getEventFee() external view returns (uint256);
  
  /**
   * sets the event fee in USD 8 decimals
   */
  function setEventFeeUSD(uint256 fee) external;

  /**
   * withdraws the funds from the POIP contract
   * to be used for POIP DAO
   */
  function withdrawFunds(address payable to, uint256 amount) external;
  
  /**
   * returns the token limit for `eventId`
   */
  function eventTokenLimit(uint256 eventId) external view returns (uint256);

  /**
   * returns the number of tokens minted for `eventId`
   */
  function eventTokensMinted(uint256 eventId) external view returns (uint256);

  /**
   * Creates a POIP event
   */
  function createEvent(uint256 tokenLimit, string memory tokenURI, 
    bytes32[] memory chipIds, uint64 startTime, uint64 finishTime) 
    external payable;

  /**
   * Mints a POIP event token (POI)
   */
  function mint(uint256 eventId, bytes32 chipId, address to, 
    bytes32 blockHash, bytes calldata signature) external;
}