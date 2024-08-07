import {
  cartesianEclipticToCartesianEquatorial,
  cartesianEclipticToSphericalEcliptic,
  cartesianEquatorialToSphericalEquatorial,
  sphericalEclipticToCartesianEcliptic,
  sphericalEquatorialToCartesianEquatorial,
} from "../../astronomy/coords";
import {
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  SphericalEclipticCoords,
  SphericalEquatorialCoords,
} from "../../types/Coords.type";
import { Coords } from "./Coords";

export class Position {
  public eclipticCoords: Coords<EclipticCoords> = new Coords<EclipticCoords>();

  public equatorialCoords: Coords<EquatorialCoords> =
    new Coords<EquatorialCoords>();

  // private orbitalCoords: Coords<OrbitalCoords> = new Coords<OrbitalCoords>();

  setEclipticCoords(coords: SphericalEclipticCoords | Cartesian3DCoords) {
    let sphericalEclipticCoords;
    let cartesianEclipticCoords;

    if (this.isCoordsSpherical(coords)) {
      sphericalEclipticCoords = coords;
      cartesianEclipticCoords =
        sphericalEclipticToCartesianEcliptic(coords);
    } else {
      cartesianEclipticCoords = coords;
      sphericalEclipticCoords =
        cartesianEclipticToSphericalEcliptic(coords);
    }

    this.eclipticCoords.setSpherical(sphericalEclipticCoords);
    this.eclipticCoords.setCartesian(cartesianEclipticCoords);

    return this;
  }

  setEquatorialCoords(
    coords: SphericalEquatorialCoords | Cartesian3DCoords
  ) {
    let sphericalEquatorialCoords;
    let cartesianEquatorialCoords;

    if (this.isCoordsSpherical(coords)) {
      sphericalEquatorialCoords = coords;
      cartesianEquatorialCoords =
        sphericalEquatorialToCartesianEquatorial(coords);
    } else {
      cartesianEquatorialCoords = coords;
      sphericalEquatorialCoords =
        cartesianEquatorialToSphericalEquatorial(coords);
    }

    this.equatorialCoords.setSpherical(sphericalEquatorialCoords);
    this.equatorialCoords.setCartesian(cartesianEquatorialCoords);

    return this;
  }

  public getEquatorialCoords(): EquatorialCoords {
    if (
      !this.equatorialCoords.isDefined() &&
      !this.eclipticCoords.isDefined()
    ) {
      throw new Error("no coords");
    }

    if (!this.equatorialCoords.isDefined() && this.eclipticCoords.cartesian) {
      const cartesianEquatorial = cartesianEclipticToCartesianEquatorial(
        this.eclipticCoords.cartesian
      );

      this.setEquatorialCoords(cartesianEquatorial);
    }

    return this.equatorialCoords.getAll();
  }

  private isCoordsSpherical = (
    coords:
      | Cartesian3DCoords
      | SphericalEclipticCoords
      | SphericalEquatorialCoords
  ) => "lat" in coords || "RA" in coords;
}
