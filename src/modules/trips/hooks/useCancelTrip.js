import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCancelTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useCancelTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCancelTrip,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({
                queryKey: tripKeys.detail(variables.trip),
            });
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
