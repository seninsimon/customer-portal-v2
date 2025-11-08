import { ERRORS } from "@/constants/errors.constants";
import axios, { Method, ResponseType } from "axios";

export interface AxiosConfig<TRequest> {
  method: Method;
  url: string;
  data?: TRequest;
  headers?: Record<string, string>;
  responseType?: ResponseType;
}

export async function axiosConfig<TResponse, TRequest>({
  method,
  url,
  data,
  headers,
  responseType,
}: AxiosConfig<TRequest>): Promise<TResponse> {
  try {
    const response = await axios({
      method,
      data,
      url: process.env.NEXT_PUBLIC_BASE_URL + url,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      responseType,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data ?? error ?? { message: ERRORS.UNEXPECTED };
  }
}
