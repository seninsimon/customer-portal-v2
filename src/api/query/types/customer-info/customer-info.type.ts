export interface Customer {
  customerName: string;
  mobile: string;
  email: string;
  address: string | null;
  contactName: string | null;
}

export interface CustomerDetailsResponse {
  data: Customer;
  statusCode: number;
  message: string;
  metadata: string;
}
