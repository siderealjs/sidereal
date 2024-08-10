import Sidereal from "../../../index";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { fixtureEphemeris } from "@test-resources/fixtures/fixtureEphemeris.fixture";

const testDate = new Date("2007-03-23T10:25:00.000Z");

describe.only("Models:: Bodies::  Earth,", () => {
  describe("getPositionAtDate", () => {
    it("should return right Position for Earth WITHOUT ephemeris", () => {
      for (const planetName in dataTestNoEphemeris) {
        if (planetName !== "earth") {
          const expectedCoords =
            dataTestNoEphemeris[planetName].ecliptic.cartesian;

          const sid = new Sidereal();
          const planet = sid.planet(planetName);

          const { x, y, z } = planet
            .getPositionAtDate(testDate)
            .getEclipticCoords().cartesian;
          expect(x).toBe(expectedCoords.x);
          expect(y).toBe(expectedCoords.y);
          expect(z).toBe(expectedCoords.z);
        }
      }
    });
    it("should return right Position for for Earth WITH ephemeris", () => {
      for (const planetName in dataTestEphemeris) {
        if (planetName !== "earth") {
          const expectedCoords =
            dataTestEphemeris[planetName].ecliptic.cartesian;

          const sid = new Sidereal();

          const fkEphPlanet = new fixtureEphemeris(planetName);
          const fkEphEarth = new fixtureEphemeris("earth");

          sid.loadEphemeris([fkEphEarth, fkEphPlanet]);

          const planet = sid.planet(planetName);

          const { x, y, z } = planet
            .getPositionAtDate(testDate)
            .getEclipticCoords().cartesian;

          expect(x).toBe(expectedCoords.x);
          expect(y).toBe(expectedCoords.y);
          expect(z).toBe(expectedCoords.z);
        }
      }
    });
  });
});
