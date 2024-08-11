import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { runAllPlanetPositionTests } from "@test-resources/test-functions/runPositionTests";

const testDate = new Date("2007-03-23T00:00:00.000Z");

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
        runAllPlanetPositionTests(dataTestNoEphemeris, "earth", false, testDate);
      });
    });
  });
});
