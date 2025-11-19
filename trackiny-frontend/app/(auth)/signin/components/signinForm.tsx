"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock,User } from "lucide-react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { UserState } from "@/lib/atom";
import { useSetAtom } from "jotai";



const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email").max(50),
  password: z.string().min(1, "Password is required").max(50),
  name: z.string().min(1, "Name is required").max(50),
});

const SignForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"transport" | "company">("transport");
  const router = useRouter();

  const buttons = [
    { label: "Transporter", type: "transport" },
    { label: "Company", type: "company" },
  ];

  const setUser = useSetAtom(UserState)


  const signInMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const payload = {
        email: values.email,
        // name: values.name,
        password: values.password,
        // type: userType,
      };

      const api = axios.create({ baseURL: "/api" });

      return await api.post(`/login`, payload);
    },
    onSuccess: (response) => {
      const data = response.data;
      setUser(data.type);
      toast.success("Signed in successfully!");

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error((error as any).response?.data?.message || "An error occurred. Check your network.");
      console.error("Sign-in error:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInMutation.mutate(values);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-5 sm:p-10 md:p-12 rounded-lg shadow-lg h-md mx-4">
        <ToastContainer />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-center flex-col space-y-8"
          >
            <h1 className="text-4xl font-bold">Sign in</h1>

            {/* User Type Selection */}
            <div className="flex justify-center gap-3">
              {buttons.map((button) => (
                <button
                  key={button.type}
                  type="button"
                  className={`py-3 px-6 rounded-xl text-white font-bold transition ${
                    userType === button.type ? "bg-[#446de2]" : "bg-black"
                  }`}
                  onClick={() => setUserType(button.type as "transport" | "company")}
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-500" />
                      <Input
                        placeholder="Name"
                        {...field}
                        className="h-12 p-7 pl-10 text-lg rounded-xl w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-500" />
                      <Input
                        placeholder="E-mail"
                        {...field}
                        className="h-12 p-7 pl-10 text-lg rounded-xl w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-500" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="h-12 p-7 pl-10 text-lg rounded-xl w-full"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary rounded-full py-4 text-white hover:opacity-85 bg-[#446de2]"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Signing In..." : "Sign In"}
            </button>

            {/* Sign-up Redirect */}
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#446de2] hover:underline">
                Sign Up
              </Link>
            </p>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignForm;
