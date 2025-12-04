export const formatTime24 = (value) => {
  if (!value) return "-";
  const match = String(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return value;
  let hour = Number.parseInt(match[1], 10);
  const minute = match[2];
  const meridian = match[3].toUpperCase();
  if (meridian === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  const hh = String(hour).padStart(2, "0");
  return `${hh}:${minute}`;
};
