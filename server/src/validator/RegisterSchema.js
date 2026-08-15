import { z } from "zod";
export const DonorRegistrationSchema = z.object({
    name: z.string()
        .min(1, "Name is too short")
        .max(30, "Name is too long"),
    email: z.string().trim().email(),
    password: z.string()
        .min(6, "Password too short")
        .regex(/[A-Z]/, "Password must contain uppercase")
        .regex(/[a-z]/, "Password must contain lowercase")
        .regex(/[0-9]/, "Password must contain number"),
    phoneNumber: z.string()
        .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
    companyName: z.string().optional()
})
export const NgoRegistrationSchema = z.object({
    organizationName: z.coerce.string()
        .min(1, "Name is too short")
        .max(30, "Name is too long"),
    registeredNumber: z.string()
        .trim()
        .min(1, "Registration number is required"),
    registeredAddress: z.string().trim()
        .min(10, "Enter a complete address")
        .max(300),
    email: z.string().trim().email(),
    phoneNumber: z.string()
        .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
    password: z.string()
        .min(6, "Password too short")
        .regex(/[A-Z]/, "Password must contain uppercase")
        .regex(/[a-z]/, "Password must contain lowercase")
        .regex(/[0-9]/, "Password must contain number"),
})
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(8, "Password is required"),
});