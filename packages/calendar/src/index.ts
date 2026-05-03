export type TimeSlot = {
  startsAt: string;
  endsAt: string;
};

export interface CalendarProvider {
  listBusyTimes(input: { from: string; to: string }): Promise<TimeSlot[]>;
  createEvent(input: { startsAt: string; endsAt: string; title: string; attendees?: string[] }): Promise<{ id: string }>;
}
