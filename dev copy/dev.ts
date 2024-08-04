import AstronomyLab from "../dist/bundle.js";

console.log(AstronomyLab);

const mars = new AstronomyLab.CelestialBody("mars");
const today = new Date('2022-01-17');

mars.getEphemerisAtDate(today);
