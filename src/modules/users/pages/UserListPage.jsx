import {
        useNavigate
    } from "react-router-dom";

import { useState } from "react";
import DeleteUserDialog from "@/components/ui/DeleteUserDialog";

import UserTable from "../components/UserTable";
import UserToolbar from "../components/UserToolbar";
import useUsers from "../hooks/useUsers";
import { userColumns } from "../components/UserColumns";
import useDeleteUser from "../hooks/useDeleteUser";
import { toast } from "sonner";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const UserListPage = ()=>{
useDocumentTitle("Users");
const navigate = useNavigate();
const [selectedUser, setSelectedUser] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);

const { data, isLoading } = useUsers();
const { mutate: deleteUser, isPending: isDeleting} = useDeleteUser();    


const handleView = (user)=>{
    // console.log("View",user);
    navigate(
        `/users/${user.slug}`
    );
};


const handleEdit = (user)=>{
    // console.log("Edit",user);
    // console.log("USER SLUG:", user.slug);
    navigate(
        `/users/${user.slug}/edit`
    );
};


const handleDelete = (user) => {
    setSelectedUser(user);
       setDialogOpen(true);
};

const confirmDelete = () => {

    if (!selectedUser) return;
        deleteUser(selectedUser.slug, {
            onSuccess: (response) => {
                toast.success(response.message);
                   setDialogOpen(false);
                      setSelectedUser(null);
            },
            onError: (error) => {
                toast.error(
                    error.response?.data?.message ??
                    "Unable to delete user."
                );
            }
        });
    };

    if(isLoading){
            return (
                <div>
                    Loading users...
                </div>
            );
        }

    const columns = userColumns({
        onView: handleView,
          onEdit: handleEdit,
            onDelete: handleDelete,
              isDeleting
    });

    return (
            <div>
                <UserToolbar />
                <UserTable
                    users={data ?? []}
                      columns={columns}
                />
                <DeleteUserDialog
                    open={dialogOpen}
                       onOpenChange={setDialogOpen}
                          user={selectedUser}
                            onConfirm={confirmDelete}
                                isDeleting={isDeleting}
                />
            </div>
        );
};


export default UserListPage;