import { z } from "zod";

const fuelLevels = [
    "empty",
    "quarter",
    "half",
    "three_quarter",
    "full",
];

/* =========================================================
   CREATE / UPDATE TRIP

   self_drive:
     - pickup_branch_id required
     - drop_branch_id required
     - driver_id must NOT be set

   with_driver:
     - pickup_location required
     - drop_location required
     - driver_id required
     - branch fields must NOT be set
========================================================= */

export const tripSchema = z
    .object({
        customer_id: z.coerce
            .number()
            .int()
            .positive("Customer is required"),

        vehicle_id: z.coerce
            .number()
            .int()
            .positive("Vehicle is required"),

        rental_type: z.enum(["self_drive", "with_driver"], {
            errorMap: () => ({ message: "Select a rental type" }),
        }),

        driver_id: z
            .union([z.literal(""), z.coerce.number().int().positive()])
            .optional(),

        pickup_branch_id: z
            .union([z.literal(""), z.coerce.number().int().positive()])
            .optional(),

        drop_branch_id: z
            .union([z.literal(""), z.coerce.number().int().positive()])
            .optional(),

        pickup_location: z.string().trim().optional().or(z.literal("")),

        drop_location: z.string().trim().optional().or(z.literal("")),

        pickup_at: z.string().min(1, "Pickup date/time is required"),

        expected_return_at: z
            .string()
            .min(1, "Expected return date/time is required"),

        pickup_odometer: z.coerce
            .number()
            .int()
            .min(0, "Pickup odometer cannot be negative"),

        pickup_fuel: z.enum(fuelLevels, {
            errorMap: () => ({ message: "Select pickup fuel level" }),
        }),

        base_amount: z.coerce
            .number()
            .min(0, "Base amount cannot be negative"),

        pickup_notes: z.string().trim().optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        if (data.rental_type === "self_drive") {
            if (!data.pickup_branch_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["pickup_branch_id"],
                    message: "Pickup branch is required",
                });
            }

            if (!data.drop_branch_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["drop_branch_id"],
                    message: "Drop branch is required",
                });
            }
        }

        if (data.rental_type === "with_driver") {
            if (!data.driver_id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["driver_id"],
                    message: "Driver is required for a driver trip",
                });
            }

            if (!data.pickup_location?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["pickup_location"],
                    message: "Pickup location is required for a driver trip",
                });
            }

            if (!data.drop_location?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["drop_location"],
                    message: "Drop location is required for a driver trip",
                });
            }
        }

        if (
            data.expected_return_at &&
            data.pickup_at &&
            new Date(data.expected_return_at) <= new Date(data.pickup_at)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["expected_return_at"],
                message: "Expected return must be after pickup",
            });
        }
    });

/* =========================================================
   COMPLETE TRIP
========================================================= */

// Factory so the form can pass the trip's pickup_odometer in for
// cross-field validation (backend enforces this too, but catching it
// client-side avoids a round trip).
export const buildCompleteTripSchema = (pickupOdometer = 0) =>
    z
        .object({
            actual_return_at: z
                .string()
                .min(1, "Actual return date/time is required"),

            return_odometer: z.coerce
                .number()
                .int()
                .min(0, "Return odometer cannot be negative"),

            return_fuel: z.enum(fuelLevels, {
                errorMap: () => ({ message: "Select return fuel level" }),
            }),

            extra_km_charge: z.coerce
                .number()
                .min(0, "Charge cannot be negative")
                .default(0),

            late_return_charge: z.coerce
                .number()
                .min(0, "Charge cannot be negative")
                .default(0),

            damage_charge: z.coerce
                .number()
                .min(0, "Charge cannot be negative")
                .default(0),

            fuel_charge: z.coerce
                .number()
                .min(0, "Charge cannot be negative")
                .default(0),

            return_notes: z.string().trim().optional().or(z.literal("")),

            damage_notes: z.string().trim().optional().or(z.literal("")),
        })
        .superRefine((data, ctx) => {
            if (data.return_odometer < pickupOdometer) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["return_odometer"],
                    message: `Return odometer cannot be less than pickup odometer (${pickupOdometer})`,
                });
            }
        });

// Default export for cases where the pickup odometer isn't known yet.
export const completeTripSchema = buildCompleteTripSchema(0);

/* =========================================================
   CANCEL TRIP
========================================================= */

export const cancelTripSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(1, "Cancellation reason is required")
        .max(1000, "Reason is too long"),
});
