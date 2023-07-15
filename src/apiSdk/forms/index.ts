import axios from 'axios';
import queryString from 'query-string';
import { FormInterface, FormGetQueryInterface } from 'interfaces/form';
import { GetQueryInterface } from '../../interfaces';

export const getForms = async (query?: FormGetQueryInterface) => {
  const response = await axios.get(`/api/forms${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createForm = async (form: FormInterface) => {
  const response = await axios.post('/api/forms', form);
  return response.data;
};

export const updateFormById = async (id: string, form: FormInterface) => {
  const response = await axios.put(`/api/forms/${id}`, form);
  return response.data;
};

export const getFormById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/forms/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFormById = async (id: string) => {
  const response = await axios.delete(`/api/forms/${id}`);
  return response.data;
};
