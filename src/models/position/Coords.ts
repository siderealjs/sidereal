import {
  Cartesian2DCoords,
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  OrbitalCoords,
  PolarCoords,
  SphericalEclipticCoords,
  SphericalEquatorialCoords,
} from "@types";

export class Coords {
  protected polar: PolarCoords | null = null;

  protected spherical:
    | SphericalEclipticCoords
    | SphericalEquatorialCoords
    | null = null;
  protected cartesian: Cartesian3DCoords | Cartesian2DCoords | null = null;

  constructor(coordType: "orbital" | "ecliptic" | "equatorial" = "ecliptic") {
    if (coordType === "orbital") {
      return new OrbitalCoordsObject();
    }
  }

  public setPolar(polar: PolarCoords): void {
    this.polar = polar;
  }

  public getPolar(): PolarCoords {
    if (!this.polar) throw new Error("No polar coord");

    return this.polar;
  }

  public setSpherical<T extends EclipticCoords | EquatorialCoords>(
    spherical: T["spherical"]
  ): void {
    this.spherical = spherical;
  }
  public getSpherical<
    T extends EclipticCoords | EquatorialCoords
  >(): T["spherical"] {
    if (!this.spherical) throw new Error("No spherical coord");

    return this.spherical;
  }

  public setCartesian(cartesian: Cartesian3DCoords | Cartesian2DCoords): void {
    this.cartesian = cartesian;
  }

  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isSphericalDefined = this.spherical !== null;

    return isCartesianDefined && isSphericalDefined;
  }

  public getAll<
    M extends OrbitalCoords | EclipticCoords | EquatorialCoords
  >(): M {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      spherical: this.spherical,
      cartesian: this.cartesian as Cartesian3DCoords,
    } as M;
  }
}

class OrbitalCoordsObject extends Coords {
  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isPolarDefined = this.polar !== null;

    return isCartesianDefined && isPolarDefined;
  }

  public getAll<M extends OrbitalCoords | EclipticCoords | EquatorialCoords>() {
    if (!this.isDefined()) throw new Error("Missing coords");

    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
    } as M;
  }
}
