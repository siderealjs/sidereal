import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";

const testDate = new Date("2007-03-23T00:00:00.000Z");

describe("Models:: Celestial Bodies:: Earth,", () => {
  describe("getPositionAtDate", () => {
    describe("WITH ephemeris", () => {
      it("should return right Heliocentric Position for Earth", () => {
        runSingleBodyPositionTests('earth', dataTestEphemeris, "sun", true, testDate);
      });

     
    });

    describe("WITHOUT ephemeris", () => {
      it("should return right Heliocentric Position for Earth", () => {
        runSingleBodyPositionTests('earth', dataTestNoEphemeris, "sun", false, testDate);
      });

     
    });
  });
});
