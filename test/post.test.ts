import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { expect } from 'chai';

describe('PostFactory', () => {
  let accounts: Signer[];
  // @ts-ignore
  let PostFactory, postFactory: any, owner, addr1, addr2, username: string, Post, post: any;
  const title = 'title';
  const body = 'body';

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

    await postFactory.deployPost(title, body);

    const [postAddress] = await postFactory.getDeployedPosts();
    // console.log('postAddress: ', postAddress)
    expect(postAddress).to.not.be.null;

    // @ts-ignore
    // console.log('Post: ', Post.interface);
    // @ts-ignore
    post = await new ethers.Contract(postAddress, Post.interface, accounts[0]);
  });

  it('check manager of the Post Factory', async () => {
    // @ts-ignore
    expect(await postFactory.manager()).to.equal(owner.address);
  });

  it('register user', async () => {
    const isRegistered = await postFactory.isRegistered();
    expect(isRegistered).to.equal(true);

    const getUsername = await postFactory.getUsername();
    expect(getUsername).to.equal(username);
  });

  it('Deploy Post', async () => {
    const length = await postFactory.getDeployedPostsLength();

    // console.log(length.toNumber());
    expect(length.toNumber()).to.equal(1);

    expect(await post.username()).to.equal(username);
    expect(await post.title()).to.equal(title);
    expect(await post.body()).to.equal(body);

    // console.log('Post: ', post);
  });

  it('Upvoting and Downvoting a post', async () => {
    const beforeVoting = await post.votes()
    expect(beforeVoting.toNumber()).to.equal(0)

    // upvoting
    await post.votePost()
    const afterUpVote = await post.votes()
    expect(afterUpVote.toNumber()).to.equal(1)

    // downvoting
    await post.votePost()
    const afterDownVote = await post.votes()
    expect(afterDownVote.toNumber()).to.equal(0)
  })

  it('Create Comment, upVote and downVote it', async () => {
    const commentText = 'comment1';
    await post.createComment(commentText, username);

    const commentsLength = await post.getCommentsCount();
    expect(commentsLength.toNumber()).to.equal(1);

    const result = await post.getCommentSummary(0);
    // console.log(result[1]);
    expect(result[1]).to.equal(commentText);

    const anotherResult = await post.comments(0);

    expect(anotherResult[2]).to.equal(commentText);

    const intialVotes = result[2].toNumber();
    expect(intialVotes).to.equal(0);

    // upvoting the comment
    await post.voteComment(0);
    const finalVotes = await post.getCommentSummary(0);
    // console.log(finalVotes[2].toNumber());
    expect(finalVotes[2].toNumber()).to.equal(1);
    
    // downvoting the comment
    await post.voteComment(0);
    const downVotes = await post.getCommentSummary(0);
    expect(downVotes[2].toNumber()).to.equal(0);
  });

  it('Delete Post', async () => {
    const initialDeployedPosts = await postFactory.deployedPosts(0)
    // console.log(initialDeployedPosts);
    
    const postCreator = await post.creator();
    // console.log(postCreator);

    await postFactory.deletePost(0, postCreator);
    
    const finalDeployedPosts = await postFactory.deployedPosts(0)

    expect(finalDeployedPosts).to.not.equal(initialDeployedPosts);
    
  })

  it('Delete Comment', async () => {
    const commentText = 'comment1';
    await post.createComment(commentText, username);

    const initialComment = await post.comments(0)
    // console.log(initialComment);
    
    await post.deleteComment(0, initialComment[0]);

    // const commentsLength = await post.getCommentsCount();

    const finalComment = await post.comments(0);

    // console.log(finalComment);
    
    expect(finalComment).to.not.equal(initialComment);
  })
});
