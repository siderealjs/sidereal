import { calcCoordsPolarAtDate } from "./../astronomy/coords";
import { CelestialBodyName } from "../types/ObjectName.type";
import { Position } from "./position/Position";
import { CelestialBody } from "./CelestialBody";
import { Earth } from "./Earth";
import { calcPhaseAngle, calculateQ } from "../astronomy/magnitude";

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
