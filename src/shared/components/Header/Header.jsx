import { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../modules/auth/store/authStore";
import useLogout from "../../../modules/auth/hooks/useLogout";

const Header = () => {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const [open, setOpen] = useState(false);

    const { mutate: logout, isPending } = useLogout();

    const handleProfile = () => {
        setOpen(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setOpen(false);
        logout();
    };

    return (
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

            <h1 className="text-xl font-semibold text-gray-800">
                Vehicle Rental Admin
            </h1>

            <div className="relative">

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                >
                    <div className="text-right">
                        <p className="font-semibold text-gray-800">
                            {user?.name || "User"}
                        </p>

                        <p className="text-sm text-gray-500">
                            {user?.role?.name || ""}
                        </p>
                    </div>

                    <ChevronDown
                        size={18}
                        className={`transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg overflow-hidden z-50">

                        <button
                            type="button"
                            onClick={handleProfile}
                            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </button>

                        <hr />

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isPending}
                            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                            <LogOut size={18} />

                            <span>
                                {isPending ? "Logging out..." : "Logout"}
                            </span>
                        </button>

                    </div>
                )}

            </div>

        </header>
    );
};

export default Header;