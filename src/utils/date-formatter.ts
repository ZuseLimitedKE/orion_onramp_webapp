import { format, parseISO, isValid } from "date-fns";

export function formatDate(dateStr: string): string {
  let date = parseISO(dateStr);

  if (!isValid(date)) {
    date = parseISO(dateStr.replace(" ", "T"));
  }

  if (!isValid(date)) {
    console.error("Invalid date string:", dateStr);
    return "Invalid date";
  }

  return format(date, "PPpp");
}
