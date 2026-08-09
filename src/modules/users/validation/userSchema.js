import { z } from "zod";

const isUnder18 = (dateString) => {
    if (!dateString) return false;
    const dob = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age--;
    return age < 18;
};

export const userSchema = (isEdit = false) =>
    z
        .object({
            name: z.string().min(3, "Full name is required"),
            email: z.string().email("Please enter a valid email address"),
            phone: z.string().min(10, "Phone number is required"),
            role_id: z.string().min(1, "Please select a role"),
            branch_id: z.string().optional(),
            status: z.string().default("active"),

            profile: z.object({
                date_of_birth: z.string().optional(),
            }).passthrough(),

            password: isEdit
                ? z.string().optional().or(z.literal(""))
                : z.string().min(8, "Password must be at least 8 characters"),

            password_confirmation: isEdit
                ? z.string().optional().or(z.literal(""))
                : z.string().min(8, "Please confirm your password"),
        })
        .superRefine((data, ctx) => {
            if (isUnder18(data.profile?.date_of_birth)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "User must be at least 18 years old",
                    path: ["profile", "date_of_birth"],
                });
            }
        })
        .refine(
            (data) => data.password === data.password_confirmation,
            {
                message: "Passwords do not match",
                path: ["password_confirmation"],
            }
        );