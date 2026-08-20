import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCompleteTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useCompleteTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCompleteTrip,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({
                queryKey: tripKeys.detail(variables.trip),
            });
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
