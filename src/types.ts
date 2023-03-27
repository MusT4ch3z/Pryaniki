export interface IUser {
  error_code: number;
  error_message: string;
  data: IUserData;
}

export interface IUserData {
  token: string;
}

export interface ICompany {
  error_code: number;
  error_message: string;
  data: ICompanyData[];
}

export interface ICompanyData {
  id?: string;
  documentStatus: string;
  employeeNumber: string;
  documentType: string;
  documentName: string;
  companySignatureName: string;
  employeeSignatureName: string;
  employeeSigDate: string;
  companySigDate: string;
  isEditMode?: boolean;
  isNewCompany?: boolean;
}
