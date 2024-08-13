import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { AstroDate } from "@models/AstroDate";

const testDate = new AstroDate(2007, 3, 23, 0, 0);

describe("Models:: Celestial Bodies:: Moon,", () => {
  describe("getPositionAtDate", () => {
    describe("WITHOUT ephemeris", () => {
      it("should return right Geocentric Position", () => {
   
        runSingleBodyPositionTests(
          "moon",
          dataTestNoEphemeris,
          "earth",
          false,
          testDate,
          'moon'
        );
      });
    });
    describe("WITH ephemeris", () => {
      it("should return right Geocentric Position", () => {
        runSingleBodyPositionTests(
          "moon",
          dataTestEphemeris,
          "earth",
          true,
          testDate,
          'moon'
        );
      });
    });
  });
});
