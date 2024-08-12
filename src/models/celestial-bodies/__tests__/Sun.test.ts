import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { AstroDate } from "@models/AstroDate";

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
          'sun'
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
          'sun'
        );
      });
    });
  });
});
