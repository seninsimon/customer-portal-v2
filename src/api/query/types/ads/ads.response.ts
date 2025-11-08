export interface Ad {
  docNo: string;
  docType: string;
  title: string | null;
  description: string | null;
  file: string;
}

export interface AdsResponse {
  data: Ad[];
  statusCode: number;
  message: string;
  metadata: string | null;
}
