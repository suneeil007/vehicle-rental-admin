import bookingRoutes from "@/modules/bookings/bookingRoutes";
import branchRoutes from "@/modules/branches/branchRoutes";
import invoiceRoutes from "@/modules/invoices/invoiceRoutes";
import paymentRoutes from "@/modules/payments/paymentRoutes";
import TripRoutes from "@/modules/trips/TripRoutes";
import userRoutes from "@/modules/users/userRoutes";
import vehicleCategoryRoutes from "@/modules/vehicleCategories/vehicleCategoryRoutes";
import vehicleRoutes from "@/modules/vehicles/vehicleRoutes";

const moduleRoutes = [
    ...userRoutes,
    ...vehicleCategoryRoutes,
    ...vehicleRoutes,
    ...branchRoutes,
    ...bookingRoutes,
    ...TripRoutes,
    ...paymentRoutes,
    ...invoiceRoutes,
];

export default moduleRoutes;