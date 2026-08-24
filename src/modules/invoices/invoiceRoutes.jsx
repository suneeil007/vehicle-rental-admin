import { lazy } from "react";

const InvoiceListPage = lazy(() => import("./pages/InvoiceListPage"));
const InvoiceDetailPage = lazy(() => import("./pages/InvoiceDetailPage"));

const invoiceRoutes = [
  {
    path: "/invoices",
    element: <InvoiceListPage />,
  },
  {
    path: "/invoices/:slug",
    element: <InvoiceDetailPage />,
  },
];

export default invoiceRoutes;