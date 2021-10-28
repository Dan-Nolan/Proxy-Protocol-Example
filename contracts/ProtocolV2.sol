//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ProtocolV2 {
    uint public num = 100; // <-- get this number

    function action(uint _num) public {
        num = _num * 100;
    }

    function action2() public {
       num *= 2;
    }
}
