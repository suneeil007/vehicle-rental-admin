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
    Check,
    ChevronsUpDown,
} from "lucide-react";

import { bookingSchema } from "../validation/bookingSchema";

import useUsers from "../../users/hooks/useUsers";
import useVehicles from "../../vehicles/hooks/useVehicles";
import useBranches from "../../branches/hooks/useBranches";
import useBookings from "../hooks/useBookings";

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
   SYSTEM VEHICLE STATUS
   ---------------------------------------------------------
   These are the ONLY vehicle statuses in the system.
========================================================= */

const VEHICLE_STATUS = {
    AVAILABLE: "available",
    BOOKED: "booked",
    ON_TRIP: "on_trip",
    MAINTENANCE: "maintenance",
    INACTIVE: "inactive",
};


/* =========================================================
   VEHICLE STATUS LABELS
========================================================= */

const VEHICLE_STATUS_LABELS = {
    available: "Available",
    booked: "Booked",
    on_trip: "On Trip",
    maintenance: "Maintenance",
    inactive: "Inactive",
};


/* =========================================================
   VEHICLE SORT ORDER
   ---------------------------------------------------------
   Available vehicles always come first.

   1. Available
   2. Booked
   3. On Trip
   4. Maintenance
   5. Inactive
========================================================= */

const VEHICLE_STATUS_SORT_ORDER = {
    available: 1,
    booked: 2,
    on_trip: 3,
    maintenance: 4,
    inactive: 5,
};


/* =========================================================
   ACTIVE BOOKING STATUSES
========================================================= */

const ACTIVE_BOOKING_STATUSES = [
    "pending",
    "booked",
    "confirmed",
    "approved",
    "ongoing",
    "in_progress",
    "active",
    "trip_created",
    "reserved",
];


/* =========================================================
   INACTIVE BOOKING STATUSES
========================================================= */

const INACTIVE_BOOKING_STATUSES = [
    "cancelled",
    "canceled",
    "completed",
    "complete",
    "rejected",
    "declined",
    "expired",
    "closed",
];


/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (value) => {
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
            value.code ??
            "";
    }

    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
};


/* =========================================================
   IS ACTIVE BOOKING
========================================================= */

const isActiveBooking = (booking) => {
    const status = normalizeStatus(
        booking?.status ??
        booking?.booking_status ??
        booking?.bookingStatus ??
        ""
    );

    if (
        INACTIVE_BOOKING_STATUSES.includes(status)
    ) {
        return false;
    }

    if (status) {
        return ACTIVE_BOOKING_STATUSES.includes(status);
    }

    return Boolean(
        booking?.pickup_at &&
        booking?.expected_return_at
    );
};


/* =========================================================
   GET ID
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
            value.branch_id ??
            value.vehicle_id ??
            value.customer_id ??
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
            value.code ??
            value.key ??
            value.rental_type ??
            value.rentalType ??
            "";
    }

    if (typeof value === "number") {
        if (value === 0) {
            return "self_drive";
        }

        if (value === 1) {
            return "with_driver";
        }
    }

    if (typeof value === "boolean") {
        return value
            ? "with_driver"
            : "self_drive";
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
        normalized === "driver" ||
        normalized === "with_a_driver"
    ) {
        return "with_driver";
    }

    return "";
};


/* =========================================================
   CUSTOMER ID
========================================================= */

const getCustomerIdFromBooking = (booking) => {
    return normalizeId(
        booking?.customer_id ??
        booking?.customer?.id ??
        booking?.customer?.user_id ??
        booking?.customer?.user?.id ??
        ""
    );
};


/* =========================================================
   VEHICLE ID
========================================================= */

const getVehicleIdFromBooking = (booking) => {
    return normalizeId(
        booking?.vehicle_id ??
        booking?.vehicle?.id ??
        booking?.vehicle?.vehicle_id ??
        ""
    );
};


/* =========================================================
   PICKUP BRANCH ID
========================================================= */

const getPickupBranchIdFromBooking = (booking) => {
    return normalizeId(
        booking?.pickup_branch_id ??
        booking?.pickup_branch?.id ??
        booking?.pickup_branch?.branch_id ??
        booking?.pickupBranch?.id ??
        ""
    );
};


/* =========================================================
   DROP BRANCH ID
========================================================= */

const getDropBranchIdFromBooking = (booking) => {
    return normalizeId(
        booking?.drop_branch_id ??
        booking?.drop_branch?.id ??
        booking?.drop_branch?.branch_id ??
        booking?.dropBranch?.id ??
        ""
    );
};


/* =========================================================
   DEFAULT FORM VALUES
========================================================= */

const EMPTY_FORM_VALUES = {
    customer_id: "",
    vehicle_id: "",
    rental_type: "",

    pickup_branch_id: "",
    drop_branch_id: "",

    pickup_location: "",
    drop_location: "",

    pickup_at: "",
    expected_return_at: "",

    quoted_amount: "",
    discount_amount: "0",
    final_amount: "",

    customer_notes: "",
    admin_notes: "",
};


/* =========================================================
   BOOKING FORM
========================================================= */

const BookingForm = ({
    onSubmit,
    onCancel,
    isLoading = false,
    defaultValues = null,
}) => {
    const queryClient = useQueryClient();


    /* =====================================================
       API DATA
    ===================================================== */

    const {
        data: users,
    } = useUsers();

    const {
        data: vehicles,
    } = useVehicles();

    const {
        data: branches,
    } = useBranches();

    const {
        data: bookings,
    } = useBookings();


    /* =====================================================
       NORMALIZE API LISTS
    ===================================================== */

    const customers = useMemo(() => {
        if (Array.isArray(users)) {
            return users;
        }

        if (Array.isArray(users?.data)) {
            return users.data;
        }

        if (Array.isArray(users?.data?.data)) {
            return users.data.data;
        }

        return [];
    }, [users]);


    const vehicleList = useMemo(() => {
        if (Array.isArray(vehicles)) {
            return vehicles;
        }

        if (Array.isArray(vehicles?.data)) {
            return vehicles.data;
        }

        if (Array.isArray(vehicles?.data?.data)) {
            return vehicles.data.data;
        }

        return [];
    }, [vehicles]);


    const branchList = useMemo(() => {
        if (Array.isArray(branches)) {
            return branches;
        }

        if (Array.isArray(branches?.data)) {
            return branches.data;
        }

        if (Array.isArray(branches?.data?.data)) {
            return branches.data.data;
        }

        return [];
    }, [branches]);


    const bookingList = useMemo(() => {
        if (Array.isArray(bookings)) {
            return bookings;
        }

        if (Array.isArray(bookings?.data)) {
            return bookings.data;
        }

        if (Array.isArray(bookings?.data?.data)) {
            return bookings.data.data;
        }

        return [];
    }, [bookings]);


    /* =====================================================
       SEARCH STATES
    ===================================================== */

    const [
        customerSearch,
        setCustomerSearch,
    ] = useState("");

    const [
        creatingCustomer,
        setCreatingCustomer,
    ] = useState(false);

    const [
        rentalTypeSearch,
        setRentalTypeSearch,
    ] = useState("");

    const [
        vehicleSearch,
        setVehicleSearch,
    ] = useState("");


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
        resolver: zodResolver(
            bookingSchema
        ),

        defaultValues:
            EMPTY_FORM_VALUES,
    });


    /* =====================================================
       WATCH
    ===================================================== */

    const customerId = watch(
        "customer_id"
    );

    const vehicleId = watch(
        "vehicle_id"
    );

    const rentalType = watch(
        "rental_type"
    );

    const pickupBranchId = watch(
        "pickup_branch_id"
    );

    const dropBranchId = watch(
        "drop_branch_id"
    );

    const quotedAmount = watch(
        "quoted_amount"
    );

    const discountAmount = watch(
        "discount_amount"
    );


    /* =====================================================
       EDIT MODE
    ===================================================== */

    const isEditMode = Boolean(
        defaultValues
    );

    const currentBookingId = normalizeId(
        defaultValues?.id ??
        defaultValues?.booking_id
    );

    const currentBookingVehicleId =
        getVehicleIdFromBooking(
            defaultValues
        );


    /* =====================================================
       VEHICLE AVAILABILITY
       -----------------------------------------------------
       ONLY THESE SYSTEM STATUSES ARE USED:

       available
       booked
       on_trip
       maintenance
       inactive

       AVAILABLE:
       selectable

       BOOKED:
       disabled

       ON TRIP:
       disabled

       MAINTENANCE:
       disabled

       INACTIVE:
       disabled

       EDIT MODE:
       Current booking vehicle remains selectable.
    ===================================================== */

    const vehicleAvailability = useMemo(() => {
        const result = {};

        vehicleList.forEach((vehicle) => {
            const id = normalizeId(
                vehicle?.id
            );

            if (!id) {
                return;
            }

            const vehicleStatus =
                normalizeStatus(
                    vehicle?.status
                );

            const isCurrentBookingVehicle =
                Boolean(
                    currentBookingId &&
                    currentBookingVehicleId &&
                    id === currentBookingVehicleId
                );


            /* =============================================
               AVAILABLE
            ============================================= */

            if (
                vehicleStatus ===
                VEHICLE_STATUS.AVAILABLE
            ) {
                result[id] = {
                    available: true,
                    unavailable: false,
                    status: vehicleStatus,
                    reason: null,
                    currentBookingVehicle:
                        isCurrentBookingVehicle,
                };

                return;
            }


            /* =============================================
               BOOKED / ON TRIP
            ============================================= */

            if (
                vehicleStatus ===
                    VEHICLE_STATUS.BOOKED ||
                vehicleStatus ===
                    VEHICLE_STATUS.ON_TRIP
            ) {

                /*
                 * During edit, allow the vehicle
                 * already assigned to this booking.
                 */

                if (
                    isCurrentBookingVehicle
                ) {
                    result[id] = {
                        available: true,
                        unavailable: false,
                        status: vehicleStatus,
                        reason: null,
                        currentBookingVehicle:
                            true,
                    };

                    return;
                }


                result[id] = {
                    available: false,
                    unavailable: true,
                    status: vehicleStatus,

                    reason:
                        vehicleStatus ===
                        VEHICLE_STATUS.ON_TRIP
                            ? "Vehicle currently on trip"
                            : "Vehicle currently booked",

                    currentBookingVehicle:
                        false,
                };

                return;
            }


            /* =============================================
               MAINTENANCE
            ============================================= */

            if (
                vehicleStatus ===
                VEHICLE_STATUS.MAINTENANCE
            ) {
                result[id] = {
                    available: false,
                    unavailable: true,
                    status: vehicleStatus,
                    reason:
                        "Vehicle under maintenance",
                    currentBookingVehicle:
                        isCurrentBookingVehicle,
                };

                return;
            }


            /* =============================================
               INACTIVE
            ============================================= */

            if (
                vehicleStatus ===
                VEHICLE_STATUS.INACTIVE
            ) {
                result[id] = {
                    available: false,
                    unavailable: true,
                    status: vehicleStatus,
                    reason:
                        "Vehicle is inactive",
                    currentBookingVehicle:
                        isCurrentBookingVehicle,
                };

                return;
            }


            /* =============================================
               UNKNOWN STATUS
            ============================================= */

            result[id] = {
                available: false,
                unavailable: true,
                status: vehicleStatus,
                reason:
                    "Unknown vehicle status",
                currentBookingVehicle:
                    isCurrentBookingVehicle,
            };
        });

        return result;
    }, [
        vehicleList,
        currentBookingId,
        currentBookingVehicleId,
    ]);


    /* =====================================================
       SORT VEHICLES
       -----------------------------------------------------
       IMPORTANT:
       Available vehicles ALWAYS come first.

       Example:

       Toyota Fortuner       Available
       Hyundai Ionic         Available
       Toyota Corolla        Available

       ------------------------------

       Toyota Hilux          Booked
       Kia Sportage          On Trip
       Hyundai Creta         Maintenance
       Toyota Prius          Inactive
    ===================================================== */

    const sortedVehicleList = useMemo(() => {
        const vehiclesWithIndex =
            vehicleList.map(
                (vehicle, index) => ({
                    vehicle,
                    index,
                })
            );

        return vehiclesWithIndex
            .sort((a, b) => {
                const statusA =
                    normalizeStatus(
                        a.vehicle?.status
                    );

                const statusB =
                    normalizeStatus(
                        b.vehicle?.status
                    );

                const orderA =
                    VEHICLE_STATUS_SORT_ORDER[
                        statusA
                    ] ?? 999;

                const orderB =
                    VEHICLE_STATUS_SORT_ORDER[
                        statusB
                    ] ?? 999;

                /*
                 * First sort by status.
                 */

                if (
                    orderA !== orderB
                ) {
                    return (
                        orderA -
                        orderB
                    );
                }

                /*
                 * Then sort by vehicle name.
                 */

                const nameA =
                    String(
                        a.vehicle?.name ??
                        ""
                    ).toLowerCase();

                const nameB =
                    String(
                        b.vehicle?.name ??
                        ""
                    ).toLowerCase();

                if (
                    nameA <
                    nameB
                ) {
                    return -1;
                }

                if (
                    nameA >
                    nameB
                ) {
                    return 1;
                }

                /*
                 * Preserve original order
                 * when names are identical.
                 */

                return (
                    a.index -
                    b.index
                );
            })
            .map(
                (item) =>
                    item.vehicle
            );
    }, [
        vehicleList,
    ]);


    /* =====================================================
       IS VEHICLE AVAILABLE
    ===================================================== */

    const isVehicleAvailable = (
        vehicle
    ) => {
        const id = normalizeId(
            vehicle?.id
        );

        if (!id) {
            return false;
        }

        return (
            vehicleAvailability[id]
                ?.available === true
        );
    };


    /* =====================================================
       VEHICLE STATUS LABEL
    ===================================================== */

    const getVehicleStatusLabel = (
        vehicle
    ) => {
        const id = normalizeId(
            vehicle?.id
        );

        const status =
            normalizeStatus(
                vehicle?.status
            );


        /*
         * Current booking vehicle should
         * not show Booked / On Trip while
         * editing.
         */

        if (
            currentBookingVehicleId &&
            id === currentBookingVehicleId &&
            currentBookingId
        ) {
            return "";
        }


        return (
            VEHICLE_STATUS_LABELS[
                status
            ] ?? "Unavailable"
        );
    };


    /* =====================================================
       POPULATE EDIT DATA
    ===================================================== */

    useEffect(() => {
        if (!defaultValues) {
            reset(
                EMPTY_FORM_VALUES
            );

            return;
        }


        console.log(
            "========== EDIT BOOKING =========="
        );

        console.log(
            "RAW BOOKING:",
            defaultValues
        );


        const customerId =
            getCustomerIdFromBooking(
                defaultValues
            );


        const vehicleId =
            getVehicleIdFromBooking(
                defaultValues
            );


        const rentalType =
            normalizeRentalType(
                defaultValues?.rental_type ??
                defaultValues?.rentalType ??
                defaultValues?.booking_type ??
                defaultValues?.bookingType ??
                defaultValues?.type
            );


        const pickupBranchId =
            getPickupBranchIdFromBooking(
                defaultValues
            );


        const dropBranchId =
            getDropBranchIdFromBooking(
                defaultValues
            );


        const pickupDate =
            defaultValues?.pickup_at ??
            defaultValues?.pickupAt ??
            "";

        const returnDate =
            defaultValues?.expected_return_at ??
            defaultValues?.expectedReturnAt ??
            "";


        const values = {
            customer_id:
                customerId,

            vehicle_id:
                vehicleId,

            rental_type:
                rentalType,

            pickup_branch_id:
                pickupBranchId,

            drop_branch_id:
                dropBranchId,

            pickup_location:
                defaultValues?.pickup_location ??
                defaultValues?.pickupLocation ??
                "",

            drop_location:
                defaultValues?.drop_location ??
                defaultValues?.dropLocation ??
                "",

            pickup_at:
                pickupDate
                    ? new Date(
                        pickupDate
                    )
                        .toISOString()
                        .slice(
                            0,
                            16
                        )
                    : "",

            expected_return_at:
                returnDate
                    ? new Date(
                        returnDate
                    )
                        .toISOString()
                        .slice(
                            0,
                            16
                        )
                    : "",

            quoted_amount:
                defaultValues?.quoted_amount !==
                    null &&
                defaultValues?.quoted_amount !==
                    undefined
                    ? String(
                        defaultValues.quoted_amount
                    )
                    : "",

            discount_amount:
                defaultValues?.discount_amount !==
                    null &&
                defaultValues?.discount_amount !==
                    undefined
                    ? String(
                        defaultValues.discount_amount
                    )
                    : "0",

            final_amount:
                defaultValues?.final_amount !==
                    null &&
                defaultValues?.final_amount !==
                    undefined
                    ? String(
                        defaultValues.final_amount
                    )
                    : "",

            customer_notes:
                defaultValues?.customer_notes ??
                defaultValues?.customerNotes ??
                "",

            admin_notes:
                defaultValues?.admin_notes ??
                defaultValues?.adminNotes ??
                "",
        };


        console.log(
            "NORMALIZED EDIT VALUES:",
            values
        );


        reset(
            values,
            {
                keepDefaultValues:
                    false,
            }
        );


        setCustomerSearch("");
        setRentalTypeSearch("");
        setVehicleSearch("");

    }, [
        defaultValues,
        reset,
    ]);


    /* =====================================================
       AUTO CALCULATE FINAL AMOUNT
    ===================================================== */

    useEffect(() => {
        const quoted =
            Number(
                quotedAmount
            ) || 0;

        const discount =
            Number(
                discountAmount
            ) || 0;

        const finalAmount =
            Math.max(
                quoted - discount,
                0
            );

        setValue(
            "final_amount",
            finalAmount.toFixed(2),
            {
                shouldValidate:
                    true,
            }
        );
    }, [
        quotedAmount,
        discountAmount,
        setValue,
    ]);


    /* =====================================================
       CHANGE RENTAL TYPE
    ===================================================== */

    const handleRentalTypeChange = (
        value
    ) => {
        setValue(
            "rental_type",
            value,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );


        setRentalTypeSearch("");


        if (
            value ===
            "with_driver"
        ) {
            setValue(
                "pickup_branch_id",
                "",
                {
                    shouldValidate:
                        true,
                    shouldDirty:
                        true,
                }
            );

            setValue(
                "drop_branch_id",
                "",
                {
                    shouldValidate:
                        true,
                    shouldDirty:
                        true,
                }
            );
        }


        if (
            value ===
            "self_drive"
        ) {
            setValue(
                "pickup_location",
                "",
                {
                    shouldValidate:
                        true,
                    shouldDirty:
                        true,
                }
            );

            setValue(
                "drop_location",
                "",
                {
                    shouldValidate:
                        true,
                    shouldDirty:
                        true,
                }
            );
        }
    };


    /* =====================================================
       CREATE CUSTOMER
    ===================================================== */

    const handleCreateCustomer =
        async () => {

            const name =
                customerSearch.trim();


            if (!name) {
                return;
            }


            try {
                setCreatingCustomer(
                    true
                );


                const firstFourLetters =
                    name
                        .replace(
                            /\s+/g,
                            ""
                        )
                        .slice(
                            0,
                            4
                        )
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

                        status:
                            "active",
                    });


                console.log(
                    "CUSTOMER CREATED:",
                    response
                );


                const newCustomer =
                    response?.data?.data ??
                    response?.data ??
                    response;


                if (
                    !newCustomer?.id
                ) {
                    console.error(
                        "Customer created but ID was not returned.",
                        response
                    );

                    return;
                }


                await queryClient.refetchQueries({
                    queryKey: [
                        "users",
                    ],
                });


                setValue(
                    "customer_id",
                    String(
                        newCustomer.id
                    ),
                    {
                        shouldValidate:
                            true,

                        shouldDirty:
                            true,
                    }
                );


                setCustomerSearch("");

            } catch (error) {
                console.error(
                    "CUSTOMER CREATE ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error?.response?.status
                );

                console.error(
                    "DATA:",
                    error?.response?.data
                );

            } finally {
                setCreatingCustomer(
                    false
                );
            }
        };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const submitForm = (
        data
    ) => {

        const isSelfDrive =
            data.rental_type ===
            "self_drive";


        const selectedVehicle =
            vehicleList.find(
                (vehicle) =>
                    normalizeId(
                        vehicle?.id
                    ) ===
                    normalizeId(
                        data.vehicle_id
                    )
            );


        /* =================================================
           VEHICLE CHECK
        ================================================= */

        if (
            selectedVehicle
        ) {
            const selectedVehicleId =
                normalizeId(
                    selectedVehicle.id
                );

            const availability =
                vehicleAvailability[
                    selectedVehicleId
                ];


            const isCurrentVehicle =
                Boolean(
                    currentBookingId &&
                    currentBookingVehicleId &&
                    selectedVehicleId ===
                        currentBookingVehicleId
                );


            if (
                !isCurrentVehicle &&
                !availability?.available
            ) {
                console.error(
                    "Selected vehicle is unavailable:",
                    {
                        vehicleId:
                            selectedVehicleId,

                        vehicle:
                            selectedVehicle?.name,

                        status:
                            selectedVehicle?.status,

                        availability,
                    }
                );

                return;
            }
        }


        /* =================================================
           PAYLOAD
        ================================================= */

        const payload = {
            ...data,

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

            pickup_location:
                isSelfDrive
                    ? null
                    : data.pickup_location
                        ?.trim() ||
                    null,

            drop_location:
                isSelfDrive
                    ? null
                    : data.drop_location
                        ?.trim() ||
                    null,

            quoted_amount:
                data.quoted_amount !==
                ""
                    ? Number(
                        data.quoted_amount
                    )
                    : 0,

            discount_amount:
                data.discount_amount !==
                ""
                    ? Number(
                        data.discount_amount
                    )
                    : 0,

            final_amount:
                data.final_amount !==
                ""
                    ? Number(
                        data.final_amount
                    )
                    : 0,
        };


        /* =================================================
           EDIT ID
        ================================================= */

        if (
            currentBookingId
        ) {
            payload.id =
                Number(
                    currentBookingId
                );
        }


        console.log(
            "===================================="
        );

        console.log(
            isEditMode
                ? "UPDATE BOOKING PAYLOAD:"
                : "CREATE BOOKING PAYLOAD:",
            payload
        );

        console.log(
            "BOOKING ID:",
            currentBookingId
        );

        console.log(
            "===================================="
        );


        onSubmit(
            payload
        );
    };


    /* =====================================================
       SELECTED RENTAL TYPE
    ===================================================== */

    const selectedRentalType =
        RENTAL_TYPE_OPTIONS.find(
            (option) =>
                option.value ===
                rentalType
        );


    /* =====================================================
       FILTER CUSTOMERS
    ===================================================== */

    const filteredCustomers =
        useMemo(() => {
            const search =
                customerSearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return customers;
            }

            return customers.filter(
                (customer) =>
                    `${customer?.name || ""} ${customer?.email || ""} ${customer?.phone || ""}`
                        .toLowerCase()
                        .includes(search)
            );
        }, [
            customers,
            customerSearch,
        ]);


    /* =====================================================
       FILTER VEHICLES
       -----------------------------------------------------
       IMPORTANT:

       We filter from sortedVehicleList,
       NOT vehicleList.

       Therefore the status ordering remains
       even when searching.
    ===================================================== */

    const filteredVehicles =
        useMemo(() => {
            const search =
                vehicleSearch
                    .trim()
                    .toLowerCase();

            if (!search) {
                return sortedVehicleList;
            }

            return sortedVehicleList.filter(
                (vehicle) =>
                    `${vehicle?.name || ""} ${vehicle?.registration_number || ""} ${vehicle?.status || ""}`
                        .toLowerCase()
                        .includes(search)
            );
        }, [
            sortedVehicleList,
            vehicleSearch,
        ]);


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <form
            onSubmit={
                handleSubmit(
                    submitForm,
                    (validationErrors) => {
                        console.log(
                            "BOOKING VALIDATION ERRORS:",
                            validationErrors
                        );
                    }
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

            {/* =================================================
                FORM GRID
            ================================================= */}

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

                                    {customerId
                                        ? (
                                            customers.find(
                                                (customer) =>
                                                    normalizeId(
                                                        customer?.id
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
                                        filteredCustomers.length === 0 && (

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


                                    <CommandEmpty>
                                        No customer found.
                                    </CommandEmpty>


                                    <CommandGroup>

                                        {filteredCustomers.map(
                                            (customer) => (

                                                <CommandItem
                                                    key={
                                                        customer?.id
                                                    }

                                                    value={`
                                                        ${customer?.name || ""}
                                                        ${customer?.email || ""}
                                                        ${customer?.phone || ""}
                                                    `}

                                                    onSelect={() => {

                                                        setValue(
                                                            "customer_id",
                                                            String(
                                                                customer.id
                                                            ),
                                                            {
                                                                shouldValidate:
                                                                    true,

                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );

                                                        setCustomerSearch("");
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
                                                                    customer?.id
                                                                )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }
                                                        `}
                                                    />


                                                    <span className="truncate">

                                                        {
                                                            customer?.name
                                                        }

                                                        {customer?.email &&
                                                            ` — ${customer.email}`}

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
                        {
                            errors.customer_id?.message
                        }
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
                                            vehicleList.find(
                                                (vehicle) =>
                                                    normalizeId(
                                                        vehicle?.id
                                                    ) ===
                                                    normalizeId(
                                                        vehicleId
                                                    )
                                            )?.name ||
                                            defaultValues?.vehicle?.name ||
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

                                <CommandInput
                                    placeholder="Search vehicle..."

                                    value={
                                        vehicleSearch
                                    }

                                    onValueChange={
                                        setVehicleSearch
                                    }
                                />


                                <CommandList>

                                    <CommandEmpty>
                                        No vehicle found.
                                    </CommandEmpty>


                                    {/* =================================================
                                        AVAILABLE VEHICLES
                                    ================================================= */}

                                    <CommandGroup heading="Available Vehicles">

                                        {filteredVehicles
                                            .filter(
                                                (vehicle) =>
                                                    normalizeStatus(
                                                        vehicle?.status
                                                    ) ===
                                                    VEHICLE_STATUS.AVAILABLE
                                            )
                                            .map(
                                                (vehicle) => {

                                                    const currentVehicleId =
                                                        normalizeId(
                                                            vehicle?.id
                                                        );

                                                    const available =
                                                        isVehicleAvailable(
                                                            vehicle
                                                        );

                                                    const isCurrentVehicle =
                                                        Boolean(
                                                            currentBookingId &&
                                                            currentBookingVehicleId &&
                                                            currentVehicleId ===
                                                                currentBookingVehicleId
                                                        );

                                                    const selectable =
                                                        available ||
                                                        isCurrentVehicle;

                                                    return (

                                                        <CommandItem
                                                            key={
                                                                currentVehicleId
                                                            }

                                                            value={`
                                                                ${vehicle?.name || ""}
                                                                ${vehicle?.registration_number || ""}
                                                                Available
                                                            `}

                                                            disabled={
                                                                !selectable
                                                            }

                                                            onSelect={() => {

                                                                if (
                                                                    !selectable
                                                                ) {
                                                                    return;
                                                                }

                                                                setValue(
                                                                    "vehicle_id",
                                                                    currentVehicleId,
                                                                    {
                                                                        shouldValidate:
                                                                            true,

                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                            }}

                                                            className={`
                                                                ${
                                                                    !selectable
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : "cursor-pointer"
                                                                }
                                                            `}
                                                        >

                                                            <Check
                                                                className={`
                                                                    mr-2
                                                                    h-4
                                                                    w-4
                                                                    ${
                                                                        normalizeId(
                                                                            vehicleId
                                                                        ) ===
                                                                        currentVehicleId
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    }
                                                                `}
                                                            />


                                                            <span
                                                                className="
                                                                    truncate
                                                                    flex-1
                                                                "
                                                            >

                                                                {
                                                                    vehicle?.name
                                                                }


                                                                {vehicle?.registration_number && (

                                                                    <span
                                                                        className="
                                                                            ml-2
                                                                            shrink-0
                                                                            text-[11px]
                                                                            text-gray-500
                                                                        "
                                                                    >
                                                                        —
                                                                        {
                                                                            vehicle.registration_number
                                                                        }
                                                                    </span>

                                                                )}

                                                            </span>

                                                        </CommandItem>

                                                    );
                                                }
                                            )}

                                    </CommandGroup>


                                    {/* =================================================
                                        OTHER VEHICLES
                                    ================================================= */}

                                    <CommandGroup heading="Other Vehicles">

                                        {filteredVehicles
                                            .filter(
                                                (vehicle) =>
                                                    normalizeStatus(
                                                        vehicle?.status
                                                    ) !==
                                                    VEHICLE_STATUS.AVAILABLE
                                            )
                                            .map(
                                                (vehicle) => {

                                                    const currentVehicleId =
                                                        normalizeId(
                                                            vehicle?.id
                                                        );

                                                    const available =
                                                        isVehicleAvailable(
                                                            vehicle
                                                        );

                                                    const statusLabel =
                                                        getVehicleStatusLabel(
                                                            vehicle
                                                        );

                                                    const isCurrentVehicle =
                                                        Boolean(
                                                            currentBookingId &&
                                                            currentBookingVehicleId &&
                                                            currentVehicleId ===
                                                                currentBookingVehicleId
                                                        );

                                                    const selectable =
                                                        available ||
                                                        isCurrentVehicle;

                                                    return (

                                                        <CommandItem
                                                            key={
                                                                currentVehicleId
                                                            }

                                                            value={`
                                                                ${vehicle?.name || ""}
                                                                ${vehicle?.registration_number || ""}
                                                                ${statusLabel}
                                                            `}

                                                            disabled={
                                                                !selectable
                                                            }

                                                            onSelect={() => {

                                                                if (
                                                                    !selectable
                                                                ) {
                                                                    return;
                                                                }

                                                                setValue(
                                                                    "vehicle_id",
                                                                    currentVehicleId,
                                                                    {
                                                                        shouldValidate:
                                                                            true,

                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                            }}

                                                            className={`
                                                                ${
                                                                    !selectable
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : "cursor-pointer"
                                                                }
                                                            `}
                                                        >

                                                            <Check
                                                                className={`
                                                                    mr-2
                                                                    h-4
                                                                    w-4
                                                                    ${
                                                                        normalizeId(
                                                                            vehicleId
                                                                        ) ===
                                                                        currentVehicleId
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    }
                                                                `}
                                                            />


                                                            <span
                                                                className="
                                                                    truncate
                                                                    flex-1
                                                                "
                                                            >

                                                                {
                                                                    vehicle?.name
                                                                }


                                                                {vehicle?.registration_number && (

                                                                    <span
                                                                        className="
                                                                            ml-2
                                                                            shrink-0
                                                                            text-[11px]
                                                                            text-gray-500
                                                                        "
                                                                    >
                                                                        —
                                                                        {
                                                                            vehicle.registration_number
                                                                        }
                                                                    </span>

                                                                )}

                                                            </span>


                                                            {statusLabel && (

                                                                <span
                                                                    className="
                                                                        ml-2
                                                                        shrink-0
                                                                        text-[10px]
                                                                        text-red-500
                                                                    "
                                                                >
                                                                    (
                                                                    {
                                                                        statusLabel
                                                                    }
                                                                    )
                                                                </span>

                                                            )}

                                                        </CommandItem>

                                                    );
                                                }
                                            )}

                                    </CommandGroup>

                                </CommandList>

                            </Command>

                        </PopoverContent>

                    </Popover>


                    <p className="error-text">
                        {
                            errors.vehicle_id?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    RENTAL TYPE
                ================================================= */}

                <div className="w-full">

                    <label className="form-label">
                        Rental Type
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

                                    {
                                        selectedRentalType?.label ||
                                        "Select rental type"
                                    }

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
                                    placeholder="Search rental type..."

                                    value={
                                        rentalTypeSearch
                                    }

                                    onValueChange={
                                        setRentalTypeSearch
                                    }
                                />


                                <CommandList>

                                    <CommandEmpty>
                                        No rental type found.
                                    </CommandEmpty>


                                    <CommandGroup>

                                        {RENTAL_TYPE_OPTIONS.map(
                                            (option) => (

                                                <CommandItem
                                                    key={
                                                        option.value
                                                    }

                                                    value={`
                                                        ${option.label}
                                                        ${option.value}
                                                    `}

                                                    onSelect={() => {

                                                        handleRentalTypeChange(
                                                            option.value
                                                        );

                                                    }}
                                                >

                                                    <Check
                                                        className={`
                                                            mr-2
                                                            h-4
                                                            w-4
                                                            ${
                                                                rentalType ===
                                                                option.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }
                                                        `}
                                                    />


                                                    <span className="truncate">

                                                        {
                                                            option.label
                                                        }

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
                        {
                            errors.rental_type?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    PICKUP
                ================================================= */}

                <div>

                    <label className="form-label">

                        {
                            rentalType ===
                            "with_driver"
                                ? "Pickup Location"
                                : "Pickup Branch"
                        }

                    </label>


                    {rentalType === "with_driver" ? (

                        <input
                            type="text"

                            {...register(
                                "pickup_location"
                            )}

                            className="form-input"

                            placeholder="Enter pickup address"
                        />

                    ) : (

                        <select
                            {...register(
                                "pickup_branch_id"
                            )}

                            className="
                                form-input
                                w-full
                            "
                        >

                            <option value="">
                                Select pickup branch
                            </option>


                            {branchList.map(
                                (branch) => {

                                    const branchId =
                                        normalizeId(
                                            branch?.id
                                        );

                                    return (

                                        <option
                                            key={
                                                branchId
                                            }

                                            value={
                                                branchId
                                            }
                                        >
                                            {
                                                branch?.name
                                            }
                                        </option>

                                    );
                                }
                            )}

                        </select>

                    )}


                    <p className="error-text">

                        {
                            rentalType ===
                            "with_driver"
                                ? errors.pickup_location?.message
                                : errors.pickup_branch_id?.message
                        }

                    </p>

                </div>


                {/* =================================================
                    DROP
                ================================================= */}

                <div>

                    <label className="form-label">

                        {
                            rentalType ===
                            "with_driver"
                                ? "Drop Location"
                                : "Drop Branch"
                        }

                    </label>


                    {rentalType === "with_driver" ? (

                        <input
                            type="text"

                            {...register(
                                "drop_location"
                            )}

                            className="form-input"

                            placeholder="Enter drop-off address"
                        />

                    ) : (

                        <select
                            {...register(
                                "drop_branch_id"
                            )}

                            className="
                                form-input
                                w-full
                            "
                        >

                            <option value="">
                                Select drop branch
                            </option>


                            {branchList.map(
                                (branch) => {

                                    const branchId =
                                        normalizeId(
                                            branch?.id
                                        );

                                    return (

                                        <option
                                            key={
                                                branchId
                                            }

                                            value={
                                                branchId
                                            }
                                        >
                                            {
                                                branch?.name
                                            }
                                        </option>

                                    );
                                }
                            )}

                        </select>

                    )}


                    <p className="error-text">

                        {
                            rentalType ===
                            "with_driver"
                                ? errors.drop_location?.message
                                : errors.drop_branch_id?.message
                        }

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
                        {
                            errors.pickup_at?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    RETURN DATE
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
                            errors.expected_return_at?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    QUOTED AMOUNT
                ================================================= */}

                <div>

                    <label className="form-label">
                        Quoted Amount
                    </label>


                    <input
                        type="number"
                        step="0.01"

                        {...register(
                            "quoted_amount"
                        )}

                        className="form-input"
                    />


                    <p className="error-text">
                        {
                            errors.quoted_amount?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    DISCOUNT
                ================================================= */}

                <div>

                    <label className="form-label">
                        Discount Amount
                    </label>


                    <input
                        type="number"
                        step="0.01"

                        {...register(
                            "discount_amount"
                        )}

                        className="form-input"
                    />


                    <p className="error-text">
                        {
                            errors.discount_amount?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    FINAL AMOUNT
                ================================================= */}

                <div>

                    <label className="form-label">
                        Final Amount
                    </label>


                    <input
                        type="number"
                        step="0.01"

                        {...register(
                            "final_amount"
                        )}

                        readOnly

                        className="
                            form-input
                            bg-gray-50
                            text-gray-600
                            cursor-not-allowed
                        "
                    />


                    <p className="error-text">
                        {
                            errors.final_amount?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    CUSTOMER NOTES
                ================================================= */}

                <div className="md:col-span-3">

                    <label className="form-label">
                        Customer Notes
                    </label>


                    <textarea
                        {...register(
                            "customer_notes"
                        )}

                        rows={3}

                        className="
                            form-input
                            resize-none
                        "

                        placeholder="Notes from the customer (optional)"
                    />


                    <p className="error-text">
                        {
                            errors.customer_notes?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    ADMIN NOTES
                ================================================= */}

                <div className="md:col-span-3">

                    <label className="form-label">
                        Admin Notes
                    </label>


                    <textarea
                        {...register(
                            "admin_notes"
                        )}

                        rows={3}

                        className="
                            form-input
                            resize-none
                        "

                        placeholder="Internal notes (optional)"
                    />


                    <p className="error-text">
                        {
                            errors.admin_notes?.message
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
                    pt-5
                    border-t
                    border-gray-200
                "
            >

                <button
                    type="button"

                    onClick={
                        onCancel
                    }

                    className="
                        px-5
                        py-2.5
                        rounded-lg
                        border
                        border-gray-300
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
                        px-5
                        py-2.5
                        rounded-lg
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >

                    {isSubmitting || isLoading
                        ? "Saving..."
                        : isEditMode
                            ? "Update Booking"
                            : "Create Booking"}

                </button>

            </div>

        </form>
    );
};


export default BookingForm;