const hre = require("hardhat");

async function main() {
  console.log("Deploying VotingSystem contract...");

  // Get the contract factory
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  
  // Deploy the contract
  const votingSystem = await VotingSystem.deploy();
  
  // Wait for deployment to finish
  await votingSystem.waitForDeployment();
  
  // Get the deployed contract address
  const address = await votingSystem.getAddress();
  
  console.log("VotingSystem deployed to:", address);
  console.log("\n=== IMPORTANT INFORMATION ===");
  console.log("Contract Address:", address);
  console.log("Owner Address:", await votingSystem.owner());
  console.log("Initial Election State:", await votingSystem.currentElectionState());
  console.log("\nPlease save this contract address and update it in:");
  console.log("- server/index.js (CONTRACT_ADDRESS)");
  console.log("- client/script.js (CONTRACT_ADDRESS)");
  console.log("\nAlso copy the ABI from artifacts/contracts/VotingSystem.sol/VotingSystem.json");
  console.log("and update it in both server/index.js and client/script.js");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});