import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import PostFactory from '../ethereum/PostFactory';
// @ts-ignore
import web3 from '../ethereum/web3';
import { isServer } from './isServer';

export const useIsAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isServer()) {
      const isLoggedIn = localStorage.getItem('isUserRegistered');
      
      let accounts:any;
      if (!isLoggedIn) {
        const getIsUserRegistered = async () => {
          // @ts-ignore
          accounts = await web3.eth.getAccounts();
          // console.log(accounts[0]);
          return await PostFactory.methods.isUserRegistered(accounts[0]).call();
        };
        getIsUserRegistered()
          .then(async(res) => {
            // console.log('isUserRegistered: ', res);
            if (res) {
              const username = await PostFactory.methods.users(accounts[0]).call();
              localStorage.setItem('isUserRegistered', res);
              localStorage.setItem('username', username);
              // router.reload();
              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else {
                router.push('/');
              }
            }
          })
          .catch((e) => console.log(e));
      } else {
        if (typeof router.query.next === 'string') {
          router.push(router.query.next);
        } else {
          router.push('/');
        }
      }
    }
  }, []);
};
