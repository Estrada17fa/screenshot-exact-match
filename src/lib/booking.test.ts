import { describe, it, expect } from "vitest";
import { bookingHours, estimateTotal, hasEnoughNotice, mxInstant } from "./booking";

describe("booking rules", () => {
  it("overnight 22:00–07:00 counts as 9 hours", () => { expect(bookingHours("22:00", "07:00")).toBe(9); });
  it("day booking 10:00–13:30 is 3.5 hours", () => { expect(bookingHours("10:00", "13:30")).toBe(3.5); });
  it("fiesta multiplies by nannies", () => { expect(estimateTotal("fiesta", 3, 2)).toBe(1500); });
  it("sol ignores nannies", () => { expect(estimateTotal("sol", 3, 1)).toBe(510); });
  it("en casa and viajera have no estimate", () => { expect(estimateTotal("casa", 5, 1)).toBeNull(); expect(estimateTotal("viajera", 5, 1)).toBeNull(); });
  it("requires 12 hours notice in Mexico City time", () => {
    const now = mxInstant("2026-11-22", "08:00");
    expect(hasEnoughNotice("2026-11-22", "19:59", now)).toBe(false);
    expect(hasEnoughNotice("2026-11-22", "20:00", now)).toBe(true);
  });
});
