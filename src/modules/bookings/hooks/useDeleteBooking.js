import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeBooking } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useDeleteBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Booking deleted successfully.");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to delete booking."
            );
        },
    });
};

export default useDeleteBooking;