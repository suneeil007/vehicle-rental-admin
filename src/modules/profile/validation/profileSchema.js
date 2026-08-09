import { z } from "zod";

export const profileSchema = z.object({

    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    gender: z.string().optional(),
    date_of_birth: z.string().optional(),
    nationality: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
    citizenship_no: z.string().optional(),
    passport_no: z.string().optional(),
    driving_license_no: z.string().optional(),
    license_expiry: z.string().optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
    bio: z.string().optional(),

});