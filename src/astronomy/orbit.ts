import { OrbitalParams } from "./../types/OrbitalParams.type";
import {
  calcEccentricAnomaly,
  calcMeanAnomalyAtDate,
  calcTrueAnomaly,
} from "./calculateAnomaly";

export const calcAnomalyAndRadiusAtDate = (
  givenDate: Date,
  orbitalParams: OrbitalParams
): { E: number; r: number } => {
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

  return { E, r };
};

export function calculateRAandDEC(r, nu, orbitalParams) {
  // Convert degrees to radians
  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Convert radians to degrees
  function radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
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
    const seconds = (
      (Math.abs(decDegrees) - degrees - minutes / 60) *
      3600
    ).toFixed(1);
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
    DEC: DEC_dms,
  };
}
