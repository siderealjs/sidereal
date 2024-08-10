import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";

const testDate = new Date("2007-03-23T00:00:00.000Z");

describe("Models:: Celestial Bodies :: Sun,", () => {
  describe("getPositionAtDate", () => {
    describe("WITHOUT ephemeris", () => {
      it("should return right Geocentric Position for the Sun", () => {
        const expectedCoords = {
          sun: { ecliptic: { earth: { cartesian: { x: 1.9909173005228373, y: 0.10341422145894497, z: -0.000049167608093072036 } } } },
        };
        runSingleBodyPositionTests(
          "sun",
          expectedCoords,
          "earth",
          false,
          testDate
        );
      });
    });
  });
});
