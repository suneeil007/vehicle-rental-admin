import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "../api/vehicleApi";
import { vehicleKeys } from "../api/vehicleKeys";

const useVehicle = (slug) => {
    return useQuery({
        queryKey: vehicleKeys.detail(slug),
        queryFn: async () => {
            const response = await getVehicle(slug);
            return response.data.data;
        },
    });
};

export default useVehicle;