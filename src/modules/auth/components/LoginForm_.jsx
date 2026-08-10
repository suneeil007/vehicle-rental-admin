import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, Route } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50 flex">

            {/* Brand panel — hidden on small screens */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#14171C] overflow-hidden flex-col justify-between p-12">

                {/* Signature: a faint route line tracing the panel, with a pulsing waypoint */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.18]"
                    viewBox="0 0 600 800"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M -20 620 C 120 560, 160 460, 300 430 S 480 260, 460 140 S 560 20, 640 -30"
                        fill="none"
                        stroke="#E8871E"
                        strokeWidth="2"
                        strokeDasharray="6 10"
                        strokeLinecap="round"
                    />
                    <circle cx="300" cy="430" r="5" fill="#E8871E">
                        <animate
                            attributeName="opacity"
                            values="1;0.25;1"
                            dur="2.4s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>

                <div className="relative z-10 flex items-center gap-2 text-white">
                    <div className="w-9 h-9 rounded-lg bg-[#E8871E] flex items-center justify-center">
                        <Route size={18} className="text-[#14171C]" strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold tracking-tight text-lg">
                        FleetAdmin
                    </span>
                </div>

                <div className="relative z-10 max-w-sm">
                    <p className="text-xs font-mono tracking-widest text-[#E8871E] mb-4 uppercase">
                        Fleet Operations · Console
                    </p>
                    <h1 className="text-3xl font-semibold text-white leading-tight mb-4">
                        Every vehicle,
                        <br />
                        every booking,
                        <br />
                        one dashboard.
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Manage your fleet, track bookings, and keep operations
                        running smoothly — all from one place.
                    </p>
                </div>

                <p className="relative z-10 text-xs text-slate-500">
                    © {new Date().getFullYear()} FleetAdmin. All rights reserved.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm">

                    {/* Logo shown only on small screens where the brand panel is hidden */}
                    <div className="flex lg:hidden items-center gap-2 mb-10">
                        <div className="w-9 h-9 rounded-lg bg-[#E8871E] flex items-center justify-center">
                            <Route size={18} className="text-[#14171C]" strokeWidth={2.5} />
                        </div>
                        <span className="font-semibold tracking-tight text-lg text-slate-900">
                            FleetAdmin
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-sm text-slate-500">
                            Sign in to your admin account to continue.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@company.com"
                                    {...register("email")}
                                    className={`
                                        w-full rounded-lg border bg-white
                                        pl-10 pr-4 py-2.5 text-sm text-slate-900
                                        placeholder:text-slate-400
                                        transition-colors
                                        focus:outline-none focus:ring-2 focus:ring-[#E8871E]/30 focus:border-[#E8871E]
                                        ${errors.email ? "border-red-400" : "border-slate-300"}
                                    `}
                                />
                            </div>

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <Lock
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`
                                        w-full rounded-lg border bg-white
                                        pl-10 pr-11 py-2.5 text-sm text-slate-900
                                        placeholder:text-slate-400
                                        transition-colors
                                        focus:outline-none focus:ring-2 focus:ring-[#E8871E]/30 focus:border-[#E8871E]
                                        ${errors.password ? "border-red-400" : "border-slate-300"}
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="
                                w-full flex items-center justify-center gap-2
                                bg-[#14171C] hover:bg-[#1F242B]
                                disabled:opacity-60 disabled:cursor-not-allowed
                                text-white text-sm font-medium
                                rounded-lg py-2.5
                                transition-colors
                                cursor-pointer
                            "
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                </div>
            </div>

        </div>
    );
};

export default LoginForm;