import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { EnquiryRequest } from "../types/enquires/enqueryRequest";
import { EnquiryResponse } from "../types/enquires/enquiry.response";




export const useEnquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<EnquiryResponse, Error, EnquiryRequest>({
    mutationFn: async (data) => {
      const response = await baseService<EnquiryResponse, EnquiryRequest>({
        method: "POST",
        url: "customer-portal/customer-enquiry/",
        data: data,
      });
      return response;
    },
    retry: 1,
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["customer-enquiries"] });
    },
  });
};
