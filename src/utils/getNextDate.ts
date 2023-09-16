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

            if (tempDate >= currentDate) {
              newStartDate = tempDate;
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

  return { startDate: newStartDate, count: count };
}
