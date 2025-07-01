"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, User, Users, FileDown, ArrowRight } from "lucide-react"
import { Attendee } from "@/types"
import { AddAttendeeDialog } from "@/components/add-attendee-dialog"
import { AttendeeTable } from "@/components/attendee-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function EventQueueApp() {
  const [capacity, setCapacity] = useState(5)
  const [registered, setRegistered] = useState<Attendee[]>([])
  const [queue, setQueue] = useState<Attendee[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddAttendee = (attendee: Omit<Attendee, "id" | "registeredAt">) => {
    const newAttendee: Attendee = {
      ...attendee,
      id: crypto.randomUUID(),
      registeredAt: new Date(),
    }

    if (registered.length < capacity) {
      setRegistered((prev) => [...prev, newAttendee])
      toast({
        title: "Success!",
        description: `${newAttendee.name} has been registered.`,
      })
    } else {
      setQueue((prev) => [...prev, newAttendee])
      toast({
        title: "Event Full",
        description: `${newAttendee.name} has been added to the queue.`,
      })
    }
    setIsDialogOpen(false)
  }

  const handleRemoveAttendee = (id: string) => {
    const attendeeToRemove = registered.find(a => a.id === id);
    if (!attendeeToRemove) return;
    
    setRegistered((prev) => prev.filter((attendee) => attendee.id !== id))
    toast({
        title: "Attendee Removed",
        description: `${attendeeToRemove.name} has been removed from the registered list.`,
        variant: "destructive"
    })
  }

  const handleExport = () => {
    const headers = ["Name", "Email", "Registered At"]
    const rows = registered.map(att => [
      `"${att.name.replace(/"/g, '""')}"`,
      `"${att.email.replace(/"/g, '""')}"`,
      `"${att.registeredAt.toLocaleString()}"`
    ].join(","))

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "registered_attendees.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: "Export Successful",
      description: "Registered attendees list has been downloaded.",
    })
  }
  
  const processQueue = useCallback(() => {
    if (registered.length < capacity && queue.length > 0) {
      const [nextInQueue, ...remainingQueue] = queue
      setRegistered(prev => [...prev, nextInQueue])
      setQueue(remainingQueue)
      toast({
        title: "Spot Opened Up!",
        description: `${nextInQueue.name} has been moved from the queue to the registered list.`,
        action: (
          <div className="flex items-center text-accent-foreground/80">
            <User className="h-4 w-4 mr-2" />
            <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
            <Users className="h-4 w-4" />
          </div>
        ),
      })
    }
  }, [capacity, queue, registered.length, toast])

  useEffect(() => {
    const timer = setTimeout(() => processQueue(), 300); // Debounce to avoid rapid state changes
    return () => clearTimeout(timer);
  }, [registered, capacity, queue, processQueue])

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 font-body">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground/90">EventQueue</h1>
        <p className="text-muted-foreground mt-2 text-lg">First-Come, First-Served Event Registration</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              onChange={(e) => setCapacity(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="mt-2"
              min="0"
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 flex flex-col justify-center">
           <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-around gap-4">
            <AddAttendeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddAttendee={handleAddAttendee}>
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="mr-2" /> Add Attendee
              </Button>
            </AddAttendeeDialog>
            <Button size="lg" variant="outline" onClick={handleExport} disabled={registered.length === 0} className="w-full sm:w-auto">
              <FileDown className="mr-2" /> Export Registered List
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendee Lists</CardTitle>
          <CardDescription>View registered and queued participants for your event.</CardDescription>
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
                onRemove={handleRemoveAttendee}
                caption="A list of successfully registered attendees."
              />
            </TabsContent>
            <TabsContent value="queue" className="mt-4">
              <AttendeeTable
                attendees={queue}
                caption="A list of participants waiting for a spot."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
