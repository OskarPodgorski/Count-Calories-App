import { startOfWeek, endOfWeek, eachDayOfInterval, format, getISODay } from "date-fns";

export function GetWeekDates(date, fullTimestamp = false) {
    const weekDates = eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
    });

    if (fullTimestamp) {
        return weekDates
    }
    else {
        return weekDates.map(d => format(d, "yyyy-MM-dd"));
    }
}