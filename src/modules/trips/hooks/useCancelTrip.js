import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCancelTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";
import { vehicleKeys } from "../../vehicles/api/vehicleKeys";

const useCancelTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCancelTrip,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({
                queryKey: tripKeys.detail(variables.trip),
            });

            /*
            | Cancelling a trip frees the vehicle back to available -
            | invalidate the vehicle module's cache too, or the
            | Vehicle list page keeps showing stale status.
            */
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

            toast.success("Trip cancelled successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to cancel trip."
            );
        },
    });
};

export default useCancelTrip;