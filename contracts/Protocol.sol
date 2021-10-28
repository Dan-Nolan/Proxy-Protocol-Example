//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Protocol {
    uint public num = 100; // 0

    function action(uint _num) public {
        num = _num; // <-- change the number
    }
}
