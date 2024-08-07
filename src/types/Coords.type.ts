export type Cartesian3DCoords = {
  x: number;
  y: number;
  z: number;
};

export type Cartesian2DCoords = {
  x: number;
  y: number;
};


export type PolarCoords = {
  v: number,
  r: number
}

export type SphericalEclipticCoords = {
  lat: number,
  lng: number,
}

export type SphericalEquatorialCoords = {
  RA: number,
  DEC: number,
}




export interface EclipticCoords {
  cartesian: Cartesian3DCoords,
  spherical: SphericalEclipticCoords
}

export type EquatorialCoords = {
  cartesian: Cartesian3DCoords,
  spherical: SphericalEquatorialCoords
}

export type OrbitalCoords = {
  cartesian: Cartesian2DCoords,
  polar: PolarCoords
}