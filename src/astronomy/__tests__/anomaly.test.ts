import {
  calcEccentricAnomaly,
  calcMeanAnomalyAtDate,
  calcTrueAnomaly,
} from "../anomaly";

describe.only("Astronomy:: Anomaly", () => {
  describe("calcEccentricAnomaly", () => {
    it("should return correct eccentric anomaly for given M and e", () => {
      const M = 0.5;
      const e = 0.1;

      const result = calcEccentricAnomaly(M, e);

      expect(result).toBe(0.5524799869065704);
    });

    it("should work with different tolerances", () => {
      const M = 0.5;
      const e = 0.01;

      const result1 = calcEccentricAnomaly(M, e, 1e-2);
      const result2 = calcEccentricAnomaly(M, e, 1e-4);
      const expected = 0.50483664469476;

      // when tolerance is lower, the computer value is not very close to the actual result
      expect(result1).not.toBeCloseTo(expected, 8);
      // when tolerance is higher, the computer value is very close to the actual result
      expect(result2).toBeCloseTo(expected, 8);
    });

    it("should throw an error if it cannot converge within the maximum iterations", () => {
      const M = 0.5;
      const e = 1;

      expect(() => {
        calcEccentricAnomaly(M, e, 1e-9, 5);
      }).toThrow("Kepler equation did not converge");
    });
  });

  describe.only("calcTrueAnomaly", () => {
    it("should calculate the true anomaly correctly for given E and e", () => {
      const E = Math.PI / 4;
      const e = 0.1;

      const result = calcTrueAnomaly(E, e);

      expect(result).toBe(0.8588583622295081);
    });

    it("should handle not not valid eccentricities correctly", () => {
      const E = -Math.PI / 4;
      const e = -0.1;

      const result = calcTrueAnomaly(E, e);

     
      expect(result).toBe(0); 
    });
  });

  describe("calcMeanAnomalyAtDate", () => {
    it("should calculate mean anomaly correctly for given parameters", () => {
      const M0 = Math.PI / 4;
      const n = 0.01;
      const date = new Date("2000-01-10");

      const result = calcMeanAnomalyAtDate(M0, n, date);

      expect(result).toBe(0.8753981633974482);
    });
  });
});
