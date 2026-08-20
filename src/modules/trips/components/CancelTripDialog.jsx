import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cancelTripSchema } from "../validation/tripSchema";
import useCancelTrip from "../hooks/useCancelTrip";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cancel Trip</DialogTitle>
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
                                    <FormLabel>Cancellation Reason</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={cancelTrip.isPending}
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
