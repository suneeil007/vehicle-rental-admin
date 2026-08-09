import VehicleCategoryListPage from "./pages/VehicleCategoryListPage";
import VehicleCategoryCreatePage from "./pages/VehicleCategoryCreatePage";
import VehicleCategoryEditPage from "./pages/VehicleCategoryEditPage";

const vehicleCategoryRoutes = [

    {
        path: "vehicle-categories",
        element: <VehicleCategoryListPage />,
    },

    {
        path: "vehicle-categories/create",
        element: <VehicleCategoryCreatePage />,
    },

    {
        path: "vehicle-categories/:slug/edit",
        element: <VehicleCategoryEditPage />,
    },

];

export default vehicleCategoryRoutes;