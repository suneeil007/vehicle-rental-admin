import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVehicle } from "../api/vehicleApi";

const useUpdateVehicle = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Vehicles"]});
        },
    });
};

export default useUpdateVehicle;