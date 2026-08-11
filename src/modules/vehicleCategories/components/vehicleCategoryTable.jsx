import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const VehicleCategoryTable = ({
    categories,
    columns,
}) => {

    const [sorting, setSorting] = useState([]);

    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({

        data: categories,

        columns,

        state: {
            sorting,
            globalFilter,
        },

        enableSorting: true,

        onSortingChange: setSorting,

        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),

        getSortedRowModel: getSortedRowModel(),

        getFilteredRowModel: getFilteredRowModel(),

        getPaginationRowModel: getPaginationRowModel(),

    });

    return (

        <div className="space-y-5">

            {/* Search */}

            <input
                value={globalFilter ?? ""}
                onChange={(e) =>
                    setGlobalFilter(e.target.value)
                }
                placeholder="Search vehicle categories..."
                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                    w-full
                    bg-white
                    md:w-96"/>
            <div
                className="
                    border
                    rounded-xl
                    overflow-hidden
                    bg-white">

                <Table>
                    <TableHeader>
                        {
                            table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {
                                            headerGroup.headers.map((header) => (
                                                <TableHead
                                                    key={header.id}
                                                    onClick={
                                                        header.column.getToggleSortingHandler()
                                                    }
                                                    className="
                                                        cursor-pointer
                                                        bg-gray-100
                                                        font-semibold">
                                                    <div className="flex gap-2">
                                                        {
                                                            flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
                                                        }
                                                        {
                                                            header.column.getIsSorted() === "asc"
                                                            &&
                                                            "⬆️"
                                                        }
                                                        {
                                                            header.column.getIsSorted() === "desc"
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
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        {
                                            row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}
                                                     className="text-sm text-gray-700" 
                                                    >

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
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:justify-between
                    md:items-center
                "
            >
                {/* Showing information */}
                <div className="text-sm text-gray-600">
                    Showing{" "}
                    {table.getRowModel().rows.length}{" "}
                    of{" "}
                    {table.getFilteredRowModel().rows.length}{" "}
                    vehicle categories
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button
                        type="button"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        className="
                            px-4
                            py-1
                            bg-blue-600
                            text-white
                            border
                            rounded
                            text-sm
                            hover:bg-blue-700
                            disabled:opacity-50
                            cursor-pointer
                        "
                    >
                        Previous
                    </button>

                    {/* Page */}
                    <span
                        className="
                            px-3
                            py-2
                            text-sm
                            whitespace-nowrap
                            text-gray-600
                        "
                    >
                        Page{" "}
                        {table.getState().pagination.pageIndex + 1}{" "}
                        of{" "}
                        {table.getPageCount()}
                    </span>

                    {/* Next */}
                    <button
                        type="button"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        className="
                            px-4
                            py-1
                            bg-blue-600
                            text-white
                            border
                            rounded
                            text-sm
                            cursor-pointer
                            hover:bg-blue-700
                            disabled:opacity-50
                        "
                    >
                        Next
                    </button>

                </div>
            </div>
        </div>
    );

};

export default VehicleCategoryTable;