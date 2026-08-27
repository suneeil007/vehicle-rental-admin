import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Check,
    ChevronsUpDown,
} from "lucide-react";

import { tripSchema } from "../validation/tripSchema";

import useUsers from "../../users/hooks/useUsers";
import useVehicles from "../../vehicles/hooks/useVehicles";
import useBranches from "../../branches/hooks/useBranches";

import { createUser } from "@/modules/users/api/userApi";


/* =========================================================
   RENTAL TYPES
========================================================= */

const RENTAL_TYPE_OPTIONS = [
    {
        value: "self_drive",
        label: "Self Drive",
    },
    {
        value: "with_driver",
        label: "With Driver",
    },
];


/* =========================================================
   FUEL LEVELS
========================================================= */

const FUEL_LEVEL_OPTIONS = [
    {
        value: "empty",
        label: "Empty",
    },
    {
        value: "quarter",
        label: "1/4",
    },
    {
        value: "half",
        label: "1/2",
    },
    {
        value: "three_quarter",
        label: "3/4",
    },
    {
        value: "full",
        label: "Full",
    },
];


/* =========================================================
   VEHICLE STATUS
========================================================= */

const VEHICLE_STATUS = {
    AVAILABLE: "available",
    BOOKED: "booked",
    ON_TRIP: "on_trip",
    MAINTENANCE: "maintenance",
    INACTIVE: "inactive",
};


/* =========================================================
   NORMALIZE VEHICLE STATUS
========================================================= */

const normalizeVehicleStatus = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "object") {
        value =
            value.value ??
            value.status ??
            value.name ??
            value.label ??
            value.slug ??
            "";
    }

    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
};


/* =========================================================
   VEHICLE STATUS LABEL
========================================================= */

const getVehicleStatusLabel = (status) => {
    const normalizedStatus =
        normalizeVehicleStatus(status);

    switch (normalizedStatus) {
        case VEHICLE_STATUS.AVAILABLE:
            return "Available";

        case VEHICLE_STATUS.BOOKED:
            return "Booked";

        case VEHICLE_STATUS.ON_TRIP:
            return "On Trip";

        case VEHICLE_STATUS.MAINTENANCE:
            return "Maintenance";

        case VEHICLE_STATUS.INACTIVE:
            return "Inactive";

        default:
            return normalizedStatus
                ? normalizedStatus
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                    )
                : "Unknown";
    }
};


/* =========================================================
   VEHICLE STATUS SORT ORDER

   Available
   Booked
   On Trip
   Maintenance
   Inactive
   Unknown
========================================================= */

const getVehicleStatusOrder = (status) => {
    const normalizedStatus =
        normalizeVehicleStatus(status);

    switch (normalizedStatus) {
        case VEHICLE_STATUS.AVAILABLE:
            return 1;

        case VEHICLE_STATUS.BOOKED:
            return 2;

        case VEHICLE_STATUS.ON_TRIP:
            return 3;

        case VEHICLE_STATUS.MAINTENANCE:
            return 4;

        case VEHICLE_STATUS.INACTIVE:
            return 5;

        default:
            return 6;
    }
};


/* =========================================================
   VEHICLE STATUS TEXT CLASS
========================================================= */

const getVehicleStatusClass = (status) => {
    const normalizedStatus =
        normalizeVehicleStatus(status);

    switch (normalizedStatus) {
        case VEHICLE_STATUS.AVAILABLE:
            return "text-green-600";

        case VEHICLE_STATUS.BOOKED:
            return "text-yellow-600";

        case VEHICLE_STATUS.ON_TRIP:
            return "text-red-600";

        case VEHICLE_STATUS.MAINTENANCE:
            return "text-orange-600";

        case VEHICLE_STATUS.INACTIVE:
            return "text-gray-500";

        default:
            return "text-gray-500";
    }
};


/* =========================================================
   FORMAT DATETIME FOR datetime-local
========================================================= */

const formatDateTimeLocal = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const hours = String(
        date.getHours()
    ).padStart(2, "0");

    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


/* =========================================================
   GET ID SAFELY
========================================================= */

const getId = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "object") {
        return (
            value.id ??
            value.user_id ??
            value.branch_id ??
            value.vehicle_id ??
            value.customer_id ??
            value.driver_id ??
            value.value ??
            ""
        );
    }

    return value;
};


/* =========================================================
   NORMALIZE ID
========================================================= */

const normalizeId = (value) => {
    const id = getId(value);

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {
        return "";
    }

    return String(id);
};


/* =========================================================
   NORMALIZE RENTAL TYPE
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
        value =
            value.value ??
            value.type ??
            value.name ??
            value.label ??
            value.slug ??
            value.rental_type ??
            "";
    }

    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

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
   NORMALIZE FUEL LEVEL
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
        value =
            value.value ??
            value.level ??
            value.name ??
            value.label ??
            value.slug ??
            value.fuel_level ??
            "";
    }

    const normalized = String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

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
   GET BOOKING VEHICLE ID
========================================================= */

const getBookingVehicleId = (values) => {
    if (!values) {
        return "";
    }

    const booking = values.booking;

    const vehicleId =
        booking?.vehicle_id ??
        booking?.vehicle?.id ??
        booking?.vehicle?.vehicle_id ??
        values.vehicle_id ??
        values.vehicle?.id ??
        values.vehicle?.vehicle_id ??
        "";

    return normalizeId(vehicleId);
};


/* =========================================================
   GET BOOKING VEHICLE OBJECT
========================================================= */

const getBookingVehicle = (values) => {
    if (!values) {
        return null;
    }

    return (
        values.booking?.vehicle ??
        values.vehicle ??
        null
    );
};


/* =========================================================
   TRIP FORM
========================================================= */

const TripForm = ({
    onSubmit,
    onCancel,
    isLoading = false,
    defaultValues = null,
}) => {
    const queryClient = useQueryClient();


    /* =====================================================
       API DATA
    ===================================================== */

    const { data: users } = useUsers();
    const { data: vehicles } = useVehicles();
    const { data: branches } = useBranches();


    const allUsers = Array.isArray(users)
        ? users
        : [];

    const vehicleList = Array.isArray(vehicles)
        ? vehicles
        : [];

    const branchList = Array.isArray(branches)
        ? branches
        : [];


    /* =====================================================
       USER ROLES
    ===================================================== */

    const getRoleId = (user) => {
        return Number(
            user?.role_id ??
            user?.role?.id ??
            user?.role?.role_id ??
            ""
        );
    };


    const customers = allUsers.filter(
        (user) => getRoleId(user) === 5
    );

    const drivers = allUsers.filter(
        (user) => getRoleId(user) === 6
    );


    /* =====================================================
       CUSTOMER SEARCH
    ===================================================== */

    const [
        customerSearch,
        setCustomerSearch,
    ] = useState("");

    const [
        creatingCustomer,
        setCreatingCustomer,
    ] = useState(false);


    /* =====================================================
       BOOKING VEHICLE ID
    ===================================================== */

    const bookingVehicleId =
        getBookingVehicleId(defaultValues);


    /* =====================================================
       CURRENT TRIP VEHICLE ID
    ===================================================== */

    const currentVehicleId = normalizeId(
        defaultValues?.vehicle_id ??
        defaultValues?.vehicle?.id ??
        defaultValues?.vehicle?.vehicle_id
    );


    /* =====================================================
       VEHICLE THAT MUST BE INCLUDED
    ===================================================== */

    const requiredVehicleId =
        bookingVehicleId ||
        currentVehicleId;


    /* =====================================================
       BOOKING VEHICLE OBJECT
    ===================================================== */

    const bookingVehicle =
        getBookingVehicle(defaultValues);


    /* =====================================================
       ALL VEHICLES FOR DROPDOWN

       AVAILABLE VEHICLES ARE FIRST.

       OTHER VEHICLES ARE SHOWN BELOW.

       Only:
         - available vehicles
         - booking vehicle
         - current trip vehicle

       can be selected.

       Other unavailable vehicles remain visible
       but disabled.
    ===================================================== */

    const selectableVehicles = useMemo(() => {

        let list = [...vehicleList];


        /* =================================================
           IF REQUIRED VEHICLE IS NOT IN API LIST,
           ADD THE VEHICLE FROM BOOKING/TRIP RESPONSE.
        ================================================= */

        const requiredVehicleExists =
            requiredVehicleId &&
            list.some(
                (vehicle) =>
                    normalizeId(vehicle?.id) ===
                    requiredVehicleId
            );


        if (
            requiredVehicleId &&
            !requiredVehicleExists &&
            bookingVehicle &&
            normalizeId(
                bookingVehicle?.id ??
                bookingVehicle?.vehicle_id
            ) === requiredVehicleId
        ) {

            list.push({
                ...bookingVehicle,

                id:
                    bookingVehicle.id ??
                    bookingVehicle.vehicle_id,
            });

        }


        /* =================================================
           REMOVE DUPLICATE VEHICLES
        ================================================= */

        const uniqueVehicles = [];

        const seenIds = new Set();

        list.forEach((vehicle) => {

            const id =
                normalizeId(vehicle?.id);

            if (!id) {
                return;
            }

            if (seenIds.has(id)) {
                return;
            }

            seenIds.add(id);

            uniqueVehicles.push(vehicle);

        });


        /* =================================================
           SORT VEHICLES

           Available first.
           Then Booked.
           Then On Trip.
           Then Maintenance.
           Then Inactive.
        ================================================= */

        uniqueVehicles.sort((a, b) => {

            const statusA =
                getVehicleStatusOrder(
                    a?.status
                );

            const statusB =
                getVehicleStatusOrder(
                    b?.status
                );


            if (statusA !== statusB) {
                return statusA - statusB;
            }


            const nameA =
                String(
                    a?.name ?? ""
                ).toLowerCase();

            const nameB =
                String(
                    b?.name ?? ""
                ).toLowerCase();


            return nameA.localeCompare(
                nameB
            );

        });


        return uniqueVehicles;

    }, [
        vehicleList,
        requiredVehicleId,
        bookingVehicle,
    ]);


    /* =====================================================
       CURRENT CUSTOMER FALLBACK
    ===================================================== */

    const customersWithFallback = useMemo(() => {

        const currentCustomer =
            defaultValues?.customer;


        if (
            currentCustomer?.id &&
            !customers.some(
                (customer) =>
                    normalizeId(customer.id) ===
                    normalizeId(currentCustomer.id)
            )
        ) {

            return [
                currentCustomer,
                ...customers,
            ];

        }

        return customers;

    }, [
        customers,
        defaultValues,
    ]);


    /* =====================================================
       CURRENT DRIVER FALLBACK
    ===================================================== */

    const driversWithFallback = useMemo(() => {

        const currentDriver =
            defaultValues?.driver;


        if (
            currentDriver?.id &&
            !drivers.some(
                (driver) =>
                    normalizeId(driver.id) ===
                    normalizeId(currentDriver.id)
            )
        ) {

            return [
                currentDriver,
                ...drivers,
            ];

        }

        return drivers;

    }, [
        drivers,
        defaultValues,
    ]);


    /* =====================================================
       FORM
    ===================================================== */

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({

        resolver:
            zodResolver(tripSchema),

        defaultValues: {

            customer_id: "",
            vehicle_id: "",
            rental_type: "",

            driver_id: "",

            pickup_branch_id: "",
            drop_branch_id: "",

            pickup_location: "",
            drop_location: "",

            pickup_at: "",
            expected_return_at: "",

            pickup_odometer: "0",
            return_odometer: "",

            pickup_fuel: "",
            return_fuel: "",

            base_amount: "",
            extra_km_charge: "0",
            late_return_charge: "0",
            damage_charge: "0",
            fuel_charge: "0",

            pickup_notes: "",

        },

    });


    /* =====================================================
       WATCH VALUES
    ===================================================== */

    const customerId =
        watch("customer_id");

    const vehicleId =
        watch("vehicle_id");

    const driverId =
        watch("driver_id");

    const rentalType =
        watch("rental_type");

    const pickupBranchId =
        watch("pickup_branch_id");

    const dropBranchId =
        watch("drop_branch_id");

    const pickupFuel =
        watch("pickup_fuel");

    const returnFuel =
        watch("return_fuel");


    /* =====================================================
       BILLING WATCH
    ===================================================== */

    const baseAmount = Number(
        watch("base_amount") || 0
    );

    const extraKmCharge = Number(
        watch("extra_km_charge") || 0
    );

    const lateReturnCharge = Number(
        watch("late_return_charge") || 0
    );

    const damageCharge = Number(
        watch("damage_charge") || 0
    );

    const fuelCharge = Number(
        watch("fuel_charge") || 0
    );


    const totalAmount =
        baseAmount +
        extraKmCharge +
        lateReturnCharge +
        damageCharge +
        fuelCharge;


    /* =====================================================
       POPULATE EDIT / BOOKING DATA
    ===================================================== */

    useEffect(() => {

        if (!defaultValues) {
            return;
        }


        /* =================================================
           CUSTOMER ID
        ================================================= */

        const normalizedCustomerId =
            normalizeId(
                defaultValues.customer_id ??
                defaultValues.customer?.id ??
                defaultValues.customer?.user_id ??
                defaultValues.customer?.customer_id
            );


        /* =================================================
           DRIVER ID
        ================================================= */

        const normalizedDriverId =
            normalizeId(
                defaultValues.driver_id ??
                defaultValues.driver?.id ??
                defaultValues.driver?.user_id ??
                defaultValues.driver?.driver_id
            );


        /* =================================================
           VEHICLE ID

           BOOKING VEHICLE HAS PRIORITY.
        ================================================= */

        const normalizedVehicleId =
            getBookingVehicleId(
                defaultValues
            );


        /* =================================================
           RENTAL TYPE
        ================================================= */

        const normalizedRentalType =
            normalizeRentalType(
                defaultValues.rental_type
            );


        /* =================================================
           FUEL
        ================================================= */

        const normalizedPickupFuel =
            normalizeFuelLevel(
                defaultValues.pickup_fuel ??
                defaultValues.pickupFuel ??
                defaultValues.pickup_fuel_level
            );


        const normalizedReturnFuel =
            normalizeFuelLevel(
                defaultValues.return_fuel ??
                defaultValues.returnFuel ??
                defaultValues.return_fuel_level
            );


        /* =================================================
           FORM VALUES
        ================================================= */

        const values = {

            /* ================= CUSTOMER ================= */

            customer_id:
                normalizedCustomerId,

            customer:
                defaultValues.customer,


            /* ================= VEHICLE ================= */

            vehicle_id:
                normalizedVehicleId,

            vehicle:
                defaultValues.vehicle ??
                defaultValues.booking?.vehicle,


            /* ================= BOOKING ================= */

            booking:
                defaultValues.booking,


            /* ================= RENTAL TYPE ================= */

            rental_type:
                normalizedRentalType,


            /* ================= DRIVER ================= */

            driver_id:
                normalizedDriverId,

            driver:
                defaultValues.driver,


            /* ================= BRANCH ================= */

            pickup_branch_id:
                normalizeId(
                    defaultValues.pickup_branch_id ??
                    defaultValues.pickup_branch?.id
                ),

            drop_branch_id:
                normalizeId(
                    defaultValues.drop_branch_id ??
                    defaultValues.drop_branch?.id
                ),


            /* ================= LOCATIONS ================= */

            pickup_location:
                defaultValues.pickup_location ??
                "",

            drop_location:
                defaultValues.drop_location ??
                "",


            /* ================= DATES ================= */

            pickup_at:
                formatDateTimeLocal(
                    defaultValues.pickup_at ??
                    defaultValues.booking?.pickup_at ??
                    defaultValues.booking?.start_at
                ),

            expected_return_at:
                formatDateTimeLocal(
                    defaultValues.expected_return_at ??
                    defaultValues.booking?.expected_return_at ??
                    defaultValues.booking?.return_at ??
                    defaultValues.booking?.end_at
                ),


            /* ================= VEHICLE CONDITION ================= */

            pickup_odometer:
                defaultValues.pickup_odometer !==
                    null &&
                defaultValues.pickup_odometer !==
                    undefined
                    ? String(
                        defaultValues.pickup_odometer
                    )
                    : "0",


            return_odometer:
                defaultValues.return_odometer !==
                    null &&
                defaultValues.return_odometer !==
                    undefined
                    ? String(
                        defaultValues.return_odometer
                    )
                    : "",


            pickup_fuel:
                normalizedPickupFuel,

            return_fuel:
                normalizedReturnFuel,


            /* ================= BILLING ================= */

            base_amount:
                defaultValues.base_amount !==
                    null &&
                defaultValues.base_amount !==
                    undefined
                    ? String(
                        defaultValues.base_amount
                    )
                    : "",


            extra_km_charge:
                defaultValues.extra_km_charge !==
                    null &&
                defaultValues.extra_km_charge !==
                    undefined
                    ? String(
                        defaultValues.extra_km_charge
                    )
                    : "0",


            late_return_charge:
                defaultValues.late_return_charge !==
                    null &&
                defaultValues.late_return_charge !==
                    undefined
                    ? String(
                        defaultValues.late_return_charge
                    )
                    : "0",


            damage_charge:
                defaultValues.damage_charge !==
                    null &&
                defaultValues.damage_charge !==
                    undefined
                    ? String(
                        defaultValues.damage_charge
                    )
                    : "0",


            fuel_charge:
                defaultValues.fuel_charge !==
                    null &&
                defaultValues.fuel_charge !==
                    undefined
                    ? String(
                        defaultValues.fuel_charge
                    )
                    : "0",


            /* ================= NOTES ================= */

            pickup_notes:
                defaultValues.pickup_notes ??
                "",

        };


        reset(values);

        setCustomerSearch("");

    }, [
        defaultValues,
        reset,
    ]);


    /* =====================================================
       CHANGE RENTAL TYPE
    ===================================================== */

    const handleRentalTypeChange = (value) => {

        setValue(
            "rental_type",
            value,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );


        if (value === "self_drive") {

            setValue(
                "driver_id",
                "",
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );


            setValue(
                "pickup_location",
                "",
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );


            setValue(
                "drop_location",
                "",
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

        }


        if (value === "with_driver") {

            setValue(
                "pickup_branch_id",
                "",
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );


            setValue(
                "drop_branch_id",
                "",
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

        }

    };


    /* =====================================================
       CREATE CUSTOMER
    ===================================================== */

    const handleCreateCustomer = async () => {

        const name =
            customerSearch.trim();


        if (!name) {
            return;
        }


        try {

            setCreatingCustomer(true);


            const firstFourLetters =
                name
                    .replace(/\s+/g, "")
                    .slice(0, 4)
                    .toLowerCase();


            const password =
                `${firstFourLetters}@2026`;


            const response =
                await createUser({

                    name,

                    email:
                        `customer_${Date.now()}@rental.local`,

                    phone: null,

                    role_id: 5,

                    branch_id: null,

                    password,

                    password_confirmation:
                        password,

                    status: "active",

                });


            const newCustomer =
                response?.data?.data ??
                response?.data ??
                response;


            if (!newCustomer?.id) {

                console.error(
                    "Customer created but ID was not returned.",
                    response
                );

                return;

            }


            await queryClient.refetchQueries({
                queryKey: ["users"],
            });


            setValue(
                "customer_id",
                String(newCustomer.id),
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );


            setCustomerSearch("");

        } catch (error) {

            console.error(
                "CUSTOMER CREATE ERROR:",
                error
            );

        } finally {

            setCreatingCustomer(false);

        }

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const submitForm = (data) => {

        const isSelfDrive =
            data.rental_type ===
            "self_drive";


        const payload = {

            ...data,


            /* ================= IDs ================= */

            customer_id:
                data.customer_id
                    ? Number(
                        data.customer_id
                    )
                    : null,


            vehicle_id:
                data.vehicle_id
                    ? Number(
                        data.vehicle_id
                    )
                    : null,


            driver_id:
                !isSelfDrive &&
                data.driver_id
                    ? Number(
                        data.driver_id
                    )
                    : null,


            pickup_branch_id:
                isSelfDrive &&
                data.pickup_branch_id
                    ? Number(
                        data.pickup_branch_id
                    )
                    : null,


            drop_branch_id:
                isSelfDrive &&
                data.drop_branch_id
                    ? Number(
                        data.drop_branch_id
                    )
                    : null,


            /* ================= LOCATIONS ================= */

            pickup_location:
                isSelfDrive
                    ? null
                    : data.pickup_location
                        ?.trim() || null,


            drop_location:
                isSelfDrive
                    ? null
                    : data.drop_location
                        ?.trim() || null,


            /* ================= VEHICLE CONDITION ================= */

            pickup_odometer:
                Number(
                    data.pickup_odometer
                ),


            return_odometer:
                data.return_odometer !== "" &&
                data.return_odometer !== null &&
                data.return_odometer !== undefined
                    ? Number(
                        data.return_odometer
                    )
                    : null,


            pickup_fuel:
                normalizeFuelLevel(
                    data.pickup_fuel
                ) || null,


            return_fuel:
                normalizeFuelLevel(
                    data.return_fuel
                ) || null,


            /* ================= BILLING ================= */

            base_amount:
                Number(
                    data.base_amount
                ),


            extra_km_charge:
                Number(
                    data.extra_km_charge || 0
                ),


            late_return_charge:
                Number(
                    data.late_return_charge || 0
                ),


            damage_charge:
                Number(
                    data.damage_charge || 0
                ),


            fuel_charge:
                Number(
                    data.fuel_charge || 0
                ),

        };


        console.log(
            "TRIP SUBMIT PAYLOAD:",
            payload
        );


        onSubmit(payload);

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <form
            onSubmit={
                handleSubmit(
                    submitForm
                )
            }
            className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-5
                "
            >


                {/* =================================================
                   CUSTOMER
                ================================================= */}

                <div className="w-full">

                    <label className="form-label">
                        Customer
                    </label>


                    <Popover
                        key={`
                            customer-
                            ${defaultValues?.id ?? "new"}-
                            ${customerId}
                        `}
                    >

                        <PopoverTrigger asChild>

                            <button
                                type="button"
                                role="combobox"
                                className="
                                    form-input
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    text-left
                                    font-normal
                                "
                            >

                                <span className="truncate">

                                    {customerId
                                        ? (
                                            customersWithFallback.find(
                                                (customer) =>
                                                    normalizeId(
                                                        customer.id
                                                    ) ===
                                                    normalizeId(
                                                        customerId
                                                    )
                                            )?.name ||
                                            defaultValues?.customer?.name ||
                                            "Customer selected"
                                        )
                                        : "Select customer"}

                                </span>


                                <ChevronsUpDown
                                    className="
                                        ml-2
                                        h-4
                                        w-4
                                        shrink-0
                                        opacity-50
                                    "
                                />

                            </button>

                        </PopoverTrigger>


                        <PopoverContent
                            align="start"
                            className="
                                w-[var(--radix-popover-trigger-width)]
                                min-w-0
                                p-0
                            "
                        >

                            <Command>

                                <CommandInput
                                    placeholder="Search customer..."
                                    value={
                                        customerSearch
                                    }
                                    onValueChange={
                                        setCustomerSearch
                                    }
                                />


                                <CommandList>

                                    {customerSearch.trim() &&
                                        !customersWithFallback.some(
                                            (customer) =>
                                                `${customer.name || ""} ${customer.email || ""}`
                                                    .toLowerCase()
                                                    .includes(
                                                        customerSearch
                                                            .trim()
                                                            .toLowerCase()
                                                    )
                                        ) && (

                                            <div
                                                className="
                                                    p-2
                                                    border-b
                                                "
                                            >

                                                <div
                                                    className="
                                                        px-2
                                                        py-2
                                                        text-sm
                                                        text-gray-500
                                                    "
                                                >
                                                    No customer found.
                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCreateCustomer
                                                    }
                                                    disabled={
                                                        creatingCustomer
                                                    }
                                                    className="
                                                        w-full
                                                        flex
                                                        items-center
                                                        gap-2
                                                        px-3
                                                        py-2.5
                                                        rounded-md
                                                        text-left
                                                        text-blue-600
                                                        font-medium
                                                        hover:bg-blue-50
                                                        disabled:opacity-50
                                                    "
                                                >

                                                    <span className="text-lg">
                                                        ＋
                                                    </span>


                                                    <span>

                                                        {creatingCustomer
                                                            ? "Creating customer..."
                                                            : `Create "${customerSearch.trim()}" as new customer`}

                                                    </span>

                                                </button>

                                            </div>

                                        )}


                                    <CommandGroup>

                                        {customersWithFallback.map(
                                            (customer) => (

                                                <CommandItem
                                                    key={
                                                        customer.id
                                                    }
                                                    value={`
                                                        ${customer.name}
                                                        ${customer.email || ""}
                                                    `}
                                                    onSelect={() => {

                                                        const selectedCustomerId =
                                                            normalizeId(
                                                                customer.id
                                                            );


                                                        setValue(
                                                            "customer_id",
                                                            selectedCustomerId,
                                                            {
                                                                shouldValidate:
                                                                    true,
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );


                                                        setCustomerSearch(
                                                            ""
                                                        );

                                                    }}
                                                >

                                                    <Check
                                                        className={`
                                                            mr-2
                                                            h-4
                                                            w-4
                                                            ${
                                                                normalizeId(
                                                                    customerId
                                                                ) ===
                                                                normalizeId(
                                                                    customer.id
                                                                )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }
                                                        `}
                                                    />


                                                    <span className="truncate">

                                                        {customer.name}

                                                        {customer.email
                                                            ? ` — ${customer.email}`
                                                            : ""}

                                                    </span>

                                                </CommandItem>

                                            )
                                        )}

                                    </CommandGroup>

                                </CommandList>

                            </Command>

                        </PopoverContent>

                    </Popover>


                    <p className="error-text">
                        {errors.customer_id?.message}
                    </p>

                </div>


                {/* =================================================
                   VEHICLE
                ================================================= */}

                <div className="w-full">

                    <label className="form-label">
                        Vehicle
                    </label>


                    <Popover>

                        <PopoverTrigger asChild>

                            <button
                                type="button"
                                role="combobox"
                                className="
                                    form-input
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    text-left
                                    font-normal
                                "
                            >

                                <span className="truncate">

                                    {vehicleId
                                        ? (
                                            selectableVehicles.find(
                                                (vehicle) =>
                                                    normalizeId(
                                                        vehicle.id
                                                    ) ===
                                                    normalizeId(
                                                        vehicleId
                                                    )
                                            )?.name ||
                                            defaultValues?.vehicle?.name ||
                                            defaultValues?.booking?.vehicle?.name ||
                                            "Vehicle selected"
                                        )
                                        : "Select vehicle"}

                                </span>


                                <ChevronsUpDown
                                    className="
                                        ml-2
                                        h-4
                                        w-4
                                        shrink-0
                                        opacity-50
                                    "
                                />

                            </button>

                        </PopoverTrigger>


                        <PopoverContent
                            align="start"
                            className="
                                w-[var(--radix-popover-trigger-width)]
                                min-w-0
                                p-0
                            "
                        >

                            <Command>

                                {/* =================================
                                   SEARCH
                                ================================= */}

                                <CommandInput
                                    placeholder="Search vehicle..."
                                />


                                <CommandList>

                                    <CommandEmpty>
                                        No vehicle found.
                                    </CommandEmpty>


                                    {/* =================================
                                       AVAILABLE VEHICLES
                                    ================================= */}

                                    {selectableVehicles.some(
                                        (vehicle) =>
                                            normalizeVehicleStatus(
                                                vehicle?.status
                                            ) ===
                                            VEHICLE_STATUS.AVAILABLE
                                    ) && (

                                        <CommandGroup
                                            heading="Available Vehicles"
                                        >

                                            {selectableVehicles
                                                .filter(
                                                    (vehicle) =>
                                                        normalizeVehicleStatus(
                                                            vehicle?.status
                                                        ) ===
                                                        VEHICLE_STATUS.AVAILABLE
                                                )
                                                .map(
                                                    (vehicle) => {

                                                        const id =
                                                            normalizeId(
                                                                vehicle.id
                                                            );


                                                        const isSelected =
                                                            normalizeId(
                                                                vehicleId
                                                            ) === id;


                                                        return (

                                                            <CommandItem
                                                                key={id}
                                                                value={`
                                                                    ${vehicle.name || ""}
                                                                    ${vehicle.registration_number || ""}
                                                                    Available
                                                                `}
                                                                onSelect={() => {

                                                                    setValue(
                                                                        "vehicle_id",
                                                                        id,
                                                                        {
                                                                            shouldValidate:
                                                                                true,
                                                                            shouldDirty:
                                                                                true,
                                                                        }
                                                                    );

                                                                }}
                                                                className="
                                                                    cursor-pointer
                                                                    px-3
                                                                    py-2.5
                                                                "
                                                            >

                                                                {/* CHECK */}

                                                                <Check
                                                                    className={`
                                                                        mr-2
                                                                        h-4
                                                                        w-4
                                                                        shrink-0
                                                                        ${
                                                                            isSelected
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        }
                                                                    `}
                                                                />


                                                                {/* VEHICLE */}
                                                                    <div
                                                                        className="
                                                                            min-w-0
                                                                            flex-1
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                        "
                                                                    >
                                                                        <div
                                                                            className="
                                                                                truncate
                                                                                font-medium
                                                                                text-gray-900
                                                                            "
                                                                        >
                                                                            {vehicle.name}
                                                                        </div>

                                                                        {vehicle.registration_number && (
                                                                            <>
                                                                                <span className="shrink-0 text-gray-400">
                                                                                    —
                                                                                </span>

                                                                                <div
                                                                                    className="
                                                                                        truncate
                                                                                        text-sm
                                                                                        text-[11px]
                                                                                        text-gray-500
                                                                                    "
                                                                                >
                                                                                    {vehicle.registration_number}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>


                                                                

                                                            </CommandItem>

                                                        );

                                                    }
                                                )}

                                        </CommandGroup>

                                    )}


                                    {/* =================================
                                       OTHER VEHICLES
                                    ================================= */}

                                    {selectableVehicles.some(
                                        (vehicle) =>
                                            normalizeVehicleStatus(
                                                vehicle?.status
                                            ) !==
                                            VEHICLE_STATUS.AVAILABLE
                                    ) && (

                                        <CommandGroup
                                            heading="Other Vehicles"
                                        >

                                            {selectableVehicles
                                                .filter(
                                                    (vehicle) =>
                                                        normalizeVehicleStatus(
                                                            vehicle?.status
                                                        ) !==
                                                        VEHICLE_STATUS.AVAILABLE
                                                )
                                                .map(
                                                    (vehicle) => {

                                                        const id =
                                                            normalizeId(
                                                                vehicle.id
                                                            );


                                                        const status =
                                                            normalizeVehicleStatus(
                                                                vehicle.status
                                                            );


                                                        /*
                                                         * The booking vehicle
                                                         * or current trip vehicle
                                                         * remains selectable.
                                                         */

                                                        const isBookingVehicle =
                                                            id ===
                                                            requiredVehicleId;


                                                        const isSelected =
                                                            normalizeId(
                                                                vehicleId
                                                            ) === id;


                                                        const canSelect =
                                                            isBookingVehicle;


                                                        return (

                                                            <CommandItem
                                                                key={id}
                                                                value={`
                                                                    ${vehicle.name || ""}
                                                                    ${vehicle.registration_number || ""}
                                                                    ${getVehicleStatusLabel(status)}
                                                                `}
                                                                disabled={
                                                                    !canSelect
                                                                }
                                                                onSelect={() => {

                                                                    if (!canSelect) {
                                                                        return;
                                                                    }


                                                                    setValue(
                                                                        "vehicle_id",
                                                                        id,
                                                                        {
                                                                            shouldValidate:
                                                                                true,
                                                                            shouldDirty:
                                                                                true,
                                                                        }
                                                                    );

                                                                }}
                                                                className={`
                                                                    px-3
                                                                    py-2.5
                                                                    ${
                                                                        canSelect
                                                                            ? "cursor-pointer"
                                                                            : "cursor-not-allowed opacity-60"
                                                                    }
                                                                `}
                                                            >

                                                                {/* CHECK */}

                                                                <Check
                                                                    className={`
                                                                        mr-2
                                                                        h-4
                                                                        w-4
                                                                        shrink-0
                                                                        ${
                                                                            isSelected
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        }
                                                                    `}
                                                                />


                                                                {/* VEHICLE DETAILS + STATUS */}

                                                                <div
                                                                    className="
                                                                        min-w-0
                                                                        flex-1
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                    "
                                                                >
                                                                    {/* VEHICLE NAME */}

                                                                    <div
                                                                        className="
                                                                            min-w-0
                                                                            truncate
                                                                            font-medium
                                                                            text-gray-900
                                                                        "
                                                                    >
                                                                        {vehicle.name}
                                                                    </div>


                                                                    {/* REGISTRATION NUMBER */}

                                                                    {vehicle.registration_number && (
                                                                        <>
                                                                            <span
                                                                                className="
                                                                                    shrink-0
                                                                                    text-[11px]
                                                                                    text-gray-400
                                                                                "
                                                                            >
                                                                                —
                                                                            </span>

                                                                            <div
                                                                                className="
                                                                                    min-w-0
                                                                                    truncate
                                                                                    text-[11px]
                                                                                    text-gray-500
                                                                                "
                                                                            >
                                                                                {vehicle.registration_number}
                                                                            </div>
                                                                        </>
                                                                    )}


                                                                    {/* STATUS */}

                                                                    <div
                                                                        className="
                                                                            ml-auto
                                                                            flex
                                                                            shrink-0
                                                                            items-center
                                                                            gap-1
                                                                        "
                                                                    >
                                                                        <span
                                                                            className={`
                                                                                text-[11px]
                                                                                font-medium
                                                                                ${getVehicleStatusClass(status)}
                                                                            `}
                                                                        >
                                                                            {getVehicleStatusLabel(status)}
                                                                        </span>


                                                                        {isBookingVehicle && (
                                                                            <span
                                                                                className="
                                                                                    text-[11px]
                                                                                    font-medium
                                                                                    text-blue-600
                                                                                "
                                                                            >
                                                                                • Booking
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </CommandItem>

                                                        );

                                                    }
                                                )}

                                        </CommandGroup>

                                    )}

                                </CommandList>

                            </Command>

                        </PopoverContent>

                    </Popover>


                    <p className="error-text">
                        {errors.vehicle_id?.message}
                    </p>

                </div>


                {/* =================================================
                   RENTAL TYPE
                ================================================= */}

                <div>

                    <label className="form-label">
                        Rental Type
                    </label>


                    <Select
                        key={`
                            rental-type-
                            ${defaultValues?.id ?? "new"}-
                            ${rentalType}
                        `}
                        value={
                            rentalType || ""
                        }
                        onValueChange={
                            handleRentalTypeChange
                        }
                    >

                        <SelectTrigger
                            className="
                                w-full
                                h-11
                                rounded-lg
                                border-gray-300
                            "
                        >

                            <SelectValue
                                placeholder="Select rental type"
                            />

                        </SelectTrigger>


                        <SelectContent>

                            {RENTAL_TYPE_OPTIONS.map(
                                (option) => (

                                    <SelectItem
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {option.label}
                                    </SelectItem>

                                )
                            )}

                        </SelectContent>

                    </Select>


                    <p className="error-text">
                        {errors.rental_type?.message}
                    </p>

                </div>


                {/* =================================================
                   DRIVER
                ================================================= */}

                {rentalType === "with_driver" && (

                    <div>

                        <label className="form-label">
                            Driver
                        </label>


                        <Select
                            key={`
                                driver-
                                ${defaultValues?.id ?? "new"}-
                                ${driverId}
                            `}
                            value={
                                driverId || ""
                            }
                            onValueChange={(value) => {

                                setValue(
                                    "driver_id",
                                    value,
                                    {
                                        shouldValidate:
                                            true,
                                        shouldDirty:
                                            true,
                                    }
                                );

                            }}
                        >

                            <SelectTrigger
                                className="
                                    w-full
                                    h-11
                                    rounded-lg
                                    border-gray-300
                                "
                            >

                                <SelectValue
                                    placeholder="
                                        Select driver
                                        (optional at creation)
                                    "
                                />

                            </SelectTrigger>


                            <SelectContent>

                                {driversWithFallback.map(
                                    (driver) => (

                                        <SelectItem
                                            key={
                                                driver.id
                                            }
                                            value={
                                                normalizeId(
                                                    driver.id
                                                )
                                            }
                                        >
                                            {driver.name}
                                        </SelectItem>

                                    )
                                )}

                            </SelectContent>

                        </Select>


                        <p className="error-text">
                            {errors.driver_id?.message}
                        </p>

                    </div>

                )}


                {/* =================================================
                   PICKUP
                ================================================= */}

                <div>

                    <label className="form-label">

                        {rentalType ===
                        "with_driver"
                            ? "Pickup Location"
                            : "Pickup Branch"}

                    </label>


                    {rentalType ===
                    "with_driver" ? (

                        <input
                            type="text"
                            {...register(
                                "pickup_location"
                            )}
                            className="form-input"
                            placeholder="Enter pickup address"
                        />

                    ) : (

                        <Select
                            key={`
                                pickup-branch-
                                ${defaultValues?.id ?? "new"}-
                                ${pickupBranchId}
                            `}
                            value={
                                pickupBranchId || ""
                            }
                            onValueChange={(value) => {

                                setValue(
                                    "pickup_branch_id",
                                    value,
                                    {
                                        shouldValidate:
                                            true,
                                        shouldDirty:
                                            true,
                                    }
                                );

                            }}
                        >

                            <SelectTrigger
                                className="
                                    w-full
                                    h-11
                                    rounded-lg
                                    border-gray-300
                                "
                            >

                                <SelectValue
                                    placeholder="Select pickup branch"
                                />

                            </SelectTrigger>


                            <SelectContent>

                                {branchList.map(
                                    (branch) => {

                                        const branchId =
                                            normalizeId(
                                                branch.id
                                            );


                                        return (

                                            <SelectItem
                                                key={
                                                    branchId
                                                }
                                                value={
                                                    branchId
                                                }
                                            >
                                                {branch.name}
                                            </SelectItem>

                                        );

                                    }
                                )}

                            </SelectContent>

                        </Select>

                    )}


                    <p className="error-text">

                        {rentalType ===
                        "with_driver"
                            ? errors.pickup_location?.message
                            : errors.pickup_branch_id?.message}

                    </p>

                </div>


                {/* =================================================
                   DROP
                ================================================= */}

                <div>

                    <label className="form-label">

                        {rentalType ===
                        "with_driver"
                            ? "Drop Location"
                            : "Drop Branch"}

                    </label>


                    {rentalType ===
                    "with_driver" ? (

                        <input
                            type="text"
                            {...register(
                                "drop_location"
                            )}
                            className="form-input"
                            placeholder="Enter drop-off address"
                        />

                    ) : (

                        <Select
                            key={`
                                drop-branch-
                                ${defaultValues?.id ?? "new"}-
                                ${dropBranchId}
                            `}
                            value={
                                dropBranchId || ""
                            }
                            onValueChange={(value) => {

                                setValue(
                                    "drop_branch_id",
                                    value,
                                    {
                                        shouldValidate:
                                            true,
                                        shouldDirty:
                                            true,
                                    }
                                );

                            }}
                        >

                            <SelectTrigger
                                className="
                                    w-full
                                    h-11
                                    rounded-lg
                                    border-gray-300
                                "
                            >

                                <SelectValue
                                    placeholder="Select drop branch"
                                />

                            </SelectTrigger>


                            <SelectContent>

                                {branchList.map(
                                    (branch) => {

                                        const branchId =
                                            normalizeId(
                                                branch.id
                                            );


                                        return (

                                            <SelectItem
                                                key={
                                                    branchId
                                                }
                                                value={
                                                    branchId
                                                }
                                            >
                                                {branch.name}
                                            </SelectItem>

                                        );

                                    }
                                )}

                            </SelectContent>

                        </Select>

                    )}


                    <p className="error-text">

                        {rentalType ===
                        "with_driver"
                            ? errors.drop_location?.message
                            : errors.drop_branch_id?.message}

                    </p>

                </div>


                {/* =================================================
                   PICKUP DATE
                ================================================= */}

                <div>

                    <label className="form-label">
                        Pickup Date &amp; Time
                    </label>


                    <input
                        type="datetime-local"
                        {...register(
                            "pickup_at"
                        )}
                        className="form-input"
                    />


                    <p className="error-text">
                        {errors.pickup_at?.message}
                    </p>

                </div>


                {/* =================================================
                   EXPECTED RETURN
                ================================================= */}

                <div>

                    <label className="form-label">
                        Expected Return
                    </label>


                    <input
                        type="datetime-local"
                        {...register(
                            "expected_return_at"
                        )}
                        className="form-input"
                    />


                    <p className="error-text">
                        {
                            errors.expected_return_at
                                ?.message
                        }
                    </p>

                </div>


                {/* =================================================
                   VEHICLE CONDITION
                ================================================= */}

                <div className="md:col-span-3">

                    <div
                        className="
                            border-t
                            border-gray-200
                            pt-6
                        "
                    >

                        <h2
                            className="
                                mb-4
                                text-base
                                font-semibold
                                text-gray-700
                            "
                        >
                            Vehicle Condition
                        </h2>


                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-4
                                gap-5
                            "
                        >

                            {/* PICKUP ODOMETER */}

                            <div>

                                <label className="form-label">
                                    Pickup Odometer (km)
                                </label>


                                <input
                                    type="number"
                                    min="0"
                                    {...register(
                                        "pickup_odometer"
                                    )}
                                    className="form-input"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .pickup_odometer
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* RETURN ODOMETER */}

                            <div>

                                <label className="form-label">
                                    Return Odometer (km)
                                </label>


                                <input
                                    type="number"
                                    min="0"
                                    {...register(
                                        "return_odometer"
                                    )}
                                    className="form-input"
                                    placeholder="Enter return odometer"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .return_odometer
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* PICKUP FUEL */}

                            <div>

                                <label className="form-label">
                                    Pickup Fuel Level
                                </label>


                                <Select
                                    key={`
                                        pickup-fuel-
                                        ${defaultValues?.id ?? "new"}-
                                        ${pickupFuel}
                                    `}
                                    value={
                                        pickupFuel || ""
                                    }
                                    onValueChange={(value) => {

                                        setValue(
                                            "pickup_fuel",
                                            normalizeFuelLevel(
                                                value
                                            ),
                                            {
                                                shouldValidate:
                                                    true,
                                                shouldDirty:
                                                    true,
                                            }
                                        );

                                    }}
                                >

                                    <SelectTrigger
                                        className="
                                            w-full
                                            h-11
                                            rounded-lg
                                            border-gray-300
                                        "
                                    >

                                        <SelectValue
                                            placeholder="Select fuel level"
                                        />

                                    </SelectTrigger>


                                    <SelectContent>

                                        {FUEL_LEVEL_OPTIONS.map(
                                            (option) => (

                                                <SelectItem
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {option.label}
                                                </SelectItem>

                                            )
                                        )}

                                    </SelectContent>

                                </Select>


                                <p className="error-text">
                                    {
                                        errors
                                            .pickup_fuel
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* RETURN FUEL */}

                            <div>

                                <label className="form-label">
                                    Return Fuel Level
                                </label>


                                <Select
                                    key={`
                                        return-fuel-
                                        ${defaultValues?.id ?? "new"}-
                                        ${returnFuel}
                                    `}
                                    value={
                                        returnFuel || ""
                                    }
                                    onValueChange={(value) => {

                                        setValue(
                                            "return_fuel",
                                            normalizeFuelLevel(
                                                value
                                            ),
                                            {
                                                shouldValidate:
                                                    true,
                                                shouldDirty:
                                                    true,
                                            }
                                        );

                                    }}
                                >

                                    <SelectTrigger
                                        className="
                                            w-full
                                            h-11
                                            rounded-lg
                                            border-gray-300
                                        "
                                    >

                                        <SelectValue
                                            placeholder="Select fuel level"
                                        />

                                    </SelectTrigger>


                                    <SelectContent>

                                        {FUEL_LEVEL_OPTIONS.map(
                                            (option) => (

                                                <SelectItem
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {option.label}
                                                </SelectItem>

                                            )
                                        )}

                                    </SelectContent>

                                </Select>


                                <p className="error-text">
                                    {
                                        errors
                                            .return_fuel
                                            ?.message
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   BILLING SUMMARY
                ================================================= */}

                <div className="md:col-span-3">

                    <div
                        className="
                            border-t
                            border-gray-200
                            pt-6
                        "
                    >

                        <h2
                            className="
                                mb-4
                                text-base
                                font-semibold
                                text-gray-700
                            "
                        >
                            Billing Summary
                        </h2>


                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-3
                                gap-5
                            "
                        >

                            {/* BASE AMOUNT */}

                            <div>

                                <label className="form-label">
                                    Base Amount
                                </label>


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(
                                        "base_amount"
                                    )}
                                    className="form-input"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .base_amount
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* EXTRA KM */}

                            <div>

                                <label className="form-label">
                                    Extra KM Charge
                                </label>


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(
                                        "extra_km_charge"
                                    )}
                                    className="form-input"
                                    placeholder="0.00"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .extra_km_charge
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* LATE RETURN */}

                            <div>

                                <label className="form-label">
                                    Late Return Charge
                                </label>


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(
                                        "late_return_charge"
                                    )}
                                    className="form-input"
                                    placeholder="0.00"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .late_return_charge
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* DAMAGE */}

                            <div>

                                <label className="form-label">
                                    Damage Charge
                                </label>


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(
                                        "damage_charge"
                                    )}
                                    className="form-input"
                                    placeholder="0.00"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .damage_charge
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* FUEL */}

                            <div>

                                <label className="form-label">
                                    Fuel Charge
                                </label>


                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(
                                        "fuel_charge"
                                    )}
                                    className="form-input"
                                    placeholder="0.00"
                                />


                                <p className="error-text">
                                    {
                                        errors
                                            .fuel_charge
                                            ?.message
                                    }
                                </p>

                            </div>

                        </div>


                        {/* TOTAL */}

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                rounded-lg
                                bg-gray-50
                                px-4
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                "
                            >
                                Total
                            </span>


                            <span
                                className="
                                    text-lg
                                    font-bold
                                    text-gray-800
                                "
                            >

                                Rs.{" "}

                                {totalAmount.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}

                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                   PICKUP NOTES
                ================================================= */}

                <div className="md:col-span-3">

                    <label className="form-label">
                        Pickup Notes
                    </label>


                    <textarea
                        {...register(
                            "pickup_notes"
                        )}
                        rows={3}
                        className="
                            form-input
                            resize-none
                        "
                        placeholder="
                            Optional notes about vehicle
                            condition at pickup
                        "
                    />


                    <p className="error-text">
                        {
                            errors
                                .pickup_notes
                                ?.message
                        }
                    </p>

                </div>

            </div>


            {/* =====================================================
               BUTTONS
            ===================================================== */}

            <div
                className="
                    flex
                    justify-end
                    gap-3
                    border-t
                    pt-5
                "
            >

                <button
                    type="button"
                    onClick={onCancel}
                    className="
                        cursor-pointer
                        rounded-lg
                        border
                        border-gray-300
                        px-5
                        py-2.5
                        text-gray-700
                        hover:bg-gray-50
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        isLoading
                    }
                    className="
                        cursor-pointer
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        text-white
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {isSubmitting || isLoading
                        ? "Saving..."
                        : defaultValues
                            ? "Update Trip"
                            : "Create Trip"}

                </button>

            </div>

        </form>

    );

};


export default TripForm;