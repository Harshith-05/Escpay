const hre = require("hardhat");

async function main() {
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  // ✅ Use waitForDeployment() instead of deployed()
  await escrow.waitForDeployment();

  console.log(`Escrow contract deployed to: ${await escrow.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
