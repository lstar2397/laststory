const CONTRACT_ADDRESS = "0x2E2E4871a78187cB02A048a69f53633541A91a4e";
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

async function sendLetter(receiver, contentId, publicationDate, notificationSent) {
  return await contract.methods.sendLetter(receiver, contentId, publicationDate, notificationSent).send({ from: userAccount });
}

async function receiveLetter(letterId) {
  return await contract.methods.receiveLetter(letterId).send({ from: userAccount });
}

async function getLetterData(letterId) {
  return await contract.methods.getLetterData(letterId).call({ from: userAccount });
}

async function getLetterPacketsByReceiver() {
  return await contract.methods.getLetterPacketsByReceiver().call({ from: userAccount });
}

async function isLetterOwner() {
  return await contract.methods.isLetterOwner().call({ from: userAccount });
}

async function isLetterReceiver() {
  return await contract.methods.isLetterReceiver().call({ from: userAccount });
}