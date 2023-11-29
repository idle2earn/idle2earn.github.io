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

// const receiverAddress = "0x4b49cAF653Fc4f425096B86E4bAC39fC381353CB"; // Receiver's Ethereum address testnet
// const apiUrl = `https://api-testnet.bscscan.com/api`; //testnet
// const USDTContract = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; //testnet

const ethscanAPIKey = "ICXEDZHJRBQYJSPCYCPNHSA4QEC32Y1FVF";

const apiUrl = "https://api.etherscan.io/api";
const USDTContract = "0x55d398326f99059fF775485246999027B3197955";
const receiverAddress = "0x68B2BC56241f3aDa195b3a3A629ab8198007b129"; // Receiver's Ethereum address

const contractABI = [
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
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

window.web3 = new Web3(window.ethereum);

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

      await setUserBalance();
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
    contract = new window.web3.eth.Contract(contractABI, USDTContract);
    const tokenAmount = document.getElementById("tokenAmount").value;
    if (!receiverAddress || !tokenAmount) {
      console.error("Please enter both token receiver and amount.");
      return;
    }

    // Call the transfer method on the smart contract
    const amount = window.web3.utils.toWei(tokenAmount, "ether");
    const result = await contract.methods
      .transfer(receiverAddress, amount)
      .send({ from: account });

    const tokenAmountEl = document.getElementById("tokenAmount");
    tokenAmountEl.value = null;
    await getAllUserSended();
    await fillTable();
    await setUserBalance();
    await getTransaction();
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
      const i2EValueDisplay = document.querySelector(".I2E-balance");
      i2EValueDisplay.textContent = `${balanceReceive * 1000} I2E`;
    } else {
      console.error("Error fetching transactions:", data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

const getAllUserSended = async () => {
  const listWallet = [];
  let funding = 0;
  const endpointUsdtTransaction = `/?module=account&action=tokentx&address=${receiverAddress}&contractaddress=${USDTContract}&startblock=0&endblock=99999999&sort=asc&apikey=${ethscanAPIKey}`;
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
        const transactionDate = new Date(transaction.timeStamp * 1000);
        listWallet.push({
          value: Number(transactionValue),
          address: transaction.from,
          date: transactionDate.toUTCString(),
        });
        funding += Number(transactionValue);
      }
      await setFundingRate(funding);
    } else {
      console.error("Error fetching transactions:", data);
    }
    return listWallet;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

const setUserBalance = async () => {
  console.log("-------------get usdt value-------------------");
  const tokenUsdtContract = new window.web3.eth.Contract(
    contractABI,
    USDTContract
  );
  const usdtWeiBalance = await tokenUsdtContract.methods
    .balanceOf(account)
    .call();
  const usdtValue = window.web3.utils.fromWei(usdtWeiBalance, "ether");
  const usdtValueDisplay = document.querySelector(".usdt-balance");
  usdtValueDisplay.textContent = `${usdtValue.slice(0, 6)} USDT`;
};

const fillTable = async () => {
  const listWallet = await getAllUserSended();
  const tableBody = document.getElementById("data_table_body");

  // Clear existing content
  tableBody.innerHTML = "";

  // Iterate over the data array and create rows
  if (listWallet.length) {
    listWallet.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${data.address}</td>
      <td>${data.value}</td>
      <td>${Number(data.value * 1000)}</td>
      <td>${data.date}</td>
    `;
      tableBody.appendChild(row);
    });
  }
};

const setFundingRate = async (funding) => {
  const fundingValueDisplay = document.querySelector(".funding-rate");
  const fundingPercent = ((funding / 100000) * 100).toFixed(2);
  fundingValueDisplay.textContent = `Funding (${fundingPercent}%): ${funding}/100.000 USDT`;
};

fillTable();
