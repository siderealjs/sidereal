import { runAllPlanetRiseSetTests } from './../../../../test-resources/test-functions/runRiseSetTests';
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

  describe("getRiseAndSetTimeAtDate, WITHOUT ephemeris", () => {
      // testing with ephemeris is not possible, because it requires calling ephemeris
      // many times at many different times
      it("should predict rise and set times for every planet", () => {
        runAllPlanetRiseSetTests(dataTestNoEphemeris, testDate);
      });
  });
});
