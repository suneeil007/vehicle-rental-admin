import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitPickupTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const usePickupTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitPickupTrip,
        onSuccess: (data, trip) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip) });
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
