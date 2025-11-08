import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { CitiesResponse, City } from "./types/city.response";

export const useCitiesQuery = (cntryDocNo: string | null) => {
  return useQuery<City[], Error>({
    queryKey: ["cities", cntryDocNo], // cache per country
    queryFn: async () => {
      const response = await baseService<CitiesResponse, void>({
        method: "GET",
        url: `/dropdown/CITY/?cntryDocNo=${cntryDocNo}`,
      });
      return response.data;
    },
    enabled: !!cntryDocNo, // prevents running if null/undefined
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
};
