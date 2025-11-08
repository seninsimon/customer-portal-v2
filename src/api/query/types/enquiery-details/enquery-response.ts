// types/enquiry.types.ts
export interface ItemDetail {
  docNo: string;
  girth: number;
  docSrNo: number;
  docType: string;
  quantity: number;
  actWeight: number;
  heightInCm: number;
  lengthInCm: number;
  breadthInCm: number;
  chargeableWeight: number;
}

export interface Enquiry {
  docType: string;
  docNo: string;
  prevDocNo: string | null;
  date: string;
  time: string | null;
  status: string;
  originCntryDocNo: string;
  origin: string;
  destinationCntryDocNo: string;
  destination: string;
  weight: string;
  type: string; // e.g. "Export"
  service: string | null;
  mode: string;
  createdBy: string;
  approvedBy: string;
  awb: string | null;
  itemdetails: ItemDetail[];
}

export interface EnquiryResponse {
  data: Enquiry[];
  statusCode: number;
  message: string;
  metadata: string;
}
