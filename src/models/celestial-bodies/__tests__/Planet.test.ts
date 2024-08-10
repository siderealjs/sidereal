import Sidereal from "../../../index";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { fixtureEphemeris } from "@test-resources/fixtures/fixtureEphemeris.fixture";

const testDate = new Date("2007-03-23T00:00:00.000Z");

describe("Models:: Planet,", () => {
  describe("getPositionAtDate", () => {
    describe("WITH ephemeris", () => {
      it("should return right Heliocentric Position for every planet", () => {
        for (const planetName in dataTestEphemeris) {
          if (planetName !== "earth") {
            const expectedCoords =
              dataTestEphemeris[planetName].ecliptic.sun.cartesian;
            const sid = new Sidereal();

            const fkEphPlanet = new fixtureEphemeris(planetName);
            const fkEphEarth = new fixtureEphemeris("earth");

            sid.useEphemeris([fkEphEarth, fkEphPlanet]);

            const planet = sid.planet(planetName);

            const { x, y, z } = planet
              .getPositionAtDate(testDate, "sun")
              .getEclipticCoords().cartesian;

            expect(`${planetName} ${x}`).toBe(
              `${planetName} ${expectedCoords.x}`
            );
            expect(`${planetName} ${y}`).toBe(
              `${planetName} ${expectedCoords.y}`
            );
            expect(`${planetName} ${z}`).toBe(
              `${planetName} ${expectedCoords.z}`
            );
          }
        }
      });
      it("should return right Geocentric Position for every planet", () => {
        for (const planetName in dataTestEphemeris) {
          if (planetName !== "earth") {
            const expectedCoords =
              dataTestEphemeris[planetName].ecliptic.earth.cartesian;
            const sid = new Sidereal();

            const fkEphPlanet = new fixtureEphemeris(planetName);
            const fkEphEarth = new fixtureEphemeris("earth");

            sid.useEphemeris([fkEphEarth, fkEphPlanet]);

            const planet = sid.planet(planetName);

            const { x, y, z } = planet
              .getPositionAtDate(testDate, "earth")
              .getEclipticCoords().cartesian;

            expect(`${planetName} ${x}`).toBe(
              `${planetName} ${expectedCoords.x}`
            );
            expect(`${planetName} ${y}`).toBe(
              `${planetName} ${expectedCoords.y}`
            );
            expect(`${planetName} ${z}`).toBe(
              `${planetName} ${expectedCoords.z}`
            );
          }
        }
      });
    });

    describe("WITHOUT ephemeris", () => {
      it("should return right Heliocentric Position for every planet", () => {
        for (const planetName in dataTestNoEphemeris) {
          if (planetName !== "earth") {
            const expectedCoords =
              dataTestNoEphemeris[planetName].ecliptic.sun.cartesian;

            const sid = new Sidereal();
            const planet = sid.planet(planetName);

            const { x, y, z } = planet
              .getPositionAtDate(testDate, "sun")
              .getEclipticCoords().cartesian;

            expect(`${planetName} ${x}`).toBe(
              `${planetName} ${expectedCoords.x}`
            );
            expect(`${planetName} ${y}`).toBe(
              `${planetName} ${expectedCoords.y}`
            );
            expect(`${planetName} ${z}`).toBe(
              `${planetName} ${expectedCoords.z}`
            );
          }
        }
      });
      it("should return right Geocentric Position for every planet", () => {
        for (const planetName in dataTestNoEphemeris) {
          if (planetName !== "earth") {
            const expectedCoords =
              dataTestNoEphemeris[planetName].ecliptic.earth.cartesian;

            const sid = new Sidereal();
            const planet = sid.planet(planetName);

            const { x, y, z } = planet
              .getPositionAtDate(testDate, "earth")
              .getEclipticCoords().cartesian;

            expect(`${planetName} ${x}`).toBe(
              `${planetName} ${expectedCoords.x}`
            );
            expect(`${planetName} ${y}`).toBe(
              `${planetName} ${expectedCoords.y}`
            );
            expect(`${planetName} ${z}`).toBe(
              `${planetName} ${expectedCoords.z}`
            );
          }
        }
      });
    });
  });
});
