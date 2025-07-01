"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Attendee } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { User, Users, ArrowRight } from "lucide-react";

interface EventContextType {
  capacity: number;
  setCapacity: (capacity: number) => void;
  registered: Attendee[];
  queue: Attendee[];
  addAttendee: (name: string, participants: number) => void;
  removeAttendee: (id: string) => void;
  removeQueuedAttendee: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capacity, setCapacityState] = useState(5);
  const [registered, setRegistered] = useState<Attendee[]>([]);
  const [queue, setQueue] = useState<Attendee[]>([]);
  const { toast } = useToast();

  const setCapacity = (newCapacity: number) => {
      setCapacityState(Math.max(0, newCapacity));
  }

  const addAttendee = (name: string, participants: number) => {
    const newAttendees: Attendee[] = [];
    for (let i = 1; i <= participants; i++) {
        let finalName = name;
        if (participants > 1 && i > 1) {
            finalName = `${name} ${i - 1}`;
        }
      
        newAttendees.push({
            name: finalName,
            id: crypto.randomUUID(),
            registeredAt: new Date(),
        })
    }

    const currentRegisteredCount = registered.length;
    const availableSlots = capacity - currentRegisteredCount;
    const toRegister = newAttendees.slice(0, availableSlots);
    const toQueue = newAttendees.slice(availableSlots);

    if (toRegister.length > 0) {
      setRegistered((prev) => [...prev, ...toRegister].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime()));
      toast({
        title: "Success!",
        description: `${toRegister.length} attendee(s) have been registered.`,
      });
    }
    
    if (toQueue.length > 0) {
      setQueue((prev) => [...prev, ...toQueue].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime()));
      toast({
        title: "Event Full",
        description: `${toQueue.length} attendee(s) have been added to the queue.`,
      });
    }
  };

  const removeAttendee = (id: string) => {
    const attendeeToRemove = registered.find(a => a.id === id);
    if (!attendeeToRemove) return;
    
    setRegistered((prev) => prev.filter((attendee) => attendee.id !== id));
    toast({
        title: "Attendee Removed",
        description: `${attendeeToRemove.name} has been removed from the registered list.`,
        variant: "destructive"
    });
  };

  const removeQueuedAttendee = (id: string) => {
    const attendeeToRemove = queue.find(a => a.id === id);
    if (!attendeeToRemove) return;
    
    setQueue((prev) => prev.filter((attendee) => attendee.id !== id));
    toast({
        title: "Attendee Removed from Queue",
        description: `${attendeeToRemove.name} has been removed from the queue.`,
        variant: "destructive"
    });
  };
  
  const processQueue = useCallback(() => {
    if (registered.length < capacity && queue.length > 0) {
      const slotsToFill = capacity - registered.length;
      const toMove = queue.slice(0, slotsToFill);
      const remainingQueue = queue.slice(slotsToFill);
      
      setRegistered(prev => [...prev, ...toMove].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime()));
      setQueue(remainingQueue);

      if (toMove.length === 1) {
        toast({
          title: "Spot Opened Up!",
          description: `${toMove[0].name} has been moved from the queue to the registered list.`,
          action: (
            <div className="flex items-center text-accent-foreground/80">
              <User className="h-4 w-4 mr-2" />
              <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
              <Users className="h-4 w-4" />
            </div>
          ),
        });
      } else if (toMove.length > 1) {
          toast({
              title: "Spots Opened Up!",
              description: `${toMove.length} participants have been moved from the queue to the registered list.`
          })
      }
    }
  }, [capacity, queue, registered, toast]);

  useEffect(() => {
    const timer = setTimeout(() => processQueue(), 300);
    return () => clearTimeout(timer);
  }, [registered, capacity, queue, processQueue]);

  return (
    <EventContext.Provider value={{ capacity, setCapacity, registered, queue, addAttendee, removeAttendee, removeQueuedAttendee }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
