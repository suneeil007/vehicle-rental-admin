import { z } from "zod";

export const branchSchema = z.object({
    name: z.string().trim().min(1, "Branch name is required").max(255),
    code: z.string().trim().min(1, "Branch code is required").max(10),
    phone: z.string().trim().min(1, "Phone is required").max(20),
    email: z.string().trim().email("Enter a valid email").max(255),

    address: z.string().trim().min(1, "Address is required").max(255),
    city: z.string().trim().min(1, "City is required").max(100),
    state: z.string().trim().min(1, "State is required").max(100),
    country: z.string().trim().min(1, "Country is required").max(100),
    postal_code: z.string().trim().optional().or(z.literal("")),

    latitude: z
        .coerce.number({ invalid_type_error: "Latitude must be a number" })
        .min(-90).max(90).optional(),
    longitude: z
        .coerce.number({ invalid_type_error: "Longitude must be a number" })
        .min(-180).max(180).optional(),

    opening_time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid time (HH:MM)"),
    closing_time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter a valid time (HH:MM)"),

    manager_name: z.string().trim().max(255).optional().or(z.literal("")),
    manager_phone: z.string().trim().max(20).optional().or(z.literal("")),

    status: z.enum(["active", "inactive"], {
        errorMap: () => ({ message: "Select a status" }),
    }),
});