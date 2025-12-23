export const formatEST = (dateInput) => {
  const d = new Date(dateInput);

  if (isNaN(d)) return "Invalid date";

  // Convert to EST by subtracting 5 hours (assuming no DST)
  const estTime = new Date(d.getTime() - 5 * 60 * 60 * 1000);

  const year = estTime.getUTCFullYear();
  const month = String(estTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(estTime.getUTCDate()).padStart(2, "0");

  let hour = estTime.getUTCHours();
  const minute = String(estTime.getUTCMinutes()).padStart(2, "0");
  const second = String(estTime.getUTCSeconds()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour; // 0 should be 12

  const hourStr = String(hour).padStart(2, "0");

  return `${year}-${month}-${day} , ${hourStr}:${minute}:${second} ${ampm}`;
};

// ==========================from,to ==========================
// ✅ Convert local DateTime → true UTC Date (correct for any timezone)
export const toUtcDate = (localDate) => {
  if (!localDate) return null;
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
};
export const toUtcEndOfDay = (localDate) => {
  if (!localDate) return null;
  const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  utcDate.setUTCHours(23, 59, 59, 999);
  return utcDate;
};