"use client";

import { EventQueueApp } from '@/components/event-queue-app';
import { useEventContext } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

export default function EventAdminPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { getEventById } = useEventContext();
  const event = getEventById(eventId);

  // In a real app, you might fetch this from a DB and show a proper not found page.
  if (!event) {
    return (
        <div className="container mx-auto text-center p-8">
            <h1 className="text-3xl font-bold">Event Not Found</h1>
            <p className="text-muted-foreground mt-2">The event you are looking for does not exist.</p>
            <Link href="/" passHref>
                <Button className="mt-4">Back to Dashboard</Button>
            </Link>
        </div>
    )
  }

  return (
    <EventQueueApp eventId={eventId} isAdmin={true} />
  );
}
