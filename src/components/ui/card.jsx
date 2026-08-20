import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
            className
        )}
        {...props}
    />
));

Card.displayName = "Card";

const CardHeader = React.forwardRef(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-4",
                className
            )}
            {...props}
        />
    )
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                "text-sm font-semibold uppercase tracking-wide text-slate-700",
                className
            )}
            {...props}
        />
    )
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "mt-1 text-xs text-slate-500",
                className
            )}
            {...props}
        />
    )
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "p-5",
                className
            )}
            {...props}
        />
    )
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "border-t border-slate-100 bg-slate-50/40 px-5 py-3",
                className
            )}
            {...props}
        />
    )
);

CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};