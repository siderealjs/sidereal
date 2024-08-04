  import orbitalParams from "../data/planets.json" assert { type: "json" };
    
  // Estrai le chiavi dell'oggetto
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const celestialBodyNames = Object.keys(orbitalParams) as Array<keyof typeof orbitalParams>;
  
  // Crea un tipo unione basato sulle chiavi
  export type CelestialBodyName = typeof celestialBodyNames[number];