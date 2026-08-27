import { z } from "zod";

export const vehicleSchema = (isEdit = false, isSystemManagedStatus = false) =>
    z.object({
        vehicle_category_id: z
            .string()
            .min(1, "Category is required"),

        name: z
            .string()
            .trim()
            .min(1, "Vehicle name is required")
            .max(255, "Maximum 255 characters allowed"),

        brand: z
            .string()
            .trim()
            .min(1, "Brand is required")
            .max(255, "Maximum 255 characters allowed"),

        model: z
            .string()
            .trim()
            .min(1, "Model is required")
            .max(255, "Maximum 255 characters allowed"),

        manufacture_year: z
            .string()
            .regex(/^\d{4}$/, "Enter a valid 4-digit year")
            .optional()
            .or(z.literal("")),

        transmission: z.enum(["manual", "automatic"], {
            errorMap: () => ({ message: "Select a transmission type" }),
        }),

        fuel_type: z.enum(["petrol", "diesel", "electric", "hybrid"], {
            errorMap: () => ({ message: "Select a fuel type" }),
        }),

        seat_capacity: z
            .coerce
            .number({ invalid_type_error: "Seat capacity is required" })
            .int()
            .min(1, "Must be at least 1"),

        price_per_day: z
            .coerce
            .number({ invalid_type_error: "Price is required" })
            .min(0, "Price cannot be negative"),

        registration_number: z
            .string()
            .trim()
            .min(1, "Registration number is required")
            .max(255, "Maximum 255 characters allowed"),

        mileage: z
            .string()
            .optional()
            .or(z.literal(""))
            .refine(
                (val) => !val || /^\d+$/.test(val),
                "Mileage must be a whole number"
            ),

        color: z
            .string()
            .trim()
            .max(255, "Maximum 255 characters allowed")
            .optional()
            .or(z.literal("")),

        description: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        |
        | "booked" and "on_trip" are system-managed statuses set
        | automatically by the Trip module. An admin can only ever
        | submit available, maintenance, or inactive from this form -
        | this mirrors the backend's Store/UpdateVehicleRequest rule.
        |
        */

        status: isSystemManagedStatus
            ? z.string()
            : z.enum(["available", "maintenance", "inactive"], {
                  errorMap: () => ({ message: "Select a status" }),
              }),
    });