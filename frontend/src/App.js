import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ethers, JsonRpcProvider } from "ethers";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anonymous Key are required!");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Escrow Contract Details
const ESCROW_CONTRACT_ADDRESS = process.env.REACT_APP_ESCROW_CONTRACT;
const ETH_RPC_URL = process.env.REACT_APP_ETH_RPC_URL;

const ESCROW_ABI = [
  "function createDeal(address _seller) external returns (uint256)",
  "function fundDeal(uint256 _dealId) external payable",
  "function releaseFunds(uint256 _dealId) external",
  "function dealCounter() public view returns (uint256)",
  "function deals(uint256) public view returns (address, address, uint256, uint8)",
];

// Initialize Ethereum provider
const provider = new JsonRpcProvider(ETH_RPC_URL);

const getSigner = async () => {
  if (!window.ethereum) throw new Error("MetaMask is required to connect your wallet!");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return new ethers.BrowserProvider(window.ethereum).getSigner();
};

const getEscrowContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);
};

function App() {
  const [sellerAddress, setSellerAddress] = useState("");
  const [dealId, setDealId] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");

  const createDeal = async () => {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.createDeal(sellerAddress);
      await tx.wait();
      alert("Deal Created Successfully!");
    } catch (error) {
      console.error("Error creating deal:", error);
      alert("Failed to create deal. Check console for details.");
    }
  };

  const fundDeal = async () => {
    try {
      const contract = await getEscrowContract();
      const amountInWei = ethers.parseEther(amount);
      const tx = await contract.fundDeal(dealId, { value: amountInWei });
      await tx.wait();
      alert(`Deal #${dealId} funded with ${amount} ETH`);
    } catch (error) {
      console.error("Error funding deal:", error);
      alert("Failed to fund deal. Check console for details.");
    }
  };

  const releaseFunds = async () => {
    try {
      const contract = await getEscrowContract();
      const tx = await contract.releaseFunds(dealId);
      await tx.wait();
      alert(`Funds Released for Deal #${dealId}`);
    } catch (error) {
      console.error("Error releasing funds:", error);
      alert("Failed to release funds. Check console for details.");
    }
  };

  const fetchBalance = async () => {
    try {
      const balanceInWei = await provider.getBalance(ESCROW_CONTRACT_ADDRESS);
      setBalance(ethers.formatEther(balanceInWei));
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      alert("Failed to fetch balance. Check console for details.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Escrow Smart Contract</h1>
      <h3>Contract Balance: {balance} ETH</h3>
      <button onClick={fetchBalance}>Refresh Balance</button>

      <hr />

      <h3>Create a Deal</h3>
      <input
        placeholder="Enter Seller Address"
        value={sellerAddress}
        onChange={(e) => setSellerAddress(e.target.value)}
      />
      <button onClick={createDeal}>Create Deal</button>

      <hr />

      <h3>Fund a Deal</h3>
      <input
        placeholder="Enter Deal ID"
        value={dealId}
        onChange={(e) => setDealId(e.target.value)}
      />
      <input
        placeholder="Enter Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={fundDeal}>Fund Deal</button>

      <hr />

      <h3>Release Funds</h3>
      <input
        placeholder="Enter Deal ID"
        value={dealId}
        onChange={(e) => setDealId(e.target.value)}
      />
      <button onClick={releaseFunds}>Release Funds</button>
    </div>
  );
}

export default App;
