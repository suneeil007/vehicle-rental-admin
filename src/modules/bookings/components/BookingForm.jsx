import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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


const BookingForm = ({
    onSubmit,
    onCancel,
    isLoading = false,
    defaultValues = null,
}) => {

    /* =========================================================
       QUERY CLIENT
    ========================================================= */

    const queryClient = useQueryClient();


    /* =========================================================
       DATA
    ========================================================= */

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


    /* =========================================================
       CUSTOMER CREATE STATE
    ========================================================= */

    const [customerSearch, setCustomerSearch] =
        useState("");

    const [creatingCustomer, setCreatingCustomer] =
        useState(false);


    /* =========================================================
       FORM
    ========================================================= */

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,

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
            pickup_at: "",
            expected_return_at: "",
            quoted_amount: "",
            discount_amount: "0",
            final_amount: "",
            customer_notes: "",
            admin_notes: "",
        },
    });


    /* =========================================================
       WATCH VALUES
    ========================================================= */

    const customerId =
        watch("customer_id");

    const vehicleId =
        watch("vehicle_id");

    const rentalType =
        watch("rental_type");

    const pickupBranchId =
        watch("pickup_branch_id");

    const dropBranchId =
        watch("drop_branch_id");

    const quotedAmount =
        watch("quoted_amount");

    const discountAmount =
        watch("discount_amount");


    /* =========================================================
       LOAD BOOKING DATA WHEN EDITING
    ========================================================= */

    useEffect(() => {

        if (!defaultValues) {
            return;
        }

        console.log(
            "================================="
        );

        console.log(
            "BOOKING DATA RECEIVED:",
            defaultValues
        );

        console.log(
            "================================="
        );


        /* =====================================================
           CUSTOMER
        ===================================================== */

        const customerId =
            defaultValues.customer?.id ??
            defaultValues.customer_id ??
            "";


        /* =====================================================
           VEHICLE
        ===================================================== */

        const vehicleId =
            defaultValues.vehicle?.id ??
            defaultValues.vehicle_id ??
            "";


        /* =====================================================
           RENTAL TYPE
        ===================================================== */

        const rentalType =
            defaultValues.rental_type ??
            "";


        /* =====================================================
           PICKUP BRANCH
        ===================================================== */

        const pickupBranchId =
            defaultValues.pickup_branch?.id ??
            defaultValues.pickup_branch_id ??
            "";


        /* =====================================================
           DROP BRANCH
        ===================================================== */

        const dropBranchId =
            defaultValues.drop_branch?.id ??
            defaultValues.drop_branch_id ??
            "";


        /* =====================================================
           DATETIME FORMATTER
           
           API:
           2026-08-26T09:00:00.000000Z

           INPUT:
           2026-08-26T14:45
        ===================================================== */

        const formatDateTimeLocal = (
            value
        ) => {

            if (!value) {
                return "";
            }

            const date = new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }

            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");

            const hours =
                String(
                    date.getHours()
                ).padStart(2, "0");

            const minutes =
                String(
                    date.getMinutes()
                ).padStart(2, "0");

            return (
                `${year}-${month}-${day}` +
                `T${hours}:${minutes}`
            );
        };


        /* =====================================================
           FORM VALUES
        ===================================================== */

        const values = {

            customer_id:
                customerId !== ""
                    ? String(customerId)
                    : "",

            vehicle_id:
                vehicleId !== ""
                    ? String(vehicleId)
                    : "",

            rental_type:
                rentalType
                    ? String(rentalType)
                    : "",

            pickup_branch_id:
                pickupBranchId !== ""
                    ? String(
                          pickupBranchId
                      )
                    : "",

            drop_branch_id:
                dropBranchId !== ""
                    ? String(dropBranchId)
                    : "",

            pickup_at:
                formatDateTimeLocal(
                    defaultValues.pickup_at
                ),

            expected_return_at:
                formatDateTimeLocal(
                    defaultValues.expected_return_at
                ),

            quoted_amount:
                defaultValues.quoted_amount !=
                null
                    ? String(
                          defaultValues.quoted_amount
                      )
                    : "",

            discount_amount:
                defaultValues.discount_amount !=
                null
                    ? String(
                          defaultValues.discount_amount
                      )
                    : "0",

            final_amount:
                defaultValues.final_amount !=
                null
                    ? String(
                          defaultValues.final_amount
                      )
                    : "",

            customer_notes:
                defaultValues.customer_notes ||
                "",

            admin_notes:
                defaultValues.admin_notes ||
                "",
        };


        console.log(
            "FORM RESET VALUES:",
            values
        );


        /* =====================================================
           RESET FORM
        ===================================================== */

        reset(values);

    }, [
        defaultValues,
        reset,
    ]);


    /* =========================================================
       AUTO CALCULATE FINAL AMOUNT
    ========================================================= */

    useEffect(() => {

        const quoted =
            parseFloat(
                quotedAmount
            ) || 0;

        const discount =
            parseFloat(
                discountAmount
            ) || 0;

        const final =
            Math.max(
                quoted - discount,
                0
            );


        setValue(
            "final_amount",
            final.toFixed(2),
            {
                shouldValidate: true,
            }
        );

    }, [
        quotedAmount,
        discountAmount,
        setValue,
    ]);


    /* =========================================================
       CREATE NEW CUSTOMER
    ========================================================= */

    const handleCreateCustomer =
        async () => {

            const name =
                customerSearch.trim();

            if (!name) {
                return;
            }


            try {

                setCreatingCustomer(true);


                /* =================================================
                   PASSWORD
                ================================================= */

                const firstFourLetters =
                    name
                        .replace(
                            /\s+/g,
                            ""
                        )
                        .slice(0, 4)
                        .toLowerCase();

                const password =
                    `${firstFourLetters}@2026`;


                /* =================================================
                   CREATE CUSTOMER
                ================================================= */

                const response =
                    await createUser({

                        name: name,

                        email:
                            `customer_${Date.now()}@rental.local`,

                        phone: null,

                        role_id: 5,

                        branch_id: null,

                        password:
                            password,

                        password_confirmation:
                            password,

                        status: "active",
                    });


                console.log(
                    "CUSTOMER CREATED:",
                    response
                );


                /* =================================================
                   GET NEW CUSTOMER
                ================================================= */

                const newCustomer =
                    response?.data ||
                    response;


                console.log(
                    "NEW CUSTOMER:",
                    newCustomer
                );


                if (!newCustomer?.id) {

                    console.error(
                        "Customer was created but no customer ID was returned.",
                        response
                    );

                    return;
                }


                /* =================================================
                   REFRESH USERS
                ================================================= */

                await queryClient.refetchQueries({
                    queryKey: ["users"],
                    type: "active",
                });


                /* =================================================
                   SELECT NEW CUSTOMER
                ================================================= */

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

                console.log(
                    "STATUS:",
                    error.response?.status
                );

                console.log(
                    "API ERROR:",
                    error.response?.data
                );

                console.error(
                    "Failed to create customer:",
                    error
                );

            } finally {

                setCreatingCustomer(
                    false
                );
            }
        };


    /* =========================================================
       SUBMIT DEBUG
    ========================================================= */

    const submitForm = (data) => {

        // console.log(
        //     "================================="
        // );

        // console.log(
        //     "BOOKING FORM SUBMIT DATA:",
        //     data
        // );

        // console.log(
        //     "CUSTOMER:",
        //     data.customer_id
        // );

        // console.log(
        //     "VEHICLE:",
        //     data.vehicle_id
        // );

        // console.log(
        //     "RENTAL TYPE:",
        //     data.rental_type
        // );

        // console.log(
        //     "PICKUP BRANCH:",
        //     data.pickup_branch_id
        // );

        // console.log(
        //     "DROP BRANCH:",
        //     data.drop_branch_id
        // );

        // console.log(
        //     "================================="
        // );

        onSubmit(data);
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <form
            onSubmit={handleSubmit(
                submitForm
            )}
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
                                                    String(
                                                        customer.id
                                                    ) ===
                                                    String(
                                                        customerId
                                                    )
                                            )?.name ||
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

                            <Command className="w-full">

                                <CommandInput
                                    placeholder="Search customer..."
                                    className="text-left"
                                    value={
                                        customerSearch
                                    }
                                    onValueChange={
                                        setCustomerSearch
                                    }
                                />


                                <CommandList>

                                    {/* =================================================
                                        CREATE CUSTOMER
                                    ================================================= */}

                                    {customerSearch.trim() &&
                                        !customers.some(
                                            (customer) =>
                                                `${customer.name || ""} ${
                                                    customer.email || ""
                                                }`
                                                    .toLowerCase()
                                                    .includes(
                                                        customerSearch
                                                            .trim()
                                                            .toLowerCase()
                                                    )
                                        ) && (

                                            <div className="
                                                p-2
                                                border-b
                                            ">

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
                                                        cursor-pointer
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


                                    {/* =================================================
                                        CUSTOMERS
                                    ================================================= */}

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
                                                                String(
                                                                    customerId
                                                                ) ===
                                                                String(
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


                                    {customers.length === 0 &&
                                        !customerSearch.trim() && (

                                            <CommandEmpty>
                                                No customer found.
                                            </CommandEmpty>
                                        )}

                                </CommandList>

                            </Command>

                        </PopoverContent>

                    </Popover>


                    <p className="error-text">
                        {
                            errors
                                .customer_id
                                ?.message
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
                                                    String(
                                                        vehicle.id
                                                    ) ===
                                                    String(
                                                        vehicleId
                                                    )
                                            )?.name ||
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
                                                                String(
                                                                    vehicleId
                                                                ) ===
                                                                String(
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
                            errors
                                .vehicle_id
                                ?.message
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
                        key={
                            `rental_type-${defaultValues?.id ?? "new"}-${rentalType}`
                        }

                        value={
                            rentalType ||
                            ""
                        }

                        onValueChange={(
                            value
                        ) => {

                            setValue(
                                "rental_type",
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
                                    Select rental type
                                "
                            >

                                {rentalType
                                    ? RENTAL_TYPE_OPTIONS.find(
                                          (option) =>
                                              option.value ===
                                              rentalType
                                      )?.label
                                    : undefined}

                            </SelectValue>

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
                            errors
                                .rental_type
                                ?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    PICKUP BRANCH
                ================================================= */}

                <div>

                    <label className="form-label">
                        Pickup Branch
                    </label>


                    <Select
                        key={
                            `pickup_branch-${defaultValues?.id ?? "new"}-${pickupBranchId}`
                        }

                        value={
                            pickupBranchId ||
                            ""
                        }

                        onValueChange={(
                            value
                        ) => {

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
                                placeholder="
                                    Select pickup branch
                                "
                            >

                                {pickupBranchId
                                    ? branchList.find(
                                          (branch) =>
                                              String(
                                                  branch.id
                                              ) ===
                                              String(
                                                  pickupBranchId
                                              )
                                      )?.name
                                    : undefined}

                            </SelectValue>

                        </SelectTrigger>


                        <SelectContent>

                            {branchList.map(
                                (branch) => (

                                    <SelectItem
                                        key={
                                            branch.id
                                        }
                                        value={
                                            String(
                                                branch.id
                                            )
                                        }
                                    >

                                        {
                                            branch.name
                                        }

                                    </SelectItem>

                                )
                            )}

                        </SelectContent>

                    </Select>


                    <p className="error-text">
                        {
                            errors
                                .pickup_branch_id
                                ?.message
                        }
                    </p>

                </div>


                {/* =================================================
                    DROP BRANCH
                ================================================= */}

                <div>

                    <label className="form-label">
                        Drop Branch (optional)
                    </label>


                    <Select
                        key={
                            `drop_branch-${defaultValues?.id ?? "new"}-${dropBranchId}`
                        }

                        value={
                            dropBranchId ||
                            ""
                        }

                        onValueChange={(
                            value
                        ) => {

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
                                placeholder="
                                    Same as pickup
                                "
                            >

                                {dropBranchId
                                    ? branchList.find(
                                          (branch) =>
                                              String(
                                                  branch.id
                                              ) ===
                                              String(
                                                  dropBranchId
                                              )
                                      )?.name
                                    : undefined}

                            </SelectValue>

                        </SelectTrigger>


                        <SelectContent>

                            {branchList.map(
                                (branch) => (

                                    <SelectItem
                                        key={
                                            branch.id
                                        }
                                        value={
                                            String(
                                                branch.id
                                            )
                                        }
                                    >

                                        {
                                            branch.name
                                        }

                                    </SelectItem>

                                )
                            )}

                        </SelectContent>

                    </Select>


                    <p className="error-text">
                        {
                            errors
                                .drop_branch_id
                                ?.message
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
                            errors
                                .pickup_at
                                ?.message
                        }
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
                            errors
                                .expected_return_at
                                ?.message
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
                            errors
                                .quoted_amount
                                ?.message
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
                            errors
                                .discount_amount
                                ?.message
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
                            errors
                                .final_amount
                                ?.message
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
                            errors
                                .customer_notes
                                ?.message
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
                            errors
                                .admin_notes
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
                    pt-5
                    border-t
                "
            >

                <button
                    type="button"
                    onClick={onCancel}
                    className="
                        px-5
                        py-2.5
                        rounded-lg
                        border
                        hover:bg-gray-50
                        cursor-pointer
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
                        cursor-pointer
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