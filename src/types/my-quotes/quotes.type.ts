
export interface Quote {
  id: string;
  docType: string;
  quoteNumber: string;
  submittedDate: string;
  submittedTime: string;
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
  destinationCntryDocNo?: string;
  originCntryDocNo?: string;
  weight: string;
  type: string;
  service: string;
  mode: string;
  createdBy: string;
}

export interface  QuotesTableProps {
  onView?: (quoteId: string) => void;
  onEdit?: (quoteId: string) => void;
}