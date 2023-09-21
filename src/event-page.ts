import 'add-to-calendar-button';

import { atcb_action } from 'add-to-calendar-button';

import { getNextRRuleOccurrence } from '$utils/getNextDate';

// Helper function to format date as YYYYMMDD
function formatDate(date: string | Date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

//formating Date and Time
function formatDateRange(date: string | Date, date2: string | Date) {
  const startDateFormat = new Date(date);
  const endDateFormat = new Date(date2);
  let formattedEndDate;

  if (endDateFormat.getMonth() === startDateFormat.getMonth()) {
    formattedEndDate = endDateFormat.getDate() + ', ' + endDateFormat.getFullYear();

    if (startDateFormat.getDate() === endDateFormat.getDate()) {
      formattedEndDate = endDateFormat.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      return formattedEndDate;
    }
  } else {
    formattedEndDate = endDateFormat.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const formattedStartDate = startDateFormat.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });

  // Concatenate the formatted date and time
  const formattedDate = formattedStartDate + ' - ' + formattedEndDate;

  return formattedDate;
}

function convertTo24Hour(time: string) {
  // Split the time string into hours and minutes
  const timeArray = time.split(':');
  let hours = parseInt(timeArray[0]);
  const minutes = parseInt(timeArray[1]);

  // Extract the AM/PM indicator from the time string
  const indicator = timeArray[1].slice(-2).toUpperCase();

  // Adjust the hours based on the AM/PM indicator
  if (indicator === 'PM' && hours !== 12) {
    hours += 12;
  } else if (indicator === 'AM' && hours === 12) {
    hours = 0;
  }

  // Format the hours and minutes to have leading zeros
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Return the time in 24-hour format
  return formattedHours + ':' + formattedMinutes + ':00';
}

function formatTimeRange(startTime: string, endTime: string) {
  if (startTime === '' || endTime === '') {
    return 'All Day';
  }

  if (startTime.includes('AM') && endTime.includes('AM')) {
    startTime = startTime.replace(' AM', '');
  }
  if (startTime.includes('PM') && endTime.includes('PM')) {
    startTime = startTime.replace(' PM', '');
  }

  return startTime + ' - ' + endTime;
}

// Find the HTML element by its data-attribute
const eventJsonRaw = document.querySelector('[data-element="event-data"]');
let eventJson: {
  rruleStr: string;
  startDate: string | Date;
  endDate: string | Date;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
};

let config: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  recurrence: string | null;
  iCalFileName: string;
  timeZone: string;
  location: string;
  options: string[];
};

// Ensure the element exists and has content
if (eventJsonRaw && eventJsonRaw.textContent) {
  try {
    // Parse the JSON content
    eventJson = JSON.parse(eventJsonRaw.textContent);
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDate: string | null | Date = urlParams.get('selectedDate');
    let startDate: string | Date;
    let endDate: string | Date;
    const rruleString = eventJson.rruleStr;
    let nextRRuleOccurrence;

    if (selectedDate === null || isNaN(new Date(selectedDate))) {
      if (rruleString.includes('WEEKLY') || rruleString.includes('MONTHLY')) {
        nextRRuleOccurrence = getNextRRuleOccurrence(
          eventJson.rruleStr,
          new Date(eventJson.startDate)
        );
        console.log(nextRRuleOccurrence);
        startDate = new Date(nextRRuleOccurrence.startDate);
        endDate = startDate;
      } else {
        startDate = new Date(eventJson.startDate);
        endDate = new Date(eventJson.endDate);
      }
    } else {
      startDate = new Date(selectedDate).toString();
      endDate = new Date(selectedDate).toString();
    }

    config = {
      name: eventJson.title,
      description: eventJson.description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startTime: null,
      endTime: null,
      recurrence: null,
      iCalFileName: eventJson.title,
      timeZone: 'America/New_York',
      location: eventJson.location,
      options: ['Apple', 'Google', 'iCal'],
    };

    if (eventJson.startTime !== '' && eventJson.endTime !== '') {
      config.startTime = convertTo24Hour(eventJson.startTime);
      config.endTime = convertTo24Hour(eventJson.endTime);
    }

    if (rruleString.includes('WEEKLY') || rruleString.includes('DAILY')) {
      config.recurrence = rruleString;
    }

    const button = document.getElementById('add-cal-bttn');
    const button2 = document.getElementById('add-cal-bttn-2');

    if (button) {
      button.addEventListener('click', () => atcb_action(config, button));
    }

    if (button2) {
      button2.addEventListener('click', () => atcb_action(config, button));
    }

    // Concatenate the formatted date and time and map
    const formattedDateRange = formatDateRange(startDate, endDate);
    const formattedTime = formatTimeRange(eventJson.startTime, eventJson.endTime);

    const dateTextElement = document.getElementById('date-text');
    const timeTextElement = document.getElementById('time-text');
    const directionsBttnElement = document.getElementById('directions-bttn');

    if (dateTextElement !== null) {
      dateTextElement.textContent = formattedDateRange;
    }

    if (timeTextElement !== null) {
      timeTextElement.textContent = formattedTime;
    }

    if (directionsBttnElement !== null) {
      directionsBttnElement.href =
        'https://www.google.com/maps/place/' + encodeURIComponent(eventJson.location);
    }
    console.log(eventJson);

    const currentDate = new Date();

    if (new Date(endDate) < currentDate) {
      // The event is in the past, so show the "event-expired" element
      const eventExpiredElement = document.querySelector('.event-expired');
      let resetButton;
      console.log(nextRRuleOccurrence);
      if (eventExpiredElement) {
        eventExpiredElement.style.display = 'flex';
        resetButton = eventExpiredElement.querySelector('.button');
      }
      if (resetButton && nextRRuleOccurrence.count === 0) {
        resetButton.style.display = 'none';
      }
    }
  } catch (e) {
    console.error('Could not parse JSON', e);
  }
} else {
  console.error('Event Json not found or empty');
}

// Function to handle the click event on the back button
function handleBackButtonClick() {
  // Get the referrer (previous page)
  let { referrer } = document;
  let currentUrl = window.location.href;

  // Remove the query string from the current URL
  currentUrl = currentUrl.split('?')[0];
  referrer = referrer.split('?')[0];

  // Check if the referrer is the same as the current page (without the query string)
  if (referrer === currentUrl || !referrer.includes('app.aspirejax.org')) {
    // If yes, redirect to "https://app.aspirejax.org/calendar"
    window.location.href = 'https://app.aspirejax.org/calendar';
  } else {
    // If not, go back to the previous page
    window.history.back();
  }
}

// Find the button with the class "CMS-Back-Button" and add a click event listener
const backButton = document.querySelector('.cms-back-button');
if (backButton) {
  backButton.addEventListener('click', handleBackButtonClick);
}
