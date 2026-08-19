import { z } from "zod";

export const bookingSchema = z
    .object({

        customer_id: z.coerce
            .number()
            .int()
            .positive("Customer is required"),

        vehicle_id: z.coerce
            .number()
            .int()
            .positive("Vehicle is required"),

        rental_type: z.enum(
            [
                "self_drive",
                "with_driver",
            ],
            {
                errorMap: () => ({
                    message: "Select a rental type",
                }),
            }
        ),

        /* =================================================
           SELF DRIVE FIELDS
           Both required independently when
           rental_type === "self_drive"
           (enforced in superRefine below)
        ================================================= */

        pickup_branch_id: z
            .union([
                z.literal(""),
                z.coerce.number().int().positive(),
            ])
            .optional(),

        drop_branch_id: z
            .union([
                z.literal(""),
                z.coerce.number().int().positive(),
            ])
            .optional(),

        /* =================================================
           WITH DRIVER FIELDS
           Required only when rental_type === "with_driver"
           (enforced in superRefine below)
        ================================================= */

        pickup_location: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),

        drop_location: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),

        pickup_at: z
            .string()
            .min(
                1,
                "Pickup date/time is required"
            ),

        expected_return_at: z
            .string()
            .min(
                1,
                "Expected return date/time is required"
            ),

        quoted_amount: z.coerce
            .number()
            .min(
                0,
                "Amount cannot be negative"
            ),

        discount_amount: z.coerce
            .number()
            .min(
                0,
                "Discount cannot be negative"
            )
            .default(0),

        final_amount: z.coerce
            .number()
            .min(
                0,
                "Final amount cannot be negative"
            )
            .optional(),

        customer_notes: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),

        admin_notes: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),
    })

    /* =========================================================
       CONDITIONAL RULES BASED ON RENTAL TYPE

       self_drive:
         - pickup_branch_id required
         - drop_branch_id required
           (independently chosen — no auto-sync/mirroring)

       with_driver:
         - pickup_location required
         - drop_location required
    ========================================================= */

    .superRefine((data, ctx) => {

        if (data.rental_type === "self_drive") {

            if (
                data.pickup_branch_id === "" ||
                data.pickup_branch_id === undefined ||
                data.pickup_branch_id === null
            ) {

                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["pickup_branch_id"],
                    message: "Pickup branch is required",
                });
            }

            if (
                data.drop_branch_id === "" ||
                data.drop_branch_id === undefined ||
                data.drop_branch_id === null
            ) {

                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["drop_branch_id"],
                    message: "Drop branch is required",
                });
            }
        }

        if (data.rental_type === "with_driver") {

            if (!data.pickup_location?.trim()) {

                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["pickup_location"],
                    message:
                        "Pickup location is required for with-driver rentals",
                });
            }

            if (!data.drop_location?.trim()) {

                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["drop_location"],
                    message:
                        "Drop location is required for with-driver rentals",
                });
            }
        }
    });