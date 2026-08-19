import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectBookingAction } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useRejectBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectBookingAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Booking rejected.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to reject booking."
            );
        },
    });
};

export default useRejectBooking;