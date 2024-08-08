import { calcCoordsPolarAtDate } from "./../astronomy/coords";
import { CelestialBodyName } from "../types/ObjectName.type";
import { Position } from "./position/Position";
import { CelestialBody } from "./CelestialBody";
import { Earth } from "./Earth";

export class Planet extends CelestialBody {

  constructor(name: CelestialBodyName) {
    super(name)
  }

  public getPositionAtDate(date: Date) {
    const bodyPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthPosition = new Earth().getPositionAtDate(date)
    const bodyPosition = new Position().setOrbitalCoords(bodyPolarCoords);

    bodyPosition.convertOrbitalToEcliptic(this.orbitalParams);
    bodyPosition.convertToGeocentric(earthPosition);

    return bodyPosition;
  }

 

//   public getEphemerisAtDate2(date: Date) {
//     const earthParams = orbitalParams["earth"];

//     const earthPolar = calcCoordsPolarAtDate(date, earthParams);
//     const bodyPolar = calcCoordsPolarAtDate(date, this.orbitalParams);

//     const { i, ω, Ω } = this.orbitalParams;
//     const longitude = normalizeAngleR(bodyPolar.v + ω + Ω);
//     const latitude = Math.asin(Math.sin(i) * Math.sin(bodyPolar.v + ω));

//     console.log("current longit", longitude, toDegrees(longitude));
//     console.log("current latidu", latitude, toDegrees(latitude));

//     const positionBodyHC = new Position().setEclipticCoords({
//       lat: latitude,
//       lng: longitude,
//       r: bodyPolar.r,
//     });

//     const { i: iT, ω: ωT, Ω: ΩT } = orbitalParams["earth"];
//     const longitudeT = normalizeAngleR(earthPolar.v + ωT + ΩT);
//     const latitudeT = Math.asin(Math.sin(iT) * Math.sin(earthPolar.v + ωT));

//     const positionEarthHC = new Position().setEclipticCoords({
//       lat: latitudeT,
//       lng: longitudeT,
//       r: earthPolar.r,
//     });

//     //console.log('m2 earth HC', positionEarthHC.eclipticCoords.cartesian)
//     console.log("m2 BODY HC", positionBodyHC.eclipticCoords.cartesian);

//     const cartesianEclipticBodyGC = {
//       x:
//         positionBodyHC.eclipticCoords.cartesian.x -
//         positionEarthHC.eclipticCoords.cartesian.x,
//       y:
//         positionBodyHC.eclipticCoords.cartesian.y -
//         positionEarthHC.eclipticCoords.cartesian.y,
//       z:
//         positionBodyHC.eclipticCoords.cartesian.z -
//         positionEarthHC.eclipticCoords.cartesian.z,
//     };

//     //console.log('meth2', cartesianEclipticBodyGC)
//     const positionBodyGC = new Position().setEclipticCoords(
//       cartesianEclipticBodyGC
//     );

//     const moonEquatorial = positionBodyGC.getEquatorialCoords();

//     console.log(
//       "FINE con longitudine",
//       convertRadsToHMS(moonEquatorial.spherical.RA),
//       convertRadToDMS(moonEquatorial.spherical.DEC)
//     );

//     const radec = moonEquatorial.spherical;
//     return radec;
//   }

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
