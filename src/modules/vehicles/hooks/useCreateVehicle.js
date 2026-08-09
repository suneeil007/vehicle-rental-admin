import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle } from "../api/vehicleApi";


const useCreateVehicle = () => {

    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });

};

export default useCreateVehicle;
