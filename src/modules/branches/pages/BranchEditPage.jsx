import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import BranchForm from "../components/BranchForm";
import useBranch from "../hooks/useBranch";
import useUpdateBranch from "../hooks/useUpdateBranch";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BranchEditPage = () => {
    useDocumentTitle("Edit Branch");

    const { slug } = useParams();
    const navigate = useNavigate();

    const { data: branch, isLoading } = useBranch(slug);
    const { mutate, isPending } = useUpdateBranch();

    const handleUpdate = (data) => {
        mutate(
            { slug, ...data },
            {
                onSuccess: () => {
                    toast.success("Branch updated successfully");
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
            }
        );
    };

    if (isLoading) return <p className="text-gray-500 text-sm">Loading branch...</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-0">
                <h1 className="text-xl font-bold text-gray-600 mb-0">Edit Branch</h1>

                <button
                    type="button"
                    onClick={() => navigate("/branches")}
                    className="h-10 w-10 flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-white transition cursor-pointer relative top-[10px]"
                    title="Branches List"
                >
                    <List className="h-4 w-4" />
                </button>
            </div>

            <p className="text-gray-500 text-sm">Update branch details</p>

            <BranchForm
                defaultValues={branch}
                onSubmit={handleUpdate}
                isLoading={isPending}
                onCancel={() => navigate("/branches")}
            />
        </div>
    );
};

export default BranchEditPage;