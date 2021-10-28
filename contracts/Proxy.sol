//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Proxy -> Protocol
// Proxy -> ProtocolV2

contract Proxy {
    uint public num = 100;
    address protocol;

    constructor(address _protocol) {
        protocol = _protocol;
    }

    fallback() external {
      address _impl = protocol;
      assembly {
        let ptr := mload(0x40)

        // (1) copy incoming call data
        calldatacopy(ptr, 0, calldatasize())

        // (2) forward call to logic contract
        let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
        let size := returndatasize()

        // (3) retrieve return data
        returndatacopy(ptr, 0, size)

        // (4) forward return data back to caller
        switch result
        case 0 { revert(ptr, size) }
        default { return(ptr, size) }
      }
    }

    function upgrade(address _protocol) external {
        // 1. SECURITY!
        protocol = _protocol;
    }
}
