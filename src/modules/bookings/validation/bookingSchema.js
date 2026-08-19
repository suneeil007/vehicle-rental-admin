import { z } from "zod";

export const bookingSchema = z.object({
    customer_id: z.coerce
        .number({ invalid_type_error: "Customer is required" })
        .int()
        .positive("Customer is required"),

    vehicle_id: z.coerce
        .number({ invalid_type_error: "Vehicle is required" })
        .int()
        .positive("Vehicle is required"),

    rental_type: z.enum(["self_drive", "with_driver"], {
        errorMap: () => ({ message: "Select a rental type" }),
    }),

    pickup_branch_id: z.coerce
        .number({ invalid_type_error: "Pickup branch is required" })
        .int()
        .positive("Pickup branch is required"),

    drop_branch_id: z
        .string()
        .optional()
        .transform((val) => (val === "" || val === undefined ? undefined : Number(val)))
        .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
            message: "Invalid drop branch",
        }),

    pickup_at: z.string().min(1, "Pickup date/time is required"),

    expected_return_at: z.string().min(1, "Expected return date/time is required"),

    quoted_amount: z.coerce
        .number({ invalid_type_error: "Quoted amount is required" })
        .min(0, "Amount cannot be negative"),

    discount_amount: z.coerce
        .number()
        .min(0, "Discount cannot be negative")
        .optional()
        .default(0),

    final_amount: z.coerce
        .number()
        .min(0, "Final amount cannot be negative")
        .optional(),

    customer_notes: z.string().trim().optional().or(z.literal("")),
    admin_notes: z.string().trim().optional().or(z.literal("")),
});