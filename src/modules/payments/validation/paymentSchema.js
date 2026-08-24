import { z } from "zod";

export const PAYMENT_TYPES = [
    "advance",
    "deposit",
    "partial",
    "final",
    "refund",
];

export const PAYMENT_METHODS = [
    "cash",
    "card",
    "bank_transfer",
    "esewa",
    "khalti",
];

// Payment methods that require a transaction/reference number
const REFERENCE_REQUIRED_METHODS = [
    "card",
    "bank_transfer",
    "esewa",
    "khalti",
];

export const paymentSchema = z
    .object({
        /*
        |--------------------------------------------------------------------------
        | Booking
        |--------------------------------------------------------------------------
        |
        | Booking is optional because a payment can belong directly
        | to a standalone trip.
        |
        */
        booking_id: z
            .number()
            .nullable()
            .optional(),

        /*
        |--------------------------------------------------------------------------
        | Trip
        |--------------------------------------------------------------------------
        */
        trip_id: z
            .number()
            .nullable()
            .optional(),

        /*
        |--------------------------------------------------------------------------
        | Amount
        |--------------------------------------------------------------------------
        */
        amount: z
            .number({
                required_error: "Amount is required",
                invalid_type_error: "Amount is required",
            })
            .positive("Amount must be greater than 0"),

        /*
        |--------------------------------------------------------------------------
        | Payment Type
        |--------------------------------------------------------------------------
        */
        type: z.enum(PAYMENT_TYPES, {
            required_error: "Payment type is required",
        }),

        /*
        |--------------------------------------------------------------------------
        | Payment Method
        |--------------------------------------------------------------------------
        */
        payment_method: z.enum(PAYMENT_METHODS, {
            required_error: "Payment method is required",
        }),

        /*
        |--------------------------------------------------------------------------
        | Transaction Reference
        |--------------------------------------------------------------------------
        */
        transaction_reference: z
            .string()
            .nullable()
            .optional(),

        /*
        |--------------------------------------------------------------------------
        | Notes
        |--------------------------------------------------------------------------
        */
        notes: z
            .string()
            .nullable()
            .optional(),

        /*
        |--------------------------------------------------------------------------
        | Paid At
        |--------------------------------------------------------------------------
        */
        paid_at: z
            .string()
            .optional(),
    })
    .superRefine((data, ctx) => {
        /*
        |--------------------------------------------------------------------------
        | Transaction reference
        |--------------------------------------------------------------------------
        */

        if (
            REFERENCE_REQUIRED_METHODS.includes(
                data.payment_method
            ) &&
            (!data.transaction_reference ||
                data.transaction_reference.trim() === "")
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["transaction_reference"],
                message:
                    "Transaction reference is required for this payment method",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Final payment
        |--------------------------------------------------------------------------
        |
        | Final payment must belong to a trip.
        |
        */

        if (data.type === "final" && !data.trip_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["trip_id"],
                message:
                    "Final settlement payments must be linked to a trip",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Partial payment
        |--------------------------------------------------------------------------
        |
        | Partial payment should also belong to a trip or booking.
        |
        */

        if (
            data.type === "partial" &&
            !data.trip_id &&
            !data.booking_id
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["trip_id"],
                message:
                    "Partial payments must be linked to a trip or booking",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Refund
        |--------------------------------------------------------------------------
        */

        if (data.type === "refund" && !data.trip_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["trip_id"],
                message:
                    "Refunds must be linked to a trip",
            });
        }
    });