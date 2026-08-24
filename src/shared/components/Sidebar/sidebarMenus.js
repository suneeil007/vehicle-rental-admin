import {
    LayoutDashboard,
    Car,
    CalendarDays,
    Users,
    Wallet,
    Building2,
} from "lucide-react";

export const menus = [
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
                children: [
                    {
                        title: "All Payments",
                        path: "/payments",
                    },
                    {
                        title: "Advance & Deposits",
                        path: "/payments?type=advance,deposit",
                    },
                    {
                        title: "Final Settlements",
                        path: "/payments?type=final",
                    },
                    {
                        title: "Refunds",
                        path: "/payments?type=refund",
                    },
                ],
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