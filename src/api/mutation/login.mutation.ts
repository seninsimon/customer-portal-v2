import { useMutation } from "@tanstack/react-query"
import { baseService } from "../base.service";
import { LoginResponse } from "./types/login/login.response";
import { LoginRequest } from "./types/login/login.request";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      const response = await baseService<LoginResponse, LoginRequest>({
        method: "POST",
        url: "auth/login/",
        data: data,
        skipTokenCheck: true,
      });

      return response;
    },
    retry: 1,
  });
};
