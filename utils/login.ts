import { useRouter } from 'next/dist/client/router';
import PostFactory from '../ethereum/PostFactory';
// @ts-ignore
import web3 from '../ethereum/web3';

export const login = () => {
  const router = useRouter();

  const getIsUserRegistered = async () => {
    // @ts-ignore
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    return await PostFactory.methods.isUserRegistered(accounts[0]).call();
  };

  getIsUserRegistered()
    .then((res) => {
      console.log('isUserRegistered: ', res);
      if (res) {
        localStorage.setItem('isUserRegistered', res);
        router.reload();
      } else {
        router.push('/register');
      }
    })
    .catch();

  return null;
};
