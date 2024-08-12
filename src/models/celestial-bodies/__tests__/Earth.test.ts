import dataTestNoEphemeris from "@test-resources/data/planetPositionsNoEphemeris.json";
import dataTestEphemeris from "@test-resources/data/planetPositionsEphemeris.json";
import { runSingleBodyPositionTests } from "@test-resources/test-functions/runPositionTests";
import { AstroDate } from "@models/AstroDate";

const testDate = new AstroDate(2007, 3, 23, 0, 0);

describe("Models:: Celestial Bodies:: Earth,", () => {
  describe("getPositionAtDate", () => {
    describe("WITH ephemeris", () => {
      it("should return right Heliocentric Position for Earth", () => {
        runSingleBodyPositionTests('earth', dataTestEphemeris, "sun", true, testDate, 'earth');
      });

     
    });

    describe("WITHOUT ephemeris", () => {
      it("should return right Heliocentric Position for Earth", () => {
        runSingleBodyPositionTests('earth', dataTestNoEphemeris, "sun", false, testDate, 'earth');
      });

     
    });
  });
});
