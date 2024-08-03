export const daysBetweenDates = (date1: Date, date2: Date) => {
  const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
  const timeDifference = date2 - date1; // differenza in millisecondi

  return timeDifference / millisecondsPerDay; // converti in giorni
};
