import {
  cartesianEclipticToCartesianEquatorial,
  cartesianEclipticToSphericalEcliptic,
  cartesianEquatorialToCartesianEcliptic,
  cartesianEquatorialToSphericalEquatorial,
  cartesianOrbitalToPolarOrbital,
  convertCoordsHCOrbitalToHCEcliptic,
  polarOrbitalToCartesianOrbital,
  sphericalEclipticToCartesianEcliptic,
  sphericalEquatorialToCartesianEquatorial,
} from "../../astronomy/coords";

import {
  Cartesian3DCoords,
  EclipticCoords,
  EquatorialCoords,
  SphericalEquatorialCoords,
  SphericalEclipticCoords,
  PolarCoords,
  Cartesian2DCoords,
  OrbitalCoords,
} from "../../types/Coords.type";
import { Coords } from "./Coords";

export class Position {
  private eclipticCoords: Coords = new Coords();

  private equatorialCoords: Coords = new Coords();

  private orbitalCoords: Coords = new Coords("orbital");

  setOrbitalCoords(coords: PolarCoords | Cartesian2DCoords) {
    let polarOrbitalCoords;
    let cartesianPolarCoords;

    if (this.isCoordsSpherical(coords)) {
      polarOrbitalCoords = coords;
      cartesianPolarCoords = polarOrbitalToCartesianOrbital(coords);
    } else {
      cartesianPolarCoords = coords;
      polarOrbitalCoords = cartesianOrbitalToPolarOrbital(coords);
    }

    this.orbitalCoords.setPolar(polarOrbitalCoords);
    this.orbitalCoords.setCartesian(cartesianPolarCoords);

    return this;
  }

  setEclipticCoords(coords: SphericalEclipticCoords | Cartesian3DCoords) {
    let sphericalEclipticCoords;
    let cartesianEclipticCoords;

    if (this.isCoordsSpherical(coords)) {
      sphericalEclipticCoords = coords;
      cartesianEclipticCoords = sphericalEclipticToCartesianEcliptic(coords);
    } else {
      cartesianEclipticCoords = coords;
      sphericalEclipticCoords = cartesianEclipticToSphericalEcliptic(coords);
    }

    this.eclipticCoords.setSpherical(sphericalEclipticCoords);
    this.eclipticCoords.setCartesian(cartesianEclipticCoords);

    return this;
  }

  setEquatorialCoords(coords: SphericalEquatorialCoords | Cartesian3DCoords) {
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

    if (!this.equatorialCoords.isDefined() && this.eclipticCoords.isDefined()) {
      const cartesianEquatorial = cartesianEclipticToCartesianEquatorial(
        this.eclipticCoords.getAll().cartesian as Cartesian3DCoords
      );

      this.setEquatorialCoords(cartesianEquatorial);
    }

    return this.equatorialCoords.getAll();
  }

  public getOrbitalCoords(): OrbitalCoords {
    if (!this.orbitalCoords.isDefined()) {
      throw new Error("no orbital coords");
    }

    return this.orbitalCoords.getAll<OrbitalCoords>();
  }

  public getEclipticCoords(): EclipticCoords {
    if (
      !this.equatorialCoords.isDefined() &&
      !this.eclipticCoords.isDefined()
    ) {
      throw new Error("no coords");
    }

    if (!this.eclipticCoords.isDefined() && this.equatorialCoords.isDefined()) {
      const cartesianEcliptic = cartesianEquatorialToCartesianEcliptic(
        this.equatorialCoords.getAll<EquatorialCoords>().cartesian
      );

      this.setEclipticCoords(cartesianEcliptic);
    }

    return this.eclipticCoords.getAll();
  }

  public convertOrbitalToEcliptic = (ω: number, i: number, Ω: number) => {
    if (!this.orbitalCoords.isDefined()) {
      throw new Error("orbital coords to convert are not found");
    }

    const cartesianEclipticCoords = convertCoordsHCOrbitalToHCEcliptic(
      this.orbitalCoords.getAll().cartesian,
      { ω, Ω, i }
    );

    this.setEclipticCoords(cartesianEclipticCoords);

    return this;
  };

  public convertToGeocentric(earthPosition: Position) {
    if (!this.eclipticCoords.isDefined()) {
      throw new Error("missing ecl coords to convert");
    }

    const earthEclCoords = earthPosition.getEclipticCoords().cartesian;
    const bodyEclCoords = this.getEclipticCoords().cartesian;

    const geocentricEclipticCoords = {
      x: bodyEclCoords.x - earthEclCoords.x,
      y: bodyEclCoords.y - earthEclCoords.y,
      z: bodyEclCoords.z - earthEclCoords.z,
    };

    this.setEclipticCoords(geocentricEclipticCoords);

    return this;
  }

  private isCoordsSpherical = (
    coords:
      | Cartesian3DCoords
      | SphericalEclipticCoords
      | SphericalEquatorialCoords
      | Cartesian2DCoords
      | PolarCoords
  ) => "lat" in coords || "RA" in coords || "v" in coords;
}
