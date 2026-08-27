import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoice } from "../hooks/useInvoice";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge";

// Cross-module imports
import { usePaymentsByTrip } from "../../payments/hooks/usePaymentsByTrip";
import { PaymentColumns } from "../../payments/components/PaymentColumns";
import PaymentTable from "../../payments/components/PaymentTable";


/*
|--------------------------------------------------------------------------
| Detail Item
|--------------------------------------------------------------------------
*/

const DetailItem = ({
  label,
  value,
}) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">
      {label}
    </p>

    <p className="text-sm font-medium">
      {value ?? "—"}
    </p>
  </div>
);


/*
|--------------------------------------------------------------------------
| Date Time Formatter
|--------------------------------------------------------------------------
*/

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


/*
|--------------------------------------------------------------------------
| Invoice Detail Page
|--------------------------------------------------------------------------
*/

export const InvoiceDetailPage = () => {

  const { slug } = useParams();

  const navigate = useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Invoice
  |--------------------------------------------------------------------------
  */

  const {
    data: invoice,
    isLoading,
  } = useInvoice(slug);


  /*
  |--------------------------------------------------------------------------
  | Payments
  |--------------------------------------------------------------------------
  */

  const {
    data: paymentsData,
    isLoading: paymentsLoading,
  } = usePaymentsByTrip(
    invoice?.trip?.slug
  );


  /*
  |--------------------------------------------------------------------------
  | Payment Columns
  |--------------------------------------------------------------------------
  |
  | Same navigation logic used by InvoiceListPage.
  |
  */

  const paymentColumns = PaymentColumns({

    showActions: true,

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


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading invoice...
      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!invoice) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Invoice not found.
      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const trip = invoice.trip;

  const customer = invoice.customer;

  const payments =
    paymentsData?.data ??
    paymentsData ??
    [];


  /*
  |--------------------------------------------------------------------------
  | Pickup Location
  |--------------------------------------------------------------------------
  */

  const pickupLocation =
    trip?.pickup_location ??
    trip?.pickupBranch?.name ??
    "—";


  /*
  |--------------------------------------------------------------------------
  | Drop Location
  |--------------------------------------------------------------------------
  */

  const dropLocation =
    trip?.drop_location ??
    trip?.dropBranch?.name ??
    "—";


  /*
  |--------------------------------------------------------------------------
  | Vehicle
  |--------------------------------------------------------------------------
  */

  const vehicleName =
    trip?.vehicle?.name ??
    trip?.vehicle?.model ??
    "—";


  /*
  |--------------------------------------------------------------------------
  | Registration Number
  |--------------------------------------------------------------------------
  */

  const registrationNumber =
    trip?.vehicle?.registration_number ??
    trip?.vehicle?.registration_no ??
    trip?.vehicle?.vehicle_number ??
    "—";


  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  */

  const driverName =
    trip?.driver?.name ??
    "—";


  return (
    <div className="space-y-6">

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

     <div className="flex items-center justify-between">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-3">

        {/* BACK BUTTON */}
        <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/invoices")}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

        {/* INVOICE TITLE */}
        <div>

            <h1 className="text-xl font-semibold">
                Invoice Details
            </h1>

            <p className="text-sm text-slate-500">
                {invoice.invoice_number ?? "—"}
            </p>

        </div>

    </div>


    {/* STATUS */}
    <InvoiceStatusBadge
        status={invoice.status}
    />

</div>


      {/* ================================================================ */}
      {/* CUSTOMER */}
      {/* ================================================================ */}

      <div className="rounded-lg border p-4">

        <h2 className="mb-4 text-sm font-semibold">
          Customer
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          <DetailItem
            label="Name"
            value={customer?.name}
          />

          <DetailItem
            label="Phone"
            value={customer?.phone}
          />

          <DetailItem
            label="Email"
            value={customer?.email}
          />

        </div>

      </div>


      {/* ================================================================ */}
      {/* TRIP INFORMATION */}
      {/* ================================================================ */}

      <div className="rounded-lg border p-4">

        <h2 className="mb-4 text-sm font-semibold">
          Trip Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <DetailItem
            label="Vehicle"
            value={vehicleName}
          />

          <DetailItem
            label="Registration Number"
            value={registrationNumber}
          />

          <DetailItem
            label="Driver"
            value={driverName}
          />

          <DetailItem
            label="Pickup Location"
            value={pickupLocation}
          />

          <DetailItem
            label="Drop Location"
            value={dropLocation}
          />

          <DetailItem
            label="Pickup At"
            value={formatDateTime(
              trip?.pickup_at
            )}
          />

          <DetailItem
            label="Expected Return"
            value={formatDateTime(
              trip?.expected_return_at
            )}
          />

          <DetailItem
            label="Actual Return"
            value={formatDateTime(
              trip?.actual_return_at
            )}
          />

        </div>

      </div>


      {/* ================================================================ */}
      {/* PAYMENT HISTORY */}
      {/* ================================================================ */}

      <div className="rounded-lg border p-4">

        <div className="mb-3 flex items-center justify-between">

          <h2 className="text-sm font-semibold">
            Payment History
          </h2>

          <div className="text-xs text-muted-foreground">

            {payments.length} payment
            {payments.length !== 1
              ? "s"
              : ""}

          </div>

        </div>

        <PaymentTable
          data={payments}
          columns={paymentColumns}
          isLoading={paymentsLoading}
        />

      </div>

    </div>
  );
};


export default InvoiceDetailPage;