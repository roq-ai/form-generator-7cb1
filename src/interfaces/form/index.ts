import { SubmissionInterface } from 'interfaces/submission';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface FormInterface {
  id?: string;
  name: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  submission?: SubmissionInterface[];
  company?: CompanyInterface;
  _count?: {
    submission?: number;
  };
}

export interface FormGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  company_id?: string;
}
