import { calcCoordsPolarAtDate } from "./../../astronomy/coords";
import { CelestialBodyName, Ephemeris } from "@types";
import { Position } from "@models/position/Position";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Earth } from "@models/celestial-bodies/Earth";
import { calcPhaseAngle, calculateQ } from "../../astronomy/magnitude";
import { Angle } from "@models/position/Angle";
import { getGMST0AtDate } from "../../astronomy/gmst0";
import { AstroDate } from "@models/AstroDate";


export class Planet extends CelestialBody {
  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    super(name, ephemeris);
  }

  public getPositionAtDate(
    date: AstroDate,
    coordinatesCenter: "sun" | "earth"
  ): Position {
    const earthPosition = new Earth(this.ephemeris).getPositionAtDate(date);

    let planetPosition;

    if (this.ephemeris[this.bodyName]) {
      const planetEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(date.UTC());

      planetPosition = new Position().setEclipticCoords(planetEclipticCoords);
    } else {
      const planetPolarCoords = calcCoordsPolarAtDate(
        date,
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

  public getMagnitude(date: AstroDate) {
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

  getRiseAndSetTimeAtDate = (date: AstroDate) => {

      const long = 0;
  
  
     
      const GMST0 = getGMST0AtDate(date);
      const UTCnoon = new AstroDate(date); 
      UTCnoon.setUTCHours(12);
      UTCnoon.setUTCMinutes(0);


  
      const planetPositionNoon = this.getPositionAtDate(UTCnoon, 'earth');
      const {RA: RANoon, DEC: DECNoon} = planetPositionNoon.getEquatorialCoords().spherical;
  
  
      const UTNoon = RANoon.radians() - GMST0.radians() -long
  
      
  
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
