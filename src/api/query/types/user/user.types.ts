export interface User {
  docNo: string;
  docType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userName: string;
  status: string;
  roleDocNo: string;
  usgDocNo: string[];
}

export interface MeResponse {
  data: {
    user: User;
  };
  statusCode: number;
  message: string;
  metadata: string;
}