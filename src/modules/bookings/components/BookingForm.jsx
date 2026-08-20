import { useEffect, useState } from "react";
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

import { bookingSchema } from "../validation/bookingSchema";

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
        ""
    );
};


/* =========================================================
   PICKUP BRANCH ID

   Supports:

   pickup_branch_id

   pickup_branch.id

   pickup_branch.branch_id

   pickup_branch_id returned as object
========================================================= */

const getPickupBranchIdFromBooking = (booking) => {
    return normalizeId(
        booking?.pickup_branch_id ??
        booking?.pickup_branch?.id ??
        booking?.pickup_branch?.branch_id ??
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
        ""
    );
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

    const { data: users } = useUsers();
    const { data: vehicles } = useVehicles();
    const { data: branches } = useBranches();


    const customers = Array.isArray(users)
        ? users
        : [];

    const vehicleList = Array.isArray(vehicles)
        ? vehicles
        : [];

    const branchList = Array.isArray(branches)
        ? branches
        : [];


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

        defaultValues: {

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
        },
    });


    /* =====================================================
       WATCH VALUES
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
       POPULATE EDIT DATA
    ===================================================== */

    useEffect(() => {

        if (!defaultValues) {
            return;
        }


        console.log(
            "========== BOOKING EDIT DATA =========="
        );

        console.log(
            "API BOOKING:",
            defaultValues
        );


        /* =================================================
           CUSTOMER
        ================================================= */

        const customerId =
            getCustomerIdFromBooking(
                defaultValues
            );


        /* =================================================
           VEHICLE
        ================================================= */

        const vehicleId =
            getVehicleIdFromBooking(
                defaultValues
            );


        /* =================================================
           RENTAL TYPE
        ================================================= */

        const rentalType =
            normalizeRentalType(
                defaultValues.rental_type ??
                defaultValues.rentalType ??
                defaultValues.booking_type ??
                defaultValues.bookingType ??
                defaultValues.type
            );


        /* =================================================
           PICKUP BRANCH
        ================================================= */

        const pickupBranchId =
            getPickupBranchIdFromBooking(
                defaultValues
            );


        /* =================================================
           DROP BRANCH
        ================================================= */

        const dropBranchId =
            getDropBranchIdFromBooking(
                defaultValues
            );


        /* =================================================
           LOCATIONS
        ================================================= */

        const pickupLocation =
            defaultValues.pickup_location ??
            "";

        const dropLocation =
            defaultValues.drop_location ??
            "";


        /* =================================================
           BUILD FORM VALUES

           IMPORTANT:

           Do NOT remove branch IDs based on rental type
           while reading API data.

           Let the API determine what exists.
        ================================================= */

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
                pickupLocation,

            drop_location:
                dropLocation,

            pickup_at:
                formatDateTimeLocal(
                    defaultValues.pickup_at
                ),

            expected_return_at:
                formatDateTimeLocal(
                    defaultValues.expected_return_at
                ),

            quoted_amount:
                defaultValues.quoted_amount !==
                    null &&
                defaultValues.quoted_amount !==
                    undefined
                    ? String(
                        defaultValues.quoted_amount
                    )
                    : "",

            discount_amount:
                defaultValues.discount_amount !==
                    null &&
                defaultValues.discount_amount !==
                    undefined
                    ? String(
                        defaultValues.discount_amount
                    )
                    : "0",

            final_amount:
                defaultValues.final_amount !==
                    null &&
                defaultValues.final_amount !==
                    undefined
                    ? String(
                        defaultValues.final_amount
                    )
                    : "",

            customer_notes:
                defaultValues.customer_notes ??
                "",

            admin_notes:
                defaultValues.admin_notes ??
                "",
        };


        console.log(
            "NORMALIZED FORM VALUES:",
            values
        );


        /* =================================================
           RESET FORM
        ================================================= */

        reset(values);


        /* =================================================
           CUSTOMER SEARCH RESET
        ================================================= */

        setCustomerSearch("");


    }, [
        defaultValues,
        reset,
    ]);


    /* =====================================================
       AUTO CALCULATE FINAL AMOUNT
    ===================================================== */

    useEffect(() => {

        const quoted =
            Number(quotedAmount) || 0;

        const discount =
            Number(discountAmount) || 0;

        const finalAmount =
            Math.max(
                quoted - discount,
                0
            );

        setValue(
            "final_amount",
            finalAmount.toFixed(2),
            {
                shouldValidate: true,
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


        if (
            value === "self_drive"
        ) {

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


        if (
            value === "with_driver"
        ) {

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

                        status: "active",
                    });


                console.log(
                    "CUSTOMER CREATED:",
                    response
                );


                const newCustomer =
                    response?.data?.data ??
                    response?.data ??
                    response;


                console.log(
                    "NEW CUSTOMER:",
                    newCustomer
                );


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
                    String(
                        newCustomer.id
                    ),
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
        };


        console.log(
            "FINAL BOOKING PAYLOAD:",
            payload
        );


        onSubmit(
            payload
        );
    };


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

                    <Popover>

                        <PopoverTrigger
                            asChild
                        >

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
                                        !customers.some(
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

                                        {customers.map(
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
                                                                    customer.id
                                                                )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }
                                                        `}
                                                    />

                                                    <span className="truncate">

                                                        {
                                                            customer.name
                                                        }

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

                        <PopoverTrigger
                            asChild
                        >

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
                                                        vehicle.id
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
                                />

                                <CommandList>

                                    <CommandEmpty>
                                        No vehicle found.
                                    </CommandEmpty>

                                    <CommandGroup>

                                        {vehicleList.map(
                                            (vehicle) => (

                                                <CommandItem
                                                    key={
                                                        vehicle.id
                                                    }

                                                    value={`
                                                        ${vehicle.name}
                                                        ${vehicle.registration_number || ""}
                                                    `}

                                                    onSelect={() => {

                                                        setValue(
                                                            "vehicle_id",
                                                            String(
                                                                vehicle.id
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

                                                    <Check
                                                        className={`

                                                            mr-2
                                                            h-4
                                                            w-4

                                                            ${
                                                                normalizeId(
                                                                    vehicleId
                                                                ) ===
                                                                normalizeId(
                                                                    vehicle.id
                                                                )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            }

                                                        `}
                                                    />

                                                    <span className="truncate">

                                                        {
                                                            vehicle.name
                                                        }

                                                        {vehicle.registration_number
                                                            ? ` — ${vehicle.registration_number}`
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
                        {
                            errors.vehicle_id?.message
                        }
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

                        key={`rental-type-${defaultValues?.id ?? "new"}-${rentalType}`}

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
                                        {
                                            option.label
                                        }
                                    </SelectItem>

                                )
                            )}

                        </SelectContent>

                    </Select>

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

                            key={`pickup-branch-${defaultValues?.id ?? "new"}-${pickupBranchId}`}

                            value={
                                pickupBranchId || ""
                            }

                            onValueChange={
                                (value) => {

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

                                }
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
                                                {
                                                    branch.name
                                                }
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

                            key={`drop-branch-${defaultValues?.id ?? "new"}-${dropBranchId}`}

                            value={
                                dropBranchId || ""
                            }

                            onValueChange={
                                (value) => {

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

                                }
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
                                                {
                                                    branch.name
                                                }
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
                    QUOTED
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
                    FINAL
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
                    "
                >

                    {isSubmitting ||
                    isLoading
                        ? "Saving..."
                        : defaultValues
                            ? "Update Booking"
                            : "Create Booking"}

                </button>

            </div>

        </form>
    );
};


export default BookingForm;