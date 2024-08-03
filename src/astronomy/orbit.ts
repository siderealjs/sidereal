import { OrbitalParams } from "./../types/OrbitalParams.type";
import { OrbitalParams } from "../types/OrbitalParams.type";
import {
  calcEccentricAnomaly,
  calcMeanAnomalyAtDate,
  calcTrueAnomaly,
} from "./calculateAnomaly";

function orbitalToCartesian(a, e, i, Ω, ω, M) {
  // Calcolare l'anomalia eccentrica
  const E = keplerEquation(M, e);

  //console.log("005:: eccentric anomaly", E, (E * 180) / Math.PI);
  // Calcolare la vera anomalia
  const v = trueAnomaly(E, e);

  //console.log("006:: v trueanumoaly", v);
  // Calcolare la distanza radiale
  const r = a * (1 - e * Math.cos(E));

  //console.log("007:: distanza radiale r", r);
  // Calcolare le coordinate heliocentriche nel piano orbitale
  const x_orb = r * Math.cos(v);
  const y_orb = r * Math.sin(v);

  // console.log("008:: coordinate orbitali", x_orb, y_orb, 0);
  // Convertire in coordinate cartesiane
  const x =
    x_orb *
      (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) -
    y_orb *
      (Math.cos(Ω) * Math.sin(ω) + Math.sin(Ω) * Math.cos(ω) * Math.cos(i));
  const y =
    x_orb *
      (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i)) -
    y_orb *
      (Math.sin(Ω) * Math.sin(ω) - Math.cos(Ω) * Math.cos(ω) * Math.cos(i));
  const z =
    x_orb * (Math.sin(ω) * Math.sin(i)) + y_orb * (Math.cos(ω) * Math.sin(i));

  //console.log("009:: coordinate cartesiane", x, y, z);
  // Moltiplicare per 1000 per convertire AU in km
  return { x: x * 140, y: y * 140, z: z * 140 };
}

const findOrbitalPositionAtGivenTime = (t, orbitalParams) => {
  const { P, M0, a, e, i, Ω, ω } = orbitalParams;

  const n = (2 * Math.PI) / P;
  // n = 0.07142580605651584
  // console.log("001::: nmercurio", n);

  // Data corrente per il calcolo

  // Calcolare l'anomalia media attuale
  const M = calcMeanAnomalyAtDate(M0, n, t);

  const position = orbitalToCartesian(a, e, i, Ω, ω, M);

  return position;
};

export default findOrbitalPositionAtGivenTime;

export const calcRelativeOrbitalCoordsAtDate = (
  givenDate: Date,
  orbitalParams: OrbitalParams
): { xRel: number; yRel: number; v: number } => {
  const { M0, a, e, n } = orbitalParams;

  // Calcolare l'anomalia media attuale
  const M = calcMeanAnomalyAtDate(M0, n, givenDate);

  console.log("003: normalized M:", M);

  // Calcolare l'anomalia eccentrica
  const E = calcEccentricAnomaly(M, e);

  console.log("004:: ecc anomaly E,", E);

  // Calcolare la vera anomalia
  const v = calcTrueAnomaly(E, e);

  console.log("005:: true anomaly", v);

  // Calcolare la distanza radiale
  //const r = a * (1 - e * Math.cos(E));
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
  console.log("006:: radial r,", r);

  // const r = a * (1 - e * e) / (1 + e * Math.cos(nu));

  // Calcolo delle coordinate nel sistema orbita
  const xRel = r * Math.cos(v);
  const yRel = r * Math.sin(v);
  const zPrime = 0; // Dato che Marte è nel piano dell'orbita

  return { E, r, e };

  // Calcolo di omega + nu
  const omegaPlusNu = omega + nu;

  // Calcolo di cos(omega + nu) e sin(omega + nu)
  const cosOmegaPlusNu = Math.cos(omegaPlusNu);
  const sinOmegaPlusNu = Math.sin(omegaPlusNu);

  // Calcolo di cos(i) e sin(i)
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  // Calcolo delle coordinate nel sistema heliocentrico
  const x =
    xPrime *
    (Math.cos(Omega) * cosOmegaPlusNu -
      Math.sin(Omega) * sinOmegaPlusNu * cosI);
  const y =
    xPrime *
    (Math.sin(Omega) * cosOmegaPlusNu +
      Math.cos(Omega) * sinOmegaPlusNu * cosI);
  const z = xPrime * (sinOmegaPlusNu * sinI);

  console.log("006:: distanza radiale,", r);

  // Calcolare le coordinate heliocentriche nel piano orbitale
  const xOrb = r * Math.cos(v);
  const yOrb = r * Math.sin(v);

  return { xOrb, yOrb };
}

export function calculateRAandDEC(r, nu, orbitalParams) {

  // Convert degrees to radians
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  // Convert radians to degrees
  function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  // Convert degrees to hours
  function degreesToHours(degrees) {
    return degrees / 15; // 360 degrees = 24 hours
  }

  // Convert RA in degrees to hours, minutes, and seconds
  function convertRAtoHMS(raDegrees) {
    let totalHours = degreesToHours(raDegrees);
    totalHours = (totalHours + 24) % 24; // Ensure RA is within 0-24 hours
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = ((totalHours - hours - minutes / 60) * 3600).toFixed(2);
    return { hours, minutes, seconds };
  }

  // Convert DEC in degrees to degrees, minutes, and seconds
  function convertDECtoDMS(decDegrees) {
    const degrees = Math.floor(Math.abs(decDegrees));
    const minutes = Math.floor((Math.abs(decDegrees) - degrees) * 60);
    const seconds = ((Math.abs(decDegrees) - degrees - minutes / 60) * 3600).toFixed(1);
    return { degrees: decDegrees >= 0 ? degrees : -degrees, minutes, seconds };
  }

  const { i, Ω, ω } = orbitalParams;
  const epsilon = 23.44; // Inclination of the ecliptic in degrees

  // Convert epsilon from degrees to radians
  const epsilonRad = degreesToRadians(epsilon);

  // Calculate Cartesian coordinates in the orbital plane
  const xOrbt =
    r * (Math.cos(nu) * Math.cos(ω) - Math.sin(nu) * Math.sin(ω) * Math.cos(i));
  const yOrbt =
    r * (Math.cos(nu) * Math.sin(ω) + Math.sin(nu) * Math.cos(ω) * Math.cos(i));
  const zOrbt = r * (Math.sin(nu) * Math.sin(i));

  // Rotate the coordinates to the ecliptic frame
  const xEcl = xOrbt;
  const yEcl = yOrbt * Math.cos(epsilonRad) - zOrbt * Math.sin(epsilonRad);
  const zEcl = yOrbt * Math.sin(epsilonRad) + zOrbt * Math.cos(epsilonRad);

  // Rotate the coordinates to the equatorial frame
  const xEq = xEcl * Math.cos(Ω) - yEcl * Math.sin(Ω);
  const yEq =
    xEcl * Math.cos(i) * Math.sin(Ω) +
    yEcl * Math.cos(i) * Math.cos(Ω) -
    zEcl * Math.sin(i);
  const zEq =
    xEcl * Math.sin(i) * Math.sin(Ω) +
    yEcl * Math.sin(i) * Math.cos(Ω) +
    zEcl * Math.cos(i);

  // Convert Cartesian coordinates to RA and DEC
  const RA = Math.atan2(yEq, xEq);
  const DEC = Math.asin(zEq / Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq));

  // Convert RA from radians to degrees, then to hours, minutes, and seconds
  const RA_degrees = radiansToDegrees(RA);
  const RA_hms = convertRAtoHMS(RA_degrees);

  // Convert DEC from radians to degrees, then to degrees, minutes, and seconds
  const DEC_degrees = radiansToDegrees(DEC);
  const DEC_dms = convertDECtoDMS(DEC_degrees);

  return {
    RA: RA_hms,
    DEC: DEC_dms
  };
}

