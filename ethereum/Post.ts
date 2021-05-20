// @ts-ignore
import web3 from './web3';
import Post from '../artifacts/contracts/Post.sol/Post.json';

const instance = (address: any) => { 
  // @ts-ignore
  return new web3.eth.Contract(JSON.parse(Post.abi), address);
}

export default instance;