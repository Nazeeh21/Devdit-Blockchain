import { Heading } from '@chakra-ui/layout';
import React from 'react';
import Comments from '../../components/Comments';
import CreateComment from '../../components/CreateComment';
import { Layout } from '../../components/Layout';
import PostContract from '../../ethereum/Post';
import { Comment, Post } from '../../utils/types';

interface PostProps {
  postSummary: Post;
  comments?: Comment[];
}

const Index = ({ postSummary, comments }: PostProps) => {
  return (
    <Layout>
      <Heading mb={4}>{postSummary[1]}</Heading>
      {postSummary[2]}
      {/* <Box mt={4}>
        <EditDeletPostButtons creatorId={data.post.creator.id} id={data.post.id} />
      </Box> */}
      {/* {meData?.me?.id === data.post.creator.id && (
        <Box mt={2}>
          <Button
            onClick={() => {
              router.push(`/post/edit/${intId}`);
            }}
            mt={4}
            type='submit'
            colorScheme='teal'
          >
            Update Post
          </Button>
        </Box>
      )} */}
      <Comments comments={comments} />
      <CreateComment />
    </Layout>
  );
};

Index.getInitialProps = async ({ query }: any) => {
  const address = query.id;
  // console.log('address: ', address);

  const post = PostContract(address);

  const postSummary = await post.methods.getPostSummary().call();
  console.log(postSummary);

  const commentsCount = await post.methods.getCommentsCount().call();

  const comments = await Promise.all(
    Array(+commentsCount)
      // @ts-ignore
      .fill()
      .map((_, index) => {
        return post.methods.getCommentSummary(index).call();
      })
  );
  console.log('comments: ', comments);
  

  return { postSummary, comments };
};

export default Index;
