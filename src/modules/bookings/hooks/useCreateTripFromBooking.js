import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTripAction } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useCreateTripFromBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTripAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Trip created from booking.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to create trip."
            );
        },
    });
};

export default useCreateTripFromBooking;