import Sidereal from "../../../index";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { runAllPlanetPositionTests } from "@test-resources/test-functions/runPositionTests";
import { AstroDate } from "@models/AstroDate";

const testDate = new AstroDate(2007, 3, 23, 0, 0);

describe("Models:: Celestial Bodies:: Planet", () => {
  describe("getPositionAtDate", () => {
    describe("WITH ephemeris", () => {
      it("should return right Heliocentric Position for every planet", () => {
        runAllPlanetPositionTests(dataTestEphemeris, "sun", true, testDate);
      });

      it("should return right Geocentric Position for every planet", () => {
        runAllPlanetPositionTests(dataTestEphemeris, "earth", true, testDate);
      });
    });

    describe("WITHOUT ephemeris", () => {
      it("should return right Heliocentric Position for every planet", () => {
        runAllPlanetPositionTests(dataTestNoEphemeris, "sun", false, testDate);
      });

      it("should return right Geocentric Position for every planet", () => {
        runAllPlanetPositionTests(
          dataTestNoEphemeris,
          "earth",
          false,
          testDate
        );
      });
    });
  });

  describe("getRiseAndSetTimeAtDate", () => {
    describe("WITH ephemeris", () => {
      it("should predict rise and set times for every planet", () => {
        for (const planetName in dataTestEphemeris) {
          if (
            planetName !== "earth" &&
            planetName !== "moon" &&
            planetName !== "sun"
          ) {
            const sid = new Sidereal();
            const planet = sid.planet(planetName);

            const { rise, set } = planet.getRiseAndSetTimeAtDate(testDate);
            expect(rise.toUTCString()).toBe("Fri, 23 Mar 2007 04:55:18 GMT");
            expect(set.toUTCString()).toBe("Fri, 23 Mar 2007 19:18:28 GMT");
          }
        }
      });
    });
  });
});
