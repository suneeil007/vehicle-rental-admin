import { useQuery } from "@tanstack/react-query";

import {
    getVehicles,
    getAvailableVehicles,
} from "../api/vehicleApi";

import { vehicleKeys } from "../api/vehicleKeys";

/*
|--------------------------------------------------------------------------
| Normalize Vehicle API Response
|--------------------------------------------------------------------------
|
| Supports:
|
| response.data.data
| response.data
| response
| response.data.vehicles
| response.vehicles
|
*/

const normalizeVehicleResponse = (response) => {

    if (Array.isArray(response?.data?.data)) {
        return response.data.data;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data?.vehicles)) {
        return response.data.vehicles;
    }

    if (Array.isArray(response?.vehicles)) {
        return response.vehicles;
    }

    return [];
};


/*
|--------------------------------------------------------------------------
| useVehicles
|--------------------------------------------------------------------------
*/

const useVehicles = ({
    availableOnly = false,
} = {}) => {

    return useQuery({

        queryKey: [
            ...vehicleKeys.all,
            availableOnly
                ? "available"
                : "all",
        ],

        queryFn: async () => {

            const response = availableOnly
                ? await getAvailableVehicles()
                : await getVehicles();

            return normalizeVehicleResponse(
                response
            );
        },

    });
};

export default useVehicles;