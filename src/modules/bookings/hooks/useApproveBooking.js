import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveBooking } from "../api/bookingApi";
import { bookingKeys } from "../api/bookingKeys";
import { approveBookingAction } from "../services/bookingService";

const useApproveBooking = () => {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: approveBookingAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
            toast.success("Booking approved");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ?? "Failed to approve booking."
            );
        },
    });
};

export default useApproveBooking;