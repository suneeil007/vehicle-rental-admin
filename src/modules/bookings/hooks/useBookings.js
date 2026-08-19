import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "../services/bookingService";
import { bookingKeys } from "../api/bookingKeys";


const useBookings = () => {
    return useQuery({
        queryKey: bookingKeys.all,
        queryFn: fetchBookings,
    });
};

export default useBookings;