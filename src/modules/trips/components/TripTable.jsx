import { useState } from "react";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const TripTable = ({
    trips = [],
    columns = [],
    loading = false,
}) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: trips,
        columns,
        state: { sorting, globalFilter },
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

            <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search trips..."
                className="border rounded-lg px-4 py-2 w-full bg-white md:w-96"
            />

            <div className="border rounded-xl overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="w-16 text-center bg-gray-100 font-semibold">
                                    S.N.
                                </TableHead>

                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer bg-gray-100 font-semibold"
                                    >
                                        <div className="flex items-center gap-2">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" && <span>⬆️</span>}
                                            {header.column.getIsSorted() === "desc" && <span>⬇️</span>}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-gray-500">
                                    Loading trips...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-gray-500">
                                    No trips found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row, index) => {
                                const serialNumber =
                                    table.getState().pagination.pageIndex *
                                        table.getState().pagination.pageSize +
                                    index +
                                    1;

                                return (
                                    <TableRow key={row.id}>
                                        <TableCell className="w-16 text-center font-medium text-gray-600">
                                            {serialNumber}
                                        </TableCell>

                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-sm text-gray-700">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div className="text-sm text-gray-600">
                    Showing {table.getRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} trips
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        className="px-4 py-1 bg-blue-600 text-white border rounded text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-2 text-sm whitespace-nowrap text-gray-600">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>

                    <button
                        type="button"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        className="px-4 py-1 bg-blue-600 text-white border rounded text-sm cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripTable;