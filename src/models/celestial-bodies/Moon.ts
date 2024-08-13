import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { calcMoonSphericalEclipticalCoordsAtDate } from "../../astronomy/moonCoords";
import { Position } from "@models/position/Position";
import { CelestialBodyName, Ephemeris } from "@types";
import { AstroDate } from "@models/AstroDate";
import { Earth } from "./Earth";
import { calcPhaseAngle, calculateQ } from "../../../src/astronomy/magnitude";

export class Moon extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("moon", ephemeris);
  }

  public getPositionAtDate(date: AstroDate): Position {
    let moonEclipticCoords;
    const ephemiris = this.ephemeris["moon"];

    if (ephemiris) {
      moonEclipticCoords = ephemiris.getPositionAtDate(date.UTC());
    } else {
      moonEclipticCoords = calcMoonSphericalEclipticalCoordsAtDate(date);
    }

    const moonPosition = new Position().setEclipticCoords(moonEclipticCoords);
    moonPosition.convertEcliptictToOrbital(this.orbitalParams);

    return moonPosition;
  }

  public getMagnitudeAtDate(date: AstroDate) {
    const earthPosition = new Earth().getPositionAtDate(date);
    const moonPosition = this.getPositionAtDate(date);

    const moonEarthDistance = moonPosition.calcDistanceFrom(earthPosition);

    const bodySunDistance = moonPosition.getOrbitalCoords().polar.r;
    const earthSunDistance = earthPosition.getOrbitalCoords().polar.r;

    const phaseAngle = calcPhaseAngle(
      moonEarthDistance,
      bodySunDistance,
      earthSunDistance
    );

    const phaseFactor = calculateQ(phaseAngle.degrees());

    const apparentMagnitude =
      this.orbitalParams.H +
      5 * Math.log10(moonEarthDistance * bodySunDistance) -
      2.5 * Math.log10(phaseFactor);

    return apparentMagnitude;
  }
}
