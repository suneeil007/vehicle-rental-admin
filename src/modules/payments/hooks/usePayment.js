import { useQuery } from "@tanstack/react-query";
import { getPaymentBySlug } from "../services/paymentService";
import { paymentKeys } from "../api/paymentKeys";

export const usePayment = (slug) => {
    return useQuery({
        queryKey: paymentKeys.detail(slug),
        queryFn: () => getPaymentBySlug(slug),
        enabled: !!slug,
    });
};