export interface FollowUp {
  type: string;
  docNo: string;
  stage: string | null;
  status: string | null;
  docSrNo: number;
  docType: string;
  remarks: string | null;
  timeUtc: string | null;
  toEmail: string | null;
  dateTime: string;
  location: string | null;
  nextDate: string | null;
  awbNumber: string | null;
  createdBy: string;
  createdTs: string;
  subStatus: string | null;
  isNextDate: boolean;
  statusText: string | null;
  description: string | null;
  emailSentBy: string | null;
  emailSentTime: string | null;
}

export interface TrackingData {
  error?: string | null;
  carrier: string;
  awbNumber: string | null;
  errorCode?: string | null;
  isTracking: boolean;
  carrierLogo?: string | null;
  contactEmail?: string | null;
  trackingLink?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
}

export interface TrackingDetailsResponse {
  data: {
    followUpData: FollowUp[];
    trackingData: TrackingData;
  };
  statusCode: number;
  message: string;
  metadata: string;
}
