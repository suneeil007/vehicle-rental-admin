import userRoutes from "@/modules/users/userRoutes";
import vehicleCategoryRoutes from "@/modules/vehicleCategories/vehicleCategoryRoutes";
import vehicleRoutes from "@/modules/vehicles/vehicleRoutes";

const moduleRoutes = [
    ...userRoutes,
    ...vehicleCategoryRoutes,
    ...vehicleRoutes
];

export default moduleRoutes;