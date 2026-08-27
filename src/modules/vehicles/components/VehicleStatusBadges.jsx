import { useMemo } from "react";

/*
|--------------------------------------------------------------------------
| Status configuration
|--------------------------------------------------------------------------
*/

const STATUS_CONFIG = {
    available: {
        label: "Available",
        style: "bg-green-100 text-green-700",
        activeStyle: "bg-green-600 text-white",
    },

    booked: {
        label: "Booked",
        style: "bg-blue-100 text-blue-700",
        activeStyle: "bg-blue-600 text-white",
    },

    on_trip: {
        label: "On trip",
        style: "bg-orange-100 text-orange-700",
        activeStyle: "bg-orange-600 text-white",
    },

    maintenance: {
        label: "Maintenance",
        style: "bg-yellow-100 text-yellow-700",
        activeStyle: "bg-yellow-600 text-white",
    },

    inactive: {
        label: "Inactive",
        style: "bg-gray-100 text-gray-600",
        activeStyle: "bg-gray-600 text-white",
    },
};

/*
|--------------------------------------------------------------------------
| Normalize status
|--------------------------------------------------------------------------
|
| Handles:
|
| available
| Available
| AVAILABLE
| on_trip
| on trip
| On Trip
| on-trip
|
*/

export const normalizeVehicleStatus = (status) => {
    if (status === null || status === undefined) {
        return "";
    }

    return String(status)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
};

/*
|--------------------------------------------------------------------------
| Vehicle Status Badges
|--------------------------------------------------------------------------
*/

const VehicleStatusBadges = ({
    vehicles = [],
    activeStatus = "",
    onSelect,
}) => {
    const normalizedActiveStatus =
        normalizeVehicleStatus(activeStatus);

    /*
    |--------------------------------------------------------------------------
    | Calculate counts
    |--------------------------------------------------------------------------
    */

    const counts = useMemo(() => {
        const result = {
            available: 0,
            booked: 0,
            on_trip: 0,
            maintenance: 0,
            inactive: 0,
        };

        if (!Array.isArray(vehicles)) {
            return result;
        }

        vehicles.forEach((vehicle) => {
            const status = normalizeVehicleStatus(
                vehicle?.status
            );

            if (
                Object.prototype.hasOwnProperty.call(
                    result,
                    status
                )
            ) {
                result[status] += 1;
            }
        });

        return result;
    }, [vehicles]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {Object.entries(STATUS_CONFIG).map(
                ([status, config]) => {
                    const isActive =
                        normalizedActiveStatus === status;

                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => {
                                const nextStatus =
                                    isActive
                                        ? ""
                                        : status;

                                onSelect?.(nextStatus);
                            }}
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                whitespace-nowrap
                                rounded-full
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition
                                cursor-pointer
                                ${
                                    isActive
                                        ? config.activeStyle
                                        : config.style
                                }
                            `}
                        >
                            <span>
                                {config.label}
                            </span>

                            <span
                                className={`
                                    rounded-full
                                    px-1.5
                                    text-[11px]
                                    font-semibold
                                    ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-white/60"
                                    }
                                `}
                            >
                                {counts[status]}
                            </span>
                        </button>
                    );
                }
            )}
        </div>
    );
};

export default VehicleStatusBadges;