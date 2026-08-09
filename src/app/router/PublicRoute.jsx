import { Navigate } from "react-router-dom";
import useAuthStore from "../../modules/auth/store/authStore";

const PublicRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;