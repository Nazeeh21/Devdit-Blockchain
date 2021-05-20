// import web3 from './web3';

const { ethers } = require("ethers");

import PostFactory from '../artifacts/contracts/Post.sol/PostFactory.json';

// const instance = () => { 
//   return new web3.eth.Contract(JSON.parse(PostFactory.abi), '0x27E7647e646063F00fd45Db310c08F8AfdC46B5F');
// }

// export default instance;

const provider = new ethers.getDefaultProvider(`https://rinkeby.infura.io/v3/99cadf7c5b144101b79a4ceb8c8fb2dd`);

const postFactory = new ethers.Contract('0x27E7647e646063F00fd45Db310c08F8AfdC46B5F', PostFactory.abi, provider);

export default postFactory;