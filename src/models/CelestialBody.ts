import {
  calcCoordsPolarAtDate,
  cartesianEclipticToCartesianEquatorial,
  cartesianEquatorialToSphericalEquatorial,
  convertCoordsHCOrbitalToHCEcliptic,
  convertCoordsPolarToOrbital,
} from "./../astronomy/coords";
import { OrbitalParams } from "./../types/OrbitalParams.type";
import orbitalParams from "../data/planets.json";
import { CelestialBodyName } from "../types/ObjectName.type";
import { calculateAlphaWikipedia, calculateQ } from "../astronomy/magnitude";
import {
  convertRadsToHMS,
  convertRadToDMS,
  normalizeAngleR,
  toDegrees,
} from "../utils/angles";
import { Position } from "./position/Position";

export class CelestialBody {
  protected orbitalParams: OrbitalParams;

  constructor(name: CelestialBodyName) {
    if (!orbitalParams[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.orbitalParams = orbitalParams[name];
  }

  public getEphemerisAtDate(date: Date) {
    const earthParams = orbitalParams["earth"];

    const earthPolar = calcCoordsPolarAtDate(date, earthParams);
    const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

    const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

    const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      earthHCOrbital,
      earthParams
    );

    const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      bodyHCOrbital,
      this.orbitalParams
    );

    console.log(44, bodyHCEcliptic);
    console.log(45, earthHCEcliptic);

    // convert to geocentric
    const xGCEclPlanet = bodyHCEcliptic.x - earthHCEcliptic.x;
    const yGCEclPlanet = bodyHCEcliptic.y - earthHCEcliptic.y;
    const zGCEclPlanet = bodyHCEcliptic.z - earthHCEcliptic.z;

    const bodyCGEclCoords = {
      x: xGCEclPlanet,
      y: yGCEclPlanet,
      z: zGCEclPlanet,
    };

    const equatorialCoords =
      cartesianEclipticToCartesianEquatorial(bodyCGEclCoords);

    const d = cartesianEquatorialToSphericalEquatorial(equatorialCoords);

    console.log("FINE", convertRadsToHMS(d.RA), convertRadToDMS(d.DEC));

    return d;
  }

  public getEphemerisAtDate2(date: Date) {
    const earthParams = orbitalParams["earth"];

    const earthPolar = calcCoordsPolarAtDate(date, earthParams);
    const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    // const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

    // const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

    // const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
    //   earthHCOrbital,
    //   earthParams
    // );

    // const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
    //   bodyHCOrbital,
    //   this.orbitalParams
    // );

    // console.log(44, bodyHCEcliptic);
    // console.log(45, earthHCEcliptic);

    // // convert to geocentric
    // const xGCEclPlanet = bodyHCEcliptic.x - earthHCEcliptic.x;
    // const yGCEclPlanet = bodyHCEcliptic.y - earthHCEcliptic.y;
    // const zGCEclPlanet = bodyHCEcliptic.z - earthHCEcliptic.z;

    // const bodyCGEclCoords = {
    //   x: xGCEclPlanet,
    //   y: yGCEclPlanet,
    //   z: zGCEclPlanet,
    // };

    // const equatorialCoords = cartesianEclipticToCartesianEquatorial(bodyCGEclCoords);

    // const d = cartesianEquatorialToSphericalEquatorial(equatorialCoords);
    // console.log("dd", d);

    // return d;

    const { i, ω, Ω } = this.orbitalParams;
    const longitude = normalizeAngleR(bodyPolar.v + ω + Ω);
    const latitude = Math.asin(Math.sin(i) * Math.sin(bodyPolar.v + ω));

    console.log("current longit", longitude, toDegrees(longitude));

    const positionBodyHC = new Position().setEclipticCoords({
      lat: latitude,
      lng: longitude,
    });

    const { i: iT, ω: ωT, Ω: ΩT } = orbitalParams["earth"];
    const longitudeT = normalizeAngleR(earthPolar.v + ωT + ΩT);
    const latitudeT = Math.asin(Math.sin(iT) * Math.sin(earthPolar.v + ωT));


    const positionEarthHC = new Position().setEclipticCoords({
      lat: latitudeT,
      lng: longitudeT,
    });


    const cartesianEclipticBodyGC = {
      x: positionBodyHC.eclipticCoords.cartesian.x - positionEarthHC.eclipticCoords.cartesian.x,
      y: positionBodyHC.eclipticCoords.cartesian.y - positionEarthHC.eclipticCoords.cartesian.y,
      z: positionBodyHC.eclipticCoords.cartesian.z - positionEarthHC.eclipticCoords.cartesian.z
    }

    const positionBodyGC = new Position().setEclipticCoords(cartesianEclipticBodyGC);

    const moonEquatorial = positionBodyGC.getEquatorialCoords();

    console.log(
      "FINE con longitudine",
      convertRadsToHMS(moonEquatorial.spherical.RA),
      convertRadToDMS(moonEquatorial.spherical.DEC)
    );

    const radec = moonEquatorial.spherical;
    return radec;
  }

  public getMagnitude(date: Date) {
    const earthParams = orbitalParams["earth"];

    const earthPolar = calcCoordsPolarAtDate(date, earthParams);
    const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthHCOrbital = convertCoordsPolarToOrbital(earthPolar);

    const bodyHCOrbital = convertCoordsPolarToOrbital(bodyPolar);

    const earthHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      earthHCOrbital,
      earthParams
    );

    const bodyHCEcliptic = convertCoordsHCOrbitalToHCEcliptic(
      bodyHCOrbital,
      this.orbitalParams
    );

    const dx = earthHCEcliptic.x - bodyHCEcliptic.x;
    const dy = earthHCEcliptic.y - bodyHCEcliptic.y;
    const dz = earthHCEcliptic.z - bodyHCEcliptic.z;

    // Calcola la distanza usando la formula euclidea
    const distanza = Math.sqrt(dx * dx + dy * dy + dz * dz);

    console.log("disanza oggetto-terra", distanza);
    console.log("distanza oggetto-sole", bodyPolar.r);

    const phaseAngle = calculateAlphaWikipedia(
      distanza,
      bodyPolar.r,
      earthPolar.r
    );
    console.log("phase angle", phaseAngle);

    const mm =
      this.orbitalParams.H +
      5 * Math.log10(distanza * bodyPolar.r) -
      2.5 * Math.log10(calculateQ(phaseAngle.degrees));

    // const mm2 =
    //   this.orbitalParams.Hemp +
    //   5 * Math.log10(distanza * bodyPolar.r) +
    //   calculateQemp("mars", phaseAngle.degrees);

    console.log("m apparent", mm);
    // console.log("m apparent empt", mm2);
  }
}
