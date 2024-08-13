import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { AstroDate } from "@models/AstroDate";
import Sidereal from "../../../index";

const testDate = new AstroDate(2007, 3, 23, 0, 0);

describe("Models:: Celestial Bodies:: Sun", () => {
  describe("getPositionAtDate", () => {
    describe("WITHOUT ephemeris", () => {
      it("should return right Geocentric Position for the Sun", () => {
        runSingleBodyPositionTests(
          "sun",
          dataTestNoEphemeris,
          "earth",
          false,
          testDate,
          "sun"
        );
      });
    });
    describe("WITH ephemeris", () => {
      it("should return right Geocentric Position for the Sun", () => {
        runSingleBodyPositionTests(
          "sun",
          dataTestEphemeris,
          "earth",
          true,
          testDate,
          "sun"
        );
      });
    });
  });

  describe("getRiseAndSetTimeAtDate", () => {
    it("should predict rise and set times", () => {
      const sid = new Sidereal();
      const sun = sid.sun();

      const { rise, set } = sun.getRiseAndSetTimeAtDate(testDate);

      expect(rise.toUTCString()).toBe("Fri, 23 Mar 2007 05:55:23 GMT");
      expect(set.toUTCString()).toBe("Fri, 23 Mar 2007 18:18:12 GMT");
    });
  });
});
