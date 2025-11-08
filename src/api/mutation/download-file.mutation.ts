import { useMutation } from "@tanstack/react-query";
import { downloadBlob } from "@/utils/download-pdf/download-pdf.utility";
import { notifications } from "@mantine/notifications";
import { baseService } from "../base.service";

export const useDownloadQuote = () => {
  return useMutation<{ blob: Blob; docNo: string }, Error, { docType: string; docNo: string }>({
    mutationFn: async ({docNo, docType}) => {
      const blob = await baseService<Blob, void>({
        method: "GET",
        url: `/customer-portal/quote-download/${docType}/1/?docNo=${docNo}`,
        responseType: "blob",
      });

      return { blob, docNo };
    },

    onSuccess: ({ blob, docNo }) => {
      downloadBlob(blob, `${docNo}.pdf`);
      notifications.show({
        title: "PDF",
        message: "Your quote will be downloaded soon",
        color: "green",
      });
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while downloading the quote.";

      notifications.show({
        title: "Download failed",
        message,
        color: "red",
      });
    },
  });
};
