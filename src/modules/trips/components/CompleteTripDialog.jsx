import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { buildCompleteTripSchema } from "../validation/tripSchema";
import useCompleteTrip from "../hooks/useCompleteTrip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const FUEL_LEVELS = [
    { value: "empty", label: "Empty" },
    { value: "quarter", label: "1/4" },
    { value: "half", label: "1/2" },
    { value: "three_quarter", label: "3/4" },
    { value: "full", label: "Full" },
];

// `trip` is the full Trip resource (needs .slug and .pickup_odometer)
const CompleteTripDialog = ({ trip, open, onOpenChange }) => {
    const completeTrip = useCompleteTrip();

    const form = useForm({
        resolver: zodResolver(
            buildCompleteTripSchema(trip?.pickup_odometer ?? 0)
        ),
        defaultValues: {
            actual_return_at: "",
            return_odometer: trip?.pickup_odometer ?? 0,
            return_fuel: "full",
            extra_km_charge: 0,
            late_return_charge: 0,
            damage_charge: 0,
            fuel_charge: 0,
            return_notes: "",
            damage_notes: "",
        },
    });

    const handleSubmit = (values) => {
        completeTrip.mutate(
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Complete Trip</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        
                        <FormField
                            control={form.control}
                            name="actual_return_at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        Actual Return At
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            className="h-8 text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="return_odometer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Return Odometer (km)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={trip?.pickup_odometer ?? 0}
                                                className="h-8 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="return_fuel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Return Fuel
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="!h-8 w-full text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {FUEL_LEVELS.map((level) => (
                                                    <SelectItem
                                                        key={level.value}
                                                        value={level.value}
                                                    >
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="extra_km_charge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Extra KM Charge
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="h-8 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="late_return_charge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Late Return Charge
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="h-8 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="damage_charge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Damage Charge
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="h-8 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fuel_charge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            Fuel Charge
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="h-8 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="return_notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        Return Notes
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={2}
                                            className="text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="damage_notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        Damage Notes
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={2}
                                            className="text-sm"
                                            {...field}
                                        />
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
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={completeTrip.isPending}
                                className="cursor-pointer bg-green-700 hover:bg-green-800"
                            >
                                {completeTrip.isPending
                                    ? "Completing..."
                                    : "Complete Trip"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CompleteTripDialog;