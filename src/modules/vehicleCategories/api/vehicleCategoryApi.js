import api from "../../../app/services/api";


export const getVehicleCategories = () => {
    return api.get("/vehicle-categories");
};


export const getVehicleCategory = (slug) => {
    return api.get(`/vehicle-categories/${slug}`);
};


export const createVehicleCategory = async (payload) => {
    const response = await api.post(
        "/vehicle-categories",
        payload
    );
    return response.data;

};


export const updateVehicleCategory = ({ slug, data }) => {
    return api.post(
        `/vehicle-categories/${slug}`,
        data
    );
};


export const deleteVehicleCategory = (slug) => {
    return api.delete(
        `/vehicle-categories/${slug}`
    );

};