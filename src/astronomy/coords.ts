import { Angle } from "@models/position/Angle";
import {
  SphericalEquatorialCoords,
  Cartesian2DCoords,
  Cartesian3DCoords,
  OrbitalParams,
  PolarCoords,
  SphericalEclipticCoords,
} from "@types";

import Constants from "../data/constants.json";

import {
  calcEccentricAnomaly,
  calcMeanAnomalyAtDate,
  calcTrueAnomaly,
} from "./anomaly";
import { AstroDate } from "@models/AstroDate";

export const calcCoordsPolarAtDate = (
  givenDate: AstroDate,
  orbitalParams: OrbitalParams
) => {
  const { a, e, n, M0 } = orbitalParams;

  // Calcolare l'anomalia media attuale

  const M = calcMeanAnomalyAtDate(M0, n, givenDate);
  //console.log("003: normalized M:", M, M * 180 /Math.PI, Mx * 180 / Math.PI);

  // Calcolare l'anomalia eccentrica
  const E = calcEccentricAnomaly(M, e);
  //console.log("004:: ecc anomaly E,", E);

  // Calcolare la vera anomalia
  const v = new Angle(calcTrueAnomaly(E, e));
  //console.log("005:: true anomaly", v);

  // Calcolare la distanza radiale
  //const r = a * (1 - e * Math.cos(E));
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v.radians()));

  return { v, r };
};

export const polarOrbitalToCartesianOrbital = (
  polarCoords: PolarCoords
): Cartesian2DCoords => {
  const { v, r } = polarCoords;

  const xOrb = r * Math.cos(v.radians());
  const yOrb = r * Math.sin(v.radians());

  return { x: xOrb, y: yOrb };
};

export const cartesianOrbitalToPolarOrbital = (
  cartesianCoords: Cartesian2DCoords
): PolarCoords => {
  const { x, y } = cartesianCoords;

  const r = Math.sqrt(x * x + y * y);
  const v = new Angle(Math.atan2(y, x)); // in radians

  return { r, v };
};

export const cartesianEclipticToCartesianEquatorial = (
  eclipticCoords: Cartesian3DCoords
): Cartesian3DCoords => {
  // inclination of equatorial plane over the ecliptic plane (radians)
  const epsilon = Constants.earthAxialTilt;

  const { x: xEcl, y: yEcl, z: zEcl } = eclipticCoords;
  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const xEq = xEcl;
  const yEq = cosEpsilon * yEcl - sinEpsilon * zEcl;
  const zEq = sinEpsilon * yEcl + cosEpsilon * zEcl;

  return {
    x: xEq,
    y: yEq,
    z: zEq,
  };
};

export const cartesianEquatorialToCartesianEcliptic = (
  equatorialCoords: Cartesian3DCoords
): Cartesian3DCoords => {
  // Inclination of equatorial plane over the ecliptic plane (radians)
  const epsilon = Constants.earthAxialTilt;

  const { x: xEq, y: yEq, z: zEq } = equatorialCoords;
  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const xEcl = xEq;
  const yEcl = cosEpsilon * yEq + sinEpsilon * zEq;
  const zEcl = -sinEpsilon * yEq + cosEpsilon * zEq;

  return {
    x: xEcl,
    y: yEcl,
    z: zEcl,
  };
};

export const convertCoordsEquatorialToEcliptic = (
  equatorialCoords: Cartesian3DCoords
): Cartesian3DCoords => {
  // inclination of equatorial plane over the ecliptic plane (radians)
  const epsilon = Constants.earthAxialTilt;

  const { x: xEq, y: yEq, z: zEq } = equatorialCoords;
  const cosEpsilon = Math.cos(epsilon);
  const sinEpsilon = Math.sin(epsilon);

  const xEcl = xEq;
  const yEcl = cosEpsilon * yEq + sinEpsilon * zEq;
  const zEcl = -sinEpsilon * yEq + cosEpsilon * zEq;

  return {
    x: xEcl,
    y: yEcl,
    z: zEcl,
  };
};

/**
 * Calcola la Declinazione (DEC) e l'Ascensione Retta (RA) e converte in formato leggibile.
 * @returns {Object} - Oggetto contenente RA e DEC nel formato leggibile.
 */
export function cartesianEquatorialToSphericalEquatorial(
  equatorialCoords: Cartesian3DCoords
) {
  const { x: xEq, y: yEq, z: zEq } = equatorialCoords;
  // Calcola la distanza radiale r
  const r = Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq);

  // Calcola la Declinazione (DEC) in radianti
  const DEC = new Angle(Math.asin(zEq / r));

  // Calcola l'Ascensione Retta (RA) in radianti
  const RA = new Angle(Math.atan2(yEq, xEq));

  // Normalizza RA a [0, 2π)
  // RA = (RA + 2 * Math.PI) % (2 * Math.PI);

  // // Correggi RA se è negativo
  // if (RA < 0) {
  //   RA += 2 * Math.PI;
  // }

  return {
    RA: RA.normalize(),
    DEC,
    r,
  };
}

export function sphericalEquatorialToCartesianEquatorial(
  sphericalCoords: SphericalEquatorialCoords
) {
  const { RA, DEC } = sphericalCoords;

  // Calcola le coordinate cartesiane equatoriali
  const xEq = Math.cos(DEC.radians()) * Math.cos(RA.radians());
  const yEq = Math.cos(DEC.radians()) * Math.sin(RA.radians());
  const zEq = Math.sin(DEC.radians());

  return {
    x: xEq,
    y: yEq,
    z: zEq,
  };
}

export function cartesianOrbitalToCartesianEcliptic(
  orbitalCoords: Cartesian2DCoords,
  { ω, Ω, i }: { ω: number; Ω: number; i: number }
): Cartesian3DCoords {
  const { x: xOrb, y: yOrb } = orbitalCoords;

  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);

  // Rotate around axis z (-w). This aligns the object periapsis to its ascending node.
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

export function cartesianEclipticToCartesianOrbital(
  eclipticCoords: Cartesian3DCoords,
  { ω, Ω, i }: { ω: number; Ω: number; i: number }
): Cartesian2DCoords {
  const { x: xEcl, y: yEcl, z: zEcl } = eclipticCoords;

  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);

  // Inversion of the rotation around the z-axis by -Ω (ascending node)
  const x2 = xEcl * cosΩ + yEcl * sinΩ;
  const y2 = -xEcl * sinΩ + yEcl * cosΩ;
  const z2 = zEcl; // z does not change during this rotation

  // Inversion of the rotation around the x-axis by -i (inclination)
  const x1 = x2;
  const y1 = y2 * cosi + z2 * sini;

  // Inversion of the rotation around the z-axis by -ω (argument of periapsis)
  const xOrb = x1 * cosω + y1 * sinω;
  const yOrb = -x1 * sinω + y1 * cosω;

  
  return { x: xOrb, y: yOrb };
}


export function polarOrbitalToSphericalEcliptic(
  polarCoords: PolarCoords,
  { ω, Ω, i }: { ω: number; Ω: number; i: number }
): SphericalEclipticCoords {
  const { v, r } = polarCoords;

  const longitude = v.radians() + ω + Ω;
  const latitude = Math.asin(Math.sin(i) * Math.sin(v.radians()));

  return {
    lat: new Angle(latitude).normalize(),
    lng: new Angle(longitude).normalize(),
    r,
  };
}

export const sphericalEclipticToCartesianEcliptic = (
  sphericalCoords: SphericalEclipticCoords
): Cartesian3DCoords => {
  const { lng: λ, lat: β, r } = sphericalCoords;

  const xEcl = r * Math.cos(λ.radians()) * Math.cos(β.radians());
  const yEcl = r * Math.sin(λ.radians()) * Math.cos(β.radians());
  const zEcl = r * Math.sin(β.radians());

  return { x: xEcl, y: yEcl, z: zEcl };
};

export const cartesianEclipticToSphericalEcliptic = (
  cartesianCoords: Cartesian3DCoords
) => {
  const { x, y, z } = cartesianCoords;

  const r = Math.sqrt(x * x + y * y + z * z);
  const λValue = Math.atan2(y, x);
  const λ = new Angle(λValue).normalize();

  const βValue = Math.atan2(z, Math.sqrt(x * x + y * y));
  const β = new Angle(βValue).normalize();

  return { lat: β, lng: λ, r };
};
