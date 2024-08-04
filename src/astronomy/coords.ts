import { convertRadsToHMS, convertRadToDMS } from "../utils/angles";
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
  const raFormattato = convertRadsToHMS(RA);
  const decFormattato = convertRadToDMS(DEC);

  return {
    RA: raFormattato,
    DEC: decFormattato,
  };
}

export const calcCoordsHCOrbital = (v: number, r: number) => {
  const xOrb = r * Math.cos(v);
  const yOrb = r * Math.sin(v);

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
