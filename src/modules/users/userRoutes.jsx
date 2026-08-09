import UserListPage from "./pages/UserListPage";
import CreateUserPage from "./pages/CreateUserPage";
import UserEditPage from "./pages/UserEditPage";
import UserViewPage from "./pages/UserViewPage";

const userRoutes = [

    {
        path: "users",
        element: <UserListPage />,
    },

    {
        path: "users/create",
        element: <CreateUserPage />,
    },

    {
        path: "users/:slug/edit",
        element: <UserEditPage />,
    },

    {
        path: "users/:slug",
        element: <UserViewPage />,
    },

];

export default userRoutes;