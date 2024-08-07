import {
  Cartesian2DCoords,
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  OrbitalCoords,
  PolarCoords,
  SphericalEclipticCoords,
  SphericalEquatorialCoords,
} from "../../types/Coords.type";

export class Coords {
  protected spherical:
    | SphericalEclipticCoords
    | SphericalEquatorialCoords
    | null = null;
  protected cartesian: Cartesian3DCoords | null = null;

  constructor(coordType: "orbital" | "ecliptic" | "equatorial" = "ecliptic") {
    if (coordType === "orbital") {
      return new OrbitalCoordsObject("orbital");
    }
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

  public setCartesian(cartesian: Cartesian3DCoords): void {
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

export class OrbitalCoordsObject extends Coords {
  private polar: PolarCoords | null = null;

  public setPolar(polar: PolarCoords): void {
    this.polar = polar;
  }

  public getPolar(): PolarCoords {
    if (!this.polar) throw new Error("No polar coord");

    return this.polar;
  }

  public isDefined(): boolean {
    const isCartesianDefined = this.cartesian !== null;
    const isPolarDefined = this.polar !== null;

    return isCartesianDefined && isPolarDefined;
  }

  public getAll<
    M extends OrbitalCoords | EclipticCoords | EquatorialCoords
  >() {
    if (!this.isDefined()) throw new Error("Missing coords");

    // @ts-expect-error
    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
    } as M;
  }
}
