import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import UserForm from "../components/UserForm";
import useCreateUser from "../hooks/useCreateUser";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const CreateUserPage = () => {

    useDocumentTitle("Create User");

    const navigate = useNavigate();

    const {
        mutate,
        isPending
    } = useCreateUser();

    const handleCreate = (formData) => {

        mutate(
            formData,
            {
                onSuccess: (response) => {
                    toast.success(
                        "User created successfully"
                    );

                    navigate("/users");
                },

                onError: (error) => {
                    const errors =
                        error.response?.data?.errors;

                    if (errors) {
                        Object.values(errors)
                            .flat()
                            .forEach((message) => {
                                toast.error(message);
                            });

                        return;
                    }

                    toast.error(
                        error.response?.data?.message ||
                        "Something went wrong"
                    );
                }
            }
        );
    };

    return (
        <div>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-1">
                <h1 className="text-xl font-bold text-gray-800">
                    Create User
                </h1>

                <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="
                        h-10 w-10
                        flex items-center justify-center
                        rounded-md
                        text-blue-600
                        bg-blue-50
                        hover:bg-white
                        transition
                        cursor-pointer
                        relative top-[10px]
                    "
                    title="Users List"
                >
                    <List className="h-4 w-4" />
                </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Create a new user
            </p>

            <UserForm
                onSubmit={handleCreate}
                onCancel={() => navigate("/users")}
                isLoading={isPending}
            />

        </div>
    );
};

export default CreateUserPage;

