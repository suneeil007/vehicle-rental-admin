import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import UserForm from "../components/UserForm";
import useUser from "../hooks/useUser";
import useUpdateUser from "../hooks/useUpdateUser";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";


const UserEditPage = () => {

    const { slug } = useParams();
    const navigate = useNavigate();

    const {
        data: user,
        isLoading
    } = useUser(slug);

    useDocumentTitle(user ? `Edit ${user.name}` : "Edit User");

    const {
        mutate,
        isPending
    } = useUpdateUser();

    const handleUpdate = (formData) => {
        // console.log("Edited Data:", formData);
        // console.log("SUBMIT FIRED - DOB:", formData.profile?.date_of_birth);
        mutate(
            {
                slug,
                data: formData
            },
            {
                onSuccess: () => {
                    toast.success(
                        "User updated successfully"
                    );
                    navigate("/users");
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message
                            ?? "Failed to update user"
                    );
                }
            }
        );

    };

    if (isLoading) {
            return <div>
                Loading user...
            </div>
        }

    if (!user) {
            return <div>
                User not found.
            </div>
        }

    return (
        <div>
           {/* Page Header */}
            <div className="flex items-center justify-between mb-1">
                <h1 className="text-xl font-bold text-gray-800">
                    Edit User
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
                Update the user’s information
            </p>

            
            <UserForm
                key={user?.slug}
                defaultValues={user}
                onSubmit={handleUpdate}
                onCancel={() =>
                    navigate("/users")
                }
                isLoading={isPending}
            />
        </div>
    );
};


export default UserEditPage;