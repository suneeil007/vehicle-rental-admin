import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
    Controller,
    FormProvider,
    useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

const FormField = ({
    ...props
}) => {
    return <Controller {...props} />;
};

const FormItemContext = React.createContext({});

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn("space-y-2", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
});

FormItem.displayName = "FormItem";

const useFormField = () => {
    const fieldContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    if (!fieldContext) {
        throw new Error("useFormField must be used within a <FormItem>");
    }

    const fieldState = getFieldState(fieldContext.name, formState);

    return {
        id: fieldContext.id,
        name: fieldContext.name,
        formItemId: `${fieldContext.id}-form-item`,
        formDescriptionId: `${fieldContext.id}-form-item-description`,
        formMessageId: `${fieldContext.id}-form-item-message`,
        ...fieldState,
    };
};

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && "text-destructive", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});

FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});

FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(
    ({ className, ...props }, ref) => {
        const { formDescriptionId } = useFormField();

        return (
            <p
                ref={ref}
                id={formDescriptionId}
                className={cn(
                    "text-sm text-muted-foreground",
                    className
                )}
                {...props}
            />
        );
    }
);

FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();

    const body = error ? String(error?.message ?? "") : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn(
                "text-sm font-medium text-destructive",
                className
            )}
            {...props}
        >
            {body}
        </p>
    );
});

FormMessage.displayName = "FormMessage";

export {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
};