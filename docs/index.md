# Solidity API

## OwnableUpgradeable

_Contract module which provides a basic access control mechanism, where
there is an account (an owner) that can be granted exclusive access to
specific functions.

By default, the owner account will be the one that deploys the contract. This
can later be changed with {transferOwnership}.

This module is used through inheritance. It will make available the modifier
&#x60;onlyOwner&#x60;, which can be applied to your functions to restrict their use to
the owner._

### _owner

```solidity
address _owner
```

### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

### __Ownable_init

```solidity
function __Ownable_init() internal
```

_Initializes the contract setting the deployer as the initial owner._

### __Ownable_init_unchained

```solidity
function __Ownable_init_unchained() internal
```

### owner

```solidity
function owner() public view virtual returns (address)
```

_Returns the address of the current owner._

### onlyOwner

```solidity
modifier onlyOwner()
```

_Throws if called by any account other than the owner._

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

_Leaves the contract without owner. It will not be possible to call
&#x60;onlyOwner&#x60; functions anymore. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner._

### transferOwnership

```solidity
function transferOwnership(address newOwner) public virtual
```

_Transfers ownership of the contract to a new account (&#x60;newOwner&#x60;).
Can only be called by the current owner._

### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal virtual
```

_Transfers ownership of the contract to a new account (&#x60;newOwner&#x60;).
Internal function without access restriction._

### __gap

```solidity
uint256[49] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## Initializable

_This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
behind a proxy. Since proxied contracts do not make use of a constructor, it&#x27;s common to move constructor logic to an
external initializer function, usually called &#x60;initialize&#x60;. It then becomes necessary to protect this initializer
function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.

TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
possible by providing the encoded function call as the &#x60;_data&#x60; argument to {ERC1967Proxy-constructor}.

CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.

[CAUTION]
&#x3D;&#x3D;&#x3D;&#x3D;
Avoid leaving a contract uninitialized.

An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
contract, which may impact the proxy. To initialize the implementation contract, you can either invoke the
initializer manually, or you can include a constructor to automatically mark it as initialized when it is deployed:

[.hljs-theme-light.nopadding]
&#x60;&#x60;&#x60;
/// @custom:oz-upgrades-unsafe-allow constructor
constructor() initializer {}
&#x60;&#x60;&#x60;
&#x3D;&#x3D;&#x3D;&#x3D;_

### _initialized

```solidity
bool _initialized
```

_Indicates that the contract has been initialized._

### _initializing

```solidity
bool _initializing
```

_Indicates that the contract is in the process of being initialized._

### initializer

```solidity
modifier initializer()
```

_Modifier to protect an initializer function from being invoked twice._

### onlyInitializing

```solidity
modifier onlyInitializing()
```

_Modifier to protect an initialization function so that it can only be invoked by functions with the
{initializer} modifier, directly or indirectly._

### _isConstructor

```solidity
function _isConstructor() private view returns (bool)
```

## PausableUpgradeable

_Contract module which allows children to implement an emergency stop
mechanism that can be triggered by an authorized account.

This module is used through inheritance. It will make available the
modifiers &#x60;whenNotPaused&#x60; and &#x60;whenPaused&#x60;, which can be applied to
the functions of your contract. Note that they will not be pausable by
simply including this module, only once the modifiers are put in place._

### Paused

```solidity
event Paused(address account)
```

_Emitted when the pause is triggered by &#x60;account&#x60;._

### Unpaused

```solidity
event Unpaused(address account)
```

_Emitted when the pause is lifted by &#x60;account&#x60;._

### _paused

```solidity
bool _paused
```

### __Pausable_init

```solidity
function __Pausable_init() internal
```

_Initializes the contract in unpaused state._

### __Pausable_init_unchained

```solidity
function __Pausable_init_unchained() internal
```

### paused

```solidity
function paused() public view virtual returns (bool)
```

_Returns true if the contract is paused, and false otherwise._

### whenNotPaused

```solidity
modifier whenNotPaused()
```

_Modifier to make a function callable only when the contract is not paused.

Requirements:

- The contract must not be paused._

### whenPaused

```solidity
modifier whenPaused()
```

_Modifier to make a function callable only when the contract is paused.

Requirements:

- The contract must be paused._

### _pause

```solidity
function _pause() internal virtual
```

_Triggers stopped state.

Requirements:

- The contract must not be paused._

### _unpause

```solidity
function _unpause() internal virtual
```

_Returns to normal state.

Requirements:

- The contract must be paused._

### __gap

```solidity
uint256[49] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## ERC1155Upgradeable

_Implementation of the basic standard multi-token.
See https://eips.ethereum.org/EIPS/eip-1155
Originally based on code by Enjin: https://github.com/enjin/erc-1155

_Available since v3.1.__

### _balances

```solidity
mapping(uint256 &#x3D;&gt; mapping(address &#x3D;&gt; uint256)) _balances
```

### _operatorApprovals

```solidity
mapping(address &#x3D;&gt; mapping(address &#x3D;&gt; bool)) _operatorApprovals
```

### _uri

```solidity
string _uri
```

### __ERC1155_init

```solidity
function __ERC1155_init() internal
```

_See {_setURI}._

### __ERC1155_init_unchained

```solidity
function __ERC1155_init_unchained() internal
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### uri

```solidity
function uri(uint256) public view virtual returns (string)
```

_See {IERC1155MetadataURI-uri}.

This implementation returns the same URI for *all* token types. It relies
on the token type ID substitution mechanism
https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].

Clients calling this function must replace the &#x60;\{id\}&#x60; substring with the
actual token type ID._

### balanceOf

```solidity
function balanceOf(address account, uint256 id) public view virtual returns (uint256)
```

_See {IERC1155-balanceOf}.

Requirements:

- &#x60;account&#x60; cannot be the zero address._

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) public view virtual returns (uint256[])
```

_See {IERC1155-balanceOfBatch}.

Requirements:

- &#x60;accounts&#x60; and &#x60;ids&#x60; must have the same length._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

_See {IERC1155-setApprovalForAll}._

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) public view virtual returns (bool)
```

_See {IERC1155-isApprovedForAll}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) public virtual
```

_See {IERC1155-safeTransferFrom}._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) public virtual
```

_See {IERC1155-safeBatchTransferFrom}._

### _safeTransferFrom

```solidity
function _safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Transfers &#x60;amount&#x60; tokens of token type &#x60;id&#x60; from &#x60;from&#x60; to &#x60;to&#x60;.

Emits a {TransferSingle} event.

Requirements:

- &#x60;to&#x60; cannot be the zero address.
- &#x60;from&#x60; must have a balance of tokens of type &#x60;id&#x60; of at least &#x60;amount&#x60;.
- If &#x60;to&#x60; refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### _safeBatchTransferFrom

```solidity
function _safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_safeTransferFrom}.

Emits a {TransferBatch} event.

Requirements:

- If &#x60;to&#x60; refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

### _mint

```solidity
function _mint(address to, uint256 id, uint256 amount, bytes data) internal virtual
```

_Creates &#x60;amount&#x60; tokens of token type &#x60;id&#x60;, and assigns them to &#x60;to&#x60;.

Emits a {TransferSingle} event.

Requirements:

- &#x60;to&#x60; cannot be the zero address.
- If &#x60;to&#x60; refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### _burn

```solidity
function _burn(address from, uint256 id, uint256 amount) internal virtual
```

_Destroys &#x60;amount&#x60; tokens of token type &#x60;id&#x60; from &#x60;from&#x60;

Requirements:

- &#x60;from&#x60; cannot be the zero address.
- &#x60;from&#x60; must have at least &#x60;amount&#x60; tokens of token type &#x60;id&#x60;._

### _setApprovalForAll

```solidity
function _setApprovalForAll(address owner, address operator, bool approved) internal virtual
```

_Approve &#x60;operator&#x60; to operate on all of &#x60;owner&#x60; tokens

Emits a {ApprovalForAll} event._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_Hook that is called before any token transfer. This includes minting
and burning, as well as batched variants.

The same hook is called on both single and batched variants. For single
transfers, the length of the &#x60;id&#x60; and &#x60;amount&#x60; arrays will be 1.

Calling conditions (for each &#x60;id&#x60; and &#x60;amount&#x60; pair):

- When &#x60;from&#x60; and &#x60;to&#x60; are both non-zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens
of token type &#x60;id&#x60; will be  transferred to &#x60;to&#x60;.
- When &#x60;from&#x60; is zero, &#x60;amount&#x60; tokens of token type &#x60;id&#x60; will be minted
for &#x60;to&#x60;.
- when &#x60;to&#x60; is zero, &#x60;amount&#x60; of &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens of token type &#x60;id&#x60;
will be burned.
- &#x60;from&#x60; and &#x60;to&#x60; are never both zero.
- &#x60;ids&#x60; and &#x60;amounts&#x60; have the same, non-zero length.

To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks]._

### _asSingletonArray

```solidity
function _asSingletonArray(uint256 element) private pure returns (uint256[])
```

### __gap

```solidity
uint256[47] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## IERC1155ReceiverUpgradeable

__Available since v3.1.__

### onERC1155Received

```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data) external returns (bytes4)
```

_Handles the receipt of a single ERC1155 token type. This function is
called at the end of a &#x60;safeTransferFrom&#x60; after the balance has been updated.

NOTE: To accept the transfer, this must return
&#x60;bytes4(keccak256(&quot;onERC1155Received(address,address,uint256,uint256,bytes)&quot;))&#x60;
(i.e. 0xf23a6e61, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| id | uint256 | The ID of the token being transferred |
| value | uint256 | The amount of tokens being transferred |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | &#x60;bytes4(keccak256(&quot;onERC1155Received(address,address,uint256,uint256,bytes)&quot;))&#x60; if transfer is allowed |

### onERC1155BatchReceived

```solidity
function onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data) external returns (bytes4)
```

_Handles the receipt of a multiple ERC1155 token types. This function
is called at the end of a &#x60;safeBatchTransferFrom&#x60; after the balances have
been updated.

NOTE: To accept the transfer(s), this must return
&#x60;bytes4(keccak256(&quot;onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)&quot;))&#x60;
(i.e. 0xbc197c81, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the batch transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| ids | uint256[] | An array containing ids of each token being transferred (order and length must match values array) |
| values | uint256[] | An array containing amounts of each token being transferred (order and length must match ids array) |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | &#x60;bytes4(keccak256(&quot;onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)&quot;))&#x60; if transfer is allowed |

## IERC1155Upgradeable

_Required interface of an ERC1155 compliant contract, as defined in the
https://eips.ethereum.org/EIPS/eip-1155[EIP].

_Available since v3.1.__

### TransferSingle

```solidity
event TransferSingle(address operator, address from, address to, uint256 id, uint256 value)
```

_Emitted when &#x60;value&#x60; tokens of token type &#x60;id&#x60; are transferred from &#x60;from&#x60; to &#x60;to&#x60; by &#x60;operator&#x60;._

### TransferBatch

```solidity
event TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)
```

_Equivalent to multiple {TransferSingle} events, where &#x60;operator&#x60;, &#x60;from&#x60; and &#x60;to&#x60; are the same for all
transfers._

### ApprovalForAll

```solidity
event ApprovalForAll(address account, address operator, bool approved)
```

_Emitted when &#x60;account&#x60; grants or revokes permission to &#x60;operator&#x60; to transfer their tokens, according to
&#x60;approved&#x60;._

### URI

```solidity
event URI(string value, uint256 id)
```

_Emitted when the URI for token type &#x60;id&#x60; changes to &#x60;value&#x60;, if it is a non-programmatic URI.

If an {URI} event was emitted for &#x60;id&#x60;, the standard
https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that &#x60;value&#x60; will equal the value
returned by {IERC1155MetadataURI-uri}._

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

_Returns the amount of tokens of token type &#x60;id&#x60; owned by &#x60;account&#x60;.

Requirements:

- &#x60;account&#x60; cannot be the zero address._

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.

Requirements:

- &#x60;accounts&#x60; and &#x60;ids&#x60; must have the same length._

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

_Grants or revokes permission to &#x60;operator&#x60; to transfer the caller&#x27;s tokens, according to &#x60;approved&#x60;,

Emits an {ApprovalForAll} event.

Requirements:

- &#x60;operator&#x60; cannot be the caller._

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

_Returns true if &#x60;operator&#x60; is approved to transfer &#x60;&#x60;account&#x60;&#x60;&#x27;s tokens.

See {setApprovalForAll}._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external
```

_Transfers &#x60;amount&#x60; tokens of token type &#x60;id&#x60; from &#x60;from&#x60; to &#x60;to&#x60;.

Emits a {TransferSingle} event.

Requirements:

- &#x60;to&#x60; cannot be the zero address.
- If the caller is not &#x60;from&#x60;, it must be have been approved to spend &#x60;&#x60;from&#x60;&#x60;&#x27;s tokens via {setApprovalForAll}.
- &#x60;from&#x60; must have a balance of tokens of type &#x60;id&#x60; of at least &#x60;amount&#x60;.
- If &#x60;to&#x60; refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value._

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external
```

_xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.

Emits a {TransferBatch} event.

Requirements:

- &#x60;ids&#x60; and &#x60;amounts&#x60; must have the same length.
- If &#x60;to&#x60; refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value._

## ERC1155SupplyUpgradeable

_Extension of ERC1155 that adds tracking of total supply per id.

Useful for scenarios where Fungible and Non-fungible tokens have to be
clearly identified. Note: While a totalSupply of 1 might mean the
corresponding is an NFT, there is no guarantees that no other token with the
same id are not going to be minted._

### __ERC1155Supply_init

```solidity
function __ERC1155Supply_init() internal
```

### __ERC1155Supply_init_unchained

```solidity
function __ERC1155Supply_init_unchained() internal
```

### _totalSupply

```solidity
mapping(uint256 &#x3D;&gt; uint256) _totalSupply
```

### totalSupply

```solidity
function totalSupply(uint256 id) public view virtual returns (uint256)
```

_Total amount of tokens in with a given id._

### exists

```solidity
function exists(uint256 id) public view virtual returns (bool)
```

_Indicates whether any token exist with a given id, or not._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

_See {ERC1155-_beforeTokenTransfer}._

### __gap

```solidity
uint256[49] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## IERC1155MetadataURIUpgradeable

_Interface of the optional ERC1155MetadataExtension interface, as defined
in the https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[EIP].

_Available since v3.1.__

### uri

```solidity
function uri(uint256 id) external view returns (string)
```

_Returns the URI for token type &#x60;id&#x60;.

If the &#x60;\{id\}&#x60; substring is present in the URI, it must be replaced by
clients with the actual token type ID._

## AddressUpgradeable

_Collection of functions related to the address type_

### isContract

```solidity
function isContract(address account) internal view returns (bool)
```

_Returns true if &#x60;account&#x60; is a contract.

[IMPORTANT]
&#x3D;&#x3D;&#x3D;&#x3D;
It is unsafe to assume that an address for which this function returns
false is an externally-owned account (EOA) and not a contract.

Among others, &#x60;isContract&#x60; will return false for the following
types of addresses:

 - an externally-owned account
 - a contract in construction
 - an address where a contract will be created
 - an address where a contract lived, but was destroyed
&#x3D;&#x3D;&#x3D;&#x3D;

[IMPORTANT]
&#x3D;&#x3D;&#x3D;&#x3D;
You shouldn&#x27;t rely on &#x60;isContract&#x60; to protect against flash loan attacks!

Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
constructor.
&#x3D;&#x3D;&#x3D;&#x3D;_

### sendValue

```solidity
function sendValue(address payable recipient, uint256 amount) internal
```

_Replacement for Solidity&#x27;s &#x60;transfer&#x60;: sends &#x60;amount&#x60; wei to
&#x60;recipient&#x60;, forwarding all available gas and reverting on errors.

https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
of certain opcodes, possibly making contracts go over the 2300 gas limit
imposed by &#x60;transfer&#x60;, making them unable to receive funds via
&#x60;transfer&#x60;. {sendValue} removes this limitation.

https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].

IMPORTANT: because control is transferred to &#x60;recipient&#x60;, care must be
taken to not create reentrancy vulnerabilities. Consider using
{ReentrancyGuard} or the
https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern]._

### functionCall

```solidity
function functionCall(address target, bytes data) internal returns (bytes)
```

_Performs a Solidity function call using a low level &#x60;call&#x60;. A
plain &#x60;call&#x60; is an unsafe replacement for a function call: use this
function instead.

If &#x60;target&#x60; reverts with a revert reason, it is bubbled up by this
function (like regular Solidity function calls).

Returns the raw returned data. To convert to the expected return value,
use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight&#x3D;abi.decode#abi-encoding-and-decoding-functions[&#x60;abi.decode&#x60;].

Requirements:

- &#x60;target&#x60; must be a contract.
- calling &#x60;target&#x60; with &#x60;data&#x60; must not revert.

_Available since v3.1.__

### functionCall

```solidity
function functionCall(address target, bytes data, string errorMessage) internal returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[&#x60;functionCall&#x60;], but with
&#x60;errorMessage&#x60; as a fallback revert reason when &#x60;target&#x60; reverts.

_Available since v3.1.__

### functionCallWithValue

```solidity
function functionCallWithValue(address target, bytes data, uint256 value) internal returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[&#x60;functionCall&#x60;],
but also transferring &#x60;value&#x60; wei to &#x60;target&#x60;.

Requirements:

- the calling contract must have an ETH balance of at least &#x60;value&#x60;.
- the called Solidity function must be &#x60;payable&#x60;.

_Available since v3.1.__

### functionCallWithValue

```solidity
function functionCallWithValue(address target, bytes data, uint256 value, string errorMessage) internal returns (bytes)
```

_Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[&#x60;functionCallWithValue&#x60;], but
with &#x60;errorMessage&#x60; as a fallback revert reason when &#x60;target&#x60; reverts.

_Available since v3.1.__

### functionStaticCall

```solidity
function functionStaticCall(address target, bytes data) internal view returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-}[&#x60;functionCall&#x60;],
but performing a static call.

_Available since v3.3.__

### functionStaticCall

```solidity
function functionStaticCall(address target, bytes data, string errorMessage) internal view returns (bytes)
```

_Same as {xref-Address-functionCall-address-bytes-string-}[&#x60;functionCall&#x60;],
but performing a static call.

_Available since v3.3.__

### verifyCallResult

```solidity
function verifyCallResult(bool success, bytes returndata, string errorMessage) internal pure returns (bytes)
```

_Tool to verifies that a low level call was successful, and revert if it wasn&#x27;t, either by bubbling the
revert reason using the provided one.

_Available since v4.3.__

## ContextUpgradeable

_Provides information about the current execution context, including the
sender of the transaction and its data. While these are generally available
via msg.sender and msg.data, they should not be accessed in such a direct
manner, since when dealing with meta-transactions the account sending and
paying for execution may not be the actual sender (as far as an application
is concerned).

This contract is only required for intermediate, library-like contracts._

### __Context_init

```solidity
function __Context_init() internal
```

### __Context_init_unchained

```solidity
function __Context_init_unchained() internal
```

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

### __gap

```solidity
uint256[50] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## ERC165Upgradeable

_Implementation of the {IERC165} interface.

Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
for the additional interface id that will be supported. For example:

&#x60;&#x60;&#x60;solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId &#x3D;&#x3D; type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
}
&#x60;&#x60;&#x60;

Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation._

### __ERC165_init

```solidity
function __ERC165_init() internal
```

### __ERC165_init_unchained

```solidity
function __ERC165_init_unchained() internal
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See {IERC165-supportsInterface}._

### __gap

```solidity
uint256[50] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## IERC165Upgradeable

_Interface of the ERC165 standard, as defined in the
https://eips.ethereum.org/EIPS/eip-165[EIP].

Implementers can declare support of contract interfaces, which can then be
queried by others ({ERC165Checker}).

For an implementation, see {ERC165}._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by
&#x60;interfaceId&#x60;. See the corresponding
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
to learn more about how these ids are created.

This function call must use less than 30 000 gas._

## Poip

### EventTokenMinted

```solidity
event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber)
```

### EventTokenStats

```solidity
struct EventTokenStats {
  uint256 _tokenMints;
  uint256 _tokenLimit;
}
```

### _MAX_TOKENS_PER_EVENT

```solidity
uint256 _MAX_TOKENS_PER_EVENT
```

### _eventTokenStats

```solidity
mapping(uint256 &#x3D;&gt; struct Poip.EventTokenStats) _eventTokenStats
```

### initialize

```solidity
function initialize(address owner) external
```

### pause

```solidity
function pause() external
```

### unpause

```solidity
function unpause() external
```

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_See {ERC1155-_beforeTokenTransfer}.
No token transfers when contract is paused_

### createEvent

```solidity
function createEvent(uint256 tokenLimit, string tokenURI, bytes32[] chipIds, uint64 startTime, uint64 finishTime) external
```

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

### _maxTokensMinted

```solidity
function _maxTokensMinted(uint256 eventId) internal view returns (bool)
```

### mint

```solidity
function mint(uint256 eventId, bytes32 chipId, address to, bytes32 blockHash, bytes signature) external
```

### ______gap

```solidity
uint256[48] ______gap
```

## PoipEvent

Event handling contract

### EventCreation

```solidity
event EventCreation(address creator, uint256 eventId)
```

### EventChipIds

```solidity
struct EventChipIds {
  bytes32[] _chipIds;
  mapping(bytes32 &#x3D;&gt; uint256) _chipIdIndexes;
}
```

### EventTimeWindow

```solidity
struct EventTimeWindow {
  uint64 _start;
  uint64 _finish;
}
```

### _MAX_CHIPS_PER_EVENT

```solidity
uint256 _MAX_CHIPS_PER_EVENT
```

### _DEFAULT_BLOCK_RECENCY_WINDOW

```solidity
uint256 _DEFAULT_BLOCK_RECENCY_WINDOW
```

### _eventCount

```solidity
uint256 _eventCount
```

### _eventCreators

```solidity
mapping(uint256 &#x3D;&gt; address) _eventCreators
```

### _eventURIs

```solidity
mapping(uint256 &#x3D;&gt; string) _eventURIs
```

### _eventChipIds

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventChipIds) _eventChipIds
```

### _eventTimeWindows

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventTimeWindow) _eventTimeWindows
```

### _creatorEventList

```solidity
mapping(address &#x3D;&gt; uint256[]) _creatorEventList
```

### _eventCreatorIndex

```solidity
mapping(uint256 &#x3D;&gt; uint256) _eventCreatorIndex
```

### __PoipEvent_init

```solidity
function __PoipEvent_init() internal
```

### __PoipEvent_init_unchained

```solidity
function __PoipEvent_init_unchained() internal
```

### _setEventChipIds

```solidity
function _setEventChipIds(uint256 eventId, bytes32[] chipIds) internal
```

### eventNumberOfChips

```solidity
function eventNumberOfChips(uint256 eventId) public view returns (uint256)
```

### eventChipIdByIndex

```solidity
function eventChipIdByIndex(uint256 eventId, uint256 index) public view returns (bytes32)
```

### eventHasChipId

```solidity
function eventHasChipId(uint256 eventId, bytes32 chipId) public view returns (bool)
```

### eventIsValidChipSignature

```solidity
function eventIsValidChipSignature(uint256 eventId, bytes32 chipId, bytes32 hash, bytes signature) public view returns (bool)
```

### _setEventTimeWindow

```solidity
function _setEventTimeWindow(uint256 eventId, uint64 start, uint64 finish) internal
```

### eventStart

```solidity
function eventStart(uint256 eventId) public view returns (uint64)
```

### eventFinish

```solidity
function eventFinish(uint256 eventId) public view returns (uint64)
```

### eventIsLive

```solidity
function eventIsLive(uint256 eventId) public view returns (bool)
```

### onlyLiveEvent

```solidity
modifier onlyLiveEvent(uint256 eventId)
```

### numberOfEventsByCreator

```solidity
function numberOfEventsByCreator(address creator) public view returns (uint256)
```

### eventOfCreatorByIndex

```solidity
function eventOfCreatorByIndex(address creator, uint256 index) public view returns (uint256)
```

### _addEventCreation

```solidity
function _addEventCreation(address creator, uint256 eventId) internal
```

### isRecentBlockHash

```solidity
function isRecentBlockHash(bytes32 blockHash) public view returns (bool)
```

### eventCreator

```solidity
function eventCreator(uint256 eventId) public view returns (address)
```

### _eventURI

```solidity
function _eventURI(uint256 eventId) internal view returns (string)
```

### _eventExists

```solidity
function _eventExists(uint256 eventId) internal view returns (bool)
```

### _nextEventId

```solidity
function _nextEventId() internal view returns (uint256)
```

### _createEvent

```solidity
function _createEvent(bytes32[] chipIds, string eventURI, uint64 startTime, uint64 finishTime) internal
```

### ______gap

```solidity
uint256[41] ______gap
```

## PoipEventSampleUpgrade

Event handling contract

### EventCreation

```solidity
event EventCreation(address creator, uint256 eventId)
```

### EventChipIds

```solidity
struct EventChipIds {
  bytes32[] _chipIds;
  mapping(bytes32 &#x3D;&gt; uint256) _chipIdIndexes;
}
```

### EventTimeWindow

```solidity
struct EventTimeWindow {
  uint64 _start;
  uint64 _finish;
}
```

### _MAX_CHIPS_PER_EVENT

```solidity
uint256 _MAX_CHIPS_PER_EVENT
```

### _DEFAULT_BLOCK_RECENCY_WINDOW

```solidity
uint256 _DEFAULT_BLOCK_RECENCY_WINDOW
```

### _eventCount

```solidity
uint256 _eventCount
```

### _eventCreators

```solidity
mapping(uint256 &#x3D;&gt; address) _eventCreators
```

### _eventURIs

```solidity
mapping(uint256 &#x3D;&gt; string) _eventURIs
```

### _eventChipIds

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEventSampleUpgrade.EventChipIds) _eventChipIds
```

### _eventTimeWindows

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEventSampleUpgrade.EventTimeWindow) _eventTimeWindows
```

### _creatorEventList

```solidity
mapping(address &#x3D;&gt; uint256[]) _creatorEventList
```

### _eventCreatorIndex

```solidity
mapping(uint256 &#x3D;&gt; uint256) _eventCreatorIndex
```

### __PoipEvent_init

```solidity
function __PoipEvent_init() internal
```

### __PoipEvent_init_unchained

```solidity
function __PoipEvent_init_unchained() internal
```

### _setEventChipIds

```solidity
function _setEventChipIds(uint256 eventId, bytes32[] chipIds) internal
```

### eventNumberOfChips

```solidity
function eventNumberOfChips(uint256 eventId) public view returns (uint256)
```

### eventChipIdByIndex

```solidity
function eventChipIdByIndex(uint256 eventId, uint256 index) public view returns (bytes32)
```

### eventHasChipId

```solidity
function eventHasChipId(uint256 eventId, bytes32 chipId) public view returns (bool)
```

### eventIsValidChipSignature

```solidity
function eventIsValidChipSignature(uint256 eventId, bytes32 chipId, bytes32 hash, bytes signature) public view returns (bool)
```

### _setEventTimeWindow

```solidity
function _setEventTimeWindow(uint256 eventId, uint64 start, uint64 finish) internal
```

### eventStart

```solidity
function eventStart(uint256 eventId) public view returns (uint64)
```

### eventFinish

```solidity
function eventFinish(uint256 eventId) public view returns (uint64)
```

### eventIsLive

```solidity
function eventIsLive(uint256 eventId) public view returns (bool)
```

### onlyLiveEvent

```solidity
modifier onlyLiveEvent(uint256 eventId)
```

### numberOfEventsByCreator

```solidity
function numberOfEventsByCreator(address creator) public view returns (uint256)
```

### eventOfCreatorByIndex

```solidity
function eventOfCreatorByIndex(address creator, uint256 index) public view returns (uint256)
```

### _addEventCreation

```solidity
function _addEventCreation(address creator, uint256 eventId) internal
```

### isRecentBlockHash

```solidity
function isRecentBlockHash(bytes32 blockHash) public view returns (bool)
```

### eventCreator

```solidity
function eventCreator(uint256 eventId) public view returns (address)
```

### _eventURI

```solidity
function _eventURI(uint256 eventId) internal view returns (string)
```

### _eventExists

```solidity
function _eventExists(uint256 eventId) internal view returns (bool)
```

### _nextEventId

```solidity
function _nextEventId() internal view returns (uint256)
```

### _createEvent

```solidity
function _createEvent(bytes32[] chipIds, string eventURI, uint64 startTime, uint64 finishTime) internal
```

### ______gap

```solidity
uint256[41] ______gap
```

## PoipSampleUpgrade

### EventTokenMinted

```solidity
event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber)
```

### EventTokenStats

```solidity
struct EventTokenStats {
  uint256 _tokenMints;
  uint256 _tokenLimit;
}
```

### _MAX_TOKENS_PER_EVENT

```solidity
uint256 _MAX_TOKENS_PER_EVENT
```

### _eventTokenStats

```solidity
mapping(uint256 &#x3D;&gt; struct PoipSampleUpgrade.EventTokenStats) _eventTokenStats
```

### initialize

```solidity
function initialize(address owner) external
```

### pause

```solidity
function pause() external
```

### unpause

```solidity
function unpause() external
```

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_See {ERC1155-_beforeTokenTransfer}.
No token transfers when contract is paused_

### createEvent

```solidity
function createEvent(uint256 tokenLimit, string tokenURI, bytes32[] chipIds, uint64 startTime, uint64 finishTime) external
```

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

### _maxTokensMinted

```solidity
function _maxTokensMinted(uint256 eventId) internal view returns (bool)
```

### mint

```solidity
function mint(uint256 eventId, bytes32 chipId, address to, bytes32 blockHash, bytes signature) external
```

### ______gap

```solidity
uint256[48] ______gap
```

## ContextUpgradeable

_Provides information about the current execution context, including the
sender of the transaction and its data. While these are generally available
via msg.sender and msg.data, they should not be accessed in such a direct
manner, since when dealing with meta-transactions the account sending and
paying for execution may not be the actual sender (as far as an application
is concerned).

This contract is only required for intermediate, library-like contracts._

### __Context_init

```solidity
function __Context_init() internal
```

### __Context_init_unchained

```solidity
function __Context_init_unchained() internal
```

### _msgSender

```solidity
function _msgSender() internal view virtual returns (address)
```

### _msgData

```solidity
function _msgData() internal view virtual returns (bytes)
```

### _msgValue

```solidity
function _msgValue() internal view virtual returns (uint256)
```

### __gap

```solidity
uint256[50] __gap
```

_This empty reserved space is put in place to allow future versions to add new
variables without shifting down storage in the inheritance chain.
See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps_

## Poip

### EventTokenMinted

```solidity
event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber)
```

### EventTokenStats

```solidity
struct EventTokenStats {
  uint256 _tokenMints;
  uint256 _tokenLimit;
}
```

### _MAX_TOKENS_PER_EVENT

```solidity
uint256 _MAX_TOKENS_PER_EVENT
```

### _eventTokenStats

```solidity
mapping(uint256 &#x3D;&gt; struct Poip.EventTokenStats) _eventTokenStats
```

### initialize

```solidity
function initialize(address owner) external
```

### pause

```solidity
function pause() external
```

### unpause

```solidity
function unpause() external
```

### transferFunds

```solidity
function transferFunds(address payable to, uint256 amount) external
```

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external
```

### eventTokenLimit

```solidity
function eventTokenLimit(uint256 eventId) external view returns (uint256)
```

### eventTokensMinted

```solidity
function eventTokensMinted(uint256 eventId) external view returns (uint256)
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_See {ERC1155-_beforeTokenTransfer}.
No token transfers when contract is paused_

### createEvent

```solidity
function createEvent(uint256 tokenLimit, string tokenURI, bytes32[] chipIds, uint64 startTime, uint64 finishTime) external payable
```

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

### _maxTokensMinted

```solidity
function _maxTokensMinted(uint256 eventId) internal view returns (bool)
```

### mint

```solidity
function mint(uint256 eventId, bytes32 chipId, address to, bytes32 blockHash, bytes signature) external
```

### ______gap

```solidity
uint256[48] ______gap
```

## PoipEvent

Event handling contract

### EventCreation

```solidity
event EventCreation(address creator, uint256 eventId)
```

### EventChipIds

```solidity
struct EventChipIds {
  bytes32[] _chipIds;
  mapping(bytes32 &#x3D;&gt; uint256) _chipIdIndexes;
}
```

### EventTimeWindow

```solidity
struct EventTimeWindow {
  uint64 _start;
  uint64 _finish;
}
```

### _MAX_CHIPS_PER_EVENT

```solidity
uint256 _MAX_CHIPS_PER_EVENT
```

### _DEFAULT_BLOCK_RECENCY_WINDOW

```solidity
uint256 _DEFAULT_BLOCK_RECENCY_WINDOW
```

### _eventCount

```solidity
uint256 _eventCount
```

### _eventCreators

```solidity
mapping(uint256 &#x3D;&gt; address) _eventCreators
```

### _eventURIs

```solidity
mapping(uint256 &#x3D;&gt; string) _eventURIs
```

### _eventChipIds

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventChipIds) _eventChipIds
```

### _eventTimeWindows

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventTimeWindow) _eventTimeWindows
```

### _creatorEventList

```solidity
mapping(address &#x3D;&gt; uint256[]) _creatorEventList
```

### _eventCreatorIndex

```solidity
mapping(uint256 &#x3D;&gt; uint256) _eventCreatorIndex
```

### __PoipEvent_init

```solidity
function __PoipEvent_init() internal
```

### __PoipEvent_init_unchained

```solidity
function __PoipEvent_init_unchained() internal
```

### _setEventChipIds

```solidity
function _setEventChipIds(uint256 eventId, bytes32[] chipIds) internal
```

### eventNumberOfChips

```solidity
function eventNumberOfChips(uint256 eventId) public view returns (uint256)
```

### eventChipIdByIndex

```solidity
function eventChipIdByIndex(uint256 eventId, uint256 index) public view returns (bytes32)
```

### eventHasChipId

```solidity
function eventHasChipId(uint256 eventId, bytes32 chipId) public view returns (bool)
```

### _eventIsValidChipSignature

```solidity
function _eventIsValidChipSignature(uint256 eventId, bytes32 chipId, bytes32 hash, bytes signature) internal view returns (bool)
```

### _setEventTimeWindow

```solidity
function _setEventTimeWindow(uint256 eventId, uint64 start, uint64 finish) internal
```

### eventStart

```solidity
function eventStart(uint256 eventId) public view returns (uint64)
```

### eventFinish

```solidity
function eventFinish(uint256 eventId) public view returns (uint64)
```

### eventIsLive

```solidity
function eventIsLive(uint256 eventId) public view returns (bool)
```

### onlyLiveEvent

```solidity
modifier onlyLiveEvent(uint256 eventId)
```

### numberOfEventsByCreator

```solidity
function numberOfEventsByCreator(address creator) public view returns (uint256)
```

### eventOfCreatorByIndex

```solidity
function eventOfCreatorByIndex(address creator, uint256 index) public view returns (uint256)
```

### _addEventCreation

```solidity
function _addEventCreation(address creator, uint256 eventId) internal
```

### _isRecentBlockHash

```solidity
function _isRecentBlockHash(bytes32 blockHash) internal view returns (bool)
```

### eventCreator

```solidity
function eventCreator(uint256 eventId) public view returns (address)
```

### _eventURI

```solidity
function _eventURI(uint256 eventId) internal view returns (string)
```

### _eventExists

```solidity
function _eventExists(uint256 eventId) internal view returns (bool)
```

### totalEvents

```solidity
function totalEvents() public view returns (uint256)
```

### _createEvent

```solidity
function _createEvent(bytes32[] chipIds, string eventURI, uint64 startTime, uint64 finishTime) internal
```

### ______gap

```solidity
uint256[41] ______gap
```

## PoipEventSampleUpgrade

Event handling contract

### EventCreation

```solidity
event EventCreation(address creator, uint256 eventId)
```

### EventChipIds

```solidity
struct EventChipIds {
  bytes32[] _chipIds;
  mapping(bytes32 &#x3D;&gt; uint256) _chipIdIndexes;
}
```

### EventTimeWindow

```solidity
struct EventTimeWindow {
  uint64 _start;
  uint64 _finish;
}
```

### _MAX_CHIPS_PER_EVENT

```solidity
uint256 _MAX_CHIPS_PER_EVENT
```

### _DEFAULT_BLOCK_RECENCY_WINDOW

```solidity
uint256 _DEFAULT_BLOCK_RECENCY_WINDOW
```

### _eventCount

```solidity
uint256 _eventCount
```

### _eventCreators

```solidity
mapping(uint256 &#x3D;&gt; address) _eventCreators
```

### _eventURIs

```solidity
mapping(uint256 &#x3D;&gt; string) _eventURIs
```

### _eventChipIds

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEventSampleUpgrade.EventChipIds) _eventChipIds
```

### _eventTimeWindows

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEventSampleUpgrade.EventTimeWindow) _eventTimeWindows
```

### _creatorEventList

```solidity
mapping(address &#x3D;&gt; uint256[]) _creatorEventList
```

### _eventCreatorIndex

```solidity
mapping(uint256 &#x3D;&gt; uint256) _eventCreatorIndex
```

### __PoipEvent_init

```solidity
function __PoipEvent_init() internal
```

### __PoipEvent_init_unchained

```solidity
function __PoipEvent_init_unchained() internal
```

### _setEventChipIds

```solidity
function _setEventChipIds(uint256 eventId, bytes32[] chipIds) internal
```

### eventNumberOfChips

```solidity
function eventNumberOfChips(uint256 eventId) public view returns (uint256)
```

### eventChipIdByIndex

```solidity
function eventChipIdByIndex(uint256 eventId, uint256 index) public view returns (bytes32)
```

### eventHasChipId

```solidity
function eventHasChipId(uint256 eventId, bytes32 chipId) public view returns (bool)
```

### eventIsValidChipSignature

```solidity
function eventIsValidChipSignature(uint256 eventId, bytes32 chipId, bytes32 hash, bytes signature) public view returns (bool)
```

### _setEventTimeWindow

```solidity
function _setEventTimeWindow(uint256 eventId, uint64 start, uint64 finish) internal
```

### eventStart

```solidity
function eventStart(uint256 eventId) public view returns (uint64)
```

### eventFinish

```solidity
function eventFinish(uint256 eventId) public view returns (uint64)
```

### eventIsLive

```solidity
function eventIsLive(uint256 eventId) public view returns (bool)
```

### onlyLiveEvent

```solidity
modifier onlyLiveEvent(uint256 eventId)
```

### numberOfEventsByCreator

```solidity
function numberOfEventsByCreator(address creator) public view returns (uint256)
```

### eventOfCreatorByIndex

```solidity
function eventOfCreatorByIndex(address creator, uint256 index) public view returns (uint256)
```

### _addEventCreation

```solidity
function _addEventCreation(address creator, uint256 eventId) internal
```

### isRecentBlockHash

```solidity
function isRecentBlockHash(bytes32 blockHash) public view returns (bool)
```

### eventCreator

```solidity
function eventCreator(uint256 eventId) public view returns (address)
```

### _eventURI

```solidity
function _eventURI(uint256 eventId) internal view returns (string)
```

### _eventExists

```solidity
function _eventExists(uint256 eventId) internal view returns (bool)
```

### _nextEventId

```solidity
function _nextEventId() internal view returns (uint256)
```

### _createEvent

```solidity
function _createEvent(bytes32[] chipIds, string eventURI, uint64 startTime, uint64 finishTime) internal
```

### ______gap

```solidity
uint256[41] ______gap
```

## PoipSampleUpgrade

### EventTokenMinted

```solidity
event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber)
```

### EventTokenStats

```solidity
struct EventTokenStats {
  uint256 _tokenMints;
  uint256 _tokenLimit;
}
```

### _MAX_TOKENS_PER_EVENT

```solidity
uint256 _MAX_TOKENS_PER_EVENT
```

### _eventFee

```solidity
uint256 _eventFee
```

### _eventTokenStats

```solidity
mapping(uint256 &#x3D;&gt; struct PoipSampleUpgrade.EventTokenStats) _eventTokenStats
```

### initialize

```solidity
function initialize(address owner) external
```

### pause

```solidity
function pause() external
```

### unpause

```solidity
function unpause() external
```

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_See {ERC1155-_beforeTokenTransfer}.
No token transfers when contract is paused_

### createEvent

```solidity
function createEvent(uint256 tokenLimit, string tokenURI, bytes32[] chipIds, uint64 startTime, uint64 finishTime) external
```

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

### _maxTokensMinted

```solidity
function _maxTokensMinted(uint256 eventId) internal view returns (bool)
```

### mint

```solidity
function mint(uint256 eventId, bytes32 chipId, address to, bytes32 blockHash, bytes signature) external
```

### ______gap

```solidity
uint256[48] ______gap
```

## Poip

Proof of Interaction Protocol (POIP) 
The protocol offers digital tokens as proof of interaction (POI) with a secure smart-tag
A POI requires a recent signature from a secure smart-tag validating interaction and recency
If the smart-tag is in a specific location, it also validates proof of location 
The representation of the POI is determined by the event creator and event
For example, an art exhibition event POI may represent viewing of an artwork

### EventTokenMinted

```solidity
event EventTokenMinted(uint256 eventId, address from, address to, uint256 tokenNumber)
```

Indicates a POI was redeemed for &#x60;eventId&#x60; by address &#x60;to&#x60;

### EventTokenStats

```solidity
struct EventTokenStats {
  uint256 _tokenMints;
  uint256 _tokenLimit;
}
```

### _MAX_TOKENS_PER_EVENT

```solidity
uint256 _MAX_TOKENS_PER_EVENT
```

The maximum supported tokens per event

### _eventFee

```solidity
uint256 _eventFee
```

The cost of event creation for POIP

### _eventTokenStats

```solidity
mapping(uint256 &#x3D;&gt; struct Poip.EventTokenStats) _eventTokenStats
```

### initialize

```solidity
function initialize(address owner) external
```

Initializes the POIP contract and inherited contracts
    Default Values:
      max tokens per event: 1 Million
      cost of event creation: 15 tokens

### pause

```solidity
function pause() external
```

Owner can pause

### unpause

```solidity
function unpause() external
```

Owner can unpause

### getEventFee

```solidity
function getEventFee() external view returns (uint256)
```

returns the cost of event creation

### setEventFee

```solidity
function setEventFee(uint256 fee) external
```

sets the cost of event creation

### transferFunds

```solidity
function transferFunds(address payable to, uint256 amount) external
```

owner can retrieve funds

### burn

```solidity
function burn(address account, uint256 id, uint256 value) external
```

token owner / approved can burn a token

### eventTokenLimit

```solidity
function eventTokenLimit(uint256 eventId) external view returns (uint256)
```

returns the POI limit for the event

### eventTokensMinted

```solidity
function eventTokensMinted(uint256 eventId) external view returns (uint256)
```

returns the number of POIs minted for the event
mintedTokens !&#x3D; eventTokens as tokens may be burned

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_See {ERC1155-_beforeTokenTransfer}.
No token transfers when contract is paused_

### createEvent

```solidity
function createEvent(uint256 tokenLimit, string tokenURI, bytes32[] chipIds, uint64 startTime, uint64 finishTime) external payable
```

Creates a POIP event

### uri

```solidity
function uri(uint256 id) public view virtual returns (string)
```

returns the URI for the event

### _maxTokensMinted

```solidity
function _maxTokensMinted(uint256 eventId) internal view returns (bool)
```

returns if max tokens are minted

### mint

```solidity
function mint(uint256 eventId, bytes32 chipId, address to, bytes32 blockHash, bytes signature) external
```

mints a POI for an event
validates that signature is from a POI device and the blockhash is recent

### ______gap

```solidity
uint256[48] ______gap
```

## PoipEvent

PoipEvent contract to handle all the event specific logic

### EventCreation

```solidity
event EventCreation(address creator, uint256 eventId)
```

### EventChipIds

```solidity
struct EventChipIds {
  bytes32[] _chipIds;
  mapping(bytes32 &#x3D;&gt; uint256) _chipIdIndexes;
}
```

### EventTimeWindow

```solidity
struct EventTimeWindow {
  uint64 _start;
  uint64 _finish;
}
```

### _MAX_CHIPS_PER_EVENT

```solidity
uint256 _MAX_CHIPS_PER_EVENT
```

### _DEFAULT_BLOCK_RECENCY_WINDOW

```solidity
uint256 _DEFAULT_BLOCK_RECENCY_WINDOW
```

### _eventCount

```solidity
uint256 _eventCount
```

### _eventCreators

```solidity
mapping(uint256 &#x3D;&gt; address) _eventCreators
```

### _eventURIs

```solidity
mapping(uint256 &#x3D;&gt; string) _eventURIs
```

### _eventChipIds

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventChipIds) _eventChipIds
```

### _eventTimeWindows

```solidity
mapping(uint256 &#x3D;&gt; struct PoipEvent.EventTimeWindow) _eventTimeWindows
```

### _creatorEventList

```solidity
mapping(address &#x3D;&gt; uint256[]) _creatorEventList
```

### _eventCreatorIndex

```solidity
mapping(uint256 &#x3D;&gt; uint256) _eventCreatorIndex
```

### __PoipEvent_init

```solidity
function __PoipEvent_init() internal
```

### __PoipEvent_init_unchained

```solidity
function __PoipEvent_init_unchained() internal
```

### _setEventChipIds

```solidity
function _setEventChipIds(uint256 eventId, bytes32[] chipIds) internal
```

### eventNumberOfChips

```solidity
function eventNumberOfChips(uint256 eventId) public view returns (uint256)
```

### eventChipIdByIndex

```solidity
function eventChipIdByIndex(uint256 eventId, uint256 index) public view returns (bytes32)
```

### eventHasChipId

```solidity
function eventHasChipId(uint256 eventId, bytes32 chipId) public view returns (bool)
```

### _eventIsValidChipSignature

```solidity
function _eventIsValidChipSignature(uint256 eventId, bytes32 chipId, bytes32 hash, bytes signature) internal view returns (bool)
```

### _setEventTimeWindow

```solidity
function _setEventTimeWindow(uint256 eventId, uint64 start, uint64 finish) internal
```

### eventStart

```solidity
function eventStart(uint256 eventId) public view returns (uint64)
```

### eventFinish

```solidity
function eventFinish(uint256 eventId) public view returns (uint64)
```

### eventIsLive

```solidity
function eventIsLive(uint256 eventId) public view returns (bool)
```

### onlyLiveEvent

```solidity
modifier onlyLiveEvent(uint256 eventId)
```

### numberOfEventsByCreator

```solidity
function numberOfEventsByCreator(address creator) public view returns (uint256)
```

### eventOfCreatorByIndex

```solidity
function eventOfCreatorByIndex(address creator, uint256 index) public view returns (uint256)
```

### _addEventCreation

```solidity
function _addEventCreation(address creator, uint256 eventId) internal
```

### _isRecentBlockHash

```solidity
function _isRecentBlockHash(bytes32 blockHash) internal view returns (bool)
```

### eventCreator

```solidity
function eventCreator(uint256 eventId) public view returns (address)
```

### _eventURI

```solidity
function _eventURI(uint256 eventId) internal view returns (string)
```

### _eventExists

```solidity
function _eventExists(uint256 eventId) internal view returns (bool)
```

### totalEvents

```solidity
function totalEvents() public view returns (uint256)
```

### _createEvent

```solidity
function _createEvent(bytes32[] chipIds, string eventURI, uint64 startTime, uint64 finishTime) internal
```

### ______gap

```solidity
uint256[41] ______gap
```

