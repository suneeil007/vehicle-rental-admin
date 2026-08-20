import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitStartTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useStartTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitStartTrip,
        onSuccess: (data, trip) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip) });
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
