import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { AdsResponse } from "./types/ads/ads.response";

export const useAdsQuery = () => {
  return useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const response = await baseService<AdsResponse, void>({
        method: "GET",
        url: "customer-portal/get-ads/?docType=AD",
      });
      return response;
    },
    staleTime: 1000 * 60 * 60,
  });
};
