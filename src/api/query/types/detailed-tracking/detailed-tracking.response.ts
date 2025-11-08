export interface DetailedTrackingResponse {
    data: Data;
    statusCode: number;
    message: string;
    metadata: string;
}

export interface Data {
    followUpData: FollowUpDatum[];
    trackingData: TrackingData;
}

export interface FollowUpDatum {
    type: string;
    docNo: string;
    stage: null;
    status: string;
    docSrNo: number;
    docType: string;
    remarks: string;
    timeUtc: null;
    toEmail: null;
    dateTime: string;
    location: null;
    nextDate: null;
    awbNumber: null;
    createdBy: string;
    createdTs: string;
    subStatus: null;
    isNextDate: boolean;
    statusText: string;
    description: null;
    emailSentBy: null;
    emailSentTime: null;
}

export interface TrackingData {
    error: string;
    carrier: string;
    awbNumber: string;
    errorCode: string;
    isTracking: boolean;
    carrierLogo: string;
    contactEmail: string;
    trackingLink: string;
    contactPerson: string;
}
