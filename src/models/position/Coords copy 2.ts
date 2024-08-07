import {
  Cartesian2DCoords,
  Cartesian3DCoords,
  OrbitalCoords as OrbitalCoordsType,
  PolarCoords,
  SphericalEclipticCoords,
  SphericalEquatorialCoords,
} from "../../types/Coords.type";

export class Coords {
  protected spherical: SphericalEclipticCoords | SphericalEquatorialCoords | null = null;
  protected cartesian: Cartesian3DCoords | null = null;
  protected polar: PolarCoords | null = null;

  constructor(coordType: "orbital" | "ecliptic" | "equatorial" = "ecliptic") {
    if (coordType === "orbital") {
      return new OrbitalCoords("orbital");
    }
  }

  public setSpherical(spherical: SphericalEclipticCoords | SphericalEquatorialCoords): void {
    this.spherical = spherical;
  }
  public getSpherical(): SphericalEclipticCoords | SphericalEquatorialCoords {
    if (!this.spherical) throw new Error("No spherical coord");

    return this.spherical;
  }

  public setCartesian(cartesian: Cartesian3DCoords): void {
    this.cartesian = cartesian;
  }

  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isSphericalDefined = this.spherical !== null;

    return isCartesianDefined && isSphericalDefined;
  }

  public getAll() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      spherical: this.spherical as SphericalEclipticCoords | SphericalEquatorialCoords,
      cartesian: this.cartesian as Cartesian2DCoords | Cartesian3DCoords,
    };
  }
}

// class Cazzo extends Coords {
//   public getAll() {
//     if (!this.isDefined()) throw new Error("Missing coords");

//     return {
//       spherical: this.spherical as EclipticCoords | EquatorialCoords,
//       cartesian: this.cartesian as Cartesian3DCoords,
//       polar: this.polar as PolarCoords,
//     };
//   }
// }

class OrbitalCoords extends Coords {
  public setPolar(polar: PolarCoords): void {
    this.polar = polar;
  }

  public getPolar(): PolarCoords {
    if (!this.polar) throw new Error("No spherical coord");

    return this.polar;
  }

  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isPolarDefined = this.polar !== null;

    return isCartesianDefined && isPolarDefined;
  }

  public getAll() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
      spherical: this.spherical as SphericalEquatorialCoords,
    };
  }
}
