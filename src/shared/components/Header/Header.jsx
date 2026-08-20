import { useState } from "react";
import {
    LogOut,
    User,
    ChevronDown,
    Moon,
    Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../modules/auth/store/authStore";
import useLogout from "../../../modules/auth/hooks/useLogout";

import { useTheme } from "@/components/theme/ThemeProvider";

const Header = () => {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const [open, setOpen] = useState(false);

    const {
        mutate: logout,
        isPending,
    } = useLogout();

    const {
        theme,
        toggleTheme,
    } = useTheme();

    const handleProfile = () => {
        setOpen(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setOpen(false);
        logout();
    };

    const handleThemeToggle = () => {
        toggleTheme();
    };

    return (
        <header
            className="
                sticky
                top-0
                z-40
                h-16

                bg-white
                dark:bg-gray-950

                border-b
                border-slate-200
                dark:border-gray-800

                px-6

                flex
                items-center
                justify-between

                transition-colors
                duration-200
            "
        >
            {/* =====================================================
                LEFT SIDE
            ====================================================== */}

            <div>
                <h1
                    className="
                        text-lg
                        font-semibold
                        text-slate-800
                        dark:text-gray-100
                    "
                >
                    Vehicle Rental Admin
                </h1>

                <p
                    className="
                        text-xs
                        text-slate-400
                        dark:text-gray-500
                    "
                >
                    Management Dashboard
                </p>
            </div>


            {/* =====================================================
                RIGHT SIDE
            ====================================================== */}

            <div className="flex items-center gap-2">

                {/* =================================================
                    THEME TOGGLE
                ================================================= */}

                <button
                    type="button"
                    onClick={handleThemeToggle}
                    title={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        dark:bg-gray-900

                        text-slate-600
                        dark:text-gray-300

                        hover:bg-slate-100
                        dark:hover:bg-gray-800

                        transition-all
                        duration-200

                        cursor-pointer
                    "
                >
                    {theme === "dark" ? (
                        <Sun
                            size={18}
                            className="text-yellow-400"
                        />
                    ) : (
                        <Moon
                            size={18}
                            className="text-slate-600"
                        />
                    )}
                </button>


                {/* =================================================
                    USER MENU
                ================================================= */}

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
                            dark:hover:bg-gray-800

                            transition-all
                            duration-200

                            cursor-pointer
                        "
                    >

                        {/* USER NAME
                            Currently hidden exactly like
                            your existing code.
                        */}

                        <div className="text-right hidden">

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    dark:text-gray-100
                                "
                            >
                                {user?.name || "User"}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-left
                                    text-slate-500
                                    dark:text-gray-400
                                "
                            >
                                {user?.role?.name ||
                                    "Administrator"}
                            </p>

                        </div>


                        {/* USER AVATAR */}

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


                        {/* CHEVRON */}

                        <ChevronDown
                            size={17}
                            className={`
                                text-slate-500
                                dark:text-gray-400

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


                    {/* =================================================
                        DROPDOWN
                    ================================================= */}

                    {open && (
                        <>
                            {/* =========================================
                                OVERLAY
                            ========================================== */}

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


                            {/* =========================================
                                MENU
                            ========================================== */}

                            <div
                                className="
                                    absolute
                                    right-0
                                    mt-2
                                    w-60

                                    rounded-xl

                                    border
                                    border-slate-200
                                    dark:border-gray-700

                                    bg-white
                                    dark:bg-gray-900

                                    shadow-xl

                                    overflow-hidden

                                    animate-in
                                    fade-in
                                    slide-in-from-top-2
                                    duration-200
                                "
                            >

                                {/* =====================================
                                    USER INFO
                                ====================================== */}

                                <div
                                    className="
                                        px-4
                                        py-3

                                        border-b
                                        border-slate-200
                                        dark:border-gray-700
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                            dark:text-gray-100
                                        "
                                    >
                                        {user?.name || "User"}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-gray-400
                                            mt-0.5
                                        "
                                    >
                                        {user?.role?.name ||
                                            "Administrator"}
                                    </p>

                                </div>


                                {/* =====================================
                                    PROFILE
                                ====================================== */}

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
                                        dark:text-gray-200

                                        hover:bg-slate-50
                                        dark:hover:bg-gray-800

                                        transition

                                        cursor-pointer
                                    "
                                >

                                    <User size={18} />

                                    <span>
                                        Profile
                                    </span>

                                </button>


                                {/* =====================================
                                    DIVIDER
                                ====================================== */}

                                <div
                                    className="
                                        border-t
                                        border-slate-200
                                        dark:border-gray-700
                                    "
                                />


                                {/* =====================================
                                    LOGOUT
                                ====================================== */}

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
                                        dark:text-red-400

                                        hover:bg-red-50
                                        dark:hover:bg-red-950/40

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

            </div>

        </header>
    );
};

export default Header;