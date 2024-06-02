import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const buy = async (amount) => {
    if (atm) {
      let tx = await atm.buy(ethers.utils.parseEther(amount.toString()));
      await tx.wait();
      getBalance();
      updateTransactionHistory("Successfully Purchased", amount);
    }
  };
  
  const sell = async (amount) => {
    if (atm) {
      let tx = await atm.sell(ethers.utils.parseEther(amount.toString()));
      await tx.wait();
      getBalance();
      updateTransactionHistory("Successfully Sold", -amount);
    }
  };


  const updateTransactionHistory = (action, amount) => {
    const newTransaction = { action, amount, timestamp: Date.now() };
    setTransactionHistory([...transactionHistory, newTransaction]);
  };

  const renderTransactionHistory = () => {
    return (
      <div>
        <h3 style={{ fontSize: '22px' }}>ACTIVITY TRACKING:</h3>
        <ul>
          {transactionHistory.map((transaction, index) => (
            <li key={index}>
              {transaction.action} {Math.abs(transaction.amount)} Ethereum -{" "}
              {new Date(transaction.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  

  const initUser = () => {
 
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

  
    if (!account) {
      return (
        <button 
          style={{
            backgroundColor: "Red", 
            borderRadius: "8px",
            padding: "15px 30px", 
            fontSize: "18px",     
            fontWeight: "bold",   
          }} 
          onClick={connectAccount}
        >
          Open Metamask wallet now
        </button>
      );
    }
    
    return (
      <div>
      <p style={{ fontSize: '22px' }}>Connected Account: {account}</p>
      <p style={{ fontSize: '22px' }}>BUY ETHEREUM</p> 
      <button style={{fontSize: "24px", backgroundColor: "Red", borderRadius: "8px"}} onClick={() => buy(document.getElementById("buyAmount").value)}>Submit Buy</button>
      <input style={{fontSize: "24px", borderRadius: "8px"}} type="number" id="buyAmount" placeholder="Insert Buy Ethereum" />
      <p style={{ fontSize: '22px' }}>SELL ETHEREUM</p> 
      <button style={{fontSize: "24px", backgroundColor: "Red", borderRadius: "8px"}} onClick={() => sell(document.getElementById("sellAmount").value)}>Submit Sell</button>
      <input style={{fontSize: "24px", borderRadius: "8px"}} type="number" id="sellAmount" placeholder="Insert Sell Ethereum" />
      {renderTransactionHistory()}
    </div>
  )
}


  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
    <h1 style={{ fontSize: "85px" }}>Marquez Digital</h1>
    <h2 style={{ fontSize: "35px" }}>Ethereum Buy and Sell</h2>
    </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          margin-top: 5px;
          color: Red;
          background-color: blue;
          padding: 100px;
          border-radius: 50px;
        }
      `}</style>
    </main>
  );
}
