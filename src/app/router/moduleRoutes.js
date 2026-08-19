import bookingRoutes from "@/modules/bookings/bookingRoutes";
import branchRoutes from "@/modules/branches/branchRoutes";
import userRoutes from "@/modules/users/userRoutes";
import vehicleCategoryRoutes from "@/modules/vehicleCategories/vehicleCategoryRoutes";
import vehicleRoutes from "@/modules/vehicles/vehicleRoutes";

const moduleRoutes = [
    ...userRoutes,
    ...vehicleCategoryRoutes,
    ...vehicleRoutes,
    ...branchRoutes,
    ...bookingRoutes,
];

export default moduleRoutes;