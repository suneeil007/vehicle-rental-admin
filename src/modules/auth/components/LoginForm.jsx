import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { loginSchema } from "../validation/loginSchema";
import { useLogin } from "../hooks/useLogin";
import useAuthStore from "../store/authStore";

const LoginForm = () => {
    const navigate = useNavigate();

    const loginStore = useAuthStore((state) => state.login);

    const { mutate, isPending } = useLogin();

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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Vehicle Rental Admin
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            {...register("email")}
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            {...register("password")}
                            className="w-full border rounded-lg px-4 py-3"
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3"
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default LoginForm;