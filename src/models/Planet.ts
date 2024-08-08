import { calcCoordsPolarAtDate } from "./../astronomy/coords";
import { CelestialBodyName } from "../types/ObjectName.type";
import { Position } from "./position/Position";
import { CelestialBody } from "./CelestialBody";
import { Earth } from "./Earth";
import { calcPhaseAngle, calculateQ } from "../astronomy/magnitude";

import readFile from "../../../astronomic-bin/dist/index.js";
import { daysBetweenDates, daysSinceEpoch } from "../utils/dates";

export class Planet extends CelestialBody {
  constructor(name: CelestialBodyName) {
    super(name);
  }

  public getPositionAtDate(date: Date) {
    const bodyPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthPosition = new Earth().getPositionAtDate(date);
    const bodyPosition = new Position().setOrbitalCoords(bodyPolarCoords);

    bodyPosition.convertOrbitalToEcliptic(this.orbitalParams);
    bodyPosition.convertToGeocentric(earthPosition);

    const dayKey = Math.round(
      2451544 + daysSinceEpoch(new Date("2024-08-09 00:00:00"))
    );
    console.log("dayke", dayKey);
    console.log("GABIRPONTE IL DJJJ", readFile(dayKey - 1));

    //const { X, Y, Z } = readFile(dayKey);

    const X = 6.954647769116639e7;
    const Y = 2.224054264658053e8;
    const Z = -1.937035103722617e6;
    const newPos = new Position().setEclipticCoords({
      x: X / 1.496e8,
      y: Y / 1.496e8,
      z: Z / 1.496e8,
    });
    //newPos.convertToGeocentric(earthPosition);
    console.log(
      newPos.getEquatorialCoords().spherical.RA.HMS(),
      newPos.getEquatorialCoords().spherical.DEC.DMS()
    );

    return bodyPosition;
  }

  public getMagnitude(date: Date) {
    const earthPosition = new Earth().getPositionAtDate(date);

    const bodyPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);
    const bodyPosition = new Position().setOrbitalCoords(bodyPolarCoords);
    bodyPosition.convertOrbitalToEcliptic(this.orbitalParams);

    const bodyEarthDistance = bodyPosition.calcDistanceFrom(earthPosition);

    const bodySunDistance = bodyPolarCoords.r;
    const earthSunDistance = earthPosition.getOrbitalCoords().polar.r;

    const phaseAngle = calcPhaseAngle(
      bodyEarthDistance,
      bodySunDistance,
      earthSunDistance
    );

    const phaseFactor = calculateQ(phaseAngle.degrees());

    const apparentMagnitude =
      this.orbitalParams.H +
      5 * Math.log10(bodyEarthDistance * bodySunDistance) -
      2.5 * Math.log10(phaseFactor);

    return apparentMagnitude;
  }
  // public getMagnitude(date: Date) {
  //   const earthParams = orbitalParams["earth"];

  //   const earthPolar = calcCoordsPolarAtDate(date, earthParams);
  //   const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

  //   const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

  //   const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

  //   const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
  //     earthHCOrbital,
  //     earthParams
  //   );

  //   const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
  //     bodyHCOrbital,
  //     this.orbitalParams
  //   );

  //   const dx = earthHCEcliptic.x - bodyHCEcliptic.x;
  //   const dy = earthHCEcliptic.y - bodyHCEcliptic.y;
  //   const dz = earthHCEcliptic.z - bodyHCEcliptic.z;

  //   // Calcola la distanza usando la formula euclidea
  //   const distanza = Math.sqrt(dx * dx + dy * dy + dz * dz);

  //   console.log("disanza oggetto-terra", distanza);
  //   console.log("distanza oggetto-sole", bodyPolar.r);

  //   const phaseAngle = calculateAlphaWikipedia(
  //     distanza,
  //     bodyPolar.r,
  //     earthPolar.r
  //   );
  //   console.log("phase angle", phaseAngle);

  //   const mm =
  //     this.orbitalParams.H +
  //     5 * Math.log10(distanza * bodyPolar.r) -
  //     2.5 * Math.log10(calculateQ(phaseAngle.degrees));

  //   // const mm2 =
  //   //   this.orbitalParams.Hemp +
  //   //   5 * Math.log10(distanza * bodyPolar.r) +
  //   //   calculateQemp("mars", phaseAngle.degrees);

  //   console.log("m apparent", mm);
  //   // console.log("m apparent empt", mm2);
  // }
}
