"use client";
import { EventQueueApp } from '@/components/event-queue-app';
import { useEventContext } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EventAttendeePage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { getEventById } = useEventContext();
  const event = getEventById(eventId);

  if (!event) {
     return (
        <div className="container mx-auto text-center p-8">
            <h1 className="text-3xl font-bold">Event Not Found</h1>
            <p className="text-muted-foreground mt-2">The event link seems to be invalid.</p>
             <Link href="/" passHref>
                <Button className="mt-4">View Available Events</Button>
            </Link>
        </div>
    )
  }

  return (
      <EventQueueApp eventId={eventId} isAdmin={false} />
  );
}
