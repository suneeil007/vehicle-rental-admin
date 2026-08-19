import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import BookingForm from "../components/BookingForm";
import useBooking from "../hooks/useBooking";
import useUpdateBooking from "../hooks/useUpdateBooking";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BookingEditPage = () => {
    useDocumentTitle("Edit Booking");

    const { slug } = useParams();
    const navigate = useNavigate();

    const {
        data: booking,
        isLoading,
    } = useBooking(slug);

    const {
        mutate,
        isPending,
    } = useUpdateBooking();

    const handleUpdate = (data) => {
        mutate(
            {
                booking: slug,
                ...data,
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Booking updated successfully"
                    );

                    navigate("/bookings");
                },

                onError: (error) => {
                    const errors =
                        error.response?.data?.errors;

                    if (errors) {
                        Object.values(errors)
                            .flat()
                            .forEach(
                                (message) => {
                                    toast.error(
                                        message
                                    );
                                }
                            );

                        return;
                    }

                    toast.error(
                        error.response?.data
                            ?.message ||
                            "Something went wrong"
                    );
                },
            }
        );
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (isLoading) {
        return (
            <p className="text-gray-500 text-sm">
                Loading booking...
            </p>
        );
    }

    /* =========================================================
       BOOKING NOT FOUND
    ========================================================= */

    if (!booking) {
        return (
            <div className="space-y-4">
                <p className="text-red-500 text-sm">
                    Booking not found.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/bookings")
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Back to Bookings
                </button>
            </div>
        );
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center justify-between mb-0">

                <h1 className="text-xl font-bold text-gray-600 mb-0">
                    Edit Booking
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/bookings")
                    }
                    className="h-10 w-10 flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-white transition cursor-pointer relative top-[10px]"
                    title="Bookings List"
                >
                    <List className="h-4 w-4" />
                </button>

            </div>

            <p className="text-gray-500 text-sm">
                Update booking details
            </p>

            {/* =================================================
                FORM
            ================================================= */}

            <BookingForm
                defaultValues={booking}
                onSubmit={handleUpdate}
                isLoading={isPending}
                onCancel={() =>
                    navigate("/bookings")
                }
            />
            

        </div>
    );
};

export default BookingEditPage;