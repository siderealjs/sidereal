import { CartesianCoordinates3D } from "../../types/Coords.type";

export class Coords<T> {
  public spherical: T = {} as T;
  public cartesian: CartesianCoordinates3D = { x: 0, y: 0, z: 0 };

  constructor(spherical?: T) {
    if (spherical) {
      this.spherical = spherical;
      this.updateCartesianFromSpherical();
    }
  }

  setSpherical(spherical: T): void {
    this.spherical = spherical;
    this.updateCartesianFromSpherical();
  }

  setCartesian(cartesian: CartesianCoordinates3D): void {
    this.cartesian = cartesian;
    this.updateSphericalFromCartesian();
  }
}
