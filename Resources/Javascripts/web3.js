
let account;
let contract;
const account_receiver = "0x2d2b120E78FA0a1a32A36d43f7aAC9A56c082147";

const accessToMetamask = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Requesting user accounts from Metamask
      window.web3 = new Web3(window.ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];

      // Displaying the account address
      document.getElementById(
        "accountArea"
      ).innerHTML = `Account Address: ${account}`;

      // Getting the balance in Wei
      const weiBalance = await window.web3.eth.getBalance(account);

      // Converting Wei to Ether
      const etherBalance = window.web3.utils.fromWei(weiBalance, "ether");

      // Displaying the balance
      document.getElementById(
        "balance"
      ).innerHTML = `Balance: ${etherBalance} BNB`;

      const contractAddress =
        "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";

      const contractABI = [
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [
            {
              name: "",
              type: "uint8",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "_from",
              type: "address",
            },
            {
              indexed: true,
              name: "_to",
              type: "address",
            },
            {
              indexed: false,
              name: "_value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "_owner",
              type: "address",
            },
            {
              indexed: true,
              name: "_spender",
              type: "address",
            },
            {
              indexed: false,
              name: "_value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          inputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              name: "",
              type: "address",
            },
            {
              name: "",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_spender",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_from",
              type: "address",
            },
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      // Instantiate the contract
      contract = new window.web3.eth.Contract(
        contractABI,
        contractAddress
      );

      console.log(accounts);
      console.log(weiBalance);
    } catch (error) {
      console.error("Error accessing Metamask accounts:", error);
    }
  } else {
    console.error("Metamask is not installed!");
  }
};

const transferTokens = async () => {
  try {
    //const tokenReceiver = document.getElementById("tokenReceiver").value;
    const accountReceiver = account_receiver;
    const tokenAmount = document.getElementById("tokenAmount").value;
    if (!accountReceiver || !tokenAmount) {
      console.error("Please enter both token receiver and amount.");
      return;
    }

    // Call the transfer method on the smart contract
    const result = await contract.methods
      .transfer(accountReceiver, tokenAmount)
      .send({ from: account });

    console.log("Token transfer result:", result);
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
};
