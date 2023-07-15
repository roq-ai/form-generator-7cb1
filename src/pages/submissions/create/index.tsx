import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSubmission } from 'apiSdk/submissions';
import { Error } from 'components/error';
import { submissionValidationSchema } from 'validationSchema/submissions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { FormInterface } from 'interfaces/form';
import { UserInterface } from 'interfaces/user';
import { getForms } from 'apiSdk/forms';
import { getUsers } from 'apiSdk/users';
import { SubmissionInterface } from 'interfaces/submission';

function SubmissionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SubmissionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSubmission(values);
      resetForm();
      router.push('/submissions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SubmissionInterface>({
    initialValues: {
      form_id: (router.query.form_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: submissionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Submission
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<FormInterface>
            formik={formik}
            name={'form_id'}
            label={'Select Form'}
            placeholder={'Select Form'}
            fetcher={getForms}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'submission',
    operation: AccessOperationEnum.CREATE,
  }),
)(SubmissionCreatePage);
