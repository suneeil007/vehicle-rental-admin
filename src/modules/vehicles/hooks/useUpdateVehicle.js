import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVehicle } from "../api/vehicleApi";
import { vehicleKeys } from "../api/vehicleKeys";

const useUpdateVehicle = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
        },
    });
};

export default useUpdateVehicle;