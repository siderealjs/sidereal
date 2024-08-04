// Dichiarazione del modulo che esporta AstronomyLab

import CelestialBody from "./models/CelestialBody";

// Dichiarazione del modulo che esporta AstronomyLab
declare module "astronomy-lab" {
  const AstronomyLab: {
    Constants: Record<string, number>;
    CelestialBody: typeof CelestialBody;
  };

  export default AstronomyLab;
}
