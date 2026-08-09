import {
    Eye,
    Pencil,
    Trash
    } from "lucide-react";


const UserActions = ({
            user,
              onView,
               onEdit,
                 onDelete
        })=>{

        return (

            <div className="flex gap-2">

                <button
                    onClick={()=>onView(user)}
                    className="text-blue-600"
                    >
                    <Eye size={18}/>
                </button>

                <button
                    onClick={()=>onEdit(user)}
                    className="text-green-600"
                    >
                    <Pencil size={18}/>
                </button>

                <button
                    onClick={()=>onDelete(user)}
                    className="text-red-600"
                    >
                    <Trash size={18}/>
                </button>
                
            </div>
        );
};


export default UserActions;