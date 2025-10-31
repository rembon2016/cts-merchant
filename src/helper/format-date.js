// Format tanggal ke format Indonesia singkat: 01 Jan 2025
export const formatDate = (value) => {
  if (!value) return "-";
  // Terima string ISO 'YYYY-MM-DD' atau objek Date
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
