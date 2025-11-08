export interface FollowUpResponse {
    data: Datum[];
    statusCode: number;
    message: string;
    metadata: string;
}

export interface Datum {
    docNo: string;
    docType: string;
    supplier: string;
    AWB: null;
    carrier: string;
    bookingId: string;
    customer: string;
    desc: null;
    status: null;
    location: null;
    bookingDate: string;
    latestStatusDate: string;
    remarks: string;
}
