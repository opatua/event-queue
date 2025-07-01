"use client"

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Attendee, Event } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { User, Users, ArrowRight } from "lucide-react";

// Initial mock data for demonstration
const initialEvents: Event[] = [
  {
    id: 'tech-conference-2024',
    name: 'Tech Conference 2024',
    description: 'Annual gathering of the brightest minds in tech.',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 30)),
    capacity: 50,
    registered: [],
    queue: [],
  },
  {
    id: 'local-meetup-bbq',
    name: 'Local Meetup & BBQ',
    description: 'A casual get-together for the local community.',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 7)),
    capacity: 15,
    registered: [],
    queue: [],
  }
];


interface EventContextType {
  events: Event[];
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Omit<Event, 'id' | 'registered' | 'queue'>) => Event;
  deleteEvent: (eventId: string) => void;
  setEventCapacity: (eventId: string, capacity: number) => void;
  addAttendeeToEvent: (eventId: string, name: string, participants: number) => void;
  removeAttendeeFromEvent: (eventId: string, attendeeId: string) => void;
  removeQueuedAttendeeFromEvent: (eventId: string, attendeeId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const { toast } = useToast();

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'registered' | 'queue'>) => {
    const newEvent: Event = {
      ...eventData,
      id: eventData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      registered: [],
      queue: [],
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (eventToDelete) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        toast({
            title: "Event Deleted",
            description: `"${eventToDelete.name}" has been permanently removed.`,
            variant: "destructive"
        });
    }
  };

  const setEventCapacity = (eventId: string, capacity: number) => {
    const event = getEventById(eventId);
    if (!event) return;
    const updatedEvent = { ...event, capacity: Math.max(0, capacity) };
    updateEvent(updatedEvent);
  };

  const addAttendeeToEvent = (eventId: string, name: string, participants: number) => {
    const event = getEventById(eventId);
    if (!event) return;

    const newAttendees: Attendee[] = Array.from({ length: participants }, (_, i) => ({
      name: participants > 1 ? `${name} ${i + 1}` : name,
      id: crypto.randomUUID(),
      registeredAt: new Date(),
    }));

    const availableSlots = event.capacity - event.registered.length;
    const toRegister = newAttendees.slice(0, availableSlots);
    const toQueue = newAttendees.slice(availableSlots);

    const updatedEvent = { ...event };

    if (toRegister.length > 0) {
      updatedEvent.registered = [...updatedEvent.registered, ...toRegister].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime());
      toast({
        title: "Success!",
        description: `${toRegister.length} attendee(s) have been registered for ${event.name}.`,
      });
    }

    if (toQueue.length > 0) {
      updatedEvent.queue = [...updatedEvent.queue, ...toQueue].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime());
      toast({
        title: "Event Full",
        description: `${toQueue.length} attendee(s) have been added to the queue for ${event.name}.`,
      });
    }
    
    updateEvent(updatedEvent);
  };

  const removeAttendeeFromEvent = (eventId: string, attendeeId: string) => {
    const event = getEventById(eventId);
    if (!event) return;

    const attendeeToRemove = event.registered.find(a => a.id === attendeeId);
    if (!attendeeToRemove) return;

    const updatedEvent = {
      ...event,
      registered: event.registered.filter(a => a.id !== attendeeId),
    };
    updateEvent(updatedEvent);

    toast({
        title: "Attendee Removed",
        description: `${attendeeToRemove.name} has been removed from the registered list.`,
        variant: "destructive"
    });
  };

  const removeQueuedAttendeeFromEvent = (eventId: string, attendeeId: string) => {
    const event = getEventById(eventId);
    if (!event) return;
    
    const attendeeToRemove = event.queue.find(a => a.id === attendeeId);
    if (!attendeeToRemove) return;

    const updatedEvent = {
      ...event,
      queue: event.queue.filter(a => a.id !== attendeeId),
    };
    updateEvent(updatedEvent);

    toast({
        title: "Attendee Removed from Queue",
        description: `${attendeeToRemove.name} has been removed from the queue.`,
        variant: "destructive"
    });
  };
  
  const processQueues = useCallback(() => {
    events.forEach(event => {
      if (event.registered.length < event.capacity && event.queue.length > 0) {
        const slotsToFill = event.capacity - event.registered.length;
        const toMove = event.queue.slice(0, slotsToFill);
        
        if (toMove.length > 0) {
            const updatedEvent = {...event};
            updatedEvent.registered = [...updatedEvent.registered, ...toMove].sort((a,b) => a.registeredAt.getTime() - b.registeredAt.getTime());
            updatedEvent.queue = updatedEvent.queue.slice(toMove.length);
            
            updateEvent(updatedEvent);

            if (toMove.length === 1) {
              toast({
                title: "Spot Opened Up!",
                description: `${toMove[0].name} has been registered for ${event.name}.`,
                action: (
                  <div className="flex items-center text-accent-foreground/80">
                    <User className="h-4 w-4 mr-2" />
                    <ArrowRight className="h-4 w-4 mr-2 text-green-400" />
                    <Users className="h-4 w-4" />
                  </div>
                ),
              });
            } else {
                toast({
                    title: "Spots Opened Up!",
                    description: `${toMove.length} participants from the queue have been registered for ${event.name}.`
                })
            }
        }
      }
    });
  }, [events, toast]);

  useEffect(() => {
    const timer = setTimeout(() => processQueues(), 300);
    return () => clearTimeout(timer);
  }, [events, processQueues]);

  return (
    <EventContext.Provider value={{ events, getEventById, addEvent, deleteEvent, setEventCapacity, addAttendeeToEvent, removeAttendeeFromEvent, removeQueuedAttendeeFromEvent }}>
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
