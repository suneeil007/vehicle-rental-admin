import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitUpdateTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useUpdateTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitUpdateTrip,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
            queryClient.invalidateQueries({
                queryKey: tripKeys.detail(variables.trip),
            });
            toast.success("Trip updated successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to update trip."
            );
        },
    });
};

export default useUpdateTrip;
