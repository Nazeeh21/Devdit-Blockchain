import { Button } from '@chakra-ui/button';
import { Box, Heading } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField } from './InputField';

const CreateComment: React.FC<{}> = ({}) => {
  return (
    <Box mt={6}>
      <Heading fontSize='xl' mb={2}>
        Create Comment
      </Heading>
      <Formik
        initialValues={{ text: '' }}
        onSubmit={async (values) => {
          console.log('creating comments');
          console.log(values);
          
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
