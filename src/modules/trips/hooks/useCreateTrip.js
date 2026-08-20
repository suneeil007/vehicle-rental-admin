import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitCreateTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useCreateTrip = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitCreateTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tripKeys.all });
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
