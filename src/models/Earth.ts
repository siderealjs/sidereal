import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";
import { calcCoordsPolarAtDate } from "../astronomy/coords";
import { Angle } from "./position/Angle";

export class Earth extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getEphemerisAtDate(date: Date) {
    const wGIusto = 4.9382057178469285;


    const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    console.log('POLARI TERRA', earthPolarCoords.r, earthPolarCoords.v.degrees())
    const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

    //earthPosition.convertOrbitalToEcliptic(this.orbitalParams.ω, 0, 0);
    earthPosition.convertOrbitalToEcliptic(
      wGIusto,
      this.orbitalParams.i,
      this.orbitalParams.Ω
    );

    return earthPosition;

    //   console.log(
    //     "terra ORBITAL XY",
    //     earthPosition.getOrbitalCoords().cartesian.x,
    //     earthPosition.getOrbitalCoords().cartesian.y
    //   );
    //   // earthPosition.convertOrbitalToEcliptic(
    //   //   this.orbitalParams.ω,
    //   //   this.orbitalParams.Ω,
    //   //   this.orbitalParams.i
    //   // );

    //   //altro numero cal sun

    //   // used in the sun calc
    //   const longAtPeri = new Angle().setDegrees(282.938346);

    //  // const MO_sun = new Angle().setDegrees(280.466069 - 282.938346).normalize().degrees()
    //   const MO_sun = new Angle().setDegrees(280.466069 - 282.938346).normalize()

    //   const M0_QUA = new Angle(this.orbitalParams.M0).normalize().degrees()

    //   console.log('CAZZU CAZZU', M0_QUA, MO_sun.degrees())

    //  //wikipedia
    //  //const longAtPeri = new Angle().setDegrees(288.1);

    //   console.log('confronta w', this.orbitalParams.ω,longAtPeri.radians() )
    //   earthPosition.convertOrbitalToEcliptic(this.orbitalParams.ω, 0, 0);

    //   // const w = longAtPeri.radians()
    //   // const cosω = Math.cos(w);
    //   // const sinω = Math.sin(w);

    //   // // Rotate around axis z (-w). This aligns the object periapsis to its ascending node.
    //   // const x1 = polarCoords.x * cosω - polarCoords.y * sinω;
    //   // const y1 = polarCoords.x * sinω + polarCoords.y * cosω;

    //   // const eclipticEarth = earthPosition.setEclipticCoords({
    //   //   x: x1,
    //   //   y: y1,
    //   //   z: 0,
    //   // });

    //   console.log(
    //     "terra longitude",
    //     earthPosition.getEclipticCoords().spherical.lng.degrees()
    //   );

    //   return earthPosition;
  }
}
