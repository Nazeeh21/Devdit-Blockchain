// import web3 from './web3';
import Post from '../artifacts/contracts/Post.sol/Post.json';

// const instance = (address) => { 
//   return new web3.eth.Contract(JSON.parse(Post.abi), address);
// }

// export default instance;

const provider = new ethers.getDefaultProvider(`https://rinkeby.infura.io/v3/99cadf7c5b144101b79a4ceb8c8fb2dd`);

const instance = (address) => {
  return new ethers.Contract(address, Post.abi, provider);
}

export default instance;