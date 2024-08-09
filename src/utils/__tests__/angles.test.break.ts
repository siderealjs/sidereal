import { convertRadsToHMS, convertRadToDMS } from "../angles";

describe("Utility:: Angles", () => {
  describe("convertRadsToHMS", () => {
    test("Returns correct values when angles in radians is provided", () => {
      const result0 = convertRadsToHMS(0.453);
      const result1 = convertRadsToHMS(0.7854);
      const result2 = convertRadsToHMS(4.621467527376711);

      expect(result0).toBe("01h 43m 49s");
      expect(result1).toBe("03h 00m 00s");
      expect(result2).toBe("17h 39m 10s");
    });

    test("Returns null when angles in radians is not valid", () => {
      const result0 = convertRadsToHMS(null as unknown as number);
      const result1 = convertRadsToHMS(undefined as unknown as number);
      const result2 = convertRadsToHMS(NaN as unknown as number);

      expect(result0).toBe(null);
      expect(result1).toBe(null);
      expect(result2).toBe(null);
    });
  });

  describe("convertRadToDMS", () => {
    test("Returns correct values when angles in radians is provided", () => {
      const result0 = convertRadToDMS(0.453);
      const result1 = convertRadToDMS(0.7854);
      const result2 = convertRadToDMS(4.621467527376711);

      expect(result0).toBe(`+25° 57' 18"`);
      expect(result1).toBe(`+45° 00' 00"`);
      expect(result2).toBe(`+264° 47' 26"`);
    });

    test("Returns null when angles in radians is not valid", () => {
      const result0 = convertRadToDMS(null as unknown as number);
      const result1 = convertRadToDMS(undefined as unknown as number);
      const result2 = convertRadToDMS(NaN as unknown as number);

      expect(result0).toBe(null);
      expect(result1).toBe(null);
      expect(result2).toBe(null);
    });
  });
});
