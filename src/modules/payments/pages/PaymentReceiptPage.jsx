import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Download,
    Printer,
    MapPin,
    CalendarDays,
    User,
    CreditCard,
    Car,
    FileText,
} from "lucide-react";

import { usePayment } from "../hooks/usePayment";

/* =========================================================
   FORMAT AMOUNT
========================================================= */

const formatAmount = (amount) =>
    Number(amount ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/* =========================================================
   CALCULATE DURATION
========================================================= */

const calculateDuration = (start, end) => {
    if (!start || !end) {
        return "—";
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const difference = endDate - startDate;

    if (difference <= 0) {
        return "—";
    }

    const totalMinutes = Math.floor(
        difference / (1000 * 60)
    );

    const days = Math.floor(
        totalMinutes / (60 * 24)
    );

    const hours = Math.floor(
        (totalMinutes % (60 * 24)) / 60
    );

    const minutes = totalMinutes % 60;

    const parts = [];

    if (days > 0) {
        parts.push(
            `${days} day${days > 1 ? "s" : ""}`
        );
    }

    if (hours > 0) {
        parts.push(
            `${hours} hour${hours > 1 ? "s" : ""}`
        );
    }

    if (minutes > 0) {
        parts.push(
            `${minutes} minute${minutes > 1 ? "s" : ""}`
        );
    }

    return parts.length
        ? parts.join(", ")
        : "Less than 1 minute";
};

/* =========================================================
   PDF-SAFE CLONE

   html2canvas/html2pdf cannot parse OKLCH colors.
   Tailwind/shadcn may generate colors using oklch().
   This function forces all relevant colors to standard
   RGB/HEX colors before html2canvas processes the clone.
========================================================= */

const createPdfSafeClone = (source) => {
    const clone = source.cloneNode(true);

    /* -------------------------------------------------------
       Remove problematic classes
    ------------------------------------------------------- */

    clone.querySelectorAll("*").forEach((element) => {
        element.classList.remove("print:hidden");
        element.classList.remove("print\\:hidden");

        /* ---------------------------------------------------
           Remove CSS variables that may contain OKLCH
        --------------------------------------------------- */

        if (element.style) {
            const style = element.getAttribute("style");

            if (style && style.toLowerCase().includes("oklch")) {
                element.removeAttribute("style");
            }
        }
    });

    /* -------------------------------------------------------
       Force safe colors on receipt elements
    ------------------------------------------------------- */

    const allElements = [
        clone,
        ...clone.querySelectorAll("*"),
    ];

    allElements.forEach((element) => {
        if (!element || !element.style) {
            return;
        }

        /*
         * We deliberately use standard RGB/HEX colors.
         * html2canvas understands these reliably.
         */

        const tagName =
            element.tagName?.toLowerCase();

        /* -----------------------------------------------
           Default text
        ----------------------------------------------- */

        element.style.color = "#0f172a";

        /* -----------------------------------------------
           Background
        ----------------------------------------------- */

        element.style.backgroundColor =
            "#ffffff";

        /* -----------------------------------------------
           Borders
        ----------------------------------------------- */

        element.style.borderColor =
            "#e2e8f0";

        element.style.borderTopColor =
            "#e2e8f0";

        element.style.borderRightColor =
            "#e2e8f0";

        element.style.borderBottomColor =
            "#e2e8f0";

        element.style.borderLeftColor =
            "#e2e8f0";

        element.style.outlineColor =
            "transparent";

        /* -----------------------------------------------
           Preserve useful colors based on classes
        ----------------------------------------------- */

        const classes =
            typeof element.className === "string"
                ? element.className
                : "";

        /* BLUE */

        if (
            classes.includes("bg-blue-600")
        ) {
            element.style.backgroundColor =
                "#2563eb";

            element.style.color =
                "#ffffff";
        }

        if (
            classes.includes("bg-blue-700")
        ) {
            element.style.backgroundColor =
                "#1d4ed8";
        }

        if (
            classes.includes("bg-blue-50")
        ) {
            element.style.backgroundColor =
                "#eff6ff";
        }

        if (
            classes.includes("border-blue-100")
        ) {
            element.style.borderColor =
                "#dbeafe";
        }

        if (
            classes.includes("text-blue-600")
        ) {
            element.style.color =
                "#2563eb";
        }

        if (
            classes.includes("text-blue-700")
        ) {
            element.style.color =
                "#1d4ed8";
        }

        /* SLATE */

        if (
            classes.includes("bg-slate-50")
        ) {
            element.style.backgroundColor =
                "#f8fafc";
        }

        if (
            classes.includes("bg-slate-100")
        ) {
            element.style.backgroundColor =
                "#f1f5f9";
        }

        if (
            classes.includes("text-slate-900")
        ) {
            element.style.color =
                "#0f172a";
        }

        if (
            classes.includes("text-slate-800")
        ) {
            element.style.color =
                "#1e293b";
        }

        if (
            classes.includes("text-slate-700")
        ) {
            element.style.color =
                "#334155";
        }

        if (
            classes.includes("text-slate-600")
        ) {
            element.style.color =
                "#475569";
        }

        if (
            classes.includes("text-slate-500")
        ) {
            element.style.color =
                "#64748b";
        }

        if (
            classes.includes("text-slate-400")
        ) {
            element.style.color =
                "#94a3b8";
        }

        if (
            classes.includes("border-slate-200")
        ) {
            element.style.borderColor =
                "#e2e8f0";
        }

        if (
            classes.includes("border-slate-100")
        ) {
            element.style.borderColor =
                "#f1f5f9";
        }

        /* GREEN */

        if (
            classes.includes("bg-emerald-50")
        ) {
            element.style.backgroundColor =
                "#ecfdf5";
        }

        if (
            classes.includes("text-emerald-600")
        ) {
            element.style.color =
                "#059669";
        }

        /* AMBER */

        if (
            classes.includes("bg-amber-50")
        ) {
            element.style.backgroundColor =
                "#fffbeb";
        }

        if (
            classes.includes("text-amber-700")
        ) {
            element.style.color =
                "#b45309";
        }

        /* WHITE */

        if (
            classes.includes("text-white")
        ) {
            element.style.color =
                "#ffffff";
        }

        /* ------------------------------------------------
           SVG colors
        ------------------------------------------------ */

        if (tagName === "svg") {
            element.style.color =
                "#64748b";
        }

        if (tagName === "path") {
            element.style.stroke =
                "currentColor";
        }

        /* ------------------------------------------------
           Remove shadows
        ------------------------------------------------ */

        element.style.boxShadow =
            "none";

        element.style.textShadow =
            "none";

        /* ------------------------------------------------
           Remove filters
        ------------------------------------------------ */

        element.style.filter =
            "none";

        /* ------------------------------------------------
           Remove transforms
        ------------------------------------------------ */

        element.style.transform =
            "none";
    });

    return clone;
};

/* =========================================================
   PAYMENT RECEIPT PAGE
========================================================= */

const PaymentReceiptPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const receiptRef = useRef(null);

    /* =====================================================
       PAYMENT
    ===================================================== */

    const {
        data,
        isLoading,
        isError,
    } = usePayment(slug);

    const payment =
        data?.data ?? data;

    /* =====================================================
       PRINT
    ===================================================== */

    const handlePrint = () => {
        window.print();
    };

    /* =====================================================
       DOWNLOAD PDF
    ===================================================== */

    const handleDownload = async () => {
    if (!receiptRef.current || !payment) {
        return;
    }

    const receiptNumber =
        payment.transaction_reference ||
        payment.slug ||
        "payment-receipt";

    try {
        const canvas = await html2canvas(receiptRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        const pdf = new jsPDF({
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 8;

        const usableWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * usableWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + margin;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight);
            heightLeft -= (pageHeight - margin * 2);
        }

        pdf.save(`${receiptNumber}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Unable to generate PDF. Please try again.");
    }
};
    /* =====================================================
       LOADING
    ===================================================== */

    if (isLoading) {
        return (
            <div className="py-10 text-center text-sm text-muted-foreground">
                Loading receipt...
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (isError || !payment) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                Payment receipt could not be loaded.
            </div>
        );
    }

    /* =====================================================
       TRIP
    ===================================================== */

    const trip =
        payment.trip;

    /* =====================================================
       CUSTOMER
    ===================================================== */

    const customer =
        trip?.customer ||
        payment.booking?.customer ||
        null;

    /* =====================================================
       VEHICLE
    ===================================================== */

    const vehicle =
        trip?.vehicle ||
        payment.booking?.vehicle ||
        null;

    /* =====================================================
       PAYMENT SUMMARY
    ===================================================== */

    const paymentSummary =
        payment.payment_summary || {};

    const tripTotal =
        Number(
            paymentSummary.trip_total ??
            trip?.total_amount ??
            0
        );

    const totalPaid =
        Number(
            paymentSummary.total_paid ??
            0
        );

    const remainingDue =
        Number(
            paymentSummary.remaining_due ??
            Math.max(
                0,
                tripTotal - totalPaid
            )
        );

    const isFullyPaid =
        remainingDue <= 0;

    /* =====================================================
       DURATION
    ===================================================== */

    const duration =
        calculateDuration(
            trip?.pickup_at,
            trip?.actual_return_at ||
                trip?.expected_return_at
        );

    /* =====================================================
       LOCATION
    ===================================================== */

    const pickupLocation =
        trip?.pickup_location ||
        trip?.pickup_branch?.name ||
        "—";

    const dropLocation =
        trip?.drop_location ||
        trip?.drop_branch?.name ||
        "—";

    /* =====================================================
       RECEIPT NUMBER
    ===================================================== */

    const receiptNumber =
        payment.transaction_reference ||
        payment.slug ||
        "—";

    /* =====================================================
       PAYMENT METHOD
    ===================================================== */

    const paymentMethod =
        payment.payment_method
            ?.replaceAll("_", " ") ||
        "—";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
                payment-receipt-page
                min-h-screen
                bg-slate-100
                p-6
                print:min-h-0
                print:bg-white
                print:p-0
            "
        >

            {/* =================================================
                ACTION BAR
            ================================================= */}

            <div
                className="
                    mx-auto
                    mb-4
                    flex
                    max-w-3xl
                    items-center
                    justify-between
                    print:hidden
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-md
                        border
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                        hover:bg-slate-50
                    "
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back
                </button>

                <div className="flex items-center gap-2">

                    {/* DOWNLOAD */}

                    <button
                        type="button"
                        onClick={
                            handleDownload
                        }
                        className="
                            inline-flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-md
                            bg-blue-600
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        <Download className="h-4 w-4" />

                        Download
                    </button>

                    {/* PRINT */}

                    <button
                        type="button"
                        onClick={
                            handlePrint
                        }
                        className="
                            inline-flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-md
                            border
                            bg-white
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-50
                        "
                    >
                        <Printer className="h-4 w-4" />

                        Print
                    </button>

                </div>
            </div>

            {/* =================================================
                RECEIPT
            ================================================= */}

            <div
                ref={receiptRef}
                className="
                    payment-receipt
                    mx-auto
                    max-w-3xl
                    overflow-hidden
                    bg-white
                    shadow-sm
                    print:max-w-none
                    print:shadow-none
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-200
                        px-8
                        py-6
                        print:px-0
                        print:py-3
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-6
                        "
                    >

                        {/* COMPANY */}

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-600
                                        text-white
                                        print:h-8
                                        print:w-8
                                    "
                                >
                                    <Car className="h-5 w-5" />
                                </div>

                                <div>

                                    <h1
                                        className="
                                            text-xl
                                            font-bold
                                            tracking-tight
                                            text-slate-900
                                            print:text-lg
                                        "
                                    >
                                        VEHICLE RENTAL
                                    </h1>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Vehicle Rental Management
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* RECEIPT */}

                        <div className="text-right">

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
                            >
                                Payment Receipt
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {receiptNumber}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    text-slate-500
                                "
                            >
                                {formatDate(
                                    payment.paid_at
                                )}
                            </p>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    className="
                        px-8
                        py-5
                        print:px-0
                        print:py-3
                    "
                >

                    {/* =================================================
                        CUSTOMER + PAYMENT
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        {/* CUSTOMER */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-slate-200
                                p-4
                                print:p-3
                            "
                        >

                            <h2
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-700
                                "
                            >
                                <User className="h-4 w-4 text-slate-500" />

                                Customer
                            </h2>

                            <div className="space-y-2">

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Name
                                    </p>

                                    <p className="text-sm font-semibold text-slate-900">
                                        {customer?.name ||
                                            "—"}
                                    </p>

                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    <div>

                                        <p className="text-[10px] text-slate-400">
                                            Phone
                                        </p>

                                        <p className="text-xs font-medium text-slate-700">
                                            {customer?.phone ||
                                                "—"}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-[10px] text-slate-400">
                                            Email
                                        </p>

                                        <p className="truncate text-xs font-medium text-slate-700">
                                            {customer?.email ||
                                                "—"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* PAYMENT */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-slate-200
                                p-4
                                print:p-3
                            "
                        >

                            <h2
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-700
                                "
                            >
                                <CreditCard className="h-4 w-4 text-slate-500" />

                                Payment
                            </h2>

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-x-4
                                    gap-y-2
                                "
                            >

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Method
                                    </p>

                                    <p className="text-xs font-semibold capitalize text-slate-800">
                                        {paymentMethod}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Type
                                    </p>

                                    <p className="text-xs font-semibold capitalize text-slate-800">
                                        {payment.type ||
                                            "—"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Status
                                    </p>

                                    <p className="text-xs font-semibold uppercase text-emerald-600">
                                        {payment.status ||
                                            "—"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Reference
                                    </p>

                                    <p className="truncate text-xs font-medium text-slate-700">
                                        {payment.transaction_reference ||
                                            "—"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        TRIP INFORMATION
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            rounded-lg
                            border
                            border-slate-200
                            p-4
                            print:p-3
                        "
                    >

                        <h2
                            className="
                                mb-3
                                flex
                                items-center
                                gap-2
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-700
                            "
                        >
                            <MapPin className="h-4 w-4 text-slate-500" />

                            Trip Information
                        </h2>

                        {/* VEHICLE */}

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                                rounded-md
                                bg-slate-50
                                px-3
                                py-2
                            "
                        >

                            <div className="flex items-center gap-2">

                                <Car className="h-4 w-4 text-slate-500" />

                                <div>

                                    <p className="text-[10px] text-slate-400">
                                        Vehicle
                                    </p>

                                    <p className="text-sm font-semibold text-slate-900">
                                        {vehicle?.name ||
                                            trip?.vehicle_name ||
                                            "—"}
                                    </p>

                                </div>

                            </div>

                            {vehicle?.registration_number && (
                                <p
                                    className="
                                        text-[11px]
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    {
                                        vehicle.registration_number
                                    }
                                </p>
                            )}

                        </div>

                        {/* LOCATIONS */}

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Pickup Location
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-800">
                                    {pickupLocation}
                                </p>

                            </div>

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Drop Location
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-800">
                                    {dropLocation}
                                </p>

                            </div>

                        </div>

                        {/* DATES */}

                        <div
                            className="
                                mt-3
                                grid
                                grid-cols-3
                                gap-4
                                border-t
                                border-slate-100
                                pt-3
                            "
                        >

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Pickup At
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-800">
                                    {formatDate(
                                        trip?.pickup_at
                                    )}
                                </p>

                            </div>

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Expected Return
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-800">
                                    {formatDate(
                                        trip?.expected_return_at
                                    )}
                                </p>

                            </div>

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Actual Return
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-800">
                                    {formatDate(
                                        trip?.actual_return_at
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* DURATION */}

                        <div
                            className="
                                mt-3
                                flex
                                items-center
                                gap-2
                                border-t
                                border-slate-100
                                pt-3
                            "
                        >

                            <CalendarDays className="h-4 w-4 text-slate-500" />

                            <div>

                                <p className="text-[10px] text-slate-400">
                                    Trip Duration
                                </p>

                                <p className="text-xs font-semibold text-slate-800">
                                    {duration}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        PAYMENT SUMMARY
                    ================================================= */}

                    <div className="mt-4">

                        <div
                            className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-slate-200
                            "
                        >

                            {/* TRIP TOTAL */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-slate-200
                                    px-4
                                    py-2.5
                                "
                            >

                                <span className="text-xs text-slate-600">
                                    Trip Total
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    NPR{" "}
                                    {formatAmount(
                                        tripTotal
                                    )}
                                </span>

                            </div>

                            {/* TOTAL PAID */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-slate-200
                                    px-4
                                    py-2.5
                                "
                            >

                                <span className="text-xs text-slate-600">
                                    Total Paid
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    NPR{" "}
                                    {formatAmount(
                                        totalPaid
                                    )}
                                </span>

                            </div>

                            {/* DUE */}

                            <div
                                className={`
                                    flex
                                    items-center
                                    justify-between
                                    px-4
                                    py-3
                                    ${
                                        isFullyPaid
                                            ? "bg-emerald-50"
                                            : "bg-amber-50"
                                    }
                                `}
                            >

                                <div>

                                    <p className="text-xs font-semibold text-slate-700">
                                        {isFullyPaid
                                            ? "Payment Status"
                                            : "Remaining Due"}
                                    </p>

                                    {!isFullyPaid && (
                                        <p className="mt-0.5 text-[10px] text-amber-700">
                                            Outstanding balance
                                        </p>
                                    )}

                                </div>

                                {isFullyPaid ? (
                                    <span
                                        className="
                                            text-sm
                                            font-bold
                                            text-emerald-600
                                        "
                                    >
                                        FULLY PAID
                                    </span>
                                ) : (
                                    <span
                                        className="
                                            text-base
                                            font-bold
                                            text-amber-700
                                        "
                                    >
                                        NPR{" "}
                                        {formatAmount(
                                            remainingDue
                                        )}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        CURRENT PAYMENT
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            rounded-lg
                            border-2
                            border-blue-100
                            bg-blue-50
                            px-5
                            py-4
                            print:px-4
                            print:py-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-blue-600
                                    "
                                >
                                    This Payment
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Amount received
                                </p>

                            </div>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-blue-700
                                "
                            >
                                NPR{" "}
                                {formatAmount(
                                    payment.amount
                                )}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        NOTES
                    ================================================= */}

                    {payment.notes && (
                        <div
                            className="
                                mt-4
                                rounded-lg
                                border
                                border-slate-200
                                px-4
                                py-3
                            "
                        >

                            <div className="flex items-start gap-2">

                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                <div>

                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Notes
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-700
                                        "
                                    >
                                        {payment.notes}
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            border-t
                            border-slate-200
                            pt-4
                            text-center
                            print:mt-3
                            print:pt-3
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-medium
                                text-slate-600
                            "
                        >
                            Thank you for your payment.
                        </p>

                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-slate-400
                            "
                        >
                            This is a computer-generated receipt and does not require a signature.
                        </p>

                    </div>

                </div>

            </div>

            {/* =====================================================
                PRINT CSS
            ===================================================== */}

            <style>
                {`
                    @media print {

                        @page {
                            size: A4 portrait;
                            margin: 8mm;
                        }

                        html,
                        body {
                            width: 100% !important;
                            min-width: 0 !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: #ffffff !important;
                        }

                        body {
                            overflow: visible !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        body * {
                            visibility: hidden !important;
                        }

                        .payment-receipt,
                        .payment-receipt * {
                            visibility: visible !important;
                        }

                        .payment-receipt-page {
                            position: static !important;
                            display: block !important;
                            width: 100vw !important;
                            min-width: 0 !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            transform: none !important;
                            background: #ffffff !important;
                        }

                        .payment-receipt {
                            position: absolute !important;
                            top: 0 !important;
                            left: 0 !important;
                            width: 100vw !important;
                            min-width: 0 !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            transform: none !important;
                            background: #ffffff !important;
                            box-shadow: none !important;
                            border: none !important;
                        }

                        .payment-receipt-page,
                        .payment-receipt-page > *,
                        .payment-receipt {
                            float: none !important;
                        }

                        button,
                        .print\\\\:hidden {
                            display: none !important;
                        }

                        .payment-receipt > * {
                            width: 100% !important;
                            max-width: none !important;
                        }

                        .payment-receipt h1 {
                            font-size: 21px !important;
                            line-height: 1.2 !important;
                        }

                        .payment-receipt h2 {
                            font-size: 12px !important;
                            line-height: 1.2 !important;
                        }

                        .payment-receipt p {
                            line-height: 1.25 !important;
                        }

                        .payment-receipt .mt-10 {
                            margin-top: 12px !important;
                        }

                        .payment-receipt .mt-6 {
                            margin-top: 10px !important;
                        }

                        .payment-receipt .mt-4 {
                            margin-top: 8px !important;
                        }

                        .payment-receipt .mt-1 {
                            margin-top: 2px !important;
                        }

                        .payment-receipt .mb-4 {
                            margin-bottom: 8px !important;
                        }

                        .payment-receipt .p-4 {
                            padding: 9px !important;
                        }

                        .payment-receipt .p-8 {
                            padding: 0 !important;
                        }

                        .payment-receipt .px-4 {
                            padding-left: 10px !important;
                            padding-right: 10px !important;
                        }

                        .payment-receipt .py-4 {
                            padding-top: 9px !important;
                            padding-bottom: 9px !important;
                        }

                        .payment-receipt .py-3 {
                            padding-top: 7px !important;
                            padding-bottom: 7px !important;
                        }

                        .payment-receipt > div,
                        .payment-receipt .rounded-lg {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }

                        .payment-receipt {
                            box-shadow: none !important;
                        }

                        .payment-receipt-page,
                        .payment-receipt {
                            overflow: visible !important;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default PaymentReceiptPage;