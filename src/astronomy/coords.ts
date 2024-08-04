import { OrbitalParams } from "./../types/OrbitalParams.type";

// usata
// TODO: sposta epsilon e aggiusta commenti e naming
export const convertCoordsEclipticToEquatorial = (
  xEcl: number,
  yEcl: number,
  zEcl: number
) => {
  // Converti in coordinate equatoriali
  const epsilon = 0.4091; // inclinazione dell'eclittica in radianti

  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const x_eq = xEcl;
  const y_eq = cosEpsilon * yEcl - sinEpsilon * zEcl;
  const z_eq = sinEpsilon * yEcl + cosEpsilon * zEcl;

  return {
    xEq: x_eq,
    yEq: y_eq,
    zEq: z_eq,
  };
};

// TODO: sistema
function convertiRAinOrari(rad: number) {
  // Converti RA da radianti a gradi
  const gradi = (1 * rad * 180) / Math.PI;

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
}

/**
 * Converte un valore in radianti in un formato gradi, minuti e secondi.
 * @param {number} rad - Valore in radianti.
 * @returns {string} - Formato "+dd° mm’ ss”".
 */
function convertiDECinGradi(radians) {
  const degrees = -1 * radians * (180 / Math.PI);

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
}

/**
 * Calcola la Declinazione (DEC) e l'Ascensione Retta (RA) e converte in formato leggibile.
 * @param {number} x_eq - Coordinata x nel sistema equatoriale.
 * @param {number} y_eq - Coordinata y nel sistema equatoriale.
 * @param {number} z_eq - Coordinata z nel sistema equatoriale.
 * @returns {Object} - Oggetto contenente RA e DEC nel formato leggibile.
 */
export function calcolaRADEC(x_eq, y_eq, z_eq) {
  // Calcola la distanza radiale r
  const r = Math.sqrt(x_eq * x_eq + y_eq * y_eq + z_eq * z_eq);

  // Calcola la Declinazione (DEC) in radianti
  const DEC = Math.asin(z_eq / r);

  // Calcola l'Ascensione Retta (RA) in radianti
  let RA = Math.atan2(y_eq, x_eq);

  // Normalizza RA a [0, 2π)
  RA = (RA + 2 * Math.PI) % (2 * Math.PI);

  // Correggi RA se è negativo
  if (RA < 0) {
    RA += 2 * Math.PI;
  }

  console.log("prima di formattare, ", RA, DEC);
  // Converti RA e DEC in formato leggibile
  const raFormattato = convertiRAinOrari(RA);
  const decFormattato = convertiDECinGradi(DEC);

  return {
    RA: raFormattato,
    DEC: decFormattato,
  };
}

export const calcCoordsHCOrbital = (v: number, r: number) => {
  const xOrb = r * Math.cos(v);
  const yOrb = r * Math.sin(v);
  //console.log('INTERNO ORB', xOrb, yOrb)

  return { xOrb, yOrb };
};

export function convertCoordsHCOrbitalToHCEcliptic(xOrb, yOrb, orbitalParams) {
  const { ω, Ω, i } = orbitalParams;

  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);

  const x1 = xOrb * cosω - yOrb * sinω;
  const y1 = xOrb * sinω + yOrb * cosω;
  const z1 = 0; // z non cambia durante questa rotazione

  // Rotazione attorno all'asse x di -i (inclinazione)
  const x2 = x1;
  const y2 = y1 * cosi - z1 * sini;
  const z2 = y1 * sini + z1 * cosi;

  // Rotazione attorno all'asse z di -Ω (nodo ascendente)
  const xEcl = x2 * cosΩ - y2 * sinΩ;
  const yEcl = x2 * sinΩ + y2 * cosΩ;
  const zEcl = z2; // z non cambia durante questa rotazione

  return { xEcl, yEcl, zEcl };
}

export const calcCoordsEclipticFromAnomaly = (
  r: number,
  v: number,
  orbitalParams: OrbitalParams
) => {
  const { xOrb, yOrb } = calcCoordsHCOrbital(v, r);

  const { xEcl, yEcl, zEcl } = convertCoordsHCOrbitalToHCEcliptic(
    xOrb,
    yOrb,
    orbitalParams
  );

  return { xEcl, yEcl, zEcl };
};
