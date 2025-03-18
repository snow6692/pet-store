import { z } from "zod";

export const orderZod = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type orderZod = z.infer<typeof orderZod>;
