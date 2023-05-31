// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract LetterExchange {
    struct Letter {
        address sender;
        address receiver;
        string contentIdentifier;
    }

    Letter[] public letters;
    mapping (uint256 => address) letterToOwner;

    function send(address _receiver, string memory _contentIdentifier) external returns (uint256) {
        Letter memory letter = Letter(msg.sender, _receiver, _contentIdentifier);
        letters.push(letter);
        uint256 letterId = letters.length - 1;
        letterToOwner[letterId] = msg.sender;

        return letterId;
    }

    function get(uint256 _letterId) public returns (address, address, string memory) {
        require(_letterId < letters.length);
        require(letterToOwner[_letterId] == msg.sender);

        Letter memory letter = letters[_letterId];
        return (letter.sender, letter.receiver, letter.contentIdentifier);
    }
}