import * as yup from 'yup';

export const submissionValidationSchema = yup.object().shape({
  form_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
