import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitPickupTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";
import { vehicleKeys } from "../../vehicles/api/vehicleKeys";

const usePickupTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitPickupTrip,
        onSuccess: (data, trip) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip) });

            /*
            | Pickup doesn't change vehicle status in this design
            | (vehicle stays "booked" through scheduled -> picked_up),
            | but invalidating here keeps the vehicle cache consistent
            | in case that ever changes.
            */
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

            toast.success("Vehicle handed over successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to hand over vehicle."
            );
        },
    });
};

export default usePickupTrip;