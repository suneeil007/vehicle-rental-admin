import { useMemo } from "react";

const STATUS_LABELS = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
    trip_created: "Trip Created",
    completed: "Completed",
};

const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
    trip_created: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
};

const STATUS_STYLES_ACTIVE = {
    pending: "bg-yellow-600 text-white",
    approved: "bg-blue-600 text-white",
    rejected: "bg-red-600 text-white",
    cancelled: "bg-red-600 text-white",
    trip_created: "bg-purple-600 text-white",
    completed: "bg-green-600 text-white",
};

/**
 * Booking status count badges.
 *
 * Counts are calculated client-side from the already-loaded bookings array.
 *
 * @param {Object} props
 * @param {Array} props.bookings - full, unfiltered bookings array
 * @param {string} props.activeStatus - currently selected status filter, "" for all
 * @param {(status: string) => void} props.onSelect - called with status, or "" to clear
 */
const BookingStatusBadges = ({
    bookings = [],
    activeStatus = "",
    onSelect,
}) => {
    const counts = useMemo(() => {
        const base = Object.keys(STATUS_LABELS).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        bookings.forEach((booking) => {
            if (base[booking.status] !== undefined) {
                base[booking.status] += 1;
            }
        });

        return base;
    }, [bookings]);

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
                        onClick={() =>
                            onSelect?.(isActive ? "" : status)
                        }
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

export default BookingStatusBadges;