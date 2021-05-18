import { ethers } from "hardhat";
import { Signer } from "ethers";
import {expect} from  'chai'

describe("PostFactory", () => {
  let accounts: Signer[]

  beforeEach(async () => {
    accounts = await ethers.getSigners()
  })
  it("check manager of the Post Factory", async () => {
    const PostFactory = await ethers.getContractFactory('PostFactory')
    let postFactory = await PostFactory.deploy()

    expect(await postFactory.manager()).to.equal(accounts[0])
  })
})