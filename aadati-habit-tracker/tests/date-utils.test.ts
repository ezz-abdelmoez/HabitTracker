import { describe, it, expect } from "vitest";
import { startOfWeek, todayISO, addDays, diffDays, weekDays } from "../../src/lib/dates";
import { WEEK_START_DAY } from "../../src/constants/habits";

describe("Dates (local calendar-day rules)", () => {
  it("WEEK_START_DAY is Saturday (6) per the user's spec", () => {
    expect(WEEK_START_DAY).toBe(6);
  });
  it("startOfWeek returns the correct Saturday for a sample date", () => {
    const iso = "2026-09-10"; // Thursday
    const start = startOfWeek(iso, WEEK_START_DAY);
    expect(start).toBe("2026-09-05"); // previous Saturday
  });
  it("addDays and diffDays are inverses", () => {
    const base = "2026-09-07";
    expect(addDays(base, 3)).toBe("2026-09-10");
    expect(diffDays(base, "2026-09-10")).toBe(3);
    expect(diffDays("2026-09-10", base)).toBe(-3);
  });
  it("weekDays produces exactly 7 dates starting from startOfWeek", () => {
    const week = weekDays("2026-09-07", WEEK_START_DAY);
    expect(week.length).toBe(7);
    expect(week[0]).toBe("2026-09-05");
    expect(week[6]).toBe("2026-09-11");
  });
  it("todayISO produces YYYY-MM-DD format", () => {
    expect(todayISO().match(/^\d{4}-\d{2}-\d{2}$/)).not.toBeNull();
  });
});
