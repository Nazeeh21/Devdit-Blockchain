import { Heading } from '@chakra-ui/layout';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import Comments from '../../components/Comments';
import CreateComment from '../../components/CreateComment';
import { Layout } from '../../components/Layout';
import PostContract from '../../ethereum/Post';
import { Comment, Post } from '../../utils/types';

const Index = () => {
  const router = useRouter();
  const address = router.query.id;

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [postSummary, setPostSummary] = useState<Post | null>(null);

  useEffect(() => {
    const getComments = async () => {
      console.log('address: ', address);

      const post = PostContract(address);

      const getPostSummary = await post.methods.getPostSummary().call();
      // console.log(postSummary);
      setPostSummary(getPostSummary);

      const commentsCount = await post.methods.getCommentsCount().call();

      const fetchedComments = await Promise.all(
        Array(+commentsCount)
          // @ts-ignore
          .fill()
          .map((_, index) => {
            return post.methods.getCommentSummary(index).call();
          })
      );
      console.log('comments: ', comments);
      setComments(fetchedComments);
    };

    if (address) {
      try {
        getComments();
      } catch (e) {
        console.log(e);
        alert('Failed to fetch comments')
      }
    }
  }, [address]);
  return (
    <Layout>
      {postSummary && (
        <div>
          <Heading mb={4}>{postSummary[1]}</Heading>
          {postSummary[2]}
        </div>
      )}
      {!comments ? <Heading size='xl'>Loading ...</Heading> : <Comments comments={comments} />}
      <CreateComment />
    </Layout>
  );
};

export default Index;
