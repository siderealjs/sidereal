import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";

const testDate = new Date("2007-03-23T00:00:00.000Z");

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
