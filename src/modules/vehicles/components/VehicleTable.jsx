import { useEffect, useState } from "react";

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

const VehicleTable = ({
    vehicles = [],
    columns = [],
    loading = false,
    toolbarRight,
}) => {
    const [sorting, setSorting] =
        useState([]);

    const [globalFilter, setGlobalFilter] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | React Table
    |--------------------------------------------------------------------------
    */

    const table = useReactTable({
        data: Array.isArray(vehicles)
            ? vehicles
            : [],

        columns,

        state: {
            sorting,
            globalFilter,
        },

        enableSorting: true,

        onSortingChange: setSorting,

        onGlobalFilterChange:
            setGlobalFilter,

        getCoreRowModel:
            getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        getFilteredRowModel:
            getFilteredRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),

        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },
    });

    /*
    |--------------------------------------------------------------------------
    | Reset pagination when search/data changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        table.setPageIndex(0);
    }, [globalFilter, vehicles.length]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-5">

            {/* Search + Status */}
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >

                {/* Search */}
                <input
                    value={
                        globalFilter ?? ""
                    }
                    onChange={(e) =>
                        setGlobalFilter(
                            e.target.value
                        )
                    }
                    placeholder="Search vehicles..."
                    className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        px-4
                        py-2.5
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        md:w-96
                    "
                />

                {/* Status badges */}
                {toolbarRight && (
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            md:justify-end
                        "
                    >
                        {toolbarRight}
                    </div>
                )}

            </div>

            {/* Table */}
            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                "
            >
                <Table>

                    {/* Header */}
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup
                                ) => (
                                    <TableRow
                                        key={
                                            headerGroup.id
                                        }
                                    >

                                        {/* S.N. */}
                                        <TableHead
                                            className="
                                                w-16
                                                bg-gray-100
                                                text-center
                                                font-semibold
                                            "
                                        >
                                            S.N.
                                        </TableHead>

                                        {headerGroup.headers.map(
                                            (
                                                header
                                            ) => {
                                                const canSort =
                                                    header.column.getCanSort();

                                                return (
                                                    <TableHead
                                                        key={
                                                            header.id
                                                        }
                                                        onClick={
                                                            canSort
                                                                ? header.column.getToggleSortingHandler()
                                                                : undefined
                                                        }
                                                        className={`
                                                            bg-gray-100
                                                            font-semibold
                                                            ${
                                                                canSort
                                                                    ? "cursor-pointer select-none"
                                                                    : ""
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-2">

                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                      header
                                                                          .column
                                                                          .columnDef
                                                                          .header,
                                                                      header.getContext()
                                                                  )}

                                                            {header.column.getIsSorted() ===
                                                                "asc" && (
                                                                <span>
                                                                    ↑
                                                                </span>
                                                            )}

                                                            {header.column.getIsSorted() ===
                                                                "desc" && (
                                                                <span>
                                                                    ↓
                                                                </span>
                                                            )}

                                                        </div>
                                                    </TableHead>
                                                );
                                            }
                                        )}

                                    </TableRow>
                                )
                            )}
                    </TableHeader>

                    {/* Body */}
                    <TableBody>

                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        1
                                    }
                                    className="
                                        py-10
                                        text-center
                                        text-gray-500
                                    "
                                >
                                    Loading vehicles...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel()
                              .rows.length ===
                          0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        1
                                    }
                                    className="
                                        py-10
                                        text-center
                                        text-gray-500
                                    "
                                >
                                    No vehicles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table
                                .getRowModel()
                                .rows
                                .map(
                                    (
                                        row,
                                        index
                                    ) => {

                                        const serialNumber =
                                            table.getState()
                                                .pagination
                                                .pageIndex *
                                                table.getState()
                                                    .pagination
                                                    .pageSize +
                                            index +
                                            1;

                                        return (
                                            <TableRow
                                                key={
                                                    row.id
                                                }
                                            >

                                                {/* S.N. */}
                                                <TableCell
                                                    className="
                                                        w-16
                                                        text-center
                                                        font-medium
                                                        text-gray-600
                                                    "
                                                >
                                                    {
                                                        serialNumber
                                                    }
                                                </TableCell>

                                                {/* Cells */}
                                                {row
                                                    .getVisibleCells()
                                                    .map(
                                                        (
                                                            cell
                                                        ) => (
                                                            <TableCell
                                                                key={
                                                                    cell.id
                                                                }
                                                                className="
                                                                    text-sm
                                                                    text-gray-700
                                                                "
                                                            >
                                                                {flexRender(
                                                                    cell
                                                                        .column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        )
                                                    )}

                                            </TableRow>
                                        );
                                    }
                                )
                        )}

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
                    md:items-center
                    md:justify-between
                "
            >

                {/* Showing */}
                <div className="text-sm text-gray-600">
                    Showing{" "}
                    <strong>
                        {
                            table.getRowModel()
                                .rows.length
                        }
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {
                            table.getFilteredRowModel()
                                .rows.length
                        }
                    </strong>{" "}
                    vehicles
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        disabled={
                            !table.getCanPreviousPage()
                        }
                        onClick={() =>
                            table.previousPage()
                        }
                        className="
                            rounded
                            border
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Previous
                    </button>

                    <span
                        className="
                            whitespace-nowrap
                            px-3
                            py-2
                            text-sm
                            text-gray-600
                        "
                    >
                        Page{" "}
                        {table.getState()
                            .pagination
                            .pageIndex + 1}{" "}
                        of{" "}
                        {Math.max(
                            table.getPageCount(),
                            1
                        )}
                    </span>

                    <button
                        type="button"
                        disabled={
                            !table.getCanNextPage()
                        }
                        onClick={() =>
                            table.nextPage()
                        }
                        className="
                            cursor-pointer
                            rounded
                            border
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
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

export default VehicleTable;