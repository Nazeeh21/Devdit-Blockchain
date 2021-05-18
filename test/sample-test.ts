import { ethers } from 'hardhat';
// import { Signer } from "ethers";
import { expect } from 'chai';

describe('PostFactory', () => {
  // let accounts: Signer[]
  // @ts-ignore
  let PostFactory, postFactory: any, owner, addr1, addr2;

  beforeEach(async () => {
    // accounts = await ethers.getSigners();
    // console.log(accounts);
    
    PostFactory = await ethers.getContractFactory('PostFactory');
    postFactory = await PostFactory.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
    // console.log(addr1.address);
    console.log('owner: ',owner.address)
    
  });
  it('check manager of the Post Factory', async () => {
    const manager = await postFactory.manager()

    console.log(manager);
    // @ts-ignore
    expect(await postFactory.manager()).to.equal(owner.address);
    
    
  });
});
