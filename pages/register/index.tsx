import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import PostFactory from '../../ethereum/PostFactory';
// @ts-ignore
import web3 from '../../ethereum/web3';
import { useIsAuth } from '../../utils/useIsAuth';

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
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
            const isUserRegistered = await PostFactory.methods
              .isUserRegistered(accounts[0])
              .call();
            if (isUserRegistered) {
              localStorage.setItem('isUserRegistered', isUserRegistered);
              localStorage.setItem('username', values.username);

              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else {
                router.push('/');
              }
            }
          } catch (e) {
            setErrors(e);
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
