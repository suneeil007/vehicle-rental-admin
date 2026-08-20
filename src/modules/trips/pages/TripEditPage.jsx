import { useNavigate, useParams } from "react-router-dom";

import useTrip from "../hooks/useTrip";
import useUpdateTrip from "../hooks/useUpdateTrip";
import TripForm from "../components/TripForm";
import { List } from "lucide-react";

// =========================================================
// DATETIME LOCAL FORMAT
// datetime-local inputs need "YYYY-MM-DDTHH:mm"
// =========================================================

const toLocalInputValue = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(
        date.getMonth() + 1
    )}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
};


// =========================================================
// PAGE
// =========================================================

const TripEditPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { data: trip, isLoading } = useTrip(slug);
    const updateTrip = useUpdateTrip();

    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {
        return <p>Loading trip...</p>;
    }

    if (!trip) {
        return <p>Trip not found.</p>;
    }


    // =====================================================
    // DEFAULT VALUES
    // =====================================================

    const defaultValues = {
        // -------------------------------------------------
        // CUSTOMER
        // -------------------------------------------------

        customer_id:
            trip.customer?.id ??
            trip.customer_id ??
            "",


        // -------------------------------------------------
        // VEHICLE
        // -------------------------------------------------

        vehicle_id:
            trip.vehicle?.id ??
            trip.vehicle_id ??
            "",


        // -------------------------------------------------
        // RENTAL TYPE
        // DO NOT CHANGE THIS
        // -------------------------------------------------

        rental_type: trip.rental_type,


        // -------------------------------------------------
        // DRIVER
        // -------------------------------------------------

        driver_id:
            trip.driver?.id ??
            trip.driver_id ??
            "",


        // -------------------------------------------------
        // PICKUP / DROP
        // -------------------------------------------------

        pickup_branch_id:
            trip.pickup_branch?.id ??
            trip.pickup_branch_id ??
            "",

        drop_branch_id:
            trip.drop_branch?.id ??
            trip.drop_branch_id ??
            "",

        pickup_location:
            trip.pickup_location ?? "",

        drop_location:
            trip.drop_location ?? "",


        // -------------------------------------------------
        // DATES
        // -------------------------------------------------

        pickup_at: toLocalInputValue(trip.pickup_at),

        expected_return_at: toLocalInputValue(
            trip.expected_return_at
        ),


        // =================================================
        // VEHICLE CONDITION
        // =================================================

        // Pickup Odometer
        pickup_odometer:
            trip.pickup_odometer ??
            "",

        // Return Odometer
        return_odometer:
            trip.return_odometer ??
            "",

        // Pickup Fuel
        pickup_fuel:
            trip.pickup_fuel ??
            "",

        // Return Fuel
        return_fuel:
            trip.return_fuel ??
            "",


        // =================================================
        // BILLING
        // =================================================

        // Base Amount
        base_amount:
            trip.base_amount !== null &&
            trip.base_amount !== undefined
                ? Number(trip.base_amount)
                : "",

        // Extra KM Charge
        extra_km_charge:
            trip.extra_km_charge !== null &&
            trip.extra_km_charge !== undefined
                ? Number(trip.extra_km_charge)
                : 0,

        // Late Return Charge
        late_return_charge:
            trip.late_return_charge !== null &&
            trip.late_return_charge !== undefined
                ? Number(trip.late_return_charge)
                : 0,

        // Damage Charge
        damage_charge:
            trip.damage_charge !== null &&
            trip.damage_charge !== undefined
                ? Number(trip.damage_charge)
                : 0,

        // Fuel Charge
        fuel_charge:
            trip.fuel_charge !== null &&
            trip.fuel_charge !== undefined
                ? Number(trip.fuel_charge)
                : 0,


        // -------------------------------------------------
        // NOTES
        // -------------------------------------------------

        pickup_notes:
            trip.pickup_notes ?? "",
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (values) => {
        updateTrip.mutate(
            {
                trip: trip.slug,
                ...values,
            },
            {
                onSuccess: () => {
                    navigate(`/trips/${trip.slug}`);
                },
            }
        );
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-4">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h1 className="text-xl font-bold text-gray-600">
                            Edit Trip
                        </h1>


                        {/* =====================================
                            STATUS
                        ===================================== */}

                        <span
                            className={`
                                inline-flex
                                items-center
                                rounded-md
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                capitalize
                                ${
                                    trip.status === "scheduled"
                                        ? "bg-blue-50 text-blue-700"
                                        : trip.status === "picked_up"
                                        ? "bg-amber-50 text-amber-700"
                                        : trip.status === "on_trip"
                                        ? "bg-purple-50 text-purple-700"
                                        : trip.status === "completed"
                                        ? "bg-green-50 text-green-700"
                                        : trip.status === "cancelled"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            {trip.status?.replace("_", " ")}
                        </span>

                    </div>


                    <p className="mt-1 text-sm text-gray-500">
                        Update trip details
                    </p>

                </div>


                {/* =================================================
                    TRIPS LIST BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() => navigate("/trips")}
                    className="
                        flex
                        h-10
                        w-10
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-md
                        bg-blue-50
                        text-blue-600
                        transition
                        hover:bg-blue-100
                    "
                    title="Trips List"
                >
                    <List className="h-4 w-4" />
                </button>

            </div>


            {/* =================================================
                TRIP FORM
            ================================================= */}

            <TripForm
                onSubmit={handleSubmit}
                onCancel={() => navigate("/trips")}
                isLoading={updateTrip.isPending}
                defaultValues={defaultValues}
            />

        </div>
    );
};

export default TripEditPage;