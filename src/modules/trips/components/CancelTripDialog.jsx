import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";

import { cancelTripSchema } from "../validation/tripSchema";
import useCancelTrip from "../hooks/useCancelTrip";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// `trip` here only needs .slug
const CancelTripDialog = ({ trip, open, onOpenChange }) => {
    const cancelTrip = useCancelTrip();

    const form = useForm({
        resolver: zodResolver(cancelTripSchema),
        defaultValues: { reason: "" },
    });

    const reasonValue = form.watch("reason") ?? "";

    const handleSubmit = (values) => {
        cancelTrip.mutate(
            { trip: trip.slug, ...values },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            }
        );
    };

    const handleOpenChange = (nextOpen) => {
        if (!nextOpen) {
            form.reset();
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>

                        <div className="space-y-1">
                            <DialogTitle>Cancel Trip</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. The trip will
                                be marked as cancelled and removed from the
                                active schedule.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline justify-between">
                                        <FormLabel>
                                            Cancellation Reason
                                        </FormLabel>
                                        <span className="text-xs text-muted-foreground">
                                            {reasonValue.length}/500
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            rows={4}
                                            maxLength={500}
                                            placeholder="Let us know why this trip is being cancelled..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => handleOpenChange(false)}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={cancelTrip.isPending}
                                className="cursor-pointer"
                            >
                                {cancelTrip.isPending
                                    ? "Cancelling..."
                                    : "Cancel Trip"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CancelTripDialog;