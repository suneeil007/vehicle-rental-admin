import {
    getVehicleCategories,
    getVehicleCategory,
    createVehicleCategory,
    updateVehicleCategory,
    deleteVehicleCategory,
} from "../api/vehicleCategoryApi";

const vehicleCategoryService = {

    getAll() {
        return getVehicleCategories()
            .then((res) => res.data);
    },

    get(slug) {
        return getVehicleCategory(slug)
            .then((res) => res.data);
    },

    create(data) {
        return createVehicleCategory(data);
    },

    update(slug, data) {
        return updateVehicleCategory(slug, data)
            .then((res) => res.data);
    },

    delete(slug) {
        return deleteVehicleCategory(slug)
            .then((res) => res.data);
    },

};

export default vehicleCategoryService;