import { z } from "zod";
export const userZod = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .optional(),
  image: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address is too long")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City is too long")
    .optional(),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State is too long")
    .optional(),
  postalCode: z
    .string()
    .min(4, "Postal code must be at least 4 characters")
    .max(10, "Postal code is too long")
    .regex(/^\d+$/, "Postal code must be numbers only")
    .optional(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country is too long")
    .optional(),
});

export type userZod = z.infer<typeof userZod>;
