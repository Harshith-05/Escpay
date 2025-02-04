const hre = require("hardhat");

async function main() {
  // 🔹 Replace with your deployed contract address
  const escrowAddress = "0xFB7eb5d5Ded27b71Cd2BEBF1A9cEd0f4e9e6e69D"; 

  // Load the contract
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.attach(escrowAddress);

  console.log(✅ Interacting with Escrow Contract at: ${escrowAddress});

  // 🔹 Check the total number of deals
  const dealCounter = await escrow.dealCounter();
  console.log(📊 Total Deals Created: ${dealCounter.toString()});

  // 🔹 If there is at least one deal, fetch and display it
  if (dealCounter > 0) {
    const deal = await escrow.deals(dealCounter);
    console.log("📄 Last Deal Details:", deal);
  }

  // 🔹 Check the contract balance
  const balance = await hre.ethers.provider.getBalance(escrowAddress);
  console.log(💰 Contract Balance: ${hre.ethers.formatEther(balance)} ETH);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });