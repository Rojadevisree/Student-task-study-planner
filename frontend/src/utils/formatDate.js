export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  
  // If the date was stored as a pure YYYY-MM-DD, it will usually be exactly midnight UTC.
  // Using UTC methods prevents timezone shifts that could roll the date back one day.
  const isMidnightUTC = dateString.endsWith("T00:00:00.000Z") || dateString.indexOf("T") === -1;
  
  const day = String(isMidnightUTC ? date.getUTCDate() : date.getDate()).padStart(2, "0");
  const month = String((isMidnightUTC ? date.getUTCMonth() : date.getMonth()) + 1).padStart(2, "0");
  const year = isMidnightUTC ? date.getUTCFullYear() : date.getFullYear();
  
  return `${day}/${month}/${year}`;
}
