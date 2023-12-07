import { format } from "date-fns";

export const renderDateFormat = (date: string | Date | null | undefined, dayFirst: boolean = false) => {
  if (!date) return "N/A";

  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return dayFirst ? [day, month, year].join("-") : [year, month, day].join("-");
};

export const renderShortNumericDateFormat = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-UK", {
    day: "numeric",
    month: "short",
  });

export const findHowManyDaysLeft = (date: string | Date) => {
  const today = new Date();
  const eventDate = new Date(date);
  const timeDiff = Math.abs(eventDate.getTime() - today.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const timeAgo = (time: any) => {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }

  var time_formats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];

  var seconds = (+new Date() - time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds == 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format: any[];
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
};

export const formatDateDistance = (date: string | Date) => {
  const today = new Date();
  const eventDate = new Date(date);
  const timeDiff = Math.abs(eventDate.getTime() - today.getTime());
  const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (days < 1) {
    const hours = Math.ceil(timeDiff / (1000 * 3600));
    if (hours < 1) {
      const minutes = Math.ceil(timeDiff / (1000 * 60));
      if (minutes < 1) {
        return "Just now";
      } else {
        return `${minutes}m`;
      }
    } else {
      return `${hours}h`;
    }
  } else if (days < 7) {
    return `${days}d`;
  } else if (days < 30) {
    return `${Math.floor(days / 7)}w`;
  } else if (days < 365) {
    return `${Math.floor(days / 30)}m`;
  } else {
    return `${Math.floor(days / 365)}y`;
  }
};

export const getDateRangeStatus = (startDate: string | null | undefined, endDate: string | null | undefined) => {
  if (!startDate || !endDate) return "draft";

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start <= now && end >= now) return "current";
  else if (start > now) return "upcoming";
  else return "completed";
};

export const renderShortDate = (date: string | Date, placeholder?: string) => {
  if (!date || date === "") return null;

  date = new Date(date);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return isNaN(date.getTime()) ? placeholder ?? "N/A" : `${day} ${month}`;
};

export const renderShortMonthDate = (date: string | Date, placeholder?: string) => {
  if (!date || date === "") return null;

  date = new Date(date);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return isNaN(date.getTime()) ? placeholder ?? "N/A" : `${month} ${year}`;
};

export const render12HourFormatTime = (date: string | Date): string => {
  if (!date || date === "") return "";

  date = new Date(date);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  let period = "AM";

  if (hours >= 12) {
    period = "PM";

    if (hours > 12) hours -= 12;
  }

  return hours + ":" + (minutes < 10 ? `0${minutes}` : minutes) + " " + period;
};

export const render24HourFormatTime = (date: string | Date): string => {
  if (!date || date === "") return "";

  date = new Date(date);

  const hours = date.getHours();
  let minutes: any = date.getMinutes();

  // add leading zero to single digit minutes
  if (minutes < 10) minutes = "0" + minutes;

  return hours + ":" + minutes;
};

export const isDateRangeValid = (startDate: string, endDate: string) => new Date(startDate) < new Date(endDate);

export const isDateGreaterThanToday = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date > today;
};

export const getAllTimeIn30MinutesInterval = (): Array<{
  label: string;
  value: string;
}> => [
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "01:00", value: "01:00" },
  { label: "01:30", value: "01:30" },
  { label: "02:00", value: "02:00" },
  { label: "02:30", value: "02:30" },
  { label: "03:00", value: "03:00" },
  { label: "03:30", value: "03:30" },
  { label: "04:00", value: "04:00" },
  { label: "04:30", value: "04:30" },
  { label: "05:00", value: "05:00" },
  { label: "05:30", value: "05:30" },
  { label: "06:00", value: "06:00" },
  { label: "06:30", value: "06:30" },
  { label: "07:00", value: "07:00" },
  { label: "07:30", value: "07:30" },
  { label: "08:00", value: "08:00" },
  { label: "08:30", value: "08:30" },
  { label: "09:00", value: "09:00" },
  { label: "09:30", value: "09:30" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
];

/**
 * @returns {number} total number of days in range
 * @description Returns total number of days in range
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} inclusive
 * @example checkIfStringIsDate("2021-01-01", "2021-01-08") // 8
 */

export const findTotalDaysInRange = (startDate: Date | string, endDate: Date | string, inclusive: boolean): number => {
  if (!startDate || !endDate) return 0;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // find number of days between startDate and endDate
  const diffInTime = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

  // if inclusive is true, add 1 to diffInDays
  if (inclusive) return diffInDays + 1;

  return diffInDays;
};

/**
 * @returns {number} week number of date
 * @description Returns week number of date
 * @param {Date} date
 * @example getWeekNumber(new Date("2023-09-01")) // 35
 */
export const getWeekNumberOfDate = (date: Date): number => {
  const currentDate = new Date(date);

  // Adjust the starting day to Sunday (0) instead of Monday (1)
  const startDate = new Date(currentDate.getFullYear(), 0, 1);

  // Calculate the number of days between currentDate and startDate
  const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

  // Adjust the calculation for weekNumber
  const weekNumber = Math.ceil((days + 1) / 7);

  return weekNumber;
};

/**
 * @returns {Date} first date of week
 * @description Returns week number of date
 * @param {Date} date
 * @example getFirstDateOfWeek(35, 2023) // 2023-08-27T00:00:00.000Z
 */
export const getFirstDateOfWeek = (date: Date): Date => {
  const year = date.getFullYear();
  const weekNumber = getWeekNumberOfDate(date);

  const januaryFirst: Date = new Date(year, 0, 1); // January is month 0
  const daysToAdd: number = (weekNumber - 1) * 7; // Subtract 1 from the week number since weeks are 0-indexed
  const firstDateOfWeek: Date = new Date(januaryFirst);
  firstDateOfWeek.setDate(januaryFirst.getDate() + daysToAdd);

  // Adjust the date to Sunday (week start)
  const dayOfWeek: number = firstDateOfWeek.getDay();
  firstDateOfWeek.setDate(firstDateOfWeek.getDate() - dayOfWeek); // Move back to Sunday

  return firstDateOfWeek;
};

/**
 * @returns {string} formatted date in the format of MMM dd, yyyy
 * @description Returns date in the formatted format
 * @param {Date | string} date
 * @example renderFormattedDate("2023-01-01") // Jan 01, 2023
 */
export const renderFormattedDate = (date: string | Date): string => {
  if (!date) return "";

  date = new Date(date);

  const formattedDate = format(date, "MMM dd, yyyy");

  return formattedDate;
};

/**
 * @returns {string | null} formatted date in the format of yyyy-mm-dd to be used in payload
 * @description Returns date in the formatted format to be used in payload
 * @param {Date | string} date
 * @example renderFormattedPayloadDate("2023-01-01") // "2023-01-01"
 */
export const renderFormattedPayloadDate = (date: Date | string): string | null => {
  if (!date) return null;

  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
