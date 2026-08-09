import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "../api/vehicleApi";

const useVehicle = (slug) => {
    return useQuery({
        queryKey: ["vehicles", slug],
        queryFn: async () => {
            const response = await getVehicle(slug);
            return response.data.data;
        },
    });
};

export default  useVehicle;