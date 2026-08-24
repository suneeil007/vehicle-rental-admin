import { useParams } from "react-router-dom";
import { useInvoice } from "../hooks/useInvoice";
import { InvoiceStatusBadge } from "../components/InvoiceStatusBadge";
// Cross-module import (relative path, per project convention)
import { usePaymentsByTrip } from "../../payments/hooks/usePaymentsByTrip";
import { PaymentColumns } from "../../payments/components/PaymentColumns";
import { PaymentTable } from "../../payments/components/PaymentTable";

const LineItem = ({ label, value, muted }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
    <span className={muted ? "text-muted-foreground" : "font-medium"}>
      NPR {Number(value).toLocaleString()}
    </span>
  </div>
);

export const InvoiceDetailPage = () => {
  const { slug } = useParams();
  const { data: invoice, isLoading } = useInvoice(slug);

  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentsByTrip(
    invoice?.trip?.slug
  );

  const paymentColumns = PaymentColumns({});

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Invoice not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{invoice.invoice_number}</h1>
          <p className="text-sm text-muted-foreground">
            Issued {new Date(invoice.invoice_date).toLocaleDateString()} · Due{" "}
            {new Date(invoice.due_date).toLocaleDateString()}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-semibold">Customer</h2>
          <p className="text-sm">{invoice.customer?.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.customer?.email}</p>
          <p className="text-sm text-muted-foreground">{invoice.customer?.phone}</p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-semibold">Trip</h2>
          <p className="text-sm capitalize">
            Status: {invoice.trip?.status?.replace("_", " ") ?? "—"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Charge Breakdown</h2>
        <LineItem label="Subtotal" value={invoice.subtotal} muted />
        <LineItem label="Extra KM Charge" value={invoice.extra_km_charge} muted />
        <LineItem label="Late Return Charge" value={invoice.late_return_charge} muted />
        <LineItem label="Damage Charge" value={invoice.damage_charge} muted />
        <LineItem label="Fuel Charge" value={invoice.fuel_charge} muted />
        <LineItem label="Discount" value={`-${invoice.discount_amount}`} muted />
        <LineItem label="Tax" value={invoice.tax_amount} muted />
        <hr className="my-2" />
        <LineItem label="Total Amount" value={invoice.total_amount} />
        <LineItem label="Paid Amount" value={invoice.paid_amount} />
        <LineItem label="Due Amount" value={invoice.due_amount} />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Payment History</h2>
        <PaymentTable
          data={paymentsData?.data ?? paymentsData ?? []}
          columns={paymentColumns}
          isLoading={paymentsLoading}
        />
      </div>
    </div>
  );
};

export default InvoiceDetailPage;