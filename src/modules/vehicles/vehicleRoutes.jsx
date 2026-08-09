import { lazy } from "react";
import { Navigate } from "react-router-dom";

const VehicleListPage = lazy(() => import("./pages/VehicleListPage"));
const VehicleCreatePage = lazy(() => import("./pages/VehicleCreatePage"));
const VehicleEditPage = lazy(() => import("./pages/VehicleEditPage"));

const vehicleRoutes = [
    {
        path: "vehicles",
        element: <VehicleListPage />,
    },
    {
        path: "vehicles/create",
        element: <VehicleCreatePage />,
    },
    {
        path: "vehicles/:slug/edit",
        element: <VehicleEditPage />,
    },
];

export default vehicleRoutes;