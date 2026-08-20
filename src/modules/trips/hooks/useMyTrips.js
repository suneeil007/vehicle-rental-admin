import { useQuery } from "@tanstack/react-query";
import { fetchMyTrips } from "../services/tripService";
import { tripKeys } from "../api/tripKeys";

const useMyTrips = (params) => {
    return useQuery({
        queryKey: tripKeys.mine,
        queryFn: () => fetchMyTrips(params),
    });
};

export default useMyTrips;
