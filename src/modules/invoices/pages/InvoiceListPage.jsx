import { useNavigate } from "react-router-dom";

import { useInvoices } from "../hooks/useInvoices";
import { InvoiceColumns } from "../components/InvoiceColumns";
import { InvoiceTable } from "../components/InvoiceTable";

export const InvoiceListPage = () => {

    const navigate = useNavigate();

    const {
        data,
        isLoading,
    } = useInvoices();

    const columns = InvoiceColumns({

        /*
        |--------------------------------------------------------------------------
        | View Invoice
        |--------------------------------------------------------------------------
        */

        onView: (invoice) => {

            navigate(
                `/invoices/${invoice.slug}`
            );
        },

        /*
        |--------------------------------------------------------------------------
        | Payment Receipt
        |--------------------------------------------------------------------------
        */

        onReceipt: (payment) => {

            if (!payment?.slug) {
                console.error(
                    "Payment slug is missing:",
                    payment
                );

                return;
            }

            navigate(
                `/payments/${payment.slug}/receipt`
            );
        },
    });

    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">

                <h1 className="text-xl font-semibold">
                    Invoices
                </h1>

            </div>

            <InvoiceTable
                data={
                    data?.data ??
                    data ??
                    []
                }
                columns={columns}
                isLoading={isLoading}
            />

        </div>
    );
};

export default InvoiceListPage;