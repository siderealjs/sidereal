import { normalizeAngleD, toDegrees, toRadians } from "../utils/angles";
import { daysSinceEpoch } from "../utils/dates";
import { calcEccentricAnomaly, calcTrueAnomaly } from "./anomaly";
import orbitalParams from "../data/planets.json";

export function getLunarCoordMethod2(date: Date) {
  function calcolaLongitudineEclitticaNonCorretta(deltaDays: number) {
    const tassoMovimentoLuna = 13.176339686; // Tasso di movimento della Luna in gradi per giorno
    const L_0 = 218.316433; // Longitudine eclittica media della Luna all'epoca standard

    const L_uncor = L_0 + tassoMovimentoLuna * deltaDays;

    return normalizeAngleD(L_uncor);
  }

  //mean longitude of the ascending node
  function calcolaLongitudineOfAscendingNodeNonCorretta(deltaDays: number) {
    const LonAscNode = 125.044522; // Longitudine dell'ascendente della Luna (at epoch?)
    const varIazione = -0.0529539;
    //const varIazione = -0.05302712328;
    // Passaggio 9: Calcolare la Longitudine Media dell'Ascendente della Luna (Omega)
    const Omega = LonAscNode + varIazione * deltaDays;

    console.log(Omega);
    return normalizeAngleD(Omega);
  }

  function calcolaMeanAnomalyNonCorretta(deltaDays: number, L_uncor: number) {
    const LonAtPeri = 83.353451; // Longitudine al perigeo della Luna

    const Mm = L_uncor - 0.1114041 * deltaDays - LonAtPeri;

    return normalizeAngleD(Mm);
  }

  const calculateMSunAndLsun = (date: Date) => {
    const deltaDays = daysSinceEpoch(date);

    const mSun0 = normalizeAngleD(
      (360.0 * deltaDays) / 365.242191 + 280.466069 - 282.938346
    );

    const mSun = mSun0;
    const sunE = calcEccentricAnomaly(
      toRadians(mSun),
      orbitalParams["earth"].e
    );
    const sunV = calcTrueAnomaly(sunE, orbitalParams["earth"].e);

    const lSun = normalizeAngleD(toDegrees(sunV + toRadians(282.938346)));

    return { mSun, lSun };
  };

  function adjustQuadrant(y: number, x: number) {
    /**
     * Compute a quadrant adjustment for the inv tan
     * function given x and y.
     *
     * @param {number} y - y coordinate
     * @param {number} x - x coordinate
     * @return {number} quadrant adjustment
     */
    let dQA = 0.0;

    if (y > 0.0 && x < 0.0) {
      dQA = 180.0;
    } else if (y < 0.0 && x < 0.0) {
      dQA = 180.0;
    } else if (y < 0.0 && x > 0.0) {
      dQA = 360.0;
    }

    return dQA;
  }

  const deltaDays = daysSinceEpoch(date);

  console.log(deltaDays);

  const { lSun, mSun } = calculateMSunAndLsun(date);

  // L_uncor = 13.176339686 * De + ASTOrbits.getOEObjLonAtEpoch(idxMoon)
  const long_eclittica_non_corretta =
    calcolaLongitudineEclitticaNonCorretta(deltaDays);

  //Omega = ASTOrbits.getOEObjLonAscNode(idxMoon) - 0.0529539 * De
  const LongitudineOfAscendingNode_Non_Corretta =
    calcolaLongitudineOfAscendingNodeNonCorretta(deltaDays);

  // Mm = L_uncor - 0.1114041 * De - ASTOrbits.getOEObjLonAtPeri(idxMoon)
  const meanANomaly_non_corretta = calcolaMeanAnomalyNonCorretta(
    deltaDays,
    long_eclittica_non_corretta
  );

  //correzione dell'equazione annuale (Ae):
  const Ae = 0.1858 * Math.sin(toRadians(mSun));

  // Calculate the evection correction (Ev)
  //     Ev = 1.2739 * ASTMath.SIN_D(2 * (L_uncor - Lsun) - Mm)
  const Ev =
    1.2739 *
    Math.sin(
      toRadians(
        2 * (long_eclittica_non_corretta - lSun) - meanANomaly_non_corretta
      )
    );

  //  Calculate the mean anomaly correction.
  //     Ca = Mm + Ev - Ae - 0.37 * ASTMath.SIN_D(Msun)
  const Ca =
    meanANomaly_non_corretta + Ev - Ae - 0.37 * Math.sin(toRadians(mSun));

  // Calculate the Moon's true anomaly (Vmoon) //already in degrees
  //     Vmoon = 6.2886 * ASTMath.SIN_D(Ca) + 0.214 * ASTMath.SIN_D(2 * Ca)
  const Vmoon =
    6.2886 * Math.sin(toRadians(Ca)) + 0.214 * Math.sin(2 * toRadians(Ca));
  //const Vmoon = 1.441898099193846E+02

  //  Calculate the corrected ecliptic longitude (L_p)
  // L_p = L_uncor + Ev + Vmoon - Ae
  const L_p = long_eclittica_non_corretta + Ev + Vmoon - Ae;

  // 18. Calculate the variation correction (V)
  // V = 0.6583 * sin[2 * (L_p - Lsun)]
  const V = 0.6583 * Math.sin(2 * toRadians(L_p - lSun));

  // 19. Calculate the Moon's true ecliptic longitude (L_t)
  // L_t = L_p + V
  const L_t = L_p + V;

  // 20. Compute the corrected ecliptic longitude of the ascending node (Omega_p)
  // Omega_p = Omega - 0.16 * sin(Msun)
  const Omega_p =
    LongitudineOfAscendingNode_Non_Corretta - 0.16 * Math.sin(toRadians(mSun));

  // 21. Calculate y = sin(L_t - Omega_p) * cos(inclination)
  // where inclination is needed for this calculation.
  const inclin = 5.1453964;
  // Calculate y = sin(L_t - Omega_p) * cos(inclination)
  const y = Math.sin(toRadians(L_t - Omega_p)) * Math.cos(toRadians(inclin));

  // Calculate x = cos(L_t - Omega_p)
  const x = Math.cos(toRadians(L_t - Omega_p));

  console.log("x,y =", x, y);
  // Compute T = inv tan(y/x)
  //let dT = toDegrees(Math.atan2(y, x));
  let dT = toDegrees(Math.atan(y / x));

  // Use the algebraic signs of y and x to determine a quadrant adjustment and apply it to T.
  const adjustment = adjustQuadrant(y, x);
  dT = dT + adjustment;
  console.log("dT=", Omega_p, dT);

  // 25. Calculate the Moon's ecliptic longitude
  const Lmoon = normalizeAngleD(Omega_p + dT);

  // 27. Calculate the Moon's ecliptic latitude
  const Bmoon = toDegrees(
    Math.asin(Math.sin(toRadians(L_t - Omega_p)) * Math.sin(toRadians(inclin)))
  );

  const lambdaRad = toRadians(Lmoon);
  const betaRad = toRadians(Bmoon);
  // const lambdaRad = 2.7815;
  // const betaRad = 0.030336;

  //console.log("quasi finale", Lmoon, Bmoon);

  return {
    L: lambdaRad,
    B: betaRad,
  };
}
