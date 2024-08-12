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
    it("should predict rise and set times for every planet", () => {
      const sid = new Sidereal();
      const venus = sid.planet("venus");

      const { rise, set } = venus.getRiseAndSetTimeAtDate(testDate);

      expect(rise.radians()).toBe(1.8998802803052328);
      expect(set.radians()).toBe(5.613519010775988);
    });
  });
});
