import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCompleteTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";
import { vehicleKeys } from "../../vehicles/api/vehicleKeys";

const useCompleteTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCompleteTrip,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({
                queryKey: tripKeys.detail(variables.trip),
            });

            /*
            | Completing a trip frees the vehicle back to available -
            | invalidate the vehicle module's cache too, or the
            | Vehicle list page keeps showing stale status.
            */
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

            toast.success("Trip completed successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to complete trip."
            );
        },
    });
};

export default useCompleteTrip;