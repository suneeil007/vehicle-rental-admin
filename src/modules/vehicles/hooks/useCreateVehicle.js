import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle } from "../api/vehicleApi";
import { vehicleKeys } from "../api/vehicleKeys";



const useCreateVehicle = () => {

    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
        },
    });

};

export default useCreateVehicle;
