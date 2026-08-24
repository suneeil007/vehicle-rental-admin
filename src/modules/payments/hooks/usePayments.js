import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../services/paymentService";
import { paymentKeys } from "../api/paymentKeys";

export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => getPayments(params),
    keepPreviousData: true,
  });
};