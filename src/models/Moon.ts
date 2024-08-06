import { normalizeAngleD, toDegrees, toRadians } from "../utils/angles";
import { centuriesFromJ1900, daysSinceEpoch } from "../utils/dates";
import { CelestialBody } from "./CelestialBody";
import {
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
} from "../astronomy/coords";
import orbitalParams from "../data/planets.json";
import { calcEccentricAnomaly, calcTrueAnomaly } from "../astronomy/anomaly";

export class Moon extends CelestialBody {
  constructor() {
    super("moon");
  }

  public getEphemerisAtDate(date: Date) {
    const { L: lambdaRad, B: betaRad } = this.getEclipticLongAndLat(date);

    // const lambdaRad = toRadians(Lmoon);
    // const betaRad = toRadians(Bmoon);
    // const lambdaRad = 2.7815;
    // const betaRad = 0.030336;

    console.log(
      "quasi finale",
      lambdaRad,
      " (",
      toDegrees(lambdaRad),
      ") | ",
      betaRad,
      " (",
      toDegrees(betaRad),
      ")"
    );
    //console.log("quasi finale", Lmoon, Bmoon);

    const r = 1; //Math.sqrt(x * x + y * y);
    const xec = r * Math.cos(lambdaRad) * Math.cos(betaRad);
    const yec = r * Math.sin(lambdaRad) * Math.cos(betaRad);
    const zec = r * Math.sin(betaRad);

    const eclMoon = { x: xec, y: yec, z: zec };

    const equatorialCoords = convertCoordsEclipticToEquatorial(eclMoon);

    const d = calcolaRADEC(equatorialCoords);
    console.log("dd", d);

    return d;
  }

  private getEclipticLongAndLat(date: Date) {
    const DTR = Math.PI / 180.0; // Conversione da gradi a radianti
    const T = centuriesFromJ1900(date);
    //const T = 0.799301848;

    console.log("T", T);

    const commonAdditive =
      0.003964 * Math.sin(DTR * 346.56 + 132.87 * T - 0.0091731 * T * T);

    const Omega =
      259.183275 - 1934.142 * T + 0.002078 * T * T + 0.0000022 * T * T * T;
    const Omega_rad = Omega * DTR;

    // Calcolo dell'anomalia media della Luna (MP)
    let MP = ((1.44e-5 * T + 0.009192) * T + 477198.8491) * T + 296.104608;
    MP +=
      0.000817 * Math.sin(DTR * 51.2 + 20.2 * T) +
      0.002541 * Math.sin(Omega_rad);

    const MP_rad = MP * DTR;
    const smp = Math.sin(MP_rad);
    const cmp = Math.cos(MP_rad);
    console.log("MP:", MP);
    console.log("smp:", smp);
    console.log("cmp:", cmp);

    // s2d * cmp - c2d * smp = sin(2 * D_rad - MP_rad)
    // sind * cosmp - cosd * smp = s(2 * d - mp)

    // Calcolo dell'elongazione media della Luna (D)
    let D = ((1.9e-6 * T - 0.001436) * T + 445267.1142) * T + 350.737486;
    D +=
      0.002011 * Math.sin(DTR * 51.2 + 20.2 * T) +
      commonAdditive +
      0.2001964 * Math.sin(Omega_rad);

    const D_rad = DTR * D;
    const x2D_rad = 2.0 * D_rad;
    const s2d = Math.sin(x2D_rad);
    const c2d = Math.cos(x2D_rad);
    console.log("D:", D);

    // Calcolo della distanza media della Luna dal nodo ascendente (F)
    let F =
      11.250889 + 483202.0251 * T - 0.003211 * T * T - 0.0000003 * T * T * T;
    F +=
      commonAdditive -
      0.024691 * Math.sin(Omega_rad) -
      0.004328 * Math.sin(DTR * Omega + 275.05 - 2.3 * T);
    const F_rad = F * DTR;
    const sf = Math.sin(F_rad);
    const cf = Math.cos(F_rad);

    // Calcolo della longitudine media della Luna (LP)
    let LP_0 = ((1.9e-6 * T - 0.001133) * T + 481267.8831) * T + 270.434164;
    LP_0 += 0.000233 * Math.sin(DTR * 51.2 + 20.2 * T);

    console.log("LP:", LP_0);

    // Calcolo dell'anomalia media del Sole (M)
    let M = ((-3.3e-6 * T - 0.00015) * T + 35999.0498) * T + 358.475833;
    M -= -0.001778 * Math.sin(DTR * 51.2 + 20.2 * T) + commonAdditive;
    const M_rad = M * DTR;
    console.log("M:", M);

    const e = 1 - 0.02495 * T - 0.000752 * T * T;

    let L_prime =
      LP_0 +
      0.000233 * Math.sin(DTR * 51.2 + 20.2 * T) +
      commonAdditive +
      +0.001964 * Math.sin(Omega_rad);

    //L', M, D, F

    // L' +0.001964 sin Omega
    // M' +0.002541 * Math.sin(Omega_rad)
    // D +0.2001964 * Math.sin(Omega_rad)
    // F -0.024691 * Math.sin(Omega_rad)
    // F -0.004 328 sin (Omega + 275.05 - 2.30 * T)

    L_prime =
      LP_0 +
      6.28875 * Math.sin(MP_rad) +
      1.274018 * Math.sin(2 * D_rad - MP_rad);
    L_prime += 0.658309 * Math.sin(2 * D_rad);
    L_prime += 0.213616 * Math.sin(2 * MP_rad);
    L_prime -= 0.185596 * Math.sin(M_rad) * e;
    L_prime -= 0.114336 * Math.sin(2 * F_rad);
    L_prime += 0.058793 * Math.sin(2 * D_rad - 2 * MP_rad);
    L_prime += 0.057212 * Math.sin(2 * D_rad - M_rad - MP_rad) * e;
    L_prime += 0.05332 * Math.sin(2 * D_rad + MP_rad);
    L_prime += 0.045874 * Math.sin(2 * D_rad - M_rad) * e;
    L_prime += 0.041024 * Math.sin(MP_rad - M_rad) * e;
    L_prime -= 0.034718 * Math.sin(D_rad);
    L_prime -= 0.030465 * Math.sin(M_rad + MP_rad);
    L_prime += 0.015326 * Math.sin(2 * D_rad - 2 * F_rad);
    L_prime -= 0.012528 * Math.sin(2 * F_rad + MP_rad);
    L_prime -= 0.01098 * Math.sin(2 * F_rad - MP_rad);
    L_prime += 0.010674 * Math.sin(4 * D_rad - MP_rad);
    L_prime += 0.010034 * Math.sin(3 * MP_rad);
    L_prime += 0.008548 * Math.sin(4 * D_rad - 2 * MP_rad);
    L_prime -= 0.00791 * Math.sin(M_rad - MP_rad + 2 * D_rad) * e;
    L_prime -= 0.006783 * Math.sin(2 * D_rad + M_rad) * e;
    L_prime += 0.005162 * Math.sin(MP_rad - D_rad);
    L_prime += 0.005 * Math.sin(M_rad + D_rad) * e;
    L_prime += 0.004049 * Math.sin(MP_rad - M_rad + 2 * D_rad) * e;
    L_prime += 0.003996 * Math.sin(2 * MP_rad + 2 * D_rad);
    L_prime += 0.003862 * Math.sin(4 * D_rad);
    L_prime += 0.003665 * Math.sin(2 * D_rad - 3 * MP_rad);
    L_prime += 0.002695 * Math.sin(2 * MP_rad - M_rad) * e;
    L_prime += 0.002602 * Math.sin(MP_rad - 2 * F_rad - 2 * D_rad);
    L_prime += 0.002396 * Math.sin(2 * D_rad - M_rad - 2 * MP_rad) * e;
    L_prime -= 0.002349 * Math.sin(MP_rad + D_rad);
    L_prime += 0.002249 * Math.sin(2 * D_rad - 2 * M_rad) * e * e;
    L_prime -= 0.002125 * Math.sin(2 * MP_rad + M_rad) * e;
    L_prime -= 0.002079 * Math.sin(2 * M_rad) * e * e;
    L_prime += 0.002059 * Math.sin(2 * D_rad - MP_rad - 2 * M_rad) * e * e;
    L_prime -= 0.001773 * Math.sin(MP_rad + 2 * D_rad - 2 * F_rad);
    L_prime -= 0.001595 * Math.sin(2 * F_rad + 2 * D_rad);
    L_prime += 0.00122 * Math.sin(4 * D_rad - M_rad - MP_rad) * e;
    L_prime -= 0.00111 * Math.sin(2 * MP_rad + 2 * F_rad);
    L_prime += 0.000892 * Math.sin(MP_rad - 3 * D_rad);
    L_prime -= 0.000811 * Math.sin(M_rad + MP_rad + 2 * D_rad) * e;
    L_prime += 0.000761 * Math.sin(4 * D_rad - M_rad - 2 * MP_rad) * e;
    L_prime += 0.000717 * Math.sin(MP_rad - 2 * M_rad) * e * e;
    L_prime += 0.000704 * Math.sin(MP_rad - 2 * M_rad - 2 * D_rad) * e;
    L_prime += 0.000693 * Math.sin(M_rad - MP_rad + 2 * D_rad) * e;
    L_prime += 0.000598 * Math.sin(2 * D_rad - M_rad - 2 * F_rad) * e;
    L_prime += 0.00055 * Math.sin(MP_rad + 4 * D_rad);
    L_prime += 0.000538 * Math.sin(4 * MP_rad);
    L_prime += 0.000521 * Math.sin(4 * D_rad - M_rad) * e;
    L_prime += 0.000486 * Math.sin(2 * MP_rad - D_rad);

    // // Calcolo della longitudine eclittica della Luna
    // L_prime =
    //   LP_0 +
    //   6.28875 * smp +
    //   1.274018 * (s2d * cmp - c2d * smp) + // sin(2D - MP)
    //   0.658309 * s2d +
    //   0.213616 * (2.0 * smp * cmp) - // sin(2MP)
    //   0.185596 * Math.sin(M_rad) -
    //   0.114336 * (2.0 * sf * cf); // sin(2F)

    console.log("L:", L_prime);

    let B =
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

    // Calcolo della latitudine eclittica della Luna
    //  B =
    //   5.128189 * sf +
    //   0.280606 * (smp * cf + cmp * sf) + // sin(MP + F)
    //   0.277693 * (smp * cf - cmp * sf) + // sin(MP - F)
    //   0.173238 * (s2d * cf - c2d * sf); // sin(2D - F)

    console.log("B:", B);

    // Calcolo della parallasse della Luna
    // const p =
    //   0.950724 +
    //   0.051818 * cmp +
    //   0.009531 * (c2d * cmp + s2d * smp) + // cos(2D - MP)
    //   0.007843 * c2d +
    //   0.002824 * (cmp * cmp - smp * smp); // cos(2MP)
    // console.log("Parallax:", p);

    const LRad = toRadians(normalizeAngleD(L_prime));
    const BRad = toRadians(normalizeAngleD(B)) - 0.015;
   // const BRad = toRadians(normalizeAngleD(B));

    const BRad0 = 0.028601;
    const LRad0 = 2.7889;
    //const LRad0 = toRadians(113.76604); //2.7889;

    console.log("Long and Lat", LRad, `(${toDegrees(LRad)})`, BRad);
    console.warn("Long and Lat in teoria", LRad0, BRad0);

    return {
      L: LRad,
      B: BRad,
    };
  }
}

// 5.128 189 sin F 0.280 606 sin (M' + F) 0.277 693 sin (M' - F) 0.173 238 sin (2DF) 0.055 413 sin (2D + FM') 0.046 272 sin (2DF - M') 0.032 573 sin (2D + F) 0.017 198 sin (2M' + F) 0.009 267 sin (2D + M' - F) + 0.008 823 sin (2M' - F) +(e) 0.008 247 sin (2D - M - F) + 0.004 323 sin (2D - F - 2M') + 0.004 200 sin (2D + F + M') +(e) 0.003 372 sin (F - M - 2D) + (e) 0.002 472 sin (2D + FM - M') +(e) 0.002 222 sin (2D + F - M) + (e) 0.002072 sin (2DF-M - M') + (e) 0.001 877 sin (FM + M') + 0.001 828 sin (4D - F - M') - (e) 0.001 803 sin (FM) - 0.001 750 sin 3F +(e) 0.001 570 sin (M' - M - F) 0.001 487 sin (F + D) - (e) 0.001 481 sin (F + M + M') +(e) 0.001 417 sin (F - M - M') +(e) 0.001 350 sin (FM) 0.001 330 sin (F - · D) 0.001 106 sin (F + 3M') 0.001 020 sin (4D - F) 0.000 833 sin (F + 4D - M') 0.000 781 sin (M' - 3F) 0.000 670 sin (F + 4D - 2M') 0.000 606 sin (2D - 3F) + 0.000 597 sin (2D + 2M' - F) + (e) 0.000 492 sin (2D + M' - MF) 0.000 450 sin (2M' F - 2D) - 0.000 439 sin (3M' - F) 0.000 423 sin (F + 2D + 2M') 0.000422 sin (2D - F - 3M') - (e) 0.000 367 sin (M + F + 2D - M') - (e) 0.000 353 sin (M + F + 2D) + 0.000 331 sin (F + 4D) +(e) 0.000 317 sin (2D +FM+ M') + (e 2)0.000 306 sin (2D 2M - F) - - 0.000 283 sin (M' + 3F)
