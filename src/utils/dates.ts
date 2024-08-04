export const daysBetweenDates = (date1: Date, date2: Date): number => {
  const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
  const timeDifference = date2.getTime() - date1.getTime(); // differenza in millisecondi

  return timeDifference / millisecondsPerDay; // converti in giorni
};
