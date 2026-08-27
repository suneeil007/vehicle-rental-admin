import { useNavigate } from "react-router-dom";

import { useInvoices } from "../hooks/useInvoices";
import { InvoiceColumns } from "../components/InvoiceColumns";
import InvoiceTable from "../components/InvoiceTable";


export const InvoiceListPage = () => {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Invoices
    |--------------------------------------------------------------------------
    */

    const {
        data,
        isLoading,
    } = useInvoices();


    /*
    |--------------------------------------------------------------------------
    | View Invoice
    |--------------------------------------------------------------------------
    */

    const handleView = (invoice) => {

        if (!invoice?.slug) {

            console.error(
                "Invoice slug not found:",
                invoice
            );

            return;
        }

        navigate(
            `/invoices/${invoice.slug}`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Payment Receipt
    |--------------------------------------------------------------------------
    */

    const handleReceipt = (payment) => {

        if (!payment?.slug) {

            console.error(
                "Payment slug not found:",
                payment
            );

            return;
        }

        navigate(
            `/payments/${payment.slug}/receipt`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Columns
    |--------------------------------------------------------------------------
    */

    const columns = InvoiceColumns({

        onView: handleView,

        onReceipt: handleReceipt,

    });


    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const invoices =
        data?.data ??
        data ??
        [];


    return (

        <div className="space-y-4">


            {/* PAGE HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <h1 className="text-xl font-semibold">
                    Invoices
                </h1>

            </div>


            {/* TABLE */}

            <InvoiceTable
                data={invoices}
                columns={columns}
                isLoading={isLoading}
            />

        </div>
    );
};


export default InvoiceListPage;