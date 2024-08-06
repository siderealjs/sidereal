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




const daysSinceJ1900 = (date: Date) : number => {
  // Definire il giorno giuliano all'inizio del 1900
  const J1900 = 2415020.0;

  // Calcolare il giorno giuliano della data fornita
  const JD = date.getTime() / 86400000 + 2440587.5;

  // Restituire i giorni trascorsi dal giorno giuliano di riferimento
  return JD - J1900;
};

export const centuriesFromJ1900 = (date: Date) => {
  const days = daysSinceJ1900(date);
  const T = days / 36525.0;
  return T;
};