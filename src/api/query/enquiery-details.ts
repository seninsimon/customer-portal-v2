    import { useQuery } from "@tanstack/react-query";
    import { baseService } from "../base.service";
    import { EnquiryResponse } from "../types/enquires/enquiry.response";


    export const useEnquiryDetails = (docType: string, docNo: string) => {
    return useQuery<EnquiryResponse>({
        queryKey: ["EnquiryDetails", docType, docNo],
        queryFn: async () => {
        const response = await baseService<EnquiryResponse, void>({
            method: "GET",
            url: `customer-portal/customer-enquiry-details/${docType}/${docNo}/`,
        });
        return response;
        },
        enabled: !!docType && !!docNo, 
    });
    };
