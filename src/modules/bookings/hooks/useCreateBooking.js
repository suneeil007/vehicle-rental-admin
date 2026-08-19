import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBooking } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";


const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        },
    });
};

export default useCreateBooking;