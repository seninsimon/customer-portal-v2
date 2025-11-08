export interface Country {
  label: string; 
  value: string; 
}

export interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
}