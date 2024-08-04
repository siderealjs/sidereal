import { Constants, CelestialBody } from "./index";

const mars = new CelestialBody("mars");
const today = new Date("2022-04-08");

mars.getEphemerisAtDate(today);
