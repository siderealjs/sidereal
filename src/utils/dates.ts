export const daysBetweenDates = (date1: Date, date2: Date): number => {
  const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
  const timeDifference = date2.getTime() - date1.getTime(); // differenza in millisecondi

  return timeDifference / millisecondsPerDay; // converti in giorni
};

export const daysSinceEpoch = (date: Date) => {
  // Definisci l'epoca standard (1 gennaio 2000 00:00 UTC)
  const epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
  // Calcola la differenza in millisecondi tra la data fornita e l'epoca
  const differenceInMillis = date.getTime() - epoch.getTime();

  // Converti la differenza da millisecondi a giorni
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return differenceInDays;
};
