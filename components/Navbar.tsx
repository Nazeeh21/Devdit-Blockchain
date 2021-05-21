import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import PostFactory from '../ethereum/PostFactory';
import { isServer } from '../utils/isServer';
// @ts-ignore
import web3 from '../ethereum/web3';
import { useRouter } from 'next/dist/client/router';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const [isUserRegistered, setIsUserRegistered] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!isServer()) {
      const isRegistered = localStorage.getItem('isUserRegistered');
      setIsUserRegistered(isRegistered);

      if (isRegistered) {
        const getUser = async () => {
          // @ts-ignore
          let accounts = await web3.eth.getAccounts();
          // console.log(accounts[0]);

          console.log('getting username');
          const username = await PostFactory.methods.users(accounts[0]).call();

          // console.log('username: ', username);
          return username;
        };
        getUser()
          .then((res) => {
            console.log(res);
            setUsername(res);
            localStorage.setItem('username', res);
          })
          .catch((e) => console.log(e));
      }
    }
  }, []);

  const loginHandler = async () => {
    // @ts-ignore
    let accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    const isUserRegistered = await PostFactory.methods
      .isUserRegistered(accounts[0])
      .call();
    console.log('isUserRegistered: ', isUserRegistered);
    if (isUserRegistered) {
      const username = await PostFactory.methods.users(accounts[0]).call();
      localStorage.setItem('username', username);
      localStorage.setItem('isUserRegistered', isUserRegistered);
      router.reload();
    } else {
      router.push('/register');
    }
  };
  let body = null;

  if (!isUserRegistered) {
    body = (
      <>
        <Button onClick={loginHandler} color='#31326f' mr={2}>
          Login
        </Button>
        <Button
          onClick={() => {
            router.push('/register');
          }}
        >
          <Link color='#31326f'>Register</Link>
        </Button>
      </>
    );
  } else {
    body = (
      <Flex alignItems='center'>
        <NextLink href='/create-post'>
          <Button color='#31326f' mr={4} as={Link}>
            create post
          </Button>
        </NextLink>
        <Box color='#31326f' mr={4}>
          {username}
        </Box>
        <Button
          color='#31326f'
          onClick={() => {
            localStorage.removeItem('isUserRegistered');
            localStorage.removeItem('username');
            router.reload();
          }}
          variant='link'
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position='sticky' top={3} bg='#ffdf6b' p={4}>
      <Flex flex={1} m='auto' alignItems='center' maxW={800}>
        <NextLink href='/'>
          <Link color='#31326f'>
            <Heading>Devdit</Heading>
          </Link>
        </NextLink>
        <Box ml='auto'>{body}</Box>
      </Flex>
    </Flex>
  );
};
