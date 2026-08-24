import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../services/invoiceService";
import { invoiceKeys } from "../api/invoiceKeys";

export const useInvoices = (params = {}) => {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => getInvoices(params),
    keepPreviousData: true,
  });
};


export default useInvoices;