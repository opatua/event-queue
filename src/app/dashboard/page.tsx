"use client"

import Link from "next/link"
import { useEventContext } from "@/context/EventContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Calendar, ArrowRight, ClipboardCopy, Trash2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

export default function DashboardPage() {
  const { events, deleteEvent } = useEventContext()
  const { toast } = useToast()

  const handleShare = (eventId: string) => {
    const url = `${window.location.origin}/events/${eventId}/attendee`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Attendee link has been copied to your clipboard.",
    });
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground/90">EQ Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your events or create a new one.</p>
        </div>
        <Link href="/events/new" passHref>
          <Button size="lg" className="mt-4 sm:mt-0">
            <Plus className="mr-2" /> Create New Event
          </Button>
        </Link>
      </header>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full flex-shrink-0 -mr-2 -mt-2">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete event</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the 
                          <strong className="px-1">{event.name}</strong> 
                          event and all of its associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteEvent(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{format(event.startDateTime, "PPP")}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{format(event.startDateTime, "p")} - {format(event.endDateTime, "p")}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{event.registered.length} / {event.capacity} Registered ({event.queue.length} in queue)</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
                 <Button variant="outline" size="sm" onClick={() => handleShare(event.id)}>
                    <ClipboardCopy className="mr-2"/>
                    Share
                </Button>
                <Link href={`/events/${event.id}`} passHref>
                  <Button size="sm" className="w-full sm:w-auto">
                    Manage Event <ArrowRight className="ml-2"/>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">No events yet!</h2>
          <p className="text-muted-foreground mt-2 mb-4">Get started by creating your first event.</p>
          <Link href="/events/new" passHref>
            <Button>
              <Plus className="mr-2" /> Create New Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
