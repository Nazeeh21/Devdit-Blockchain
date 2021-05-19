import { ethers } from 'hardhat';
import { Signer } from "ethers";
import { expect } from 'chai';

describe('PostFactory', () => {
  let accounts: Signer[]
  // @ts-ignore
  let PostFactory, postFactory: any, owner, addr1, addr2, username: string, Post;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    // console.log(accounts);

    PostFactory = await ethers.getContractFactory('PostFactory');
    Post = await ethers.getContractFactory('Post');
    
    postFactory = await PostFactory.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
    // console.log(addr1.address);
    // console.log('owner: ', owner.address);
    username = 'user1';
    await postFactory.registerUser(username);
  });

  it('check manager of the Post Factory', async () => {
    const manager = await postFactory.manager();
    console.log(manager);
    // @ts-ignore
    expect(await postFactory.manager()).to.equal(owner.address);
  });

  it('register user', async () => {
    const isRegistered = await postFactory.isRegistered();
    expect(isRegistered).to.equal(true);

    const getUsername = await postFactory.getUsername();
    expect(getUsername).to.equal(username);
  });

  it('Deploy Post', async() => {

    const title = 'title'
    const body = 'body'

    await postFactory.deployPost(title, body)
    const length = await postFactory.getDeployedPostsLength()

    // console.log(length.toNumber());
    expect(length.toNumber()).to.equal(1);

    const [postAddress] = await postFactory.getDeployedPosts();
    // console.log('postAddress: ', postAddress)
    expect(postAddress).to.not.be.null;


    // @ts-ignore
    // console.log('Post: ', Post.interface);
    // @ts-ignore
    const post = await new ethers.Contract(postAddress, Post.interface, accounts[0]);

    // console.log('Post: ', post);
    
  })
});
