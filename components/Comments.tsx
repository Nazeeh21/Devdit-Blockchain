import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
// import PostContract from '../ethereum/Post';
import { Wrapper } from './Wrapper';
import { Comment } from '../utils/types';
import { LikeUnlike } from './LikeUnlike';
import { useRouter } from 'next/dist/client/router';
// @ts-ignore
import web3 from '../ethereum/web3';
import PostContract from '../ethereum/Post';

interface CommentsProps {
  comments: Comment[] | undefined;
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  const router = useRouter();
  const postAddress = router.query.id;
  const [commentLikes, setCommentLikes] = useState<Boolean[]>([]);
  const [loadingVoteComment, setLoadingComment] = useState<boolean[]>([]);

  useEffect(() => {
    const getCommentLikes = async () => {
      if (
        localStorage.getItem('username') &&
        localStorage.getItem('isUserRegistered') &&
        comments?.length !== 0
      ) {
        const loadingState: boolean[] = [];
        // @ts-ignore
        const accounts = await web3.eth.getAccounts();
        const getCommentLikes = await Promise.all(
          comments!.map((_, index) => {
            const post = PostContract(postAddress);
            loadingState.push(false);
            return post.methods.vottedComment(index, accounts[0]).call();
          })
        );
        setLoadingComment(loadingState);

        // @ts-ignore
        setCommentLikes(getCommentLikes);
        console.log('getCommentLikes: ', getCommentLikes);
      }
    };

    getCommentLikes();
  }, []);

  if (comments!.length === 0) {
    return (
      <Wrapper>
        <Heading mb={4}>Comments</Heading>
        <div>You got no comments or query failed for some reason</div>
      </Wrapper>
    );
  }

  const likeComment = async (commentIndex: number) => {
    if (
      !localStorage.getItem('username') ||
      !localStorage.getItem('isUserRegistered')
    ) {
      router.replace('/register?next=' + router.asPath);
    }
    let loadingStateArray = [...loadingVoteComment];
    loadingStateArray[commentIndex] = true;
    setLoadingComment(loadingStateArray);
    // @ts-ignore
    const accounts = await web3.eth.getAccounts();
    const post = PostContract(postAddress);

    try {
      await post.methods.voteComment(commentIndex).send({ from: accounts[0] });
      loadingStateArray[commentIndex] = false;
      setLoadingComment(loadingStateArray);
    } catch (e) {
      console.log(e);
      loadingStateArray[commentIndex] = false;
      setLoadingComment(loadingStateArray);
      alert('Error while voting a comment');
    }
    router.reload();
  };

  return (
    <Wrapper>
      <br />
      <Heading fontSize='2xl' mb={4}>
        Comments
      </Heading>
      <Stack mt={8}>
        {comments!.map((comment, index) => (
          <Flex
            key={index}
            p={5}
            shadow='md'
            borderWidth='1px'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box>
              {console.log(comment)}
              <Text>{comment[1]}</Text>
              <Text mt={4}>Posted by: {comment[0]}</Text>
            </Box>
            <Box>
              <LikeUnlike
                isLoading={loadingVoteComment[index]}
                hasLiked={commentLikes[index]}
                clickHandler={() => {
                  let anyCommentVoteIsLoading = false;

                  loadingVoteComment.map((element) => {
                    if (element) {
                      anyCommentVoteIsLoading = true;
                    }
                  });
                  if (!anyCommentVoteIsLoading) {
                    likeComment(index);
                  } else {
                    alert('Cant perform 2 transactions simultaneously');
                  }
                }}
              />
              <Text textAlign='center'>{comment[2]}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Wrapper>
  );
};

// @ts-ignore
// Comments.getInitialProps = async (query: any) => {
//   const address = query.id;
//   // console.log('address: ', address);

//   const post = PostContract(address);

//   const commentsCount = await post.methods.getCommentsCount().call();

//   const comments = Promise.all(
//     Array(+commentsCount)
//       // @ts-ignore
//       .fill()
//       .map((_, index) => {
//         return post.methods.getCommentSummary(index);
//       })
//   );
//   // console.log('comments: ', comments);

//   return { comments };
// };
export default Comments;
