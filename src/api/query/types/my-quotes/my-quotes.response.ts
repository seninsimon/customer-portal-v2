export interface MyQuotesResponse {
  data: Datum[];
  statusCode: number;
  message: string;
  metadata: string;
}

export interface Datum {
  docType: string;
  docNo: string;
  date: string | Date;
  quoteId: string;
  bookingId:string;
  awb?: string 
  time: string;
  status: string | null;
  originCntryDocNo: string;
  origin: string;
  destinationCntryDocNo: string;
  destination: string;
  weight: string;
  type: string;
  service: string;
  mode: string;
  createdBy: string;
  approvedBy: string;
  
  
}
