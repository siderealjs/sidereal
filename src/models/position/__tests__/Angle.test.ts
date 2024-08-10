import { Angle } from "@models/position/Angle";

describe("Models:: Angle", () => {
  describe("constructor", () => {
    it("should set the value in radians if provided", () => {
      const angle = new Angle(Math.PI);
      expect(angle.radians()).toBe(Math.PI);
    });

    it("should leave valueInRadians as null if no value is provided", () => {
      const angle = new Angle();
      expect(() => angle.radians()).toThrow(
        "no value for the angle in radians"
      );
    });
  });

  describe("setRadians", () => {
    it("should set the value in radians", () => {
      const angle = new Angle();
      angle.setRadians(Math.PI);
      expect(angle.radians()).toBe(Math.PI);
    });

    it("should return the instance for chaining", () => {
      const angle = new Angle();
      expect(angle.setRadians(Math.PI)).toBe(angle);
    });
  });

  describe("setDegrees", () => {
    it("should set the value in radians based on degrees", () => {
      const angle = new Angle();
      angle.setDegrees(180);
      expect(angle.radians()).toBeCloseTo(Math.PI);
    });

    it("should return the instance for chaining", () => {
      const angle = new Angle();
      expect(angle.setDegrees(180)).toBe(angle);
    });
  });

  describe("radians", () => {
    it("should return the value in radians", () => {
      const angle = new Angle(Math.PI / 2);
      expect(angle.radians()).toBe(Math.PI / 2);
    });

    it("should throw an error if valueInRadians is null", () => {
      const angle = new Angle();
      expect(() => angle.radians()).toThrow(
        "no value for the angle in radians"
      );
    });
  });

  describe("degrees", () => {
    it("should return the value in degrees", () => {
      const angle = new Angle(Math.PI);
      expect(angle.degrees()).toBeCloseTo(180);
    });

    it("should throw an error if valueInRadians is null", () => {
      const angle = new Angle();
      expect(() => angle.degrees()).toThrow(
        "no value for the angle in degrees"
      );
    });
  });

  describe("degreesToRadians", () => {
    it("should convert properly", () => {
      expect(new Angle().degreesToRadians(58)).toBe(1.0122909661567112);
      expect(new Angle().degreesToRadians(180)).toBe(Math.PI);
    });
  });

  describe("radianstoDegrees", () => {
    it("should convert properly", () => {
      expect(new Angle().radianstoDegrees((Math.PI * 4) / 5)).toBe(144);
      expect(new Angle().radianstoDegrees(Math.PI)).toBe(180);
    });
  });

  describe("radiansToHMS", () => {
    it("should throw an error if radians is null, undefined or NaN", () => {
      const angle = new Angle();
      const angle2 = new Angle(null);
      const angle3 = new Angle(NaN);
      expect(() => angle.radiansToHMS()).toThrow("angle not valid");
      expect(() => angle2.radiansToHMS()).toThrow("angle not valid");
      expect(() => angle3.radiansToHMS()).toThrow("angle not valid");
    });

    it("should conver properly", () => {
      expect(new Angle().radiansToHMS(Math.PI)).toBe("12h 00m 00s");
      expect(new Angle().radiansToHMS((Math.PI * 8) / 9 + 0.34)).toBe(
        "11h 57m 55s"
      );
    });
  });

  describe("radiansToDMS", () => {
    it("should throw an error if radians is null, undefined or NaN", () => {
      const angle = new Angle();
      const angle2 = new Angle(null);
      const angle3 = new Angle(NaN);
      expect(() => angle.radiansToDMS()).toThrow("angle not valid");
      expect(() => angle2.radiansToDMS()).toThrow("angle not valid");
      expect(() => angle3.radiansToDMS()).toThrow("angle not valid");
    });

    it("should conver properly", () => {
      expect(new Angle().radiansToDMS(Math.PI)).toBe(`+180° 00' 00"`);
      expect(new Angle().radiansToDMS((Math.PI * 8) / 9 + 0.34)).toBe(
        `+179° 28' 50"`
      );
    });
  });

  describe("normalize", () => {
    it("should normalize a positive angle greater than 2π", () => {
      const angle = new Angle(3 * Math.PI);
      angle.normalize();
      expect(angle.radians()).toBeCloseTo(Math.PI);
    });

    it("should normalize a negative angle to a positive angle within [0, 2π)", () => {
      const angle = new Angle(-Math.PI);
      angle.normalize();
      expect(angle.radians()).toBeCloseTo(Math.PI);
    });

    it("should not change an angle that is already within the range [0, 2π)", () => {
      const angle = new Angle(Math.PI / 2);
      angle.normalize();
      expect(angle.radians()).toBeCloseTo(Math.PI / 2);
    });

    it("should normalize an angle exactly at 2π to 0", () => {
      const angle = new Angle(2 * Math.PI);
      angle.normalize();
      expect(angle.radians()).toBe(0);
    });
  });
});
