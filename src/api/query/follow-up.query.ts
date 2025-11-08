import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { FollowUpResponse } from "./types/follow-up/follow-up.response";
import { FollowUpParams } from "./types/follow-up/follow-up.params";

export const useBookingFollowUpQuery = ({ fromDate, toDate }: FollowUpParams) => {
  return useQuery<FollowUpResponse, Error>({
    queryKey: ["booking-follow-ups", fromDate, toDate],
    queryFn: async () => {
      const response = await baseService<FollowUpResponse, void>({
        method: "GET",
        url: `customer-portal/get-booking-follow-up/SO/?fromDate=${fromDate}&toDate=${toDate}`,
      });
      return response;
    },
    enabled: !!fromDate && !!toDate,
    staleTime: 1000 * 60 * 5,
  });
};
