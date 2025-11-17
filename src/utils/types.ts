export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  categoryColor: string;
  rruleStr: string;
  rrule: string;
  hide: string;
  exdateStr: string;
  exdate: string[];
};
