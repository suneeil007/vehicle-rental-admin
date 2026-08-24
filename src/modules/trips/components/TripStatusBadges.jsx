import { useMemo } from "react";

const STATUS_LABELS = {
    scheduled: "Scheduled",
    picked_up: "Picked Up",
    on_trip: "On Trip",
    completed: "Completed",
    cancelled: "Cancelled",
};

const STATUS_STYLES = {
    scheduled: "bg-blue-100 text-blue-800",
    picked_up: "bg-amber-100 text-amber-800",
    on_trip: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const STATUS_STYLES_ACTIVE = {
    scheduled: "bg-blue-600 text-white",
    picked_up: "bg-amber-600 text-white",
    on_trip: "bg-purple-600 text-white",
    completed: "bg-green-600 text-white",
    cancelled: "bg-red-600 text-white",
};

/**
 * Status count badges, computed client-side from the already-loaded trips
 * array (TripTable does local filtering/pagination, so no extra API calls
 * are needed for counts).
 *
 * @param {Object} props
 * @param {Array} props.trips - full, unfiltered trips array
 * @param {string} props.activeStatus - currently selected status filter, "" for all
 * @param {(status: string) => void} props.onSelect - called with status, or "" to clear
 */
const TripStatusBadges = ({ trips = [], activeStatus = "", onSelect }) => {
    const counts = useMemo(() => {
        const base = Object.keys(STATUS_LABELS).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        trips.forEach((trip) => {
            if (base[trip.status] !== undefined) {
                base[trip.status] += 1;
            }
        });

        return base;
    }, [trips]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {Object.keys(STATUS_LABELS).map((status) => {
                const isActive = activeStatus === status;
                const styles = isActive
                    ? STATUS_STYLES_ACTIVE[status]
                    : STATUS_STYLES[status];

                return (
                    <button
                        key={status}
                        type="button"
                        onClick={() => onSelect?.(isActive ? "" : status)}
                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${styles}`}
                    >
                        {STATUS_LABELS[status]}
                        <span className="rounded-full bg-white/60 px-1.5 text-[11px] font-semibold">
                            {counts[status]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default TripStatusBadges;