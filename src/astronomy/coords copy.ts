import { OrbitalParams } from "./../types/OrbitalParams.type";

export const convertCoordsRelativeOrbitalToHeliocentricOrbital = (
  xRel: number,
  yRel: number,
  v: number,
  orbitalParams: OrbitalParams
) => {
  const { i, Ω, ω } = orbitalParams;
  const omegaPlusV = ω + v;

  // Calcolo di cos(omega + v) e sin(omega + v)
  const cosOmegaPlusV = Math.cos(omegaPlusV);
  const sinOmegaPlusV = Math.sin(omegaPlusV);

  // Calcolo di cos(i) e sin(i)
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  // Calcolo delle coordinate nel sistema heliocentrico
  const xOrb =
    xRel * (Math.cos(Ω) * cosOmegaPlusV - Math.sin(Ω) * sinOmegaPlusV * cosI);
  const yOrb =
    xRel * (Math.sin(Ω) * cosOmegaPlusV + Math.cos(Ω) * sinOmegaPlusV * cosI);
  const zOrb = yRel * (sinOmegaPlusV * sinI);

  return { xOrb, yOrb, zOrb };
};

export const convertCoordsOrbitalToEcliptic = (
  xOrb: number,
  yOrb: number,
  orbitalParams: OrbitalParams
) => {
  const { i, Ω, ω } = orbitalParams;
  const xEcl =
    xOrb *
      (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i)) -
    yOrb *
      (Math.sin(Ω) * Math.cos(ω) + Math.cos(Ω) * Math.sin(ω) * Math.cos(i));

  const yEcl =
    xOrb *
      (Math.cos(Ω) * Math.sin(ω) + Math.sin(Ω) * Math.cos(ω) * Math.cos(i)) +
    yOrb *
      (Math.cos(Ω) * Math.cos(ω) - Math.sin(Ω) * Math.sin(ω) * Math.cos(i));

  const zEcl =
    xOrb * (Math.sin(ω) * Math.sin(i)) + yOrb * (Math.cos(ω) * Math.sin(i));

  return { xEcl, yEcl, zEcl };
};

export const convertCoordsEclipticToEquatorial = (
  xEcl: number,
  yEcl: number,
  zEcl: number
) => {
  // Converti in coordinate equatoriali
  const epsilonInRadians = 0.408407; // Obliquità dell'eclittica in gradi

  const xEq = xEcl;
  const yEq =
    yEcl * Math.cos(epsilonInRadians) - zEcl * Math.sin(epsilonInRadians);
  const zEq =
    yEcl * Math.sin(epsilonInRadians) + zEcl * Math.cos(epsilonInRadians);

  return { xEq, yEq, zEq };
};




/**
 * Converti le coordinate eliocentriche (x, y, z) in coordinate equatoriali (ascensione retta, declinazione).
 * 
 * @param {number} x - Coordinata x nel sistema eliocentrico in AU
 * @param {number} y - Coordinata y nel sistema eliocentrico in AU
 * @param {number} z - Coordinata z nel sistema eliocentrico in AU
 * @returns {object} Coordinate equatoriali {ra, dec}
 */
export const convertHeliocentricToCelestial = (x, y, z) => {
  // Calcola la distanza radiale r
  const r = Math.sqrt(x * x + y * y + z * z);
  
  // Calcola la declinazione δ
  const declination = Math.asin(z / r);
  
  // Calcola l'ascensione retta α
  const rightAscension = Math.atan2(y, x);
  
  // Converti i risultati in gradi
  const raDegrees = rightAscension * (180 / Math.PI);
  const decDegrees = declination * (180 / Math.PI);
  
  
  return {
    ra: raDegrees/15,
    dec: decDegrees
  };
};