export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  categoryColor: string;
  rruleStr: string;
  rrule: string;
  rruleEnum: string;
  rruleInterval: string;
  rruleCount: string;
  rruleByDay: string;
  hide: string;
  exdateStr: string;
  exdate: string[];
};
