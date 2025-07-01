"use client"

import { Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import type { Attendee } from "@/types"

interface AttendeeTableProps {
  attendees: Attendee[]
  onRemove?: (id: string) => void
  caption: string
}

export function AttendeeTable({ attendees, onRemove, caption }: AttendeeTableProps) {
  if (attendees.length === 0) {
    const emptyMessage = caption.startsWith("A list of successfully registered") 
      ? "No attendees have registered yet." 
      : "The queue is currently empty.";
    return <p className="text-center text-muted-foreground py-12">{emptyMessage}</p>
  }

  const isRegisteredTable = caption.includes("registered");
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableCaption className="py-4">{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Registration Time</TableHead>
            {onRemove && <TableHead className="text-right w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((attendee, index) => (
            <TableRow key={attendee.id} className="transition-all hover:bg-primary/10">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{attendee.name}</TableCell>
              <TableCell>{attendee.registeredAt.toLocaleString()}</TableCell>
              {onRemove && (
                <TableCell className="text-right">
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {attendee.name}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove <strong>{attendee.name}</strong> from the {isRegisteredTable ? "registered list" : "queue"}.
                          {isRegisteredTable && " If there are participants in the queue, the first one will take this spot."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onRemove(attendee.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
