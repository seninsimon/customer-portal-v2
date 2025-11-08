/* ---------------- Follow-up Event ---------------- */
export type FollowUpEvent = {
  type: string;
  docNo: string;
  stage: string | null;
  status: string;
  docSrNo: number;
  docType: string;
  remarks: string | null;
  timeUtc: string | null;
  toEmail: string | null;
  dateTime: string; // ISO datetime string
  location: string | null;
  nextDate: string | null;
  awbNumber: string | null;
  createdBy: string;
  createdTs: string; // ISO datetime string
  subStatus: string | null;
  isNextDate: boolean;
  statusText: string;
  description: string | null;
  emailSentBy: string | null;
  emailSentTime: string | null;
};

/* ---------------- Tracking Data ---------------- */
export type TrackingData = {
  error: string | null;
  carrier: string | null;
  awbNumber: string | null;
  errorCode: string | null;
  isTracking: boolean;
  carrierLogo: string | null;
  contactEmail: string | null;
  trackingLink: string | null;
  contactPerson: string | null;
};

/* ---------------- API Response ---------------- */
export type FollowUpApiResponse = {
  data: {
    followUpData: FollowUpEvent[];
    trackingData: TrackingData;
  };
  statusCode: number;
  message: string;
  metadata: string | null;
};
