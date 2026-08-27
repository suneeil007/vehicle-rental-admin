import api from "@/app/services/api";

/*
|--------------------------------------------------------------------------
| Get All Vehicles
|--------------------------------------------------------------------------
*/
export const getVehicles = () => {
    return api.get("/vehicles");
};


/*
|--------------------------------------------------------------------------
| Get Available Vehicles
|--------------------------------------------------------------------------
|
| Used when creating a new booking.
| Backend returns only vehicles that are currently available.
|
*/
export const getAvailableVehicles = () => {
    return api.get("/vehicles/available");
};


/*
|--------------------------------------------------------------------------
| Get Single Vehicle
|--------------------------------------------------------------------------
*/
export const getVehicle = (slug) => {
    return api.get(`/vehicles/${slug}`);
};


/*
|--------------------------------------------------------------------------
| Create Vehicle
|--------------------------------------------------------------------------
*/
export const createVehicle = async (payload) => {
    const response = await api.post("/vehicles", payload);

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Vehicle
|--------------------------------------------------------------------------
*/
export const updateVehicle = ({ slug, data }) => {
    return api.post(`/vehicles/${slug}`, data);
};


/*
|--------------------------------------------------------------------------
| Delete Vehicle
|--------------------------------------------------------------------------
*/
export const deleteVehicle = (slug) => {
    return api.delete(`/vehicles/${slug}`);
};