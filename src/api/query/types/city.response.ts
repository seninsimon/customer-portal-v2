export interface City {
  label: string; 
  value: string; 
}

export interface CitiesResponse {
  success: boolean;
  message: string;
  data: City[];
}
