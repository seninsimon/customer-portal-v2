export interface EnquiryRequest {
  docDate: Date;
  stmDocNo: string;
  cusDocNo: string;
  originCountry: string;
  destinationCountry: string;
  slmDocNo: string;
  grossWeight: number;
  totalPackage?: number;
  totalWeight?: number;
  volumeWeight?: number;
  chargeableWeight?: number;
  time: string;
  dimFactor?: number;
  isStackable?: boolean;
  isDangerous?: boolean;
  isNonStackable?: boolean;
  isFreightService?: boolean;
  enqDetails: EnquiryDetail[];
}

export interface EnquiryDetail {
  id: string;
  actWeight: number;
  length: number;
  breadth: number;
  height: number;
  volumeWeight: number;
  girth: number;
  chargeableWeight: number;
  status: string;
  quantity: number;
  lengthInCm: number;
  breadthInCm: number;
  heightInCm: number;
  actWeightInKg: number;
}