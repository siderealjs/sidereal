import { daysBetweenDates } from "../dates";

describe("Utility:: Dates", () => {
  describe("daysBetweenDates", () => {
    test("Returns correct day difference", () => {
        const date = new Date('2000-01-01');
        const nextDay = new Date('2000-01-02');
        const nextMonth = new Date('2000-02-01');
        const nextYear = new Date('2001-01-01');
      
        const result0 = daysBetweenDates(date, nextDay);
        const result1 = daysBetweenDates(date, nextMonth);
        const result2 = daysBetweenDates(date, nextYear);
      

      expect(result0).toBe(1);
      expect(result1).toBe(31);
      expect(result2).toBe(366);
    });
  });
});
