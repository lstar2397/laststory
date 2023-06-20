// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract LetterExchange {
    struct Letter {
        address sender;
        address receiver;
        string contentId;
        uint publicationDate;
        bool notificationSent;
    }

    struct LetterPacket {
        uint256 letterId;
        address sender;
        address receiver;
        uint publicationDate;
    }

    Letter[] private letters;

    mapping (uint256 => address) letterToOwner;

    event LetterSent(address indexed _sender, address indexed _receiver, uint _publicationDate);

    function sendLetter(address _receiver, string memory _contentId, uint _publicationDate, bool _notificationSent) external returns (uint256) {
        letters.push(Letter(msg.sender, _receiver, _contentId, _publicationDate, _notificationSent));

        uint letterId = letters.length - 1;
        letterToOwner[letterId] = msg.sender;

        if (_notificationSent) {
            emit LetterSent(msg.sender, _receiver, _publicationDate);
        }

        return letterId;
    }

    function isLetterOwner(uint256 _letterId) external view returns (bool) {
        return letterToOwner[_letterId] == msg.sender;
    }

    function isLetterReceiver(uint256 _letterId) external view returns (bool) {
        return letters[_letterId].receiver == msg.sender;
    }

    function receiveLetter(uint256 _letterId) external {
        require (msg.sender != letterToOwner[_letterId]);
        require (msg.sender == letters[_letterId].receiver);
        require (block.timestamp >= letters[_letterId].publicationDate);

        letterToOwner[_letterId] = msg.sender;
    }

    function getLetterData(uint256 _letterId) public view returns (Letter memory) {
        require (msg.sender == letterToOwner[_letterId] || msg.sender == letters[_letterId].sender);
        require (block.timestamp >= letters[_letterId].publicationDate);

        return letters[_letterId];
    }

    function getLetterPacketCountByReceiver() internal view returns (uint256) {
        uint256 counter = 0;

        for (uint256 i = 0; i < letters.length; i++) {
            if (letters[i].receiver == msg.sender) {
                counter++;
            }
        }

        return counter;
    }

    function getLetterPacketsByReceiver() public view returns (LetterPacket[] memory) {
        uint letterCount = getLetterPacketCountByReceiver();
        LetterPacket[] memory result = new LetterPacket[](letterCount);
        uint counter = 0;

        for (uint i = 0; i < letters.length; i++) {
            if (letters[i].receiver == msg.sender) {
                result[counter] = LetterPacket(i, letters[i].sender, letters[i].receiver, letters[i].publicationDate);
                counter++;
            }
        }

        return result;
    }
}
