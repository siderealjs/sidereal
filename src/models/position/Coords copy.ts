
export class Coords<
  T extends EclipticCoords | EquatorialCoords | OrbitalCoordsType
> {
  protected spherical: EclipticCoords | EquatorialCoords | null = null;
  protected cartesian: Cartesian3DCoords | null = null;

  constructor(coordType: "orbital" | "ecliptic" | "equatorial" = "ecliptic") {
    if (coordType === "orbital") {
      return new OrbitalCoords("orbital");
    }

    return this;
  }

  public getAll(): T {
    return {
      spherical: this.spherical as (EclipticCoords | EquatorialCoords),
      cartesian: this.cartesian as T["cartesian"],
    };
  }
}

class OrbitalCoords extends Coords<OrbitalCoordsType> {
  private polar: PolarCoords | null = null;

  public getAll() {

    return {
      polar: this.polar as PolarCoords,
      cartesian: this.cartesian as Cartesian2DCoords,
    };
  }
}
