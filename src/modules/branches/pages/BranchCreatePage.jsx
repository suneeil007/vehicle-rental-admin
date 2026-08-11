import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import BranchForm from "../components/BranchForm";
import useCreateBranch from "../hooks/useCreateBranch";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BranchCreatePage = () => {
    useDocumentTitle("Create Branch");

    const navigate = useNavigate();
    const { mutate, isPending } = useCreateBranch();

    const handleCreate = (data) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Branch created successfully");
                navigate("/branches");
            },
            onError: (error) => {
                const errors = error.response?.data?.errors;
                if (errors) {
                    Object.values(errors).flat().forEach((message) => {
                        toast.error(message);
                    });
                    return;
                }
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-0">
                <h1 className="text-xl font-bold text-gray-600 mb-0">Create Branch</h1>

                <button
                    type="button"
                    onClick={() => navigate("/branches")}
                    className="h-10 w-10 flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-white transition cursor-pointer relative top-[10px]"
                    title="Branches List"
                >
                    <List className="h-4 w-4" />
                </button>
            </div>

            <p className="text-gray-500 text-sm">Add a new branch location</p>

            <BranchForm
                onSubmit={handleCreate}
                isLoading={isPending}
                onCancel={() => navigate("/branches")}
            />
        </div>
    );
};

export default BranchCreatePage;