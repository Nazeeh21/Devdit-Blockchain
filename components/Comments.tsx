import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/layout';
import React from 'react';
// import PostContract from '../ethereum/Post';
import { Wrapper } from './Wrapper';
import { Comment } from '../utils/types';

interface CommentsProps {
  comments: Comment[] | undefined;
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {

  if (comments!.length === 0) {
    return (
      <Wrapper>
        <Heading mb={4}>Comments</Heading>
        <div>You got no comments or query failed for some reason</div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <br />
      <Heading fontSize='2xl' mb={4}>
        Comments
      </Heading>
      <Stack mt={8}>
        {comments!.map((comment, index) => (
          <Flex key={index} p={5} shadow='md' borderWidth='1px'>
            <Box>
              {/* {console.log(comment)} */}
              <Text>{comment[1]}</Text>
              <Text mt={4}>Posted by: {comment[0]}</Text>
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
