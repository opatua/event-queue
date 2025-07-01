"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { useEventContext } from "@/context/EventContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/types"

const eventFormSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  date: z.date({ required_error: "A date is required." }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format. Use HH:MM." }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format. Use HH:MM." }),
  capacity: z.coerce.number().int().min(1, { message: "Capacity must be at least 1." }),
}).refine(data => {
    if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
    }
    return true;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
});


type EventFormValues = z.infer<typeof eventFormSchema>

export function CreateEventForm() {
  const router = useRouter()
  const { addEvent } = useEventContext()
  const { toast } = useToast()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startTime: "10:00",
      endTime: "11:00",
      capacity: 50,
    },
  })

  const onSubmit = (data: EventFormValues) => {
    const [startHours, startMinutes] = data.startTime.split(':').map(Number)
    const startDateTime = new Date(data.date)
    startDateTime.setHours(startHours, startMinutes)

    const [endHours, endMinutes] = data.endTime.split(':').map(Number)
    const endDateTime = new Date(data.date)
    endDateTime.setHours(endHours, endMinutes)


    const eventData: Omit<Event, 'id' | 'registered' | 'queue'> = {
      name: data.name,
      description: data.description,
      startDateTime,
      endDateTime,
      capacity: data.capacity,
    }

    const newEvent = addEvent(eventData)
    
    toast({
      title: "Event Created!",
      description: `Successfully created "${newEvent.name}".`,
    })

    router.push(`/events/${newEvent.id}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Tech Conference" {...field} />
              </FormControl>
              <FormDescription>This is the public name of your event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your event..." className="resize-y" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormDescription>The maximum number of attendees that can be registered.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">Create Event</Button>
      </form>
    </Form>
  )
}
