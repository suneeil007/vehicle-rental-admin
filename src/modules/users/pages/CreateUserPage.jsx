import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserForm from "../components/UserForm";
import useCreateUser from "../hooks/useCreateUser";


const CreateUserPage = () => {

    const navigate = useNavigate();

    const {
        mutate,
        isPending

    } = useCreateUser();

    const handleCreate = (formData) => {

        mutate(
            formData,
            {
                onSuccess:(response)=>{
                    toast.success(
                        "User created successfully"
                    );
                    navigate("/users");
                },

                onError:(error)=>{
                    const errors = error.response?.data?.errors;
                    if(errors){
                        Object.values(errors)
                            .flat()
                            .forEach((message)=>{

                                toast.error(message);
                            });
                        return;
                    }

                    toast.error(
                        error.response?.data?.message 
                        ||
                        "Something went wrong"
                    );
                }
            }
        );
    };

    return (

        <div>
            <h1
                className="
                    text-3xl
                    font-bold
                    text-gray-800
                    cursor-pointer
                    mb-6">
                Create User
            </h1>
                <UserForm
                    onSubmit={handleCreate}
                    onCancel={() =>
                        navigate("/users")
                    }
                    isLoading={isPending}
                />
        </div>
    );
};


export default CreateUserPage;