import { useQuery } from "@tanstack/react-query";
import { fetchBooking } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";

const useBookings = (booking) => {
    return useQuery({
        queryKey: bookingKeys.detail(booking),
        queryFn: () => fetchBooking(booking),
        enabled: Boolean(booking),
    })
}

export default useBookings;