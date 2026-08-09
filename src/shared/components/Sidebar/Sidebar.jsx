import { NavLink } from "react-router-dom";
import { useState } from "react";

import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Car,
    CalendarDays,
    Users,
    Wallet,
    Building2,
} from "lucide-react";

const menus = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
    },

    {
        title: "Vehicle Management",
        icon: Car,
        children: [
            {
                title: "Vehicle Categories",
                path: "/vehicle-categories",
            },
            {
                title: "Vehicles",
                path: "/vehicles",
            },
        ],
    },

    {
        title: "Booking Management",
        icon: CalendarDays,
        children: [
            {
                title: "Bookings",
                path: "/bookings",
            },
            {
                title: "Trips",
                path: "/trips",
            },
        ],
    },

    {
        title: "User Management",
        icon: Users,
        children: [
            {
                title: "Users",
                path: "/users",
            },
            {
                title: "Roles",
                path: "/roles",
            },
        ],
    },

    {
        title: "Finance",
        icon: Wallet,
        children: [
            {
                title: "Payments",
                path: "/payments",
            },
            {
                title: "Invoices",
                path: "/invoices",
            },
        ],
    },

    {
        title: "Branch Management",
        icon: Building2,
        children: [
            {
                title: "Branches",
                path: "/branches",
            },
        ],
    },
];

const Sidebar = () => {

    const [openMenus, setOpenMenus] = useState({
        "Vehicle Management": false,
    });

    const toggleMenu = (title) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <aside className="w-72 min-h-screen bg-slate-900 text-white shadow-lg">

            <div className="p-6 border-b border-slate-700">

                <h2 className="text-2xl font-bold">
                    Vehicle Rental
                </h2>

            </div>

            <nav className="p-4 space-y-2">

                {menus.map((menu) => {

                    // Normal menu
                    if (!menu.children) {

                        const Icon = menu.icon;

                        return (

                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-slate-800 text-slate-200"
                                    }`
                                }
                            >

                                <Icon size={18} />

                                {menu.title}

                            </NavLink>

                        );

                    }

                    // Dropdown menu
                    const Icon = menu.icon;

                    return (

                        <div key={menu.title}>

                            <button
                                onClick={() => toggleMenu(menu.title)}
                                className="
                                        w-full
                                        flex
                                        items-center
                                        justify-between
                                        px-4
                                        py-3
                                        rounded-lg
                                        hover:bg-slate-800
                                        transition-all
                                        duration-200
                                    "
                            >

                                <div className="flex items-center gap-3">

                                    <Icon size={18} />

                                    <span>{menu.title}</span>

                                </div>

                                <ChevronRight
                                    size={18}
                                    className={`
                                        transition-transform
                                        duration-300
                                        ${
                                            openMenus[menu.title]
                                                ? "rotate-90"
                                                : ""
                                        }
                                    `}
                                />

                            </button>

                            <div
                                className={`
                                    overflow-hidden
                                    transition-all
                                    duration-300
                                    ease-in-out
                                    ${
                                        openMenus[menu.title]
                                            ? "max-h-96 opacity-100 mt-2"
                                            : "max-h-0 opacity-0"
                                    }
                                `}
                            >
                                <div className="ml-10 space-y-1">

                                    {menu.children.map((child) => (

                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            className={({ isActive }) =>
                                                `
                                                flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-2
                                                rounded-md
                                                text-sm
                                                transition-all
                                                duration-200
                                                ${
                                                    isActive
                                                        ? "bg-blue-600 text-white"
                                                        : "text-slate-300 hover:bg-slate-800 hover:translate-x-1"
                                                }
                                                `
                                            }
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                            {child.title}
                                        </NavLink>

                                    ))}

                                </div>
                            </div>

                        </div>

                    );

                })}

            </nav>

        </aside>
    );
};

export default Sidebar;