"use client"

import { useState } from "react"
import { Plus, Users, FileDown, Calendar, ClipboardCopy } from "lucide-react"
import { useEventContext } from "@/context/EventContext"
import { AddAttendeeDialog } from "@/components/add-attendee-dialog"
import { AttendeeTable } from "@/components/attendee-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"

interface EventQueueAppProps {
  eventId: string;
  isAdmin?: boolean;
}

export function EventQueueApp({ eventId, isAdmin = false }: EventQueueAppProps) {
  const { getEventById, setEventCapacity, addAttendeeToEvent, removeAttendeeFromEvent, removeQueuedAttendeeFromEvent } = useEventContext()
  const event = getEventById(eventId)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddAttendee = (name: string, participants: number) => {
    addAttendeeToEvent(eventId, name, participants)
    setIsDialogOpen(false)
  }

  const handleExport = () => {
    if (!event) return;
    const headers = ["Name", "Registered At"]
    const rows = event.registered.map(att => [
      `"${att.name.replace(/"/g, '""')}"`,
      `"${att.registeredAt.toLocaleString()}"`
    ].join(","))

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${event.id}_registered_attendees.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: "Export Successful",
      description: "Registered attendees list has been downloaded.",
    })
  }

  const handleShare = () => {
    const url = `${window.location.origin}/events/${eventId}/attendee`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Attendee link has been copied to your clipboard.",
    });
  };

  if (!event) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card><CardHeader><Skeleton className="h-24" /></CardHeader></Card>
            <Card className="md:col-span-2"><CardHeader><Skeleton className="h-24" /></CardHeader></Card>
        </div>
        <Card><CardContent className="pt-6"><Skeleton className="h-64" /></CardContent></Card>
      </div>
    )
  }
  
  const { name, description, dateTime, capacity, registered, queue } = event;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 font-body">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground/90">{name}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{description}</p>
        <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{dateTime.toLocaleString()}</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 text-primary" /> Event Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="capacity">Max Registrations</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setEventCapacity(eventId, parseInt(e.target.value, 10) || 0)}
                  className="mt-2"
                  min="0"
                />
              </CardContent>
            </Card>
          )}

          <Card className={isAdmin ? "md:col-span-2 flex flex-col justify-center" : "md:col-span-3 flex flex-col justify-center"}>
             <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-around gap-4">
              <AddAttendeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddAttendee={handleAddAttendee}>
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="mr-2" /> Add Attendee(s)
                </Button>
              </AddAttendeeDialog>
              {isAdmin && (
                <>
                  <Button size="lg" variant="outline" onClick={handleExport} disabled={registered.length === 0} className="w-full sm:w-auto">
                    <FileDown className="mr-2" /> Export List
                  </Button>
                   <Button size="lg" variant="outline" onClick={handleShare} className="w-full sm:w-auto">
                    <ClipboardCopy className="mr-2" /> Share Link
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

      <Card>
        <CardHeader>
            <div>
                <CardTitle>Attendee Lists</CardTitle>
                <CardDescription>View registered and queued participants for your event.</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="registered">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registered">Registered ({registered.length}/{capacity})</TabsTrigger>
              <TabsTrigger value="queue">Queue ({queue.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="registered" className="mt-4">
              <AttendeeTable
                attendees={registered}
                onRemove={isAdmin ? (id) => removeAttendeeFromEvent(eventId, id) : undefined}
                caption="A list of successfully registered attendees."
              />
            </TabsContent>
            <TabsContent value="queue" className="mt-4">
              <AttendeeTable
                attendees={queue}
                onRemove={isAdmin ? (id) => removeQueuedAttendeeFromEvent(eventId, id) : undefined}
                caption="A list of participants waiting for a spot."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
