import {
        useReactTable,
        getCoreRowModel,
        getSortedRowModel,
        getFilteredRowModel,
        getPaginationRowModel,
        flexRender
    }
    from "@tanstack/react-table";

import {
        useState
    }
    from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
    }
    from "@/components/ui/table";



const UserTable = ({
        users,
        columns
    }) => {


    const [sorting,setSorting] = useState([]);
    // console.log("CURRENT SORTING:", sorting);
    const [globalFilter,setGlobalFilter] = useState("");
    const table = useReactTable({
    data:users,
    columns,
    state:{
        sorting,
        globalFilter
    },


    enableSorting:true,
    onSortingChange:setSorting,
    onGlobalFilterChange:setGlobalFilter,
    getCoreRowModel:
        getCoreRowModel(),
    getSortedRowModel:
        getSortedRowModel(),
    getFilteredRowModel:
        getFilteredRowModel(),
    getPaginationRowModel:
        getPaginationRowModel(),
});

// console.log(
//     table.getAllColumns()
//     .map(col=>({
//         id:col.id,
//         sortable:col.getCanSort()
//     }))
// );

// console.log("TABLE USERS:", users);
// console.log("TABLE COLUMNS:", columns);

    return (

        <div className="space-y-5">

        {/* Search */}

        <input
            value={globalFilter ?? ""}
            onChange={(e)=>
                setGlobalFilter(e.target.value)
            }
            placeholder="Search users..."
            className="
                    border
                    rounded-lg
                    px-4
                    py-2
                    w-full
                    md:w-96
                    bg-white
                    "/>

        <div className="
                border
                rounded-xl
                overflow-hidden
                bg-white
                ">
             <Table>
                <TableHeader>
                    {
                    table
                    .getHeaderGroups()
                    .map(headerGroup=>(
                    <TableRow key={headerGroup.id}>
                    {
                    headerGroup.headers.map(header=>(
                        <TableHead
                                    key={header.id}
                                    onClick={
                                        header.column.getToggleSortingHandler()
                                    }
                                    className="
                                        cursor-pointer
                                        font-semibold
                                        bg-gray-100
                                        "
                                >


                            <div className="flex gap-2">
                                {
                                    flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )
                                }

                                {
                                    header.column.getIsSorted()==="asc"
                                    &&
                                    "⬆️"
                                }

                                {
                                    header.column.getIsSorted()==="desc"
                                    &&
                                    "⬇️"
                                }
                            </div>
                        </TableHead>
                    ))
                    }
                    </TableRow>
                    ))
                    }
                </TableHeader>
                <TableBody>
                    {
                    table
                        .getRowModel()
                        .rows
                        .map(row=>(
                                    
                            <TableRow key={row.id}>
                                {
                                row
                                    .getVisibleCells()
                                    .map(cell=>(
                                <TableCell key={cell.id}>
                                    {
                                            flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    }
                                </TableCell>
                                ))
                                }
                            </TableRow>
                    ))
                    }
                </TableBody>
            </Table>
            
         </div>

            {/* Pagination */}
            <div className="
                    flex
                    justify-between
                    items-center
                    ">

            <div className="text-sm text-gray-600">
                Showing {table.getRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} users
            </div>

            <div className="flex gap-2">

                    <button
                        disabled={
                            !table.getCanPreviousPage()
                            }
                        onClick={()=>
                            table.previousPage()
                            }
                        className="
                                px-4
                                py-2
                                bg-blue-600
                                text-white
                                border
                                rounded
                                text-sm
                                hover:bg-blue-700
                                disabled:opacity-50
                                disabled:hover:bg-blue-600
                                ">
                        Previous
                    </button>


                    <span className="px-3
                                    py-2
                                    text-sm">
                            Page{" "}
                            {
                            table.getState()
                            .pagination
                            .pageIndex + 1
                            }
                            {" "}of{" "}
                            {
                            table.getPageCount()
                            }
                    </span>


                    <button
                        disabled={
                            !table.getCanNextPage()
                            }
                        onClick={()=>
                            table.nextPage()
                            }
                        className="
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            border
                            rounded
                            text-sm
                            hover:bg-blue-700
                            disabled:opacity-50
                            disabled:hover:bg-blue-600
                            "
                        >
                    Next
                    </button>
            </div>
         </div>
    </div>

    );
};


export default UserTable;