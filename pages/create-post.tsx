import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import PostFactory from '../ethereum/PostFactory';
// @ts-ignore
import web3 from '../ethereum/web3';

interface createPostProps {}

const createPost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();

  return (
    <Layout>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          // console.log(values);
          try {
            // @ts-ignore
            const accounts = await web3.eth.getAccounts();
            await PostFactory.methods
              .deployPost(values.title, values.text)
              .send({ from: accounts[0] });
            router.push('/');
          } catch (e) {
            console.log(e);
            alert('Error while creating post');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='title' label='Title' />
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='text...'
                label='Body'
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default createPost;
