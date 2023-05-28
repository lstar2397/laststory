// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LetterExchange {
    struct Letter {
        string contentIpfsUrl;
        address sender;
        address receiver;
        uint publicationDate;
    }

    Letter[] internal letters;
    mapping (uint => address) letterToOwner;

    function createLetter(string memory _contentIpfsUrl, address _receiver, uint _publicationDate) public {
        letters.push(Letter({
            contentIpfsUrl: _contentIpfsUrl,
            sender: msg.sender,
            receiver: _receiver,
            publicationDate: _publicationDate
        }));

        uint letterId = letters.length - 1;
        letterToOwner[letterId] = msg.sender;
    }

    function getLetter(uint _letterId) external view returns (string memory, address, address) {
        Letter memory letter = letters[_letterId];

        require (letter.sender == msg.sender || 
                letterToOwner[_letterId] == msg.sender);

        return (letter.contentIpfsUrl,
                letter.sender,
                letter.receiver);
    }

    function _getCountBySender() internal view returns (uint) {
        uint count = 0;

        for (uint i = 0; i < letters.length; i++) {
            if (letters[i].sender == msg.sender) {
                count++;
            }
        }

        return count;
    }

    function getLettersBySender() external view returns (uint[] memory) {
        uint[] memory result = new uint[](_getCountBySender());

        uint j = 0;
        for (uint i = 0; i < letters.length; i++) {
            if (letters[i].sender == msg.sender) {
                result[j] = i;
                j++;
            }
        }

        return result;
    }

    function _getCountByReceiver() internal view returns (uint) {
        uint count = 0;

        for (uint i = 0; i < letters.length; i++) {
            if (letters[i].receiver == msg.sender &&
                letters[i].publicationDate >= block.timestamp) {
                count++;
            }
        }

        return count;
    }

    function getLettersByReceiver() external view returns (uint[] memory) {
        uint[] memory result = new uint[](_getCountByReceiver());

        uint j = 0;
        for (uint i = 0; i < letters.length; i++) {
            if (letters[i].receiver == msg.sender &&
                letters[i].publicationDate >= block.timestamp) {
                result[j] = i;
                j++;
            }
        }

        return result;
    }
}