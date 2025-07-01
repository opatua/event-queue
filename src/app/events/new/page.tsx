import { CreateEventForm } from "@/components/create-event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEventPage() {
    return (
        <div className="container mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Create a New Event</CardTitle>
                    <CardDescription>Fill out the details below to set up your new event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateEventForm />
                </CardContent>
            </Card>
        </div>
    )
}
