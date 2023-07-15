import { FormInterface } from 'interfaces/form';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SubmissionInterface {
  id?: string;
  form_id: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  form?: FormInterface;
  user?: UserInterface;
  _count?: {};
}

export interface SubmissionGetQueryInterface extends GetQueryInterface {
  id?: string;
  form_id?: string;
  user_id?: string;
}
