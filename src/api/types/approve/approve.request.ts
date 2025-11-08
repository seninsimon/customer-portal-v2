export interface QuoteApproveRequest {
  docType: string;
  docNo: string;
  approvedBy?: string;
  approvedTs?: string; // ISO timestamp
  remarks: string;
  contactEmail: string;
  contactNo: string;
  contactPerson: string;
  consignee: string;
  consigneeAddress: string;
  consigneeAddress1: string;
  consigneeCityDocNo: string;
  consigneeContactPerson: string;
  consigneeEmail: string;
  consigneeMobile: string;
  consigneePhone: string;
  consigneePostalCode: string;
  shipper: string;
  shipperAddress: string;
  shipperAddress1: string;
  shipperCityDocNo: string;
  shipperContactPerson: string;
  shipperEmail: string;
  shipperMobile: string;
  shipperPhone: string;
}