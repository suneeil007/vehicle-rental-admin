import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../api/vehicleApi";
import { vehicleKeys } from "../api/vehicleKeys";

const useVehicles = () => {
    return useQuery({
        queryKey: vehicleKeys.all,
        queryFn: async () => {
            const response = await getVehicles();
            return response.data.data;
        },
    });
};

export default useVehicles;