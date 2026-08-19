import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBookingAction } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelBookingAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Booking cancelled.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to cancel booking."
            );
        },
    });
};

export default useCancelBooking;