/**
 * Convert angles in radians to HoursMinutesSeconds angles
 *
 * @param {number} radians - Value in radians
 * @returns {string|null} - In the format +10h 05m 12s
 */
export const convertRadsToHMS = (radians: number): string | null => {
  if (radians === null || radians === undefined || Number.isNaN(radians)) {
    console.warn("Angle not valid");
    return null;
  }
  // Convert radians to degrees
  const degrees = (1 * radians * 180) / Math.PI;

  // Convert degrees to hours
  let hours = Math.floor(degrees / 15);
  let minutes = Math.floor((degrees % 15) * 4);
  let seconds = Math.round(((degrees % 15) * 4 - minutes) * 60);

  // Make sure hours are in the 0-23 range
  hours = (hours + 24) % 24;
  // Make sure that minutes and seconds are in 0-59 range
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes === 60) {
    minutes = 0;
    hours++;
  }

  return `${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
};

/**
 * Convert angles in radians to Degrees-Primes-Seconds angles
 *
 * @param {number} radians - Value in radians
 * @returns {string|null} - Format "+dd° mm’ ss”".
 */
export const convertRadToDMS = (radians: number): string | null => {
  if (radians === null || radians === undefined || Number.isNaN(radians)) {
    console.warn("Angle not valid");
    return null;
  }

  const degrees = radians * (180 / Math.PI);

  // Get the sign and the abs value of the angle
  const sign = degrees < 0 ? "-" : "+";
  const absDegrees = Math.abs(degrees);

  // Calculate grades, minutes and seconds
  const intDegrees = Math.floor(absDegrees);
  const minutes = (absDegrees - intDegrees) * 60;
  const intMinutes = Math.floor(minutes);
  const seconds = (minutes - intMinutes) * 60;

  // Format minutes and seconds as 2chacters strings (with a potential initial 0 if <9)
  const formattedMinutes = intMinutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toFixed(0).toString().padStart(2, "0");

  return `${sign}${intDegrees}° ${formattedMinutes}' ${formattedSeconds}"`;
};

// Converte i gradi in radianti
export const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

// Converte i radianti in gradi
export const toDegrees = (radians: number) => {
  return radians * (180 / Math.PI);
};

// Funzione per normalizzare l'angolo tra 0 e 360 gradi
export const normalizeAngleD = (degrees: number) => {
  return ((degrees % 360) + 360) % 360;
  // return degrees % 360;
};
