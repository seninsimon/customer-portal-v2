

import { useQuery } from "@tanstack/react-query";
import { baseService } from "../base.service";
import { MeResponse, User } from "./types/user/user.types";


export const useMeQuery = () => {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await baseService<MeResponse, void>({
        method: "GET",
        url: "auth/me/",
      });
      return response.data.user;
    },
  });
};
