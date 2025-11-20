import {z} from "zod"
export const formSchemaSignin = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email").max(50),
  password: z.string().min(1, "Password is required").max(50),
});
export const formSchemaSignup = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address").max(50),
    password: z.string().min(8, "Password must be at least 8 characters long").max(50),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    fullName: z.string().min(1, "Full Name is required").max(50),
    phoneNumber: z.string().min(1, "Phone Number is required").max(50),
    type: z.enum(["Company", "Student"]),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



