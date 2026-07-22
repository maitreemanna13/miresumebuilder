export function formatDateRange(
  startDate?: string,
  endDate?: string,
  current?: boolean
): string {
  const start = startDate?.trim();
  const end = current ? "Present" : endDate?.trim();

  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return "";
}
