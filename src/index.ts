import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrule from '@fullcalendar/rrule';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';

import { getEvents } from '$utils/getEvents';

let events;

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLElement>('[data-element="calendar"]');
  const dayCalendarElement = document.querySelector<HTMLElement>('[data-element="day-calendar"]');
  if (!calendarElement) return;
  if (!dayCalendarElement) return;

  events = getEvents();
  console.log(events);

  const dayCalendar = new Calendar(dayCalendarElement, {
    plugins: [dayGridPlugin, rrulePlugin],
    initialView: 'dayGridDay',
    headerToolbar: {
      left: '',
      center: '',
      right: '',
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
    },
    contentHeight: 'auto',
    events,
  });

  const calendar = new Calendar(calendarElement, {
    plugins: [interactionPlugin, dayGridPlugin, rrulePlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: '',
      center: '',
      right: '',
    },
    contentHeight: 'auto',
    dateClick: function (info) {
      dayCalendar.gotoDate(info.date);
      calendar.gotoDate(info.date);
      const dateElement = dayCalendarElement.querySelector('.fc-col-header-cell-cushion');
      if (dateElement) {
        const date = new Date(info.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        dateElement.textContent = formattedDate;
        const calTitle = document.getElementById('cal-header');
        if (calTitle) {
          calTitle.textContent = calendar.view.title;
        }
      }
    },

    eventClick: function (info) {
      info.jsEvent.preventDefault();
      const clickedDate = info.event.start;

      const queryParameter = `selectedDate=${clickedDate.toISOString()}`;
      const newUrl = info.event.url + '?' + queryParameter;

      window.location.href = newUrl;
    },
    eventContent: function (arg) {
      const orginalEvent = events.find((event) => event.id === arg.event.id);
      const decodedTitle = decodeHtmlEntities(arg.event.title);
      let eventDiv = '';

      if (arg.event.allDay === true) {
        //All Day Events
        const wrapperStyle = `
        --hover-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.1)};
        --event-font-color-light: ${adjustHex(orginalEvent.categoryColor || '#3788d8', -20)};
        --event-font-color-dark: ${adjustHex(orginalEvent.categoryColor || '#3788d8', 60)};
        background-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.2)};
        border-color: ${orginalEvent.categoryColor || '#3788d8'};
        `;

        eventDiv = `
        <div class="event-wrapper allDay" style="${wrapperStyle}"><p>
            ${decodedTitle}
          </p></div>`;
      } else if (orginalEvent.rruleStr === '') {
        //Nonrepeating Events

        const timeRangeStr = formatTime(orginalEvent.start, orginalEvent.end);

        const wrapperStyle = `
        --hover-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.1)};
        --event-font-color-light: ${adjustHex(orginalEvent.categoryColor || '#3788d8', -20)};
        --event-font-color-dark: ${adjustHex(orginalEvent.categoryColor || '#3788d8', 60)};
        background-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.2)};
        border-color: ${orginalEvent.categoryColor || '#3788d8'};
        `;

        const timeWrapperStyle = `
        --hover-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.1)};
        --event-font-color-light: ${adjustHex(orginalEvent.categoryColor || '#3788d8', -20)};
        --event-font-color-dark: ${adjustHex(orginalEvent.categoryColor || '#3788d8', 30)};
        `;

        eventDiv = `
        <div class="event-wrapper fullEvent" style="${wrapperStyle}">
            <p>${decodedTitle}</p>
            <div class="event-time-wrapper" style="${timeWrapperStyle}">
                <svg xmlns="http://www.w3.org/2000/svg" height=".9em" style="min-width:.9em" viewBox="0 0 512 512">
                    <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                </svg>
                <small>${timeRangeStr}</small>
            </div>
        </div>`;
      } else {
        //Repeating Events
        const circleHtml = `<span class="event-circle" style="background-color: ${
          orginalEvent.categoryColor || '#3788d8'
        };"></span>`;
        const wrapperStyle = `
        --hover-color: ${hexToRgba(orginalEvent.categoryColor || '#3788d8', 0.2)};
        `;

        eventDiv = `
        <div class="event-wrapper" style="${wrapperStyle}">
            ${circleHtml}<p>${decodedTitle}
        </p></div>`;
      }

      return { html: eventDiv };
    },

    displayEventTime: false,

    fixedWeekCount: false,

    events,
  });

  InitializeCalendarToolbar(calendar);
  calendar.render();
  dayCalendar.render();
  const dateElement = dayCalendarElement.querySelector('.fc-col-header-cell-cushion');
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  }
});

const InitializeCalendarToolbar = (calendar: Calendar) => {
  const calTitle = document.getElementById('cal-header');
  if (calTitle) {
    calTitle.textContent = calendar.view.title;
  }

  document.getElementById('prev')?.addEventListener('click', function () {
    calendar.prev();
    if (calTitle) {
      calTitle.textContent = calendar.view.title;
    }
  });

  document.getElementById('next')?.addEventListener('click', function () {
    calendar.next();
    if (calTitle) {
      calTitle.textContent = calendar.view.title;
    }
  });

  document.getElementById('today')?.addEventListener('click', function () {
    calendar.today();
    if (calTitle) {
      calTitle.textContent = calendar.view.title;
    }
  });
};

function decodeHtmlEntities(str) {
  // Create a temporary DOM div element
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || div.innerText || '';
}

function findOriginalEventBySlug(slug) {
  return events.find((event) => event.slug === slug);
}

function hexToRgba(hex, alpha) {
  // Remove the '#' symbol if present
  hex = hex.replace('#', '');

  // Convert hex to RGB values
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  // Convert RGB values to decimal (0 to 1)
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;

  // Create and return the RGBA string
  return `rgba(${normalizedRed * 100}%, ${normalizedGreen * 100}%, ${
    normalizedBlue * 100
  }%, ${alpha})`;
}

function adjustHex(hex, percentage) {
  // Remove the '#' symbol if present
  hex = hex.replace('#', '');

  // Convert hex to RGB values
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  // Calculate the adjustments for each color component
  const adjustAmount = Math.round(2.55 * percentage);
  const adjustedRed = Math.max(0, Math.min(255, red + adjustAmount));
  const adjustedGreen = Math.max(0, Math.min(255, green + adjustAmount));
  const adjustedBlue = Math.max(0, Math.min(255, blue + adjustAmount));

  // Convert RGB values to decimal (0 to 1)
  const normalizedRed = adjustedRed / 255;
  const normalizedGreen = adjustedGreen / 255;
  const normalizedBlue = adjustedBlue / 255;

  // Create and return the RGBA string with 100% alpha
  return `rgba(${normalizedRed * 100}%, ${normalizedGreen * 100}%, ${normalizedBlue * 100}%, 1)`;
}
function formatTime(date, date2) {
  const startDateFormat = new Date(date);
  const endDateFormat = new Date(date2);

  const timeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  let formattedStartTime = new Date(startDateFormat).toLocaleTimeString(
    undefined,
    timeFormatOptions
  );
  const formattedEndTime = new Date(endDateFormat).toLocaleTimeString(undefined, timeFormatOptions);

  if (formattedStartTime.includes('AM') && formattedEndTime.includes('AM')) {
    formattedStartTime = formattedStartTime.replace(' AM', '');
  }
  if (formattedStartTime.includes('PM') && formattedEndTime.includes('PM')) {
    formattedStartTime = formattedStartTime.replace(' PM', '');
  }

  return formattedStartTime + ' - ' + formattedEndTime;
}
