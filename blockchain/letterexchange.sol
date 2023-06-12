// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract LetterExchange {
    struct Letter {
        address sender;
        address receiver;
        string contentId;
    }

    Letter[] private letters;

    mapping (uint256 => address) letterToOwner;

    function sendLetter(address _receiver, string memory _contentId) external returns (uint256) {
        letters.push(Letter(msg.sender, _receiver, _contentId));

        uint letterId = letters.length - 1;
        letterToOwner[letterId] = msg.sender;

        return letterId;
    }

    function receiveLetter(uint256 _letterId) external {
        require (msg.sender != letterToOwner[_letterId]);
        require (msg.sender == letters[_letterId].receiver);

        letterToOwner[_letterId] = msg.sender;
    }

    function getLetter(uint256 _letterId) public view returns (Letter memory) {
        require (msg.sender == letterToOwner[_letterId]);

        return letters[_letterId];
    }
}
