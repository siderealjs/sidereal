import { OrbitalParams } from "./../types/OrbitalParams.type";
import {
  calcEccentricAnomaly,
  calcMeanAnomalyAtDate,
  calcTrueAnomaly,
} from "./calculateAnomaly";



export const calcAnomalyAndRadiusAtDate = (
  givenDate: Date,
  orbitalParams: OrbitalParams
): { v: number; r: number } => {
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

  return { v, r };
};
