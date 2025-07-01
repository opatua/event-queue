export interface Attendee {
  id: string;
  name: string;
  registeredAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  capacity: number;
  registered: Attendee[];
  queue: Attendee[];
}
