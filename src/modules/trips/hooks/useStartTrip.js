import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitStartTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";
import { vehicleKeys } from "../../vehicles/api/vehicleKeys";

const useStartTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitStartTrip,
        onSuccess: (data, trip) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip) });

            /*
            | Starting a trip flips the vehicle's status to on_trip -
            | invalidate the vehicle module's cache too, or the
            | Vehicle list page keeps showing stale status.
            */
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

            toast.success("Trip started successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to start trip."
            );
        },
    });
};

export default useStartTrip;