import { useQuery } from "@tanstack/react-query";
import { fetchTrip } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useTrip = (trip) => {
    return useQuery({
        queryKey: tripKeys.detail(trip),
        queryFn: () => fetchTrip(trip),
        enabled: !!trip,
    });
};

export default useTrip;
