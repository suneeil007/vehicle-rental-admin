import { useState } from "react";
import EmptyState from "../EmptyState";


const DataTable = ({
    columns = [],
    data = [],
    actions
}) => {


    const [selectedRows, setSelectedRows] = useState([]);


    const allSelected =
        data.length > 0 &&
        selectedRows.length === data.length;



    const toggleSelectAll = () => {

        if (allSelected) {

            setSelectedRows([]);

        } else {

            setSelectedRows(
                data.map(item => item.id)
            );

        }

    };



    const toggleRow = (id) => {

        setSelectedRows((prev) => {

            if (prev.includes(id)) {

                return prev.filter(
                    item => item !== id
                );

            }


            return [
                ...prev,
                id
            ];

        });

    };



    if (!data.length) {

        return (
            <EmptyState
                message="No records found"
            />
        );

    }



    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                overflow-hidden
            "
        >


            <div className="overflow-x-auto">


                <table className="min-w-full table-auto">


                    <thead className="bg-gray-50">


                        <tr>


                            {/* Checkbox Header */}
                            <th
                                className="
                                    w-8
                                    px-2
                                    py-3
                                    text-center
                                "
                            >

                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="
                                        w-4
                                        h-4
                                        cursor-pointer
                                    "
                                />

                            </th>



                            {/* SN Header */}
                            <th
                                className="
                                    w-10
                                    px-2
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                SN
                            </th>



                            {
                                columns.map((column) => (

                                    <th
                                        key={column.key}
                                        className="
                                            px-4
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-gray-600
                                            uppercase
                                            tracking-wide
                                        "
                                    >
                                        {column.title}

                                    </th>

                                ))
                            }



                            {
                                actions &&

                                <th
                                    className="
                                        px-4
                                        py-3
                                        text-right
                                        text-xs
                                        font-semibold
                                        text-gray-600
                                        uppercase
                                    "
                                >
                                    Actions
                                </th>

                            }


                        </tr>


                    </thead>




                    <tbody
                        className="
                            divide-y
                            divide-gray-100
                        "
                    >


                        {
                            data.map((row, index) => (


                                <tr
                                    key={row.id}
                                    className={`
                                        transition
                                        hover:bg-gray-50

                                        ${
                                            selectedRows.includes(row.id)
                                            ?
                                            "bg-blue-50"
                                            :
                                            ""
                                        }
                                    `}
                                >



                                    {/* Checkbox */}
                                    <td
                                        className="
                                            w-8
                                            px-2
                                            py-3
                                            text-center
                                        "
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedRows.includes(row.id)
                                            }
                                            onChange={() =>
                                                toggleRow(row.id)
                                            }
                                            className="
                                                w-4
                                                h-4
                                                cursor-pointer
                                            "
                                        />

                                    </td>



                                    {/* SN */}
                                    <td
                                        className="
                                            w-10
                                            px-2
                                            py-3
                                            text-sm
                                            text-gray-500
                                        "
                                    >

                                        {index + 1}

                                    </td>




                                    {
                                        columns.map((column) => (

                                            <td
                                                key={column.key}
                                                className="
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-gray-700
                                                    whitespace-nowrap
                                                "
                                            >

                                                {
                                                    column.render
                                                    ?
                                                    column.render(row)
                                                    :
                                                    row[column.key]
                                                }

                                            </td>

                                        ))
                                    }




                                    {
                                        actions &&

                                        <td
                                            className="
                                                px-4
                                                py-3
                                                text-right
                                            "
                                        >
                                            {actions(row)}
                                        </td>

                                    }



                                </tr>


                            ))
                        }


                    </tbody>


                </table>


            </div>


        </div>

    );

};


export default DataTable;