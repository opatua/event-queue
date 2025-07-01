# **App Name**: EventQueue

## Core Features:

- Set Capacity: Allow the event organizer to define the maximum registration capacity for the event.
- Add Attendee: Add attendees with automatic queueing. If the capacity is not full, add the attendee directly to the registered list; otherwise, add them to the queue. Use in-memory data structures.
- View Lists: View the lists of registered attendees and queued participants, showing relevant information for each (e.g., name, email, time of registration).
- Export to CSV: Generate a CSV file of the registered participants for record-keeping and further analysis.
- Automatic Queue Management: Automatically move participants from the queue to the registered list when spots become available due to cancellations or capacity changes. Use in-memory data structures to manage this.

## Style Guidelines:

- Primary color: Soft, desaturated green (#A7D1AB) to evoke a sense of calm and organization.
- Background color: Off-white (#F5F5F5) to provide a clean, uncluttered backdrop.
- Accent color: A slightly darker, more saturated green (#74B72E) for highlighting key actions and information.
- Body and headline font: 'Inter', a grotesque-style sans-serif font, for a clean, modern, readable appearance in both headlines and body text.
- Use simple, intuitive icons to represent actions like 'add attendee,' 'export,' and 'view list.'
- Maintain a clean, tabular layout for displaying lists of attendees and queue members.
- Use subtle animations, such as a smooth transition when an attendee moves from the queue to the registered list.