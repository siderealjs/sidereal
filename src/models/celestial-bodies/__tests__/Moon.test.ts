import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";

const testDate = new Date("2007-03-23T00:00:00.000Z");

describe("Models:: Celestial Bodies:: Moon,", () => {
  describe("getPositionAtDate", () => {
    describe("WITHOUT ephemeris", () => {
      it("should return right Geocentric Position for the Moon", () => {
        // const expectedCoords = {
        //   moon: { ecliptic: { earth: { cartesian: { x: 0.9973471026380928, y: 0.061396001169460146, z: -0.00023332451672653342 } } } },
        // };
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
      it("should return right Geocentric Position for the Moon", () => {
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
