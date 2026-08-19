import { lazy } from "react";

const BookingListPage = lazy(() => import("./pages/BookingListPage"));
const BookingCreatePage = lazy(() => import("./pages/BookingCreatePage"));
const BookingEditPage = lazy(() => import("./pages/BookingEditPage"));

const bookingRoutes = [
    { path: "bookings", element: <BookingListPage /> },
    { path: "bookings/create", element: <BookingCreatePage /> },
    { path: "bookings/:slug/edit", element: <BookingEditPage /> },
];

export default bookingRoutes;