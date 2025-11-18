export function getNextRRuleOccurrence(rruleString: string, eventStartDate: Date) {
  // Parse the RRULE string to extract relevant parameters
  const rruleParts = rruleString.replace(/^RRULE:/, '').split(';');
  const frequencyPart = rruleParts.find((part) => part.startsWith('FREQ='));
  const intervalPart = rruleParts.find((part) => part.startsWith('INTERVAL='));
  const byDayPart = rruleParts.find((part) => part.startsWith('BYDAY='));
  const byMonthDayPart = rruleParts.find((part) => part.startsWith('BYMONTHDAY='));
  const countPart = rruleParts.find((part) => part.startsWith('COUNT='));

  // Check if the parts are not undefined before splitting them
  const frequency = frequencyPart ? frequencyPart.split('=')[1] : undefined;
  const interval = intervalPart ? parseInt(intervalPart.split('=')[1]) : undefined;
  let byMonthDay = byMonthDayPart ? parseInt(byMonthDayPart.split('=')[1]) : undefined;
  let count = countPart ? parseInt(countPart.split('=')[1]) : undefined;
  let byDay;
  if (byDayPart) {
    byDay = byDayPart.split('=')[1].split(',');
  } else {
    byDay = undefined;
  }

  const currentDate = new Date();
  let newStartDate: Date;

  if (eventStartDate <= currentDate) {
    ////This it to get the next date
    if (frequency === 'WEEKLY') {
      newStartDate = new Date(
        eventStartDate.getFullYear(),
        eventStartDate.getMonth(),
        eventStartDate.getDate() - (interval ? interval * 7 : 1)
      );

      for (let i = 0; newStartDate < currentDate; i++) {
        newStartDate = new Date(
          newStartDate.getFullYear(),
          newStartDate.getMonth(),
          newStartDate.getDate() + (interval ? interval * 7 : 1)
        );

        if (byDay != null) {
          // If byDay values are defined
          for (let index = 0; index < byDay.length; index++) {
            const dayAbbreviation = byDay[index];

            const startingDay = newStartDate.getDay();

            let date = 1;
            const dayIndex = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].indexOf(dayAbbreviation);

            const weekNumber = Math.floor(dayIndex / 7); // Calculate the week number within the month
            const dayIndexWithinWeek = dayIndex % 7; // Calculate the index of the day within the week

            if (dayIndexWithinWeek >= startingDay) {
              date += dayIndexWithinWeek - startingDay;
            } else {
              date += 7 - (startingDay - dayIndexWithinWeek);
            }

            date += weekNumber;
            const tempDate = new Date(
              newStartDate.getFullYear(),
              newStartDate.getMonth(),
              newStartDate.getDate() + date
            );
            if (tempDate >= currentDate && tempDate >= eventStartDate) {
              newStartDate = tempDate;
              break;
            }
          }
        }
        if (count !== undefined) {
          count -= 1;
          if (count <= 0) {
            return { startDate: newStartDate, count: count };
          }
        }
      }
      if (newStartDate >= eventStartDate) {
        eventStartDate = new Date(
          newStartDate.getFullYear(),
          newStartDate.getMonth(),
          newStartDate.getDate(),
          eventStartDate.getUTCHours(),
          eventStartDate.getUTCMinutes(),
          eventStartDate.getUTCSeconds()
        );
      }
    } else if (frequency === 'MONTHLY') {
      // If the frequency is monthly
      newStartDate = new Date(
        eventStartDate.getFullYear(),
        eventStartDate.getMonth() - (interval ? interval : 1),
        eventStartDate.getDate()
      );

      for (let i = 0; newStartDate < currentDate; i++) {
        newStartDate = new Date(
          newStartDate.getFullYear(),
          newStartDate.getMonth() + (interval ? interval : 1),
          newStartDate.getDate()
        );

        if (byMonthDay != null) {
          if (byMonthDay === undefined) {
            byMonthDay = eventStartDate.getDate();
          }
          // If byMonthDay value is defined, update the new start date accordingly
          newStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), byMonthDay);
        } else if (byDay != null) {
          // If byDay values are defined
          for (let index = 0; index < byDay.length; index++) {
            const weekNumber = parseInt(byDay[index]);
            const dayAbbreviation = byDay[index].slice(-2);

            const dateStr = `${newStartDate.getMonth() + 1}/1/${newStartDate.getFullYear()}`;
            const startingDay = new Date(dateStr).getDay();

            let date = 1;
            const dayIndex = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(dayAbbreviation);
            if (dayIndex >= startingDay) {
              date += dayIndex - startingDay;
            } else {
              date += 7 - (startingDay - dayIndex);
            }

            if (weekNumber === -1) {
              const lastDayOfMonth = new Date(
                newStartDate.getFullYear(),
                newStartDate.getMonth(),
                0
              ).getDate();
              const tempDate = new Date(
                newStartDate.getFullYear(),
                newStartDate.getMonth(),
                lastDayOfMonth
              );

              while (tempDate.getDay() !== dayIndex) {
                tempDate.setDate(tempDate.getDate() - 1);
              }

              if (tempDate >= currentDate) {
                newStartDate = tempDate;
                break;
              }
            } else {
              date += (weekNumber - 1) * 7;
              const tempDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), date);
              newStartDate = tempDate;
              if (tempDate >= currentDate) {
                break;
              }
            }
          }

          if (count !== undefined) {
            count -= 1;
            if (count <= 0) {
              return newStartDate;
            }
          }
        }

        if (newStartDate.toString() === currentDate.toString()) {
          break;
        }
      }
    }
  } else {
    newStartDate = eventStartDate;
  }

  return { startDate: newStartDate, count: count };
}

// Helper function to format date as YYYYMMDD
export function formatDate(date: string | Date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

//formating Date and Time
export function formatDateRange(date: string | Date, date2: string | Date) {
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

export function convertTo24Hour(time: string) {
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

export function formatTimeRange(startTime: string, endTime: string) {
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

export function hydrateEventCardsFromEvents(events) {
  const now = new Date();
  const cards = document.querySelectorAll<HTMLElement>('[data-parentEvent]');

  cards.forEach((card) => {
    const parentId = card.getAttribute('data-parentEvent');
    if (!parentId) return;

    const event = events.find((e) => e.id === parentId);
    if (!event) {
      card.remove();
      return;
    }

    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);
    const durationMs = originalEnd.getTime() - originalStart.getTime();

    let startLocal: Date;
    let endLocal: Date;

    // --- RECURRING EVENTS ---
    if (event.rruleStr && event.rruleStr !== '') {
      const next = getNextRRuleOccurrence(event.rruleStr, originalStart);

      if (!next || !next.startDate || (typeof next.count === 'number' && next.count <= 0)) {
        card.remove();
        return;
      }

      const nextDay = next.startDate; // usually midnight

      // ✅ Reattach original time-of-day to the next date
      startLocal = new Date(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate(),
        originalStart.getHours(),
        originalStart.getMinutes(),
        originalStart.getSeconds()
      );

      endLocal = new Date(startLocal.getTime() + durationMs);
    } else {
      // --- ONE-OFF EVENTS ---
      if (originalEnd < now) {
        card.remove();
        return;
      }

      startLocal = new Date(originalStart);
      endLocal = new Date(originalEnd);
    }

    // Store for sorting (ISO is fine; we only care about chronological order)
    card.dataset.sortDate = startLocal.toISOString();

    // --- UPDATE DATE TEXT ---
    const dateEl = card.querySelector<HTMLElement>('[data-event="date"]');
    if (dateEl) {
      dateEl.textContent = startLocal.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    // --- UPDATE TIME TEXT ---
    const timeEl = card.querySelector<HTMLElement>('[data-event="time"]');
    if (timeEl) {
      const startStr = startLocal.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      const endStr = endLocal.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      timeEl.textContent = formatTimeRange(startStr, endStr);
    }
  });

  sortEventCardsByDate();
}

function sortEventCardsByDate() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-parentEvent]'));

  if (cards.length === 0) return;

  // Assume all cards share the same parent (Webflow collection list wrapper)
  const parent = cards[0].parentElement;
  if (!parent) return;

  cards.sort((a, b) => {
    const da = a.dataset.sortDate ? new Date(a.dataset.sortDate).getTime() : 0;
    const db = b.dataset.sortDate ? new Date(b.dataset.sortDate).getTime() : 0;
    return da - db; // earliest first
  });

  cards.forEach((card) => parent.appendChild(card)); // re-append in sorted order
}
