export type CartesianCoordinates3D = {
  x: number;
  y: number;
  z: number;
};

export type CartesianCoordinates2D = {
  x: number;
  y: number;
};


export type Polar = {
  v: number,
  r: number
}

export type SphericalEcliptic = {
  lat: number,
  lng: number,
  d?: number
}

export type SphericalEquatorial = {
  RA: number,
  DEC: number,
}


