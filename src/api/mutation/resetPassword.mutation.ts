import { useMutation } from "@tanstack/react-query";
import { baseService } from "../base.service";

interface ResetPasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useResetPasseword = () => {
  return useMutation({
    mutationFn: async (data : ResetPasswordPayload) => {
      const response = await baseService({
        method: "POST",
        url: "/customer-portal/reset-password/",
        data: data,
      });

      return response;
    },
    retry: 1,
  });
};