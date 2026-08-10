import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { loginSchema } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";
import useAuthStore from "../store/authStore";

const LoginForm = () => {
    const navigate = useNavigate();

    const loginStore = useAuthStore((state) => state.login);

    const { mutate, isPending } = useLogin();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: (response) => {
                const { token, user } = response.data.data;

                loginStore(token, user);

                toast.success("Login successful");

                navigate("/");
            },

            onError: (error) => {
                toast.error(
                    error.response?.data?.message ||
                        "Invalid email or password"
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
                    Vehicle Rental Admin
                </h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Sign in to your account
                </p>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@company.com"
                                    {...register("email")}
                                    className="form-input"
                                    style={{ paddingLeft: "2.75rem" }}
                                />
                            </div>

                            {errors.email && (
                                <p className="error-text">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className="form-input"
                                    style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer z-10"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="error-text">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="
                                w-full
                                flex items-center justify-center gap-2
                                bg-blue-600 hover:bg-blue-700
                                disabled:opacity-50
                                text-white
                                rounded-lg
                                py-3
                                transition
                                cursor-pointer
                            "
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LoginForm;