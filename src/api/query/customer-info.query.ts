import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { CustomerDetailsResponse } from "./types/customer-info/customer-info.type";

export const useCustomerInfo = () => {
  return useQuery({
    queryKey: ["customer-info"],
    queryFn: async () => {
      const response = await baseService<CustomerDetailsResponse, void>({
        method: "GET",
        url: "customer-portal/get-customer-details",
      });
      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
};
