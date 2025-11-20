import { useMutation } from "@tanstack/react-query";
import { login,register } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
export const useSignin = () => {
    const router = useRouter();
    const signInMutation = useMutation({
        mutationFn: login,
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
    return signInMutation;
}
export const useSignUp = () => {
    const signUpMutation = useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            const { data } = response.data;
            toast.success("Signed in successfully!");

            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }
            router.push("/dashboard");
            toast.success("Signed up successfully!")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred during sign up");
        },
    });
    return signUpMutation;
}

