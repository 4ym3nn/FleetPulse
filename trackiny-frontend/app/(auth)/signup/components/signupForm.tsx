"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const formSchema = z
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

type FormSchemaType = z.infer<typeof formSchema>;

const SignUpForm: React.FC = () => {
  const [userType, setUserType] = useState<"transport" | "company">("transport");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router=useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      type: "Company",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (values: FormSchemaType) => {
      const payload =
        userType === "company"
          ? { email: values.email, password: values.password, type: userType, name: values.fullName, [userType]: {} }
          : { email: values.email, password: values.password, type: userType, [userType]: { trucks: [] }, name: values.fullName };

      console.log("Payload:", payload);

      try {
        const api=axios.create({
          baseURL:"/api",
        })
        const response = await api.post("/Auth/signup", payload);

        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
    onSuccess: (response) => {
            const { data } = response.data;
            toast.success("Signed in successfully!");

            if (data.token) {
              localStorage.setItem("authToken", data.token);
            }
            router.push("/dashboard");
      toast.success("Signed up successfully!")},
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred during sign up");
    },
  });

  const onSubmit = (values: FormSchemaType) => signUpMutation.mutate(values);

  return (
    <div className="flex justify-center items-center  ">
      <div className="bg-white p-5 sm:p-10 w-[500px] md:p-12 rounded-lg shadow-lg h-md mx-4">
        <Form {...form}>
            <h1 className="text-4xl font-bold text-center mb-4">Sign up</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* User Type Selection */}
            <div className="flex justify-center gap-3">
              {(["transport", "company"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`py-3 px-6 rounded-xl text-white font-bold transition ${userType === type ? "bg-[#446de2]" : "bg-black"}`}
                  onClick={() => setUserType(type)}
                >
                  {type === "transport" ? "Transporter" : "Company"}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            {[
              { name: "email", placeholder: "E-mail", icon: <Mail /> },
              { name: "fullName", placeholder: "Full Name", icon: <User /> },
              { name: "phoneNumber", placeholder: "Phone Number", icon: <Phone /> },
            ].map(({ name, placeholder, icon }) => (
              <FormField key={name} name={name as keyof FormSchemaType} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
                      <Input {...field} placeholder={placeholder} className="pl-10 pr-3 py-7" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}

            {/* Password Fields */}
            {([
              { name: "password", placeholder: "Password", show: showPassword, setShow: setShowPassword },
              { name: "confirmPassword", placeholder: "Confirm Password", show: showConfirmPassword, setShow: setShowConfirmPassword },
            ] as const).map(({ name, placeholder, show, setShow }) => (
              <FormField key={name} name={name as keyof FormSchemaType} control={form.control} render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500"><Lock /></span>
                      <Input {...field} type={show ? "text" : "password"} placeholder={placeholder} className="pl-10 flex items-center justify-center pr-10 py-7" />
                      <span onClick={() => setShow(!show)} className="absolute right-3 top-3 cursor-pointer">
                        {show ? <Eye size={20} /> : <EyeOff size={20} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}

            {/* Submit Button */}
            <button type="submit" className="w-full bg-primary rounded-full py-4 text-white hover:opacity-85" disabled={signUpMutation.isPending}>
              {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-center">
              Already have an account? <Link href="/signin" className="text-[#446de2] hover:underline">Sign in</Link>
            </p>
          </form>
        </Form>
      </div>

    </div>
  );
};
export default SignUpForm;
