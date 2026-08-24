import { useQuery } from "@tanstack/react-query";
import { getInvoiceBySlug } from "../services/invoiceService";
import { invoiceKeys } from "../api/invoiceKeys";

export const useInvoice = (slug) => {
  return useQuery({
    queryKey: invoiceKeys.detail(slug),
    queryFn: () => getInvoiceBySlug(slug),
    enabled: !!slug,
  });
};