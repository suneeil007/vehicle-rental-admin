import { lazy } from "react";

const TripListPage = lazy(() => import("./pages/TripListPage"));
const TripCreatePage = lazy(() => import("./pages/TripCreatePage"));
const TripEditPage = lazy(() => import("./pages/TripEditPage"));
const TripDetailPage = lazy(() => import("./pages/TripDetailPage"));

const tripRoutes = [
    { path: "trips", element: <TripListPage /> },
    { path: "trips/create", element: <TripCreatePage /> },
    { path: "trips/:slug", element: <TripDetailPage /> },
    { path: "trips/:slug/edit", element: <TripEditPage /> },
];

export default tripRoutes;
