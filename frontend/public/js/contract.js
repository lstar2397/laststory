const CONTRACT_ADDRESS = "0x66983a152D7f3ec713810f2DD79634E9bE6ba446";
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_publicationDate",
				"type": "uint256"
			}
		],
		"name": "LetterSent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_letterId",
				"type": "uint256"
			}
		],
		"name": "getLetterData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "contentId",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "publicationDate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "notificationSent",
						"type": "bool"
					}
				],
				"internalType": "struct LetterExchange.Letter",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLetterPacketsByReceiver",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "letterId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "publicationDate",
						"type": "uint256"
					}
				],
				"internalType": "struct LetterExchange.LetterPacket[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_letterId",
				"type": "uint256"
			}
		],
		"name": "isLetterOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_letterId",
				"type": "uint256"
			}
		],
		"name": "isLetterReceiver",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_letterId",
				"type": "uint256"
			}
		],
		"name": "receiveLetter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_contentId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_publicationDate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_notificationSent",
				"type": "bool"
			}
		],
		"name": "sendLetter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let userAccount;
let provider;
let contract;
let web3;

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Account changed to none");
  } else if (accounts[0] !== userAccount) {
    console.log("Account changed!")
    console.log(`old account: ${userAccount}, new account: ${accounts[0]}`);
    userAccount = accounts[0];
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let provider;

  if (window.ethereum) {
    provider = window.ethereum;
    web3 = new Web3(provider);

    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      handleAccountsChanged(accounts);

      provider.on("accountsChanged", handleAccountsChanged);
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    } catch (error) {
      console.error("User denied account access");
      console.error(error);
    }
  } else {
    console.log("Metamask를 찾을 수 없습니다.");
  }
});

function sendLetter(receiver, contentId, publicationDate, notificationSent) {
  return contract.methods.sendLetter(receiver, contentId, publicationDate, notificationSent).send({ from: userAccount });
}

function receiveLetter(letterId) {
  return contract.methods.receiveLetter(letterId).send({ from: userAccount });
}

function getLetterData(letterId) {
  return contract.methods.getLetterData(letterId).call({ from: userAccount });
}

function getLetterPacketsByReceiver() {
  return contract.methods.getLetterPacketsByReceiver().call({ from: userAccount });
}

function isLetterOwner(letterId) {
  return contract.methods.isLetterOwner(letterId).call({ from: userAccount });
}

function isLetterReceiver(letterId) {
  return contract.methods.isLetterReceiver(letterId).call({ from: userAccount });
}