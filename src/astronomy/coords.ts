import {
  CartesianCoordinates2D,
  CartesianCoordinates3D,
} from "../types/Coords.type";
import Constants from "../data/constants.json";
import { convertRadsToHMS, convertRadToDMS } from "../utils/angles";
import { OrbitalParams } from "./../types/OrbitalParams.type";

// usata
// TODO: aggiusta commenti e naming
export const convertCoordsEclipticToEquatorial = (
  eclipticCoords: CartesianCoordinates3D
): CartesianCoordinates3D => {
  // Converti in coordinate equatoriali
  const epsilon = Constants.earthAxialTilt; // inclinazione dell'eclittica in radianti

  const { x: xEcl, y: yEcl, z: zEcl } = eclipticCoords;
  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const x_eq = xEcl;
  const y_eq = cosEpsilon * yEcl - sinEpsilon * zEcl;
  const z_eq = sinEpsilon * yEcl + cosEpsilon * zEcl;

  return {
    x: x_eq,
    y: y_eq,
    z: z_eq,
  };
};

/**
 * Calcola la Declinazione (DEC) e l'Ascensione Retta (RA) e converte in formato leggibile.
 * @returns {Object} - Oggetto contenente RA e DEC nel formato leggibile.
 */
export function calcolaRADEC(equatorialCoords: CartesianCoordinates3D) {
  const { x: xEq, y: yEq, z: zEq } = equatorialCoords;
  // Calcola la distanza radiale r
  const r = Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq);

  // Calcola la Declinazione (DEC) in radianti
  const DEC = Math.asin(zEq / r);

  // Calcola l'Ascensione Retta (RA) in radianti
  let RA = Math.atan2(yEq, xEq);

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

export function convertCoordsHCOrbitalToHCEcliptic(
  orbitalCoords: CartesianCoordinates2D,
  orbitalParams: OrbitalParams
): CartesianCoordinates3D {
  const { ω, Ω, i } = orbitalParams;

  const { x: xOrb, y: yOrb } = orbitalCoords;

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

  return { x: xEcl, y: yEcl, z: zEcl };
}
