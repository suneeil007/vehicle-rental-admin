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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

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

    /*
     * Handle API response like:
     *
     * "full"
     *
     * OR
     *
     * {
     *    value: "full"
     * }
     *
     * OR
     *
     * {
     *    name: "Full"
     * }
     */

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

    /* ================= EMPTY ================= */

    if (
        normalized === "empty" ||
        normalized === "0"
    ) {
        return "empty";
    }

    /* ================= QUARTER ================= */

    if (
        normalized === "quarter" ||
        normalized === "1/4" ||
        normalized === "one_quarter" ||
        normalized === "one_fourth" ||
        normalized === "25"
    ) {
        return "quarter";
    }

    /* ================= HALF ================= */

    if (
        normalized === "half" ||
        normalized === "1/2" ||
        normalized === "one_half" ||
        normalized === "50"
    ) {
        return "half";
    }

    /* ================= THREE QUARTER ================= */

    if (
        normalized === "three_quarter" ||
        normalized === "three_quarters" ||
        normalized === "3/4" ||
        normalized === "three_fourth" ||
        normalized === "75"
    ) {
        return "three_quarter";
    }

    /* ================= FULL ================= */

    if (
        normalized === "full" ||
        normalized === "100"
    ) {
        return "full";
    }

    return "";
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

    const customers = allUsers.filter(
        (user) => Number(user.role_id) === 5
    );

    const drivers = allUsers.filter(
        (user) => Number(user.role_id) === 6
    );


    /* =====================================================
       CUSTOMER SEARCH
    ===================================================== */

    const [customerSearch, setCustomerSearch] = useState("");
    const [creatingCustomer, setCreatingCustomer] = useState(false);


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

        resolver: zodResolver(tripSchema),

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

            /* Vehicle Condition */

            pickup_odometer: "0",
            return_odometer: "",

            pickup_fuel: "",
            return_fuel: "",

            /* Billing */

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

    const customerId = watch("customer_id");
    const vehicleId = watch("vehicle_id");
    const driverId = watch("driver_id");

    const rentalType = watch("rental_type");

    const pickupBranchId = watch("pickup_branch_id");
    const dropBranchId = watch("drop_branch_id");

    const pickupFuel = watch("pickup_fuel");
    const returnFuel = watch("return_fuel");

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
       POPULATE EDIT DATA
    ===================================================== */

    useEffect(() => {

        if (!defaultValues) {
            return;
        }

        /*
         * IMPORTANT:
         *
         * Fuel is normalized here exactly like
         * rental_type.
         */

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

        console.log(
            "TRIP EDIT - pickup fuel:",
            defaultValues.pickup_fuel,
            "=>",
            normalizedPickupFuel
        );

        console.log(
            "TRIP EDIT - return fuel:",
            defaultValues.return_fuel,
            "=>",
            normalizedReturnFuel
        );


        const values = {

            /* ================= CUSTOMER ================= */

            customer_id: normalizeId(
                defaultValues.customer_id ??
                defaultValues.customer?.id
            ),


            /* ================= VEHICLE ================= */

            vehicle_id: normalizeId(
                defaultValues.vehicle_id ??
                defaultValues.vehicle?.id
            ),


            /* ================= RENTAL TYPE ================= */

            rental_type: normalizeRentalType(
                defaultValues.rental_type
            ),


            /* ================= DRIVER ================= */

            driver_id: normalizeId(
                defaultValues.driver_id ??
                defaultValues.driver?.id
            ),


            /* ================= BRANCH ================= */

            pickup_branch_id: normalizeId(
                defaultValues.pickup_branch_id ??
                defaultValues.pickup_branch?.id
            ),

            drop_branch_id: normalizeId(
                defaultValues.drop_branch_id ??
                defaultValues.drop_branch?.id
            ),


            /* ================= LOCATIONS ================= */

            pickup_location:
                defaultValues.pickup_location ?? "",

            drop_location:
                defaultValues.drop_location ?? "",


            /* ================= DATES ================= */

            pickup_at:
                formatDateTimeLocal(
                    defaultValues.pickup_at
                ),

            expected_return_at:
                formatDateTimeLocal(
                    defaultValues.expected_return_at
                ),


            /* =================================================
               VEHICLE CONDITION
            ================================================= */

            pickup_odometer:
                defaultValues.pickup_odometer !== null &&
                defaultValues.pickup_odometer !== undefined
                    ? String(defaultValues.pickup_odometer)
                    : "0",

            return_odometer:
                defaultValues.return_odometer !== null &&
                defaultValues.return_odometer !== undefined
                    ? String(defaultValues.return_odometer)
                    : "",


            /*
             * THIS IS THE IMPORTANT FIX
             */

            pickup_fuel:
                normalizedPickupFuel,

            return_fuel:
                normalizedReturnFuel,


            /* =================================================
               BILLING
            ================================================= */

            base_amount:
                defaultValues.base_amount !== null &&
                defaultValues.base_amount !== undefined
                    ? String(defaultValues.base_amount)
                    : "",

            extra_km_charge:
                defaultValues.extra_km_charge !== null &&
                defaultValues.extra_km_charge !== undefined
                    ? String(defaultValues.extra_km_charge)
                    : "0",

            late_return_charge:
                defaultValues.late_return_charge !== null &&
                defaultValues.late_return_charge !== undefined
                    ? String(defaultValues.late_return_charge)
                    : "0",

            damage_charge:
                defaultValues.damage_charge !== null &&
                defaultValues.damage_charge !== undefined
                    ? String(defaultValues.damage_charge)
                    : "0",

            fuel_charge:
                defaultValues.fuel_charge !== null &&
                defaultValues.fuel_charge !== undefined
                    ? String(defaultValues.fuel_charge)
                    : "0",


            /* ================= NOTES ================= */

            pickup_notes:
                defaultValues.pickup_notes ?? "",
        };


        console.log(
            "TRIP EDIT FORM VALUES:",
            values
        );


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
            data.rental_type === "self_drive";


        const payload = {

            ...data,


            /* ================= IDs ================= */

            customer_id:
                data.customer_id
                    ? Number(data.customer_id)
                    : null,

            vehicle_id:
                data.vehicle_id
                    ? Number(data.vehicle_id)
                    : null,

            driver_id:
                !isSelfDrive &&
                data.driver_id
                    ? Number(data.driver_id)
                    : null,


            pickup_branch_id:
                isSelfDrive &&
                data.pickup_branch_id
                    ? Number(data.pickup_branch_id)
                    : null,

            drop_branch_id:
                isSelfDrive &&
                data.drop_branch_id
                    ? Number(data.drop_branch_id)
                    : null,


            /* ================= LOCATIONS ================= */

            pickup_location:
                isSelfDrive
                    ? null
                    : data.pickup_location?.trim() || null,

            drop_location:
                isSelfDrive
                    ? null
                    : data.drop_location?.trim() || null,


            /* =================================================
               VEHICLE CONDITION
            ================================================= */

            pickup_odometer:
                Number(data.pickup_odometer),

            return_odometer:
                data.return_odometer !== "" &&
                data.return_odometer !== null &&
                data.return_odometer !== undefined
                    ? Number(data.return_odometer)
                    : null,


            /*
             * Keep the exact values expected by backend.
             */

            pickup_fuel:
                normalizeFuelLevel(
                    data.pickup_fuel
                ) || null,

            return_fuel:
                normalizeFuelLevel(
                    data.return_fuel
                ) || null,


            /* =================================================
               BILLING
            ================================================= */

            base_amount:
                Number(data.base_amount),

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
            onSubmit={handleSubmit(submitForm)}
            className="
                bg-white
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6
            "
        >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


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
                                    value={customerSearch}
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

                                            <div className="p-2 border-b">

                                                <div className="
                                                    px-2
                                                    py-2
                                                    text-sm
                                                    text-gray-500
                                                ">
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
                                                    key={customer.id}
                                                    value={`${customer.name} ${customer.email || ""}`}
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
                                                    key={vehicle.id}
                                                    value={`${vehicle.name} ${vehicle.registration_number || ""}`}
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

                                                        {vehicle.name}

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
                        value={rentalType || ""}
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
                                        key={option.value}
                                        value={option.value}
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
                            value={driverId || ""}
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

                                {drivers.map(
                                    (driver) => (

                                        <SelectItem
                                            key={driver.id}
                                            value={normalizeId(
                                                driver.id
                                            )}
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

                        {rentalType === "with_driver"
                            ? "Pickup Location"
                            : "Pickup Branch"}

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
                                                key={branchId}
                                                value={branchId}
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

                        {rentalType === "with_driver"
                            ? errors.pickup_location?.message
                            : errors.pickup_branch_id?.message}

                    </p>

                </div>


                {/* =================================================
                   DROP
                ================================================= */}

                <div>

                    <label className="form-label">

                        {rentalType === "with_driver"
                            ? "Drop Location"
                            : "Drop Branch"}

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
                                                key={branchId}
                                                value={branchId}
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

                        {rentalType === "with_driver"
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
                        {...register("pickup_at")}
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


                            {/* =================================================
                               PICKUP FUEL
                            ================================================= */}

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
                                        errors.pickup_fuel
                                            ?.message
                                    }
                                </p>

                            </div>


                            {/* =================================================
                               RETURN FUEL
                            ================================================= */}

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
                                        errors.return_fuel
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
                                        errors.base_amount
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


                            {/* FUEL CHARGE */}

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
                        placeholder="Optional notes about vehicle condition at pickup"
                    />

                    <p className="error-text">
                        {
                            errors.pickup_notes
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