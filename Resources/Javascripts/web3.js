{
  /* <div class="layout_disclaimer">
                    <a id ="connect_metamask" class="button translate" onclick="accessToMetamask()">CONNECT METAMASK</a>                  
                    <p id="accountArea"></p>
                    <p id="balance"></p>
                    <!-- Add input fields for token receiver and amount -->
                    <!-- <label for="tokenReceiver">Token Receiver:</label> -->
                    <!-- <input
                      type="text"
                      id="tokenReceiver"
                      placeholder="Enter receiver address"
                    /> -->
                    <!-- <br /> -->

                    <label for="tokenAmount">Token Amount:</label>
                    <input type="text" id="tokenAmount" placeholder="Enter token amount" />
                    <!-- <br /> -->           
                    <!-- Add a button to trigger the transferTokens function -->
        
                    <a id ="transfer_tokens" class="button translate" onclick="transferTokens()">TRANSFER TOKENS</a>         
                    <!-- <button onclick="transferTokens()">TRANSFER TOKENS</button>           -->
                </div>   */
}

let account;
let contract;
let accountBalance = {
  weiBalance: 0,
  etherBalance: 0,
  tokenBalance: 0,
};
let balanceReceive = 0;
let senderAddress = ""; // Sender's Ethereum address
let listWallet = [];

const receiverAddress = "0x4a116b0A55A11E40568a9ceAF968aeCC7468113A"; // Receiver's Ethereum address
const account_receiver = "0x4a116b0A55A11E40568a9ceAF968aeCC7468113A";
const ethscanAPIKey = "578GEDAT7XNJ5EYAZXAJBW8RDQG2PFIZUP";
const apiUrl = `https://api-testnet.bscscan.com/api`;
const USDTContract = "0x55d398326f99059fF775485246999027B3197955";

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

const usdtAbi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

window.web3 = new Web3("https://bsc-dataseed.binance.org/");

const accessToMetamask = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Requesting user accounts from Metamask
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];
      senderAddress = account;

      // Displaying the account address
      const userInfoButton = document.querySelector(".button-login");
      const shortenedText = account.slice(0, 4) + "..." + account.slice(-3);
      userInfoButton.textContent = shortenedText;
      userInfoButton.onclick = showAccount;

      const formTransfer = document.getElementById("formTransferToken");
      formTransfer.style.display = "block";

      // Getting the balance in Wei
      // const weiBalance = await window.web3.eth.getBalance(account);

      // Converting Wei to Ether
      // const etherBalance = window.web3.utils.fromWei(weiBalance, "ether");
      console.log("-------------get usdt value-------------------");
      const tokenUsdtContract = new window.web3.eth.Contract(
        usdtAbi,
        USDTContract
      );
      const usdtWeiBalance = await tokenUsdtContract.methods
        .balanceOf(account)
        .call();

      const usdtValueDisplay = document.querySelector(".usdt-balance");
      usdtValueDisplay.textContent = `${usdtWeiBalance} USDT`;
      console.log({ usdtWeiBalance });
      // accountBalance.weiBalance = weiBalance;
      // accountBalance.etherBalance = etherBalance;

      const contractAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";

      await getTransaction();
      await getAllUserSended();
    } catch (error) {
      console.error("Error accessing Metamask accounts:", error);
    }
  } else {
    console.error("Metamask is not installed!");
  }
};

const transferTokens = async () => {
  try {
    // Instantiate the contract
    contract = new window.web3.eth.Contract(contractABI, contractAddress);
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
    await getTransaction();
    await getAllUserSended();
    console.log("Token transfer result:", result);
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
};

function showAccount() {
  // var modal = document.getElementById("userModal");
  // var modalUsername = document.getElementById("modalUsername");
  // var username = account; // Assuming you have a login form
  // modalUsername.textContent = username;
  // modal.style.display = "block";
}

const closeModal = () => {
  var modal = document.getElementById("userModal");
  modal.style.display = "none";
};

const getTransaction = async () => {
  const endpointUsdtTransaction = `/?module=account&action=tokentx&address=${senderAddress}&contractaddress=${USDTContract}&startblock=0&endblock=99999999&sort=asc&apikey=${ethscanAPIKey}`;
  try {
    const response = await fetch(apiUrl + endpointUsdtTransaction);
    const data = await response.json();
    if (data.status === "1") {
      const transactions = data.result.filter(
        (tx) => tx.to.toLowerCase() === receiverAddress.toLowerCase()
      );
      for (const transaction of transactions) {
        // Get the value (amount) of the transaction
        const transactionValue = window.web3.utils.fromWei(
          transaction.value,
          "ether"
        );
        balanceReceive += Number(transactionValue);
      }
      console.log("Sender:", balanceReceive);
    } else {
      console.error("Error fetching transactions:", data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

const getAllUserSended = async () => {
  const endpointUsdtTransaction = `/?module=account&action=tokentx&address=${receiverAddress}&contractaddress=${USDTContract}&startblock=0&endblock=99999999&sort=asc&apikey=${ethscanAPIKey}`;
  try {
    const response = await fetch(apiUrl + endpointUsdtTransaction);
    const data = await response.json();
    console.log({ data });
    if (data.status === "1") {
      const transactions = data.result.filter(
        (tx) => tx.to.toLowerCase() === receiverAddress.toLowerCase()
      );
      for (const transaction of transactions) {
        // Get the value (amount) of the transaction
        const transactionValue = window.web3.utils.fromWei(
          transaction.value,
          "ether"
        );
        listWallet.push({
          value: transactionValue,
          address: transaction.from,
        });
      }
      console.log("Receiver:", listWallet);
    } else {
      console.error("Error fetching transactions:", data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};
