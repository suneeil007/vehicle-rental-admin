import { AlertTriangle } from "lucide-react";

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

const DeleteVehicleDialog = ({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
    vehicle,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">

                <AlertDialogHeader>
                    <div className="flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-7 w-7 text-red-600" />
                        </div>
                    </div>

                    <AlertDialogTitle className="mt-4 text-center text-xl">
                        Delete Vehicle
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-left">
                        {vehicle ? (
                            <>
                                Are you sure you want to delete
                                <span className="font-semibold text-gray-900">
                                    {" "}
                                    {vehicle.name}
                                </span>
                                ?
                                <br />
                                <br />
                                This action cannot be undone.
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete this vehicle?
                                <br />
                                <br />
                                This action cannot be undone.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                         disabled={loading}
                         className="cursor-pointer"
                         >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={loading}
                        className="bg-red-600 cursor-pointer hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteVehicleDialog;