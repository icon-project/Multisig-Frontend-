export function convertTimestampToDateTime(timestamp: string): string {
  const ts = Number(timestamp);
  const date = new Date(ts / 1_000_000);
  const formattedDate = date.toISOString().substring(0, 19);

  return formattedDate;
}
