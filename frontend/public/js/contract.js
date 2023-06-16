// function handleAccountsChanged(accounts) {
//   if (accounts.length === 0) {
//     console.log("Account changed to none");
//   } else if (accounts[0] !== userAccount) {
//     console.log("Account changed!");
//     console.log(`old account: ${userAccount}, new account: ${accounts[0]}`);
//     userAccount = accounts[0];
//   }
// }

document.addEventListener("DOMContentLoaded", async function () {
  let provider;

  if (window.ethereum) {
    provider = window.ethereum;
    web3 = new Web3(provider);

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      console.error("User denied account access");
      console.error(error);
    }
  } else {
    console.log("Metamask를 찾을 수 없습니다.");
  }
});

//   try {
//     let accounts = await provider.request({ method: "eth_requestAccounts" });
//     handleAccountsChanged(accounts);

//     provider.on("accountsChanged", handleAccountsChanged);
//   } catch (error) {
//     console.error("User denied account access");
//     console.error(error);
//   }
// } else {
//   console.log("Metamask를 찾을 수 없습니다.");
// }

//  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// function sendLetter(receiverAddress, contentIdentifier) {
//   return contract.methods
//     .send(receiverAddress, contentIdentifier)
//     .send({ from: userAccount })
//     .then(function (receipt) {
//       console.log(receipt);
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// }

// function getLetter(letterId) {
//   return contract.methods
//     .get(letterId)
//     .call()
//     .then(function (result) {
//       console.log(result);
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// }
