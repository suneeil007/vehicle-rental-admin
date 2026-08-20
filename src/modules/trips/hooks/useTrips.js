import { useQuery } from "@tanstack/react-query";
import { fetchTrips } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useTrips = (params) => {
    return useQuery({
        queryKey: params ? [...tripKeys.all, params] : tripKeys.all,
        queryFn: () => fetchTrips(params),
    });
};

export default useTrips;
