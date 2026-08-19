import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import BookingForm from "../components/BookingForm";
import useCreateBooking from "../hooks/useCreateBooking";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BookingCreatePage = () => {
    useDocumentTitle("Create Booking");

    const navigate = useNavigate();

    const {
        mutate,
        isPending,
    } = useCreateBooking();

    const handleCreate = (data) => {
        mutate(data, {
            onSuccess: () => {
                toast.success(
                    "Booking created successfully"
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
        });
    };

    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center justify-between mb-0">

                <h1 className="text-xl font-bold text-gray-600 mb-0">
                    Create Booking
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
                Manually create a booking for a customer
            </p>

            {/* =================================================
                FORM
            ================================================= */}

            <BookingForm
                onSubmit={handleCreate}
                isLoading={isPending}
                onCancel={() =>
                    navigate("/bookings")
                }
            />

        </div>
    );
};

export default BookingCreatePage;