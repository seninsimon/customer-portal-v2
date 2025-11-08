import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { MyQuotesResponse } from "./types/my-quotes/my-quotes.response";

export const useMyQuotesQuery = (docType: string) => {
  return useQuery<MyQuotesResponse, Error>({
    queryKey: ["customer-enquiries", docType],
    queryFn: async () => {
      const response = await baseService<MyQuotesResponse, void>({
        method: "GET",
        url: `customer-portal/customer-enquiry-list/${docType}/`,
      });
      return response;
    },
    staleTime: 1000 * 60 * 60,
  });
};
