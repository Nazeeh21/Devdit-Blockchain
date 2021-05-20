import Web3 from 'web3'

let web3
// @ts-ignore
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running

  // @ts-ignore
  window.ethereum.enable();
  // @ts-ignore
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const INFURA_API_KEY = process.env.INFURA_API_KEY || '';

  const provider = new Web3.providers.HttpProvider(
    `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`
  );

  web3 = new Web3(provider);
}

export default web3;