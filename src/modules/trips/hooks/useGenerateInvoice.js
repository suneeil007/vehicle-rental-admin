import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitGenerateInvoice } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

// NOTE: Invoice module doesn't exist yet. This hook fires the endpoint and
// invalidates the trip so its `invoice` relation (once added to
// TripResource) reflects the newly generated invoice. Revisit once the
// Invoice module's pages/routes exist so we can redirect to the invoice.
const useGenerateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitGenerateInvoice,
        onSuccess: (data, trip) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip) });
            toast.success("Invoice generated successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to generate invoice."
            );
        },
    });
};

export default useGenerateInvoice;
