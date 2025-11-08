export interface Quote {
  id: string;
  docType: string;
  quoteNumber: string; // from docNo
  submittedDate: string; // from date
  submittedTime: string; // from time
  status:
    | "Raised"
    | "Processing"
    | "Completed"
    | "Confirmed"
    | "Expired"
    | "Active"
    | null;
  origin: string;
  destination: string;
  weight: string;
  type: string;
  service: string;
  mode: string;
  createdBy: string;
}

export interface CustomerEnquiryResponse {
  data: [
    {
      docType: string;
      docNo: string;
      date: string;
      time: string;
      status: string | null;
      origin: string;
      destination: string;
      destinationCntryDocNo: string;
      originCntryDocNo: string;
      weight: string;
      type: string;
      service: string;
      mode: string;
      createdBy: string;
    }
  ];
}