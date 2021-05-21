import { Heading } from '@chakra-ui/layout';
import React from 'react'
import CreateComment from '../../components/CreateComment';
import { Layout } from '../../components/Layout';
import PostContract from '../../ethereum/Post';
import { Post } from '../../utils/types';

interface PostProps {
postSummary: Post;
}

const Index = ({postSummary}: PostProps) => {
  
    return (<Layout>
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
      {/* <Comments pageProps /> */}
      <CreateComment />
    </Layout>);
}

// @ts-ignore
Index.getInitialProps = async({ query }) => {
  const address = query.id
  // console.log('address: ', address);
  
  const post = PostContract(address);

  const postSummary = await post.methods.getPostSummary().call()
  console.log(postSummary);

  return {postSummary}
}

export default Index;