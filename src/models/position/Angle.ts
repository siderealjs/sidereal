export class Angle {
  private valueInRadians: number | null = null;

  constructor(value?: number) {
    if (value !== undefined) {
      this.valueInRadians = value;
    }
  }

  setRadians(angleInRadians: number) {
    this.valueInRadians = angleInRadians;

    return this;
  }

  setDegrees(angleInDegrees: number) {
    this.valueInRadians = this.degreesToRadians(angleInDegrees);

    return this;
  }

  radians(): number {
    if (null === this.valueInRadians)
      throw new Error("no value for the angle in radians");

    return this.valueInRadians;
  }

  degrees(): number {
    if (null === this.valueInRadians)
      throw new Error("no value for the angle in degrees");

    return this.radianstoDegrees(this.valueInRadians);
  }

  HMS(): string {
    if (null === this.valueInRadians)
      throw new Error("no value for the angle in HMS");

    return this.radiansToHMS(this.valueInRadians);
  }

  DMS(): string {
    if (null === this.valueInRadians)
      throw new Error("no value for the angle in DMS");

    return this.radiansToDMS(this.valueInRadians);
  }

  private degreesToRadians = (degrees: number): number => {
    // (Math.PI / 180)
    const DTR = 0.017453292519943295;
    return degrees * DTR;
  };

  private radianstoDegrees = (radians: number): number => {
    // (180 / Math.PI)
    const RTD = 57.29577951308232;
    return radians * RTD;
  };

  /**
   * Convert angles in radians to HoursMinutesSeconds angles
   *
   * @param {number} radians - Value in radians
   * @returns {string} - In the format +10h 05m 12s
   */
  private radiansToHMS = (radians: number): string => {
    if (radians === null || radians === undefined || Number.isNaN(radians)) {
      throw new Error("angle not valid");
    }

    // Convert radians to degrees
    const degrees = (1 * radians * 180) / Math.PI;

    // Convert degrees to hours
    let hours = Math.floor(degrees / 15);
    let minutes = Math.floor((degrees % 15) * 4);
    let seconds = Math.round(((degrees % 15) * 4 - minutes) * 60);

    // Make sure hours are in the 0-23 range
    hours = (hours + 24) % 24;
    // Make sure that minutes and seconds are in 0-59 range
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }

    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  /**
   * Convert angles from radians to Degrees-Primes-Seconds angles
   *
   * @param {number} radians - Value in radians
   * @returns {string} - Format "+dd° mm’ ss”".
   */
  private radiansToDMS(radians: number): string {
    if (radians === null || radians === undefined || Number.isNaN(radians)) {
      throw new Error("angle not valid");
    }

    const degrees = radians * (180 / Math.PI);

    // Get the sign and the abs value of the angle
    const sign = degrees < 0 ? "-" : "+";
    const absDegrees = Math.abs(degrees);

    // Calculate grades, minutes and seconds
    const intDegrees = Math.floor(absDegrees);
    const minutes = (absDegrees - intDegrees) * 60;
    const intMinutes = Math.floor(minutes);
    const seconds = (minutes - intMinutes) * 60;

    // Format minutes and seconds as 2chacters strings (with a potential initial 0 if <9)
    const formattedMinutes = intMinutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toFixed(0).toString().padStart(2, "0");

    return `${sign}${intDegrees}° ${formattedMinutes}' ${formattedSeconds}"`;
  }

  normalize() {
    const x2PI = 2 * Math.PI;
    this.valueInRadians = (((this.valueInRadians || 0) % x2PI) + x2PI) % x2PI;

    return this;
  }
}
