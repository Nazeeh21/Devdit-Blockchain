import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import PostFactory from '../ethereum/PostFactory';
import { isServer } from '../utils/isServer';
// @ts-ignore
import web3 from '../ethereum/web3';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const [isUserRegistered, setIsUserRegistered] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!isServer()) {
      const isRegistered = localStorage.getItem('isUserRegistered');
      setIsUserRegistered(isRegistered);

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
        })
        .catch((e) => console.log(e));
    }
  }, []);
  let body = null;

  if (!isUserRegistered) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color='#31326f' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='#31326f'>Register</Link>
        </NextLink>
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
        <Box color='#31326f' mr={4}>{username}</Box>
        <Button color='#31326f' onClick={() => {}} variant='link'>
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
