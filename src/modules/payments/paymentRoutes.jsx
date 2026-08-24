import { lazy } from "react";

const PaymentListPage = lazy(
    () => import("./pages/PaymentListPage")
);

const PaymentDetailsPage = lazy(
    () => import("./pages/PaymentDetailsPage")
);

const PaymentReceiptPage = lazy(
    () => import("./pages/PaymentReceiptPage")
);

const paymentRoutes = [
    {
        path: "/payments",
        element: <PaymentListPage />,
    },
    {
        path: "/payments/:slug",
        element: <PaymentDetailsPage />,
    },
    {
        path: "/payments/:slug/receipt",
        element: <PaymentReceiptPage />,
    },
];

export default paymentRoutes;