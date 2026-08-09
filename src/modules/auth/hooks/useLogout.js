import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logout as logoutApi } from "../api/authApi";
import useAuthStore from "../store/authStore";

export default function useLogout() {
    const navigate = useNavigate();

    const clearAuth = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: logoutApi,

        onSuccess: () => {
            clearAuth();

            toast.success("Logged out successfully.");

            navigate("/login", { replace: true });
        },

        onError: () => {
            // Even if backend logout fails,
            // clear local session.
            clearAuth();

            navigate("/login", { replace: true });
        },
    });
}