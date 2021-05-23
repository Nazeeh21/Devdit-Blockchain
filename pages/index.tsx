import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import PostFactory from '../ethereum/PostFactory';
import PostContract from '../ethereum/Post';
import NextLink from 'next/link';
// @ts-ignore
import web3 from '../ethereum/web3';
import { Post } from '../utils/types';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';

const Home = ({}) => {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [postAddresses, setPostAddresses] = useState<String[]>([])
  
  useEffect(() => {
    async function getAccounts() {
      const getDeployedPostsLength = await PostFactory.methods
        .getDeployedPostsLength()
        .call();
      console.log(getDeployedPostsLength);

      const postAddresses = await PostFactory.methods.getDeployedPosts().call();
      setPostAddresses(postAddresses);

      const fetchedPosts = await Promise.all(
        postAddresses.map((address: any) => {
          const post = PostContract(address);
          return post.methods.getPostSummary().call();
        })
      );

      // console.log(typeof fetchedPosts);
      // console.log(fetchedPosts);
      
      // @ts-ignore
      setPosts(fetchedPosts)
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
          <Stack mt={8} mb={2}>
            {!posts ? <Heading m='auto'>Loading ...</Heading> : posts?.map((post, index) => {
              return (
                <Flex mb={2} key={index} p={5} shadow='md' borderWidth='1px'>
                  <Box>
                    {/* {console.log(post)} */}
                    <NextLink
                      href='/post/[id]'
                      as={`/post/${postAddresses && postAddresses[index]}`}
                    >
                      <Link>
                        <Heading fontSize='xl'>{post[1]}</Heading>
                      </Link>
                    </NextLink>
                    <Text>Posted by: {post[0]}</Text>
                    <Text mt={4}>{post[2]}</Text>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
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

// Home.getInitialProps = async () => {
//   const getDeployedPostsLength = await PostFactory.methods
//     .getDeployedPostsLength()
//     .call();
//   console.log(getDeployedPostsLength);

//   const postAddresses = await PostFactory.methods.getDeployedPosts().call();

//   // const is_Registered = await PostFactory.methods.isRegistered().call();

//   // console.log('is_Registered: ', is_Registered);

//   // const username = await PostFactory.methods.getUsername().call();

//   // console.log(username);

//   const posts = await Promise.all(
//     postAddresses.map((address: any) => {
//       const post = PostContract(address);
//       return post.methods.getPostSummary().call();
//     })
//   );

//   // console.log('posts: ', posts);
//   return { posts, postAddresses };
// };

export default Home;
