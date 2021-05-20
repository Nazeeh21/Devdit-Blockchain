// @ts-ignore
import web3 from './web3';
import PostFactory from '../artifacts/contracts/Post.sol/PostFactory.json';

const instance = () => { 
  // @ts-ignore
  return new web3.eth.Contract(JSON.parse(PostFactory.abi), '0x27E7647e646063F00fd45Db310c08F8AfdC46B5F');
}

export default instance;