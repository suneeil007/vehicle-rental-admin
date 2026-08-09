import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import UserForm from "../components/UserForm";
import useUser from "../hooks/useUser";
import useUpdateUser from "../hooks/useUpdateUser";


const UserEditPage = () => {

    const { slug } = useParams();
    const navigate = useNavigate();

    const {
        data: user,
        isLoading
    } = useUser(slug);

    const {
        mutate,
        isPending
    } = useUpdateUser();

    const handleUpdate = (formData) => {
        // console.log("Edited Data:", formData);
        console.log("SUBMIT FIRED - DOB:", formData.profile?.date_of_birth);
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
            <h1 className="
                text-3xl
                font-bold
                mb-6
            ">
                Edit User
            </h1>
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