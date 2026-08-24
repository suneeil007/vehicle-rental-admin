import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordPayment } from "../services/paymentService";
import { paymentKeys } from "../api/paymentKeys";

/**
 * Records a new payment. Does NOT handle toast internally —
 * toast is handled at the dialog/page level (mirrors Booking/Trip create hooks).
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      // Invoice totals (paid_amount/due_amount) are derived server-side from
      // payments, so invalidate invoice queries too if the invoice is already loaded.
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};