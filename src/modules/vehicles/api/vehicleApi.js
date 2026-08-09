import api from "@/app/services/api";

export const getVehicles = () => {
    return api.get("/vehicles");
};

export const getVehicle = (slug) => {
    return api.get(`/vehicles/${slug}`);
};

export const createVehicle = async (payload) => {
    const response = await api.post("/vehicles", payload);
    return response.data
};

export const updateVehicle = ({ slug, data }) => {
    return api.post(`/vehicles/${slug}`, data);
}; 

export const deleteVehicle = (slug) => {
    return api.delete(`/vehicles/${slug}`);
};


