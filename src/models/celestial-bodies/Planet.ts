import { calcCoordsPolarAtDate } from "./../../astronomy/coords";
import { CelestialBodyName, Ephemeris } from "@types";
import { Position } from "./../position/Position";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Earth } from "@models/celestial-bodies/Earth";
import { calcPhaseAngle, calculateQ } from "../../astronomy/magnitude";
import { calcRiseAndSetTime } from "src/astronomy/riseSet";

import orbitalParams from "../../data/planets.json";
import { calcMeanAnomalyAtDate } from "src/astronomy/anomaly";
import { Angle } from "@models/position/Angle";


export class Planet extends CelestialBody {
  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    super(name, ephemeris);
  }

  public getPositionAtDate(
    UTCDate: Date,
    coordinatesCenter: "sun" | "earth"
  ): Position {
    const earthPosition = new Earth(this.ephemeris).getPositionAtDate(UTCDate);

    let planetPosition;

    if (this.ephemeris[this.bodyName]) {
      const planetEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(UTCDate);

      planetPosition = new Position().setEclipticCoords(planetEclipticCoords);
    } else {
      const planetPolarCoords = calcCoordsPolarAtDate(
        UTCDate,
        this.orbitalParams
      );
      planetPosition = new Position().setOrbitalCoords(planetPolarCoords);
      planetPosition.convertOrbitalToEcliptic(this.orbitalParams);
    }

    if (coordinatesCenter === "earth") {
      planetPosition.convertToGeocentric(earthPosition);
    }

    return planetPosition;
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

  getRiseAndSetTimeAtDate = (date: Date) => {

      const long = 0;
  
  
      const MSun = calcMeanAnomalyAtDate(orbitalParams['sun'].M0, orbitalParams['sun'].n, date);
      const meanLongitudeSun_radians = MSun + orbitalParams['sun'].ω;
      const GMST0_radians = meanLongitudeSun_radians + Math.PI
  console.log('GMST0 PLANET', GMST0_radians)
  
      const UTCnoon = new Date(date.getTime());
      UTCnoon.setUTCHours(12);
      UTCnoon.setUTCMinutes(0);
  
      const planetPositionNoon = this.getPositionAtDate(UTCnoon, 'earth');
      const {RA: RANoon, DEC: DECNoon} = planetPositionNoon.getEquatorialCoords().spherical;
  
  
      const UTNoon = RANoon.radians() - GMST0_radians -long
  
      
  
      const sinh = 0 // Math.sin(-0.833 * 2 * Math.PI / 360);
      const sinDEC = Math.sin(DECNoon.radians());
      const sinLat = Math.sin(51 * 2 * Math.PI / 360)
      const cosDEC = Math.cos(DECNoon.radians());
      const cosLat = Math.cos(51 * 2 * Math.PI / 360)
  
  
      const cosLHA = (sinh - sinLat*sinDEC)/(cosLat *cosDEC);
      const LHA_radians = Math.acos(cosLHA);
  
      const sunriseTime = new Angle(UTNoon - LHA_radians).normalize()
      const sunsetTime = new Angle(UTNoon + LHA_radians).normalize()
  
  
    
      console.log('Sunrise', sunriseTime.HMS());
      console.log('Sunset', sunsetTime.HMS());
  
    
  };
}
