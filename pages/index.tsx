import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import PostFactory from '../ethereum/PostFactory';
import PostContract from '../ethereum/Post';
import NextLink from 'next/link';
// @ts-ignore

import web3 from '../ethereum/web3';
import { Post } from '../utils/types';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/layout';

interface HomeProps {
  manager: String;
  posts?: Post[];
}

const Home = ({ manager, posts }: HomeProps) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    async function getAccounts() {
      // @ts-ignore
      let accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      const isUserRegistered = await PostFactory.methods
        .isUserRegistered(accounts[0])
        .call();
      console.log(isUserRegistered);

      setIsRegistered(isUserRegistered);
    }
    getAccounts();
  }, []);

  return (
    <div className='container'>
      <Head>
        <title>Devdit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Layout>
          {posts?.map((post, index) => {
            return (<Flex key={index} p={5} shadow='md' borderWidth='1px'>
              <Box>
                {console.log(post)}
                <NextLink href='/post/[id]' as={`/post/${post[0]}`}>
                    <Link>
                      <Heading fontSize='xl'>{post[1]}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by: {post[0]}</Text>
                  <Text mt={4}>{post[2]}</Text>
              </Box>
            </Flex>)
          })}
        </Layout>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0;
        }

        main {
          padding: 0rem 0;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

Home.getInitialProps = async () => {
  const manager = await PostFactory.methods.manager().call();
  const getDeployedPostsLength = await PostFactory.methods
    .getDeployedPostsLength()
    .call();
  console.log(getDeployedPostsLength);

  const postAddresses = await PostFactory.methods.getDeployedPosts().call();
  
  const posts = await Promise.all(
    postAddresses.map((address: any) => {
      const post = PostContract(address);
      return post.methods.getPostSummary().call();
    })
  );

  console.log('posts: ', posts);
  return { manager, posts };
};

export default Home;
