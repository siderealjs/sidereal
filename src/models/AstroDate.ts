export class AstroDate extends Date {
  // private date: Date;

  constructor(
    y: number | Date,
    m?: number,
    d?: number,
    h?: number,
    minutes?: number
  ) {
    let utcDate;
    if (y instanceof Date) {
      utcDate = new Date(y.getTime());
    } else {
      utcDate = new Date(y, m! - 1, d, h, minutes, 0);
    }
    super(utcDate.getTime());
  }

  public daysSinceEpoch(epochName: "J2000" | "J1900") {
    const epochYear = epochName === "J2000" ? 2000 : 1900;
    const epoch = new Date(Date.UTC(epochYear, 0, 1, 0, 0, 0));

    // Calculate diff in milliseconds
    const differenceInMillis = this.getTime() - epoch.getTime();

    // Convert diff from milliseconds to days
    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

    return differenceInDays;
  }

  public UTC() {
    return this;
  }

  // public creatCopy() {
  //   return new AstroDate(
  //     this.getUTCFullYear(),
  //     this.getUTCMonth(),
  //     this.getUTCDay(),
  //     this.getUTCHours(),
  //     this.getUTCMinutes()
  //   );
  // }
}
