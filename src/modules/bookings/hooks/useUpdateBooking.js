import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBooking } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useUpdateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
};

export default useUpdateBooking;