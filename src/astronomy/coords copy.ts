import { OrbitalParams } from "./../types/OrbitalParams.type";

export const calcCoordsOrbital = (
  E: number,
  r: number,
  orbitalParams: OrbitalParams
) => {
  // eccentricita
  const { e } = orbitalParams;
  // Calcola le coordinate nel piano orbitale
  const x = r * (Math.cos(E) - e);
  const y = r * Math.sqrt(1 - e * e) * Math.sin(E);

  // Ritorna un oggetto con le coordinate x, y
  return {
    xOrb: x,
    yOrb: y,
  };
};

export const convertCoordsOrbitalToEclipticSTRONZA = (
  xRel: number,
  yRel: number,
  orbitalParams: OrbitalParams
) => {
  const { i, ω } = orbitalParams;

  const x_ecl = xRel * Math.cos(ω) - yRel * (Math.sin(ω) * Math.cos(i));
  const y_ecl = xRel * Math.sin(ω) + yRel * (Math.cos(ω) * Math.cos(i));
  const z_ecl = yRel * Math.sin(i);

  // Ritorna un oggetto con le coordinate x, y, e z nel sistema eclittico
  return {
    xOrb: x_ecl,
    yOrb: y_ecl,
    zOrb: z_ecl,
  };
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

function convertiRAinOrari(rad) {
  // Converti RA da radianti a gradi
  const gradi = (rad * 180) / Math.PI;

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
function convertiDECinGradi(rad) {
  // Converti DEC da radianti a gradi
  const gradi = (rad * 180) / Math.PI;

  // Determina il segno per il formato
  const segno = gradi >= 0 ? "+" : "-";
  const gradiAssoluti = Math.abs(gradi);

  // Calcola gradi, minuti e secondi
  const gradiInt = Math.floor(gradiAssoluti);
  const minuti = Math.floor((gradiAssoluti - gradiInt) * 60);
  const secondi = Math.round(((gradiAssoluti - gradiInt) * 60 - minuti) * 60);

  return `${segno}${gradiInt.toString().padStart(2, "0")}° ${minuti
    .toString()
    .padStart(2, "0")}’ ${secondi.toString().padStart(2, "0")}”`;
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


  // // Correggi RA se è negativo
  // if (RA < 0) {
  //   RA += 2 * Math.PI;
  // }

  console.log("prima di formattare, ", RA, DEC);
  // Converti RA e DEC in formato leggibile
  const raFormattato = convertiRAinOrari(RA);
  const decFormattato = convertiDECinGradi(DEC);

  return {
    RA: raFormattato,
    DEC: decFormattato,
  };
}

export function calculateCoordinates(r, v, orbitalParams) {
  const { i, Ω, ω } = orbitalParams;

  // Calculate position in orbital plane
  const xOrb = r * Math.cos(ω + v);
  const yOrb = r * Math.sin(ω + v);

  // Convert to 3D coordinates
  const x = xOrb * (Math.cos(Ω) - Math.sin(Ω) * Math.cos(i));
  const y = xOrb * (Math.sin(Ω) + Math.cos(Ω) * Math.cos(i));
  const z = yOrb * Math.sin(i);

  return { x, y, z };
}

// export const calcCelstialParams = (v, orbitalParams) => {
//   const { e, ω, a, Ω, i } = orbitalParams;

//   const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

//   const xOrb = r * Math.cos(ω + v);
//   const yOrb = r * Math.sin(ω + v);

//   const x = xOrb * (Math.cos(Ω) - Math.sin(Ω) * Math.cos(i));
//   const y = xOrb * (Math.sin(Ω) + Math.cos(Ω) * Math.cos(i));
//   const z = yOrb * Math.sin(i);

//   const d = Math.sqrt(x * x + y * y);
//   const declination = Math.atan2(z, d);
//   const rightAscension = Math.atan2(y, x);

//   console.log('prima di conv', declination, rightAscension);

//   const raFormattato = convertiRAinOrari(rightAscension);
//   const decFormattato = convertiDECinGradi(declination);

//   return {
//     RA: raFormattato,
//     DEC: decFormattato,
//   };

// };

export const orbitalCoordsWithTrueAnomaly = (v, r) => {
  const xOrb = r * Math.cos(v);
  const yOrb = r * Math.sin(v);

  return { xOrb, yOrb };
};

export const maremma = (v, orbitalParams) => {
  const { e, ω, a, Ω, i } = orbitalParams;
  const epsilon = 23.44;

  // Calcolare la distanza radiale
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

  // Coordinate in termini del sistema eclittico
  const x =
    r *
    (Math.cos(ω + v) * Math.cos(Ω) -
      Math.sin(ω + v) * Math.sin(Ω) * Math.cos(i));
  const y =
    r *
    (Math.cos(ω + v) * Math.sin(Ω) +
      Math.sin(ω + v) * Math.cos(Ω) * Math.cos(i));
  const z = r * (Math.sin(ω + v) * Math.sin(i));

  // Coordinate in termini di sistema equatoriale
  // coordinate spaziali tridimensionali (x, y, z) nel sistema di riferimento equatoriale.
  // cordinate equatoriali cartesiane
  const xEq = x;
  const yEq = y * Math.cos(epsilon) - z * Math.sin(epsilon);
  const zEq = y * Math.sin(epsilon) + z * Math.cos(epsilon);

  // Calcolare l'ascensione retta e la declinazione
  const α = Math.atan2(yEq, xEq);
  const δ = Math.asin(zEq / Math.sqrt(xEq * xEq + yEq * yEq + zEq * zEq));

  console.log("PRE REV", xEq, yEq, zEq);
  return { α, δ };
  // return {
  //   alpha: convertiRAinOrari(α), // Ascensione retta in radianti
  //   declination: convertiDECinGradi(δ) // Declinazione in radianti
  // };
};

export const reverseDECandRA = (α, δ) => {
  const r = 1.4336214122696722;

  const y = r * Math.cos(δ) * Math.sin(α);
  const x = r * Math.cos(δ) * Math.cos(α);

  const z = r * Math.sin(δ);

  console.log("REVERSED,", x, y, z);
};

export const transformEquatorialToEcliptic = (xeq, yeq, zeq) => {
  const ε = 23.44;

  const xecl = xeq;
  const yecl = yeq * Math.cos(ε) - zeq * Math.sin(ε);
  const zecl = yeq * Math.sin(ε) + zeq * Math.cos(ε);
};

///////////////////
export const convertOrbitalToEcliptic = (x, y, orbitalParams) => {
  const { i, Ω, ω } = orbitalParams;

  // Calcola i coseni e seni degli angoli
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);

  // Matrici di rotazione
  const R_ω = [
    [cosω, -sinω, 0],
    [sinω, cosω, 0],
    [0, 0, 1],
  ];

  const R_i = [
    [1, 0, 0],
    [0, cosi, -sini],
    [0, sini, cosi],
  ];

  const R_Ω = [
    [cosΩ, -sinΩ, 0],
    [sinΩ, cosΩ, 0],
    [0, 0, 1],
  ];

  // Combinazione delle rotazioni
  const R_orbit = multiplyMatrices(R_Ω, multiplyMatrices(R_i, R_ω));

  // Applicare la rotazione alle coordinate orbitali
  const x_ecl = R_orbit[0][0] * x + R_orbit[0][1] * y;
  const y_ecl = R_orbit[1][0] * x + R_orbit[1][1] * y;
  const z_ecl = R_orbit[2][0] * x + R_orbit[2][1] * y;

  return { x: x_ecl, y: y_ecl, z: z_ecl };
};

// Funzione per moltiplicare due matrici 3x3
const multiplyMatrices = (A, B) => {
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
};
