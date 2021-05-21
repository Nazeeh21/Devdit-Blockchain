import { ethers } from 'hardhat';

async function main() {
  const PostFactory = await ethers.getContractFactory('PostFactory');

  // If we had constructor arguments, they would be passed into deploy()
  let postFactory = await PostFactory.deploy();

  // The address the Contract WILL have once mined
  console.log(postFactory.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(postFactory.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await postFactory.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(e => {
  console.log(e);
  process.exit(1);
});