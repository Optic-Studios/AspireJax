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

    if (event.rruleStr) {
      event.rrule = 'DTSTART:' + formatDateToISO8601(event.start) + '\n' + event.rruleStr;
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

function formatDateToISO8601(date: {
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

  if (hours === '0') {
    return `${year}${month}${day};`;
  }
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
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
