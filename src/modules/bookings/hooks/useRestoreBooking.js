import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingKeys } from "../api/bookingKeys";
import { restoreBookingAction } from "../services/bookingService";

const useRestoreBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreBookingAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Booking restored.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to restore booking."
            );
        },
    });
};

export default useRestoreBooking;