import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import useBranches from "../hooks/useBranches";
import useDeleteBranch from "../hooks/useDeleteBranch";
import BranchColumns from "../components/BranchColumns";
import BranchTable from "../components/BranchTable";
import DeleteBranchDialog from "../components/DeleteBranchDialog";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const BranchListPage = () => {
    useDocumentTitle("Branches");

    const navigate = useNavigate();
    const { data: branches, isLoading } = useBranches();
    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();

    const [deleteTarget, setDeleteTarget] = useState(null);

    const columns = BranchColumns({
        onEdit: (branch) => navigate(`/branches/${branch.slug}/edit`),
        onDelete: (branch) => setDeleteTarget(branch),
    });

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        deleteBranch(deleteTarget.slug, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-600">Branches</h1>
                    <p className="text-gray-500 text-sm">Manage rental branch locations</p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/branches/create")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Add Branch
                </button>
            </div>

            <BranchTable branches={branches ?? []} columns={columns} loading={isLoading} />

            <DeleteBranchDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                branch={deleteTarget}
            />
        </div>
    );
};

export default BranchListPage;