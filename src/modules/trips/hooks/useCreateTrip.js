import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCreateTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";
import { vehicleKeys } from "../../vehicles/api/vehicleKeys";

const useCreateTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCreateTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });

            /*
            | Creating a trip sets the vehicle's status to booked -
            | invalidate the vehicle module's cache too, or the
            | Vehicle list page keeps showing stale status.
            */
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

            toast.success("Trip created successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to create trip."
            );
        },
    });
};

export default useCreateTrip;