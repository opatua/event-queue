"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const attendeeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  participants: z.coerce.number().int().min(1, { message: "Must add at least one participant." }),
})

type AttendeeFormValues = z.infer<typeof attendeeSchema>

interface AddAttendeeDialogProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAttendee: (name: string, participants: number) => void
}

export function AddAttendeeDialog({ children, open, onOpenChange, onAddAttendee }: AddAttendeeDialogProps) {
  const form = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: "",
      participants: 1,
    },
  })

  const onSubmit = (data: AttendeeFormValues) => {
    onAddAttendee(data.name, data.participants)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Attendee(s)</DialogTitle>
          <DialogDescription>
            Enter the attendee's details. They will be registered or added to the queue automatically.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Participants</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Add Attendee(s)</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
