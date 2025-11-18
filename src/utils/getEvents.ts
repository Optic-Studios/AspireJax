import { rrulestr } from 'rrule';

import { Event } from './types';

export function getEvents() {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');
  const events = [...scripts].map((script) => {
    if (!script.textContent) {
      return;
    }
    const event: Event = JSON.parse(script.textContent);
    event.start = new Date(event.start);
    event.end = new Date(event.end);

    event.allDay = event.start.getHours() === 0 && event.start.getMinutes() === 0;

    // Build RRULE
    const rrule = buildRRule(event);
    if (rrule) {
      event.rrule = rrule;
    }

    if (event.exdateStr) {
      event.exdate = event.exdateStr
        .split(',')
        .map((date) => formatDateToYYYYMMDDD(new Date(date)));
    }

    return event;
  });

  console.log(events);

  const filteredEvents = events.filter((event) => event && event.hide !== 'true');

  return filteredEvents;
}

function formatDateToISO8601(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function formatDateToYYYYMMDDD(date: {
  getUTCFullYear: () => any;
  getUTCMonth: () => number;
  getUTCDate: () => any;
  getUTCHours: () => any;
  getUTCMinutes: () => any;
  getUTCSeconds: () => any;
}) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
// Build a valid RRULE string from individual components
function buildRRule(event: Event): string | null {
  if (!event.rruleEnum) return null;

  const interval = event.rruleInterval ? Number(event.rruleInterval) : 1;
  const count = event.rruleCount ? Number(event.rruleCount) : null;
  const byDay = event.rruleByDay.replace(/\s+/g, '') || null;

  const parts: string[] = [];

  // Base FREQ (from rruleEnum, e.g. "FREQ=WEEKLY")
  parts.push(`FREQ=${event.rruleEnum}`);

  // Interval always included
  parts.push(`INTERVAL=${interval}`);

  // Optional COUNT
  if (count && !isNaN(count)) {
    parts.push(`COUNT=${count}`);
  }

  // Optional BYDAY
  if (byDay && byDay.trim() !== '') {
    parts.push(`BYDAY=${byDay}`);
  }
  event.rruleStr = 'RRULE:' + parts.join(';');
  // Combine into full RRULE, including DTSTART
  return 'DTSTART:' + formatDateToISO8601(event.start) + '\n' + event.rruleStr;
}
