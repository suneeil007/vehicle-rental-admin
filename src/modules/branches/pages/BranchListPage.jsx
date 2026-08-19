import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import useBranches from "../hooks/useBranches";
import useDeleteBranch from "../hooks/useDeleteBranch";
import BranchColumns from "../components/BranchColumns";
import BranchTable from "../components/BranchTable";
import DeleteBranchDialog from "../components/DeleteBranchDialog";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";
import BranchToolbar from "../components/BranchToolbar";

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
            
            <BranchToolbar />

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