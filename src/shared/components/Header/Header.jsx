import { useState } from "react";
import {
    LogOut,
    User,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../modules/auth/store/authStore";
import useLogout from "../../../modules/auth/hooks/useLogout";

const Header = () => {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const [open, setOpen] = useState(false);

    const {
        mutate: logout,
        isPending,
    } = useLogout();

    const handleProfile = () => {
        setOpen(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setOpen(false);
        logout();
    };

    return (
        <header
            className="
                sticky
                top-0
                z-40
                h-16
                bg-white
                border-b
                border-slate-200
                px-6
                flex
                items-center
                justify-between
            "
        >
            <div>
                <h1 className="text-lg font-semibold text-slate-800">
                    Vehicle Rental Admin
                </h1>

                <p className="text-xs text-slate-400">
                    Management Dashboard
                </p>
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() =>
                        setOpen((prev) => !prev)
                    }
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-1.5
                        hover:bg-slate-100
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                >
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                            {user?.name || "User"}
                        </p>

                        <p className="text-xs text-slate-500">
                            {user?.role?.name || "Administrator"}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-white
                            font-semibold
                            text-sm
                            cursor-pointer
                        "
                    >
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                    <ChevronDown
                        size={17}
                        className={`
                            text-slate-500
                            transition-transform
                            duration-300
                            cursor-pointer
                            ${
                                open
                                    ? "rotate-180"
                                    : ""
                            }
                        `}
                    />
                </button>

                {open && (
                    <>
                        {/* Overlay */}
                        <div
                            className="
                                fixed
                                inset-0
                                z-[-1]
                            "
                            onClick={() =>
                                setOpen(false)
                            }
                        />

                        <div
                            className="
                                absolute
                                right-0
                                mt-2
                                w-60
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-xl
                                overflow-hidden
                                animate-in
                                fade-in
                                slide-in-from-top-2
                                duration-200
                            "
                        >
                            <div className="px-4 py-3 border-b">
                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.name || "User"}
                                </p>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    {user?.role?.name || "Administrator"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleProfile}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-700
                                    hover:bg-slate-50
                                    transition
                                    cursor-pointer
                                "
                            >
                                <User size={18} />

                                <span>
                                    Profile
                                </span>
                            </button>

                            <div className="border-t" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isPending}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-600
                                    hover:bg-red-50
                                    transition
                                    disabled:opacity-50
                                    cursor-pointer
                                "
                            >
                                <LogOut size={18} />

                                <span>
                                    {isPending
                                        ? "Logging out..."
                                        : "Logout"}
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;