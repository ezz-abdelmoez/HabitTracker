import { describe, it, expect } from "vitest";
import { fixtureHabits } from "../src/lib/fixtures/habits";
import { fixtureCategories } from "../src/lib/fixtures/categories";
import { todayISO } from "@/lib/dates";

/** §15 — Mock-workflow test: fixture store is complete and deterministic. */
describe("Mock-workflow: fixtures", () => {
  it("loads 9 real habits with exact names from the user's txt", () => {
    expect(fixtureHabits.length).toBe(9);
    const slugs = fixtureHabits.map((h) => h.slug);
    expect(slugs).toContain("german-a1");
    expect(slugs).toContain("happy-share");
    expect(slugs).toContain("bakalory");
    expect(slugs).toContain("hawaii-ict-cloud");
    expect(slugs).toContain("tuesday-planning");
  });

  it("4 categories map to the 4 life tracks from the txt", () => {
    expect(fixtureCategories.length).toBe(4);
    const ids = fixtureCategories.map((c) => c.id);
    expect(ids).toEqual(["cat-lang", "cat-dev", "cat-career", "cat-system"]);
  });

  it("every habit references a category that exists", () => {
    const catIds = new Set(fixtureCategories.map((c) => c.id));
    for (const h of fixtureHabits) {
      expect(catIds.has(h.categoryId)).toBe(true);
    }
  });

  it("Tuesday planning habit has fixedDays mode with [2] (Tuesday = index 2 in JS getDay)", () => {
    const plan = fixtureHabits.find((h) => h.slug === "tuesday-planning");
    expect(plan).toBeDefined();
    expect(plan!.schedule.mode).toBe("fixedDays");
    expect(plan!.schedule.days).toContain(2);
  });

  it("50h cap constant is wired and echoes 3000 minutes", () => {
    const { CAP_WEEKLY_MINUTES } = require("../src/constants/habits");
    expect(CAP_WEEKLY_MINUTES).toBe(3000);
  });
});
