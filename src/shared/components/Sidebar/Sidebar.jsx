import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

import { menus } from "./sidebarMenus";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    const [openMenus, setOpenMenus] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Automatically handle active dropdown
    |--------------------------------------------------------------------------
    |
    | Example:
    | /vehicle-categories
    |      ↓
    | Vehicle Management automatically opens
    |
    | Then:
    | /
    |      ↓
    | Vehicle Management automatically closes
    |
    */

    useEffect(() => {
        const activeParent = menus.find(
            (menu) =>
                menu.children &&
                menu.children.some(
                    (child) =>
                        location.pathname === child.path ||
                        location.pathname.startsWith(
                            `${child.path}/`
                        )
                )
        );

        if (activeParent) {
            setOpenMenus({
                [activeParent.title]: true,
            });
        } else {
            setOpenMenus({});
        }
    }, [location.pathname]);

    /*
    |--------------------------------------------------------------------------
    | Toggle dropdown
    |--------------------------------------------------------------------------
    */

    const toggleMenu = (title) => {
        if (collapsed) {
            setCollapsed(false);

            setOpenMenus({
                [title]: true,
            });

            return;
        }

        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <aside
            className={`
                fixed
                left-0
                top-0
                z-50
                h-screen
                bg-slate-900
                text-white
                shadow-xl
                flex
                flex-col
                transition-all
                duration-300
                ease-in-out

                ${collapsed ? "w-20" : "w-72"}
            `}
        >
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div
                className={`
                    h-16
                    flex
                    items-center
                    border-b
                    border-slate-700
                    transition-all
                    duration-300

                    ${
                        collapsed
                            ? "justify-center px-3"
                            : "justify-between px-4"
                    }
                `}
            >
                {!collapsed && (
                    <div
                        className="
                            overflow-hidden
                            whitespace-nowrap
                            transition-all
                            duration-300
                        "
                    >
                        <h2 className="text-lg font-bold tracking-wide">
                            Vehicle Rental
                        </h2>

                        <p className="text-xs text-slate-400 mt-0.5">
                            Administration
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() =>
                        setCollapsed((prev) => !prev)
                    }
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {collapsed ? (
                        <PanelLeftOpen size={21} />
                    ) : (
                        <PanelLeftClose size={21} />
                    )}
                </button>
            </div>

            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <nav
                className="
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    p-3
                    text-sm
                    space-y-1
                "
            >
                {menus.map((menu) => {
                    const Icon = menu.icon;

                    /*
                    |--------------------------------------------------------------------------
                    | NORMAL MENU
                    |--------------------------------------------------------------------------
                    */

                    if (!menu.children) {
                        return (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                end
                                title={
                                    collapsed
                                        ? menu.title
                                        : undefined
                                }
                                className={({ isActive }) =>
                                    `
                                    group
                                    relative
                                    flex
                                    items-center
                                    h-11
                                    rounded-lg
                                    transition-all
                                    duration-200
                                    text-sm
                                    cursor-pointer

                                    ${
                                        collapsed
                                            ? "justify-center px-0"
                                            : "gap-3 px-3"
                                    }

                                    ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }
                                    `
                                }
                            >
                                <Icon
                                    size={19}
                                    className="
                                        shrink-0
                                        transition-transform
                                        duration-200
                                        group-hover:scale-110
                                    "
                                />

                                <span
                                    className={`
                                        whitespace-nowrap
                                        overflow-hidden
                                        transition-all
                                        duration-300
                                        text-sm

                                        ${
                                            collapsed
                                                ? "w-0 opacity-0"
                                                : "w-auto opacity-100"
                                        }
                                    `}
                                >
                                    {menu.title}
                                </span>

                                {/* Tooltip */}

                                {collapsed && (
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-16
                                            z-50
                                            whitespace-nowrap
                                            rounded-md
                                            bg-slate-800
                                            px-3
                                            py-2
                                            text-xs
                                            text-white
                                            opacity-0
                                            translate-x-[-5px]
                                            shadow-lg
                                            transition-all
                                            duration-200
                                            group-hover:opacity-100
                                            group-hover:translate-x-0
                                        "
                                    >
                                        {menu.title}
                                    </span>
                                )}
                            </NavLink>
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | CHECK ACTIVE CHILD
                    |--------------------------------------------------------------------------
                    */

                    const isParentActive =
                        menu.children.some(
                            (child) =>
                                location.pathname ===
                                    child.path ||
                                location.pathname.startsWith(
                                    `${child.path}/`
                                )
                        );

                    /*
                    |--------------------------------------------------------------------------
                    | DROPDOWN OPEN STATE
                    |--------------------------------------------------------------------------
                    */

                    const isOpen =
                        !collapsed &&
                        openMenus[menu.title];

                    return (
                        <div key={menu.title}>
                            {/* =================================================
                                PARENT BUTTON
                            ================================================== */}

                            <button
                                type="button"
                                onClick={() =>
                                    toggleMenu(menu.title)
                                }
                                title={
                                    collapsed
                                        ? menu.title
                                        : undefined
                                }
                                className={`
                                    group
                                    relative
                                    w-full
                                    flex
                                    items-center
                                    h-11
                                    rounded-lg
                                    transition-all
                                    duration-200
                                    cursor-pointer

                                    ${
                                        collapsed
                                            ? "justify-center px-0"
                                            : "justify-between px-3"
                                    }

                                    ${
                                        isParentActive
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }
                                `}
                            >
                                <div
                                    className={`
                                        flex
                                        items-center

                                        ${
                                            collapsed
                                                ? "justify-center"
                                                : "gap-3"
                                        }
                                    `}
                                >
                                    <Icon
                                        size={19}
                                        className={`
                                            shrink-0
                                            transition-all
                                            duration-200
                                            group-hover:scale-110

                                            ${
                                                isParentActive
                                                    ? "text-blue-400"
                                                    : "text-slate-300"
                                            }
                                        `}
                                    />

                                    <span
                                        className={`
                                            whitespace-nowrap
                                            overflow-hidden
                                            transition-all
                                            duration-300
                                            text-sm

                                            ${
                                                collapsed
                                                    ? "w-0 opacity-0"
                                                    : "w-auto opacity-100"
                                            }
                                        `}
                                    >
                                        {menu.title}
                                    </span>
                                </div>

                                {!collapsed && (
                                    <ChevronRight
                                        size={17}
                                        className={`
                                            shrink-0
                                            transition-all
                                            duration-300

                                            ${
                                                isOpen
                                                    ? "rotate-90 text-blue-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    />
                                )}

                                {/* Tooltip */}

                                {collapsed && (
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-16
                                            z-50
                                            whitespace-nowrap
                                            rounded-md
                                            bg-slate-800
                                            px-3
                                            py-2
                                            text-xs
                                            text-white
                                            opacity-0
                                            translate-x-[-5px]
                                            shadow-lg
                                            transition-all
                                            duration-200
                                            group-hover:opacity-100
                                            group-hover:translate-x-0
                                        "
                                    >
                                        {menu.title}
                                    </span>
                                )}
                            </button>

                            {/* =================================================
                                CHILDREN
                            ================================================== */}

                            <div
                                className={`
                                    grid
                                    transition-all
                                    duration-300
                                    ease-in-out

                                    ${
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }
                                `}
                            >
                                <div className="overflow-hidden">
                                    <div
                                        className="
                                            ml-5
                                            mt-1
                                            pl-4
                                            border-l
                                            border-slate-700
                                            space-y-1
                                        "
                                    >
                                        {menu.children.map(
                                            (child) => (
                                                <NavLink
                                                    key={
                                                        child.path
                                                    }
                                                    to={
                                                        child.path
                                                    }
                                                    className={({
                                                        isActive,
                                                    }) =>
                                                        `
                                                        group
                                                        relative
                                                        flex
                                                        items-center
                                                        gap-2
                                                        px-3
                                                        py-2.5
                                                        rounded-md
                                                        text-sm
                                                        transition-all
                                                        duration-200

                                                        ${
                                                            isActive
                                                                ? "bg-blue-600 text-white shadow-sm"
                                                                : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                                                        }
                                                        `
                                                    }
                                                >
                                                    <span
                                                        className={`
                                                            w-1.5
                                                            h-1.5
                                                            rounded-full
                                                            shrink-0
                                                            transition-all
                                                            duration-200

                                                            ${
                                                                location.pathname ===
                                                                child.path
                                                                    ? "bg-white scale-125"
                                                                    : "bg-slate-500 group-hover:bg-white"
                                                            }
                                                        `}
                                                    />

                                                    <span className="truncate">
                                                        {
                                                            child.title
                                                        }
                                                    </span>
                                                </NavLink>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* =====================================================
                BOTTOM
            ====================================================== */}

            <div
                className="
                    border-t
                    border-slate-700
                    p-3
                "
            >
                <div
                    className={`
                        flex
                        items-center
                        rounded-lg
                        bg-slate-800
                        transition-all
                        duration-300

                        ${
                            collapsed
                                ? "justify-center p-2"
                                : "gap-3 p-3"
                        }
                    `}
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-xs
                            font-bold
                        "
                    >
                        VR
                    </div>

                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium whitespace-nowrap">
                                Vehicle Rental
                            </p>

                            <p className="text-xs text-slate-400 whitespace-nowrap">
                                Admin Panel
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;