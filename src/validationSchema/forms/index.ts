import * as yup from 'yup';

export const formValidationSchema = yup.object().shape({
  name: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
