import { format, parseISO } from "date-fns";

export function formatDate(dateStr: string): string {
  const iso = dateStr.replace(" ", "T");

  const date = parseISO(iso);
  return format(date, "PPpp");
}
