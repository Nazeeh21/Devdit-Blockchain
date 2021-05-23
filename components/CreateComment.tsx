import { Button } from '@chakra-ui/button';
import { Box, Heading } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from './InputField';
import PostContract from '../ethereum/Post';
import { useRouter } from 'next/dist/client/router';
// @ts-ignore
import web3 from '../ethereum/web3';

const CreateComment: React.FC<{}> = ({}) => {
  const router = useRouter();
  const address = router.query.id;
  // useIsAuth();
  return (
    <Box mt={10}>
      <Heading fontSize='xl' mb={2}>
        Create Comment
      </Heading>
      <Formik
        initialValues={{ text: '' }}
        onSubmit={async (values) => {
          // console.log('creating comments');
          // console.log(values);
          if (
            !localStorage.getItem('username') ||
            !localStorage.getItem('isUserRegistered')
          ) {
            router.replace('/register?next=' + router.asPath);
          }
          try {
            const post = PostContract(address);
            // @ts-ignore
            const accounts = await web3.eth.getAccounts();
            await post.methods
              .createComment(values.text, localStorage.getItem('username'))
              .send({ from: accounts[0] });

            router.reload();
          } catch (e) {
            console.log(e);
            alert('Failed creating comment');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='text' placeholder='comment' label='Comment' />
            <Button
              mt={4}
              mb={2}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Create Comment
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateComment;
