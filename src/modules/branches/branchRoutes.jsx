import { lazy } from "react";

const BranchListPage = lazy(() => import("./pages/BranchListPage"));
const BranchCreatePage = lazy(() => import("./pages/BranchCreatePage"));
const BranchEditPage = lazy(() => import("./pages/BranchEditPage"));

const branchRoutes = [
    { path: "branches", element: <BranchListPage /> },
    { path: "branches/create", element: <BranchCreatePage /> },
    { path: "branches/:slug/edit", element: <BranchEditPage /> },
];

export default branchRoutes;