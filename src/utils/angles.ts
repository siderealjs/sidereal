// TODO: sistema
export const convertRadsToHMS = (radians: number) => {
  // Converti RA da radianti a gradi
  const gradi = (1 * radians * 180) / Math.PI;

  // Converti gradi in ore
  let ore = Math.floor(gradi / 15);
  let minuti = Math.floor((gradi % 15) * 4);
  let secondi = Math.round(((gradi % 15) * 4 - minuti) * 60);

  // Assicurati che ore siano nel range 0-23
  ore = (ore + 24) % 24;
  // Assicurati che minuti e secondi siano nel range 0-59
  if (secondi === 60) {
    secondi = 0;
    minuti++;
  }
  if (minuti === 60) {
    minuti = 0;
    ore++;
  }

  return `${ore.toString().padStart(2, "0")}h ${minuti
    .toString()
    .padStart(2, "0")}m ${secondi.toString().padStart(2, "0")}s`;
};

/**
 * Converte un valore in radianti in un formato gradi, minuti e secondi.
 * @param {number} radians - Valore in radianti.
 * @returns {string} - Formato "+dd° mm’ ss”".
 */
export const convertRadToDMS = (radians: number): string => {
  const degrees = radians * (180 / Math.PI);

  // Ottieni il segno e il valore assoluto dei gradi
  const sign = degrees < 0 ? "-" : "+";
  const absDegrees = Math.abs(degrees);

  // Ottieni i gradi, minuti e secondi
  const intDegrees = Math.floor(absDegrees);
  const minutes = (absDegrees - intDegrees) * 60;
  const intMinutes = Math.floor(minutes);
  const seconds = (minutes - intMinutes) * 60;

  // Formatta i minuti e i secondi come numeri interi
  const formattedMinutes = intMinutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toFixed(2).toString().padStart(2, "0");

  return `${sign}${intDegrees}° ${formattedMinutes}' ${formattedSeconds}"`;
};
