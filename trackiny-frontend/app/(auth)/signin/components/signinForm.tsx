"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { UserState } from "@/lib/atom";
import { useSetAtom } from "jotai";
import { formSchemaSignin } from "@/lib/validations/auth";
import { useSignin } from "@/hooks/mutations/useAuthMutations";
const SignForm: React.FC = () => {
    const signInMutation = useSignin();
    const form = useForm<z.infer<typeof formSchemaSignin>>({
        resolver: zodResolver(formSchemasSignin),
        defaultValues: {
            email: "",
            password: "",
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

    function onSubmit(values: z.infer<typeof formSchemaSignin>) {
        signInMutation.mutate(values);
    }

    return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
                <ToastContainer />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-6"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold text-center">Sign in</h1>

                        {/* User Type Selection */}
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {buttons.map((button) => (
                                <button
                                    key={button.type}
                                    type="button"
                                    className={`py-2.5 sm:py-3 px-5 sm:px-7 rounded-xl text-white font-bold transition text-sm sm:text-base ${userType === button.type ? "bg-[#446de2]" : "bg-black"
                                        }`}
                                    onClick={() => setUserType(button.type as "transport" | "company")}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                            <Input
                                                placeholder="E-mail"
                                                {...field}
                                                className="h-12 pl-10 pr-4 text-base rounded-xl w-full"
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
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                className="h-12 pl-10 pr-12 text-base rounded-xl w-full"
                                                placeholder="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
                            className="w-full bg-[#446de2] rounded-full py-3 sm:py-3.5 text-white font-semibold hover:opacity-85 text-base sm:text-lg"
                            disabled={signInMutation.isPending}
                        >
                            {signInMutation.isPending ? "Signing In..." : "Sign In"}
                        </button>

                        {/* Sign-up Redirect */}
                        <p className="text-center text-sm sm:text-base">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-[#446de2] hover:underline font-semibold">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
}
export default SignForm;
