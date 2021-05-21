import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import PostFactory from '../../ethereum/PostFactory';
// @ts-ignore
import web3 from '../../ethereum/web3';

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  return (
    <Layout>
      <Formik
        initialValues={{ username: '' }}
        onSubmit={async (values, { setErrors }) => {
          // @ts-ignore

          const accounts = await web3.eth.getAccounts();

          console.log(accounts);

          try {
            await PostFactory.methods.registerUser(values.username).send({
              from: accounts[0],
            });
          } catch (e) {
            setErrors(e)
          }
          // console.log(values.username);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default index;
