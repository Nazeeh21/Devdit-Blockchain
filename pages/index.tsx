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
import { LikeUnlike } from '../components/LikeUnlike';
import { useRouter } from 'next/dist/client/router';

const Home = ({}) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [postAddresses, setPostAddresses] = useState<String[]>([]);
  const [postLikes, setPostLikes] = useState<Boolean[]>([]);

  const [loadingVotePost, setLoadingPost] = useState<boolean[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function getAccounts() {
      const getDeployedPostsLength = await PostFactory.methods
        .getDeployedPostsLength()
        .call();
      console.log(getDeployedPostsLength);

      const postAddresses = await PostFactory.methods.getDeployedPosts().call();
      setPostAddresses(postAddresses);
      const loadingState: boolean[] = [];
      const fetchedPosts = await Promise.all(
        postAddresses.map((address: any) => {
          const post = PostContract(address);
          loadingState.push(false);
          return post.methods.getPostSummary().call();
        })
      );
      // console.log(typeof fetchedPosts);
      console.log(fetchedPosts);
      setLoadingPost(loadingState);
      // @ts-ignore
      setPosts(fetchedPosts);

      if (
        localStorage.getItem('username') &&
        localStorage.getItem('isUserRegistered')
      ) {
        // @ts-ignore
        const accounts = await web3.eth.getAccounts();
        const getPostLikes = await Promise.all(
          postAddresses.map((address: any) => {
            const post = PostContract(address);
            return post.methods.vottedPost(accounts[0]).call();
          })
        );

        // @ts-ignore
        setPostLikes(getPostLikes);
        console.log('getPostLikes: ', getPostLikes);
      }
    }
    try {
      getAccounts();
    } catch (e) {
      console.log(e);
      alert('Error while fetching posts');
    }
  }, []);

  const likePost = async (postAddress: String, index: number) => {
    if (
      !localStorage.getItem('username') ||
      !localStorage.getItem('isUserRegistered')
    ) {
      router.replace('/register?next=' + router.asPath);
    }
    let loadingStateArray = [...loadingVotePost];
    loadingStateArray[index] = true;
    setLoadingPost(loadingStateArray);
    // @ts-ignore
    const accounts = await web3.eth.getAccounts();
    const post = PostContract(postAddress);

    try {
      await post.methods.votePost().send({ from: accounts[0] });
      loadingStateArray[index] = false;
      setLoadingPost(loadingStateArray);
      router.reload();
    } catch (e) {
      console.log(e);
      loadingStateArray[index] = false;
      setLoadingPost(loadingStateArray);
    }
  };

  return (
    <div className='container'>
      <Head>
        <title>Devdit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Layout>
          <Stack mt={8} mb={2}>
            {!posts ? (
              <Heading m='auto'>Loading ...</Heading>
            ) : (
              posts?.map((post, index) => {
                return (
                  <Flex
                    mb={2}
                    key={index}
                    p={5}
                    shadow='md'
                    borderWidth='1px'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box>
                      {console.log(post)}
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
                    <Box>
                      <LikeUnlike
                        isLoading={loadingVotePost[index]}
                        // isLoading={true}
                        hasLiked={postLikes[index]}
                        clickHandler={() => {
                          let anyPostVoteIsLoading = false;

                          loadingVotePost.map((element) => {
                            if (element) {
                              anyPostVoteIsLoading = true;
                            }
                          });
                          if (!anyPostVoteIsLoading) {
                            likePost(postAddresses[index], index);
                          } else {
                            alert('Cant perform 2 transactions simultaneously');
                          }
                        }}
                      />
                      <Text textAlign='center'>{post[3]}</Text>
                    </Box>
                  </Flex>
                );
              })
            )}
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

export default Home;
