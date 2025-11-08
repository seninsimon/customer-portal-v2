import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { DetailedTrackingResponse } from "./types/detailed-tracking/detailed-tracking.response";

export const useDetailedTrackingQuery = ({ bookingDocNo }: { bookingDocNo: string }) => {
  return useQuery<DetailedTrackingResponse, Error>({
    queryKey: ["tracking-details", bookingDocNo],
    queryFn: async () => {
      const response = await baseService<DetailedTrackingResponse, void>({
        method: "GET",
        url: `customer-portal/get-tracking/SO/${bookingDocNo}/`,
      });
      return response;
    },
    enabled: !!bookingDocNo,
    staleTime: 1000 * 60 * 60,
  });
};
