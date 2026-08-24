import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useBookings from "../hooks/useBookings";
import useApproveBooking from "../hooks/useApproveBooking";
import useRejectBooking from "../hooks/useRejectBooking";
import useCancelBooking from "../hooks/useCancelBooking";
import useCreateTripFromBooking from "../hooks/useCreateTripFromBooking";
import useRestoreBooking from "../hooks/useRestoreBooking";
import useDeleteBooking from "../hooks/useDeleteBooking";
import useProfile from "../../auth/hooks/useProfile";

import BookingColumns from "../components/BookingColumns";
import BookingTable from "../components/BookingTable";
import BookingToolbar from "../components/BookingToolbar";
import BookingStatusBadges from "../components/BookingStatusBadges";
import DeleteBookingDialog from "../components/DeleteBookingDialog";

import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BookingListPage = () => {
    useDocumentTitle("Bookings");

    const navigate = useNavigate();

    const {
        data: bookings,
        isLoading,
        isError,
    } = useBookings();

    const { data: profile } = useProfile();

    const isSuperAdmin = profile?.role?.slug === "super-admin";

    const { mutate: approveBooking } = useApproveBooking();
    const { mutate: rejectBooking } = useRejectBooking();
    const { mutate: cancelBooking } = useCancelBooking();
    const { mutate: createTrip } = useCreateTripFromBooking();
    const { mutate: restoreBooking } = useRestoreBooking();
    const { mutate: deleteBooking, isPending: isDeleting } =
        useDeleteBooking();

    const [activeStatus, setActiveStatus] = useState("");
    const [pendingActionSlug, setPendingActionSlug] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const allBookings = bookings ?? [];

    const filteredBookings = useMemo(() => {
        if (!activeStatus) return allBookings;

        return allBookings.filter(
            (booking) => booking.status === activeStatus
        );
    }, [allBookings, activeStatus]);

    const withPendingGuard = (slug, mutateFn) => {
        setPendingActionSlug(slug);

        mutateFn(slug, {
            onSettled: () => setPendingActionSlug(null),
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        deleteBooking(deleteTarget.slug, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const columns = BookingColumns({
        onApprove: (booking) =>
            withPendingGuard(booking.slug, approveBooking),

        onReject: (booking) =>
            withPendingGuard(booking.slug, rejectBooking),

        onCancel: (booking) =>
            withPendingGuard(booking.slug, cancelBooking),

        onCreateTrip: (booking) =>
            withPendingGuard(booking.slug, createTrip),

        onRestore: (booking) =>
            withPendingGuard(booking.slug, restoreBooking),

        onEdit: (booking) =>
            navigate(`/bookings/${booking.slug}/edit`),

        onDelete: (booking) =>
            setDeleteTarget(booking),

        isSuperAdmin,
    });

    return (
        <div className="space-y-6">
            <BookingToolbar />

            {isError && (
                <p className="text-destructive">
                    Failed to load bookings.
                </p>
            )}

            <BookingTable
                bookings={filteredBookings}
                columns={columns}
                loading={isLoading}
                toolbarRight={
                    <BookingStatusBadges
                        bookings={allBookings}
                        activeStatus={activeStatus}
                        onSelect={setActiveStatus}
                    />
                }
            />

            <DeleteBookingDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) =>
                    !open && setDeleteTarget(null)
                }
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                booking={deleteTarget}
            />
        </div>
    );
};

export default BookingListPage;