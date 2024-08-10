import { Angle } from "@models/position/Angle";
import { SphericalEclipticCoords } from "@types";
import { centuriesFromJ1900 } from "../../utils/dates";

export const calcMoonSphericalEclipticalCoordsAtDate = (
  date: Date
): SphericalEclipticCoords => {
  const DTR = Math.PI / 180.0; // Conversione da gradi a radianti
  const T = centuriesFromJ1900(date);
  //const T = 0.799301848;

  const commonAdditive =
    0.003964 * Math.sin(DTR * (346.56 + 132.87 * T - 0.0091731 * T * T));

  const Omega =
    259.183275 - 1934.142 * T + 0.002078 * T * T + 0.0000022 * T * T * T;
  const Omega_rad = Omega * DTR;

  // Calcolo dell'anomalia media della Luna (MP)
  let MP = ((1.44e-5 * T + 0.009192) * T + 477198.8491) * T + 296.104608;
  MP +=
    0.000817 * Math.sin(DTR * (51.2 + 20.2 * T)) +
    0.002541 * Math.sin(Omega_rad);

  const MP_rad = MP * DTR;
  console.log("MP:", MP);

  // Calcolo dell'elongazione media della Luna (D)
  let D = ((1.9e-6 * T - 0.001436) * T + 445267.1142) * T + 350.737486;
  D +=
    0.002011 * Math.sin(DTR * (51.2 + 20.2 * T)) +
    commonAdditive +
    0.2001964 * Math.sin(Omega_rad);

  const D_rad = DTR * D;

  console.log("D:", D);

  // Calcolo della distanza media della Luna dal nodo ascendente (F)
  let F =
    11.250889 + 483202.0251 * T - 0.003211 * T * T - 0.0000003 * T * T * T;
  F +=
    commonAdditive -
    0.024691 * Math.sin(Omega_rad) -
    0.004328 * Math.sin(DTR * (Omega + 275.05 - 2.3 * T));
  const F_rad = F * DTR;

  // Calcolo della longitudine media della Luna (LP)
  let LP_0 = ((1.9e-6 * T - 0.001133) * T + 481267.8831) * T + 270.434164;
  LP_0 += 0.000233 * Math.sin(DTR * (51.2 + 20.2 * T));
  LP_0 +=
    0.000233 * Math.sin(DTR * (51.2 + 20.2 * T)) +
    commonAdditive +
    +0.001964 * Math.sin(Omega_rad);

  console.log("LP:", LP_0);

  // Calcolo dell'anomalia media del Sole (M)
  let M = ((-3.3e-6 * T - 0.00015) * T + 35999.0498) * T + 358.475833;
  M -= -0.001778 * Math.sin(DTR * (51.2 + 20.2 * T)) + commonAdditive;
  const M_rad = M * DTR;
  console.log("M:", M);

  const e = 1 - 0.02495 * T - 0.000752 * T * T;

  const L =
    LP_0 +
    6.28875 * Math.sin(MP_rad) +
    1.274018 * Math.sin(2 * D_rad - MP_rad) +
    0.658309 * Math.sin(2 * D_rad) +
    0.213616 * Math.sin(2 * MP_rad) -
    0.185596 * Math.sin(M_rad) * e -
    0.114336 * Math.sin(2 * F_rad) +
    0.058793 * Math.sin(2 * D_rad - 2 * MP_rad) +
    0.057212 * Math.sin(2 * D_rad - M_rad - MP_rad) * e +
    0.05332 * Math.sin(2 * D_rad + MP_rad) +
    0.045874 * Math.sin(2 * D_rad - M_rad) * e +
    0.041024 * Math.sin(MP_rad - M_rad) * e -
    0.034718 * Math.sin(D_rad) -
    0.030465 * Math.sin(M_rad + MP_rad) +
    0.015326 * Math.sin(2 * D_rad - 2 * F_rad) -
    0.012528 * Math.sin(2 * F_rad + MP_rad) -
    0.01098 * Math.sin(2 * F_rad - MP_rad) +
    0.010674 * Math.sin(4 * D_rad - MP_rad) +
    0.010034 * Math.sin(3 * MP_rad) +
    0.008548 * Math.sin(4 * D_rad - 2 * MP_rad) -
    0.00791 * Math.sin(M_rad - MP_rad + 2 * D_rad) * e -
    0.006783 * Math.sin(2 * D_rad + M_rad) * e +
    0.005162 * Math.sin(MP_rad - D_rad) +
    0.005 * Math.sin(M_rad + D_rad) * e +
    0.004049 * Math.sin(MP_rad - M_rad + 2 * D_rad) * e +
    0.003996 * Math.sin(2 * MP_rad + 2 * D_rad) +
    0.003862 * Math.sin(4 * D_rad) +
    0.003665 * Math.sin(2 * D_rad - 3 * MP_rad) +
    0.002695 * Math.sin(2 * MP_rad - M_rad) * e +
    0.002602 * Math.sin(MP_rad - 2 * F_rad - 2 * D_rad) +
    0.002396 * Math.sin(2 * D_rad - M_rad - 2 * MP_rad) * e -
    0.002349 * Math.sin(MP_rad + D_rad) +
    0.002249 * Math.sin(2 * D_rad - 2 * M_rad) * e * e -
    0.002125 * Math.sin(2 * MP_rad + M_rad) * e -
    0.002079 * Math.sin(2 * M_rad) * e * e +
    0.002059 * Math.sin(2 * D_rad - MP_rad - 2 * M_rad) * e * e -
    0.001773 * Math.sin(MP_rad + 2 * D_rad - 2 * F_rad) -
    0.001595 * Math.sin(2 * F_rad + 2 * D_rad) +
    0.00122 * Math.sin(4 * D_rad - M_rad - MP_rad) * e -
    0.00111 * Math.sin(2 * MP_rad + 2 * F_rad) +
    0.000892 * Math.sin(MP_rad - 3 * D_rad) -
    0.000811 * Math.sin(M_rad + MP_rad + 2 * D_rad) * e +
    0.000761 * Math.sin(4 * D_rad - M_rad - 2 * MP_rad) * e +
    0.000717 * Math.sin(MP_rad - 2 * M_rad) * e * e +
    0.000704 * Math.sin(MP_rad - 2 * M_rad - 2 * D_rad) * e +
    0.000693 * Math.sin(M_rad - MP_rad + 2 * D_rad) * e +
    0.000598 * Math.sin(2 * D_rad - M_rad - 2 * F_rad) * e +
    0.00055 * Math.sin(MP_rad + 4 * D_rad) +
    0.000538 * Math.sin(4 * MP_rad) +
    0.000521 * Math.sin(4 * D_rad - M_rad) * e +
    0.000486 * Math.sin(2 * MP_rad - D_rad);
  console.log("L:", L);

  const B0 =
    5.128189 * Math.sin(F_rad) +
    0.280606 * Math.sin(MP_rad + F_rad) +
    0.277693 * Math.sin(MP_rad - F_rad) +
    0.173238 * Math.sin(2 * D_rad - F_rad) +
    0.055413 * Math.sin(2 * D_rad + F_rad - MP_rad) +
    0.046272 * Math.sin(2 * D_rad - F_rad - MP_rad) +
    0.032573 * Math.sin(2 * D_rad + F_rad) +
    0.017198 * Math.sin(2 * MP_rad + F_rad) +
    0.009267 * Math.sin(2 * D_rad + MP_rad - F_rad) +
    0.008823 * Math.sin(2 * MP_rad - F_rad) +
    e * 0.008247 * Math.sin(2 * D_rad - M_rad - F_rad) +
    0.004323 * Math.sin(2 * D_rad - F_rad - 2 * MP_rad) +
    0.0042 * Math.sin(2 * D_rad + F_rad + MP_rad) +
    e * 0.003372 * Math.sin(F_rad - M_rad - 2 * D_rad) +
    e * 0.002472 * Math.sin(2 * D_rad + F_rad - M_rad) +
    e * 0.002222 * Math.sin(2 * D_rad + F_rad - M_rad) +
    e * 0.002072 * Math.sin(2 * D_rad - F_rad - M_rad - MP_rad) +
    e * 0.001877 * Math.sin(F_rad - M_rad + MP_rad) +
    0.001828 * Math.sin(4 * D_rad - F_rad - MP_rad) -
    e * 0.001803 * Math.sin(F_rad + M_rad) -
    0.00175 * Math.sin(3 * F_rad) +
    e * 0.00157 * Math.sin(MP_rad - M_rad - F_rad) -
    0.001487 * Math.sin(F_rad + D_rad) -
    e * 0.001481 * Math.sin(F_rad + M_rad + MP_rad) +
    e * 0.001417 * Math.sin(F_rad - M_rad - MP_rad) +
    e * 0.00135 * Math.sin(F_rad - M_rad) +
    0.00133 * Math.sin(F_rad - D_rad) +
    0.001106 * Math.sin(F_rad + 3 * MP_rad) +
    0.00102 * Math.sin(4 * D_rad - F_rad) +
    0.000833 * Math.sin(F_rad + 4 * D_rad - MP_rad) +
    0.000781 * Math.sin(MP_rad - 3 * F_rad) +
    0.00067 * Math.sin(F_rad + 4 * D_rad - 2 * MP_rad) +
    0.000606 * Math.sin(2 * D_rad - 3 * F_rad) +
    0.000597 * Math.sin(2 * D_rad + 2 * MP_rad - F_rad) +
    e * 0.000492 * Math.sin(2 * D_rad + MP_rad - M_rad - F_rad) +
    0.00045 * Math.sin(2 * MP_rad - F_rad - 2 * D_rad) +
    0.000439 * Math.sin(3 * MP_rad - F_rad) +
    0.000423 * Math.sin(F_rad + 2 * D_rad + 2 * MP_rad) +
    0.000422 * Math.sin(2 * D_rad - F_rad - 3 * MP_rad) -
    e * 0.000367 * Math.sin(M_rad + F_rad + 2 * D_rad - MP_rad) -
    e * 0.000353 * Math.sin(M_rad + F_rad + 2 * D_rad) +
    0.000331 * Math.sin(F_rad + 4 * D_rad) +
    e * 0.000317 * Math.sin(2 * D_rad + F_rad + MP_rad) +
    e * e * 0.000306 * Math.sin(2 * D_rad - 2 * M_rad - F_rad) -
    0.000283 * Math.sin(MP_rad + 3 * F_rad);

  const w1 = 0.0004664 * Math.cos(Omega_rad);
  const w2 = 0.0000754 * Math.cos(DTR * (Omega + 275.05 - 2.3 * T));

  const B = B0 * (1 - w1 - w2);
  console.log("B:", B);

  // const LRad = toRadians(normalizeAngleD(L));
  // //const BRad = normalizeAngleR(toRadians(normalizeAngleD(B)) - 0.015);
  // const BRad = toRadians(normalizeAngleD(B)) - 0.015;
  // //  const BRad = toRadians(normalizeAngleD(B));

  const angleL = new Angle().setDegrees(normalizeAngleD(L));
  const angleB = new Angle().setDegrees(normalizeAngleD(B));
  angleB.setRadians(angleB.radians() - 0.015);

  console.warn("Long and Lat in teoria", 2.7889, 0.028601);

  return {
    lng: angleL,
    lat: angleB,
    r: 1,
  };
};

export const normalizeAngleD = (degrees: number) => {
  return ((degrees % 360) + 360) % 360;
  //return degrees % 360;
};
