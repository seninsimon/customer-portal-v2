// src/api/mutations/quote-approve.mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { QuoteApproveRequest } from "../types/approve/approve.request";
import { QuoteApproveResponse } from "../types/approve/approve.response";
import { notifications } from "@mantine/notifications";

export const useQuoteApproveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<QuoteApproveResponse, Error, QuoteApproveRequest>({
    
    mutationFn: async (
      data: QuoteApproveRequest
    ): Promise<QuoteApproveResponse> => {
      const response = await baseService<
        QuoteApproveResponse,
        QuoteApproveRequest
      >({
        method: "POST",
        url: `customer-portal/quote-approve/?docType=${data.docType}&docNo=${data.docNo}`,
        data,
      });

      return response;
    },
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-enquiries"] });

      notifications.show({
        title: "Success",
        message: "Quote approved successfully",
        color: "green",
      });
    },
    
  });
};
