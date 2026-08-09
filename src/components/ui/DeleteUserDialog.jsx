import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";

const DeleteUserDialog = ({
    open,
    onOpenChange,
    user,
    onConfirm,
    isDeleting = false,
}) => {

    return (

        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >

             <AlertDialogContent className="max-w-sm">
                  <AlertDialogHeader>

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-7 w-7 text-red-600" />
                        </div>

                        <AlertDialogTitle className="text-xl text-left">
                            Delete User
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-left leading-6">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold text-gray-900">
                                {user?.name}
                            </span>
                            ?
                            <br />
                            <br />
                            This action cannot be undone.
                        </AlertDialogDescription>

                    </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="cursor-pointer"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            cursor-pointer">

                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </>
                        )}

                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

    );

};

export default DeleteUserDialog;