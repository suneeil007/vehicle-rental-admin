export const Table = ({
    children,
    className = ""
}) => (
    <table className={`w-full ${className}`}>
        {children}
    </table>
);



export const TableHeader = ({
    children,
    className = ""
}) => (
    <thead className={className}>
        {children}
    </thead>
);



export const TableBody = ({
    children,
    className = ""
}) => (
    <tbody className={className}>
        {children}
    </tbody>
);



export const TableRow = ({
    children,
    className = ""
}) => (
    <tr className={`border-b ${className}`}>
        {children}
    </tr>
);



export const TableHead = ({
    children,
    className = "",
    ...props
}) => (
    <th
        className={`text-left p-3 ${className}`}
        {...props}
    >
        {children}
    </th>
);



export const TableCell = ({
    children,
    className = "",
    ...props
}) => (
    <td
        className={`p-3 ${className}`}
        {...props}
    >
        {children}
    </td>
);