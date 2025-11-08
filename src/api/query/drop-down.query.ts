import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";

interface DropDownResponse<T> {
  data: T[];
}

export function useDropDown<T>(docType: string) {
  return useQuery<T[], Error>({
    queryKey: ["dropdown", docType],
    queryFn: async () => {
      const response = await baseService<DropDownResponse<T>, void>({
        method: "GET",
        url: `/dropdown/${docType}/`,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
}
