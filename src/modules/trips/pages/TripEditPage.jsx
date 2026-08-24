import { useMemo } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { List } from "lucide-react";

import useTrip from "../hooks/useTrip";
import useUpdateTrip from "../hooks/useUpdateTrip";

import TripForm from "../components/TripForm";


/* =========================================================
   DATETIME LOCAL

   Converts API ISO datetime into:

   YYYY-MM-DDTHH:mm
========================================================= */

const toLocalInputValue = (value) => {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (number) =>
        String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(
            date.getMonth() + 1 )}-${pad(
            date.getDate())}T${pad(
            date.getHours())}:${pad(
            date.getMinutes()
        )}`;
};


/* =========================================================
   GET FIRST VALID VALUE
========================================================= */

const firstValue = (...values) => {

    for (const value of values) {

        if (
            value !== null &&
            value !== undefined &&
            value !== ""
        ) {
            return value;
        }
    }

    return "";
};


/* =========================================================
   ID

   Always send IDs as strings to TripForm.

   This is important for Radix Select.
========================================================= */

const normalizeId = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "object") {

        value = firstValue(
            value.id,
            value.user_id,
            value.customer_id,
            value.driver_id,
            value.vehicle_id,
            value.branch_id
        );
    }

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    return String(value);
};


/* =========================================================
   RENTAL TYPE
========================================================= */

const normalizeRentalType = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "object") {

        value = firstValue(
            value.value,
            value.type,
            value.rental_type,
            value.slug,
            value.name,
            value.label
        );
    }

    const normalized =
        String(value)
            .trim()
            .toLowerCase()
            .replace(
                /[\s-]+/g,
                "_"
            );


    if (
        normalized === "self_drive" ||
        normalized === "selfdrive" ||
        normalized === "self"
    ) {
        return "self_drive";
    }


    if (
        normalized === "with_driver" ||
        normalized === "withdriver" ||
        normalized === "driver"
    ) {
        return "with_driver";
    }


    return "";
};


/* =========================================================
   FUEL
========================================================= */

const normalizeFuelLevel = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "object") {

        value = firstValue(
            value.value,
            value.level,
            value.fuel_level,
            value.slug,
            value.name,
            value.label
        );
    }


    const normalized =
        String(value)
            .trim()
            .toLowerCase()
            .replace(
                /[\s-]+/g,
                "_"
            );


    if (
        normalized === "empty" ||
        normalized === "0"
    ) {
        return "empty";
    }


    if (
        normalized === "quarter" ||
        normalized === "1/4" ||
        normalized === "one_quarter" ||
        normalized === "one_fourth" ||
        normalized === "25"
    ) {
        return "quarter";
    }


    if (
        normalized === "half" ||
        normalized === "1/2" ||
        normalized === "one_half" ||
        normalized === "50"
    ) {
        return "half";
    }


    if (
        normalized === "three_quarter" ||
        normalized === "three_quarters" ||
        normalized === "3/4" ||
        normalized === "three_fourth" ||
        normalized === "75"
    ) {
        return "three_quarter";
    }


    if (
        normalized === "full" ||
        normalized === "100"
    ) {
        return "full";
    }


    return "";
};


/* =========================================================
   PAGE
========================================================= */

const TripEditPage = () => {

    const {
        slug,
    } = useParams();

    const navigate =
        useNavigate();

        


    /* =====================================================
       TRIP
    ===================================================== */

    const {
        data: trip,
        isLoading,
        isError,
    } = useTrip(slug);


    /* =====================================================
       UPDATE
    ===================================================== */

    const updateTrip =
        useUpdateTrip();


    /* =====================================================
       DEFAULT VALUES

       useMemo prevents creating a new object on every render.
    ===================================================== */

    const defaultValues = useMemo(() => {

        if (!trip) {
            return null;
        }


        /* ================================================
           CUSTOMER
        ================================================ */

        const customerId =
            normalizeId(
                firstValue(
                    trip.customer_id,
                    trip.customer?.id,
                    trip.customer?.user_id,
                    trip.customer?.customer_id
                )
            );


        /* ================================================
           VEHICLE
        ================================================ */

        const vehicleId =
            normalizeId(
                firstValue(
                    trip.vehicle_id,
                    trip.vehicle?.id,
                    trip.vehicle?.vehicle_id
                )
            );


        /* ================================================
           DRIVER
        ================================================ */

        const driverId =
            normalizeId(
                firstValue(
                    trip.driver_id,
                    trip.driver?.id,
                    trip.driver?.user_id,
                    trip.driver?.driver_id
                )
            );


        /* ================================================
           RENTAL TYPE
        ================================================ */

        const rentalType =
            normalizeRentalType(
                firstValue(
                    trip.rental_type,
                    trip.rentalType,
                    trip.type
                )
            );


        /* ================================================
           PICKUP BRANCH
        ================================================ */

        const pickupBranchId =
            normalizeId(
                firstValue(
                    trip.pickup_branch_id,
                    trip.pickup_branch?.id,
                    trip.pickup_branch?.branch_id
                )
            );


        /* ================================================
           DROP BRANCH
        ================================================ */

        const dropBranchId =
            normalizeId(
                firstValue(
                    trip.drop_branch_id,
                    trip.drop_branch?.id,
                    trip.drop_branch?.branch_id
                )
            );


        /* ================================================
           FUEL
        ================================================ */

        const pickupFuel =
            normalizeFuelLevel(
                firstValue(
                    trip.pickup_fuel,
                    trip.pickupFuel,
                    trip.pickup_fuel_level
                )
            );


        const returnFuel =
            normalizeFuelLevel(
                firstValue(
                    trip.return_fuel,
                    trip.returnFuel,
                    trip.return_fuel_level
                )
            );


        /* ================================================
           FINAL VALUES
        ================================================ */

        const values = {

            /* CUSTOMER */

            customer_id:
                customerId,
            customer:
                trip.customer,    


            /* VEHICLE */

            vehicle_id:
                vehicleId,
            vehicle:
                trip.vehicle,  
    


            /* RENTAL */

            rental_type:
                rentalType,


            /* DRIVER */

            driver_id:
                driverId,

            driver:
                 trip.driver,    


            /* BRANCH */

            pickup_branch_id:
                pickupBranchId,

            drop_branch_id:
                dropBranchId,


            /* LOCATION */

            pickup_location:
                trip.pickup_location ??
                "",

            drop_location:
                trip.drop_location ??
                "",


            /* DATES */

            pickup_at:
                toLocalInputValue(
                    trip.pickup_at
                ),

            expected_return_at:
                toLocalInputValue(
                    trip.expected_return_at
                ),


            /* VEHICLE CONDITION */

            pickup_odometer:
                trip.pickup_odometer !== null &&
                trip.pickup_odometer !== undefined
                    ? String(
                        trip.pickup_odometer
                    )
                    : "0",

            return_odometer:
                trip.return_odometer !== null &&
                trip.return_odometer !== undefined
                    ? String(
                        trip.return_odometer
                    )
                    : "",

            pickup_fuel:
                pickupFuel,

            return_fuel:
                returnFuel,


            /* BILLING */

            base_amount:
                trip.base_amount !== null &&
                trip.base_amount !== undefined
                    ? String(
                        trip.base_amount
                    )
                    : "",

            extra_km_charge:
                trip.extra_km_charge !== null &&
                trip.extra_km_charge !== undefined
                    ? String(
                        trip.extra_km_charge
                    )
                    : "0",

            late_return_charge:
                trip.late_return_charge !== null &&
                trip.late_return_charge !== undefined
                    ? String(
                        trip.late_return_charge
                    )
                    : "0",

            damage_charge:
                trip.damage_charge !== null &&
                trip.damage_charge !== undefined
                    ? String(
                        trip.damage_charge
                    )
                    : "0",

            fuel_charge:
                trip.fuel_charge !== null &&
                trip.fuel_charge !== undefined
                    ? String(
                        trip.fuel_charge
                    )
                    : "0",


            /* NOTES */

            pickup_notes:
                trip.pickup_notes ??
                "",
        };


        // console.log(
        //     "TRIP API RESPONSE:",
        //     trip
        // );

        // console.log(
        //     "TRIP EDIT DEFAULT VALUES:",
        //     values
        // );


        return values;

    }, [trip]);


    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {

        return (
            <div className="p-6">
                <p className="text-sm text-gray-500">
                    Loading trip...
                </p>
            </div>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (isError) {

        return (
            <div className="p-6">
                <p className="text-sm text-red-600">
                    Failed to load trip.
                </p>
            </div>
        );
    }


    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!trip) {

        return (
            <div className="p-6">
                <p className="text-sm text-gray-500">
                    Trip not found.
                </p>
            </div>
        );
    }


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (values) => {

        // console.log(
        //     "TRIP UPDATE FORM VALUES:",
        //     values
        // );
        


        updateTrip.mutate(
            {
                trip: trip.slug,
                ...values,
            },
            {
                onSuccess: () => {

                    navigate(
                        `/trips/${trip.slug}`
                    );

                },
            }
        );
    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = () => {

        switch (trip.status) {

            case "scheduled":
                return "bg-blue-50 text-blue-700";

            case "picked_up":
                return "bg-amber-50 text-amber-700";

            case "on_trip":
                return "bg-purple-50 text-purple-700";

            case "completed":
                return "bg-green-50 text-green-700";

            case "cancelled":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="space-y-4">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="
                flex
                items-start
                justify-between
            ">

                <div>

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <h1 className="
                            text-xl
                            font-bold
                            text-gray-600
                        ">
                            Edit Trip
                        </h1>


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
                                ${getStatusClass()}
                            `}
                        >
                            {trip.status
                                ?.replace(
                                    /_/g,
                                    " "
                                )}
                        </span>

                    </div>


                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        Update trip details
                    </p>

                </div>


                {/* =================================================
                   LIST
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/trips")
                    }
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

                    <List
                        className="
                            h-4
                            w-4
                        "
                    />

                </button>

            </div>


            {/* =================================================
               FORM
            ================================================= */}

            <TripForm
                key={trip.id ?? trip.slug}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/trips")
                }
                isLoading={
                    updateTrip.isPending
                }
                defaultValues={
                    defaultValues
                }
            />

        </div>
    );
};


export default TripEditPage;