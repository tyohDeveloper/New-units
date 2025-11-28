import { describe, it, expect } from "vitest";
import { CONVERSION_DATA, PREFIXES } from "@/lib/conversion-data";

describe("Conversion Data", () => {
  describe("PREFIXES", () => {
    it("should have standard SI prefixes", () => {
      const prefixIds = PREFIXES.map((p) => p.id);
      expect(prefixIds).toContain("kilo");
      expect(prefixIds).toContain("milli");
      expect(prefixIds).toContain("micro");
      expect(prefixIds).toContain("mega");
    });

    it("should have correct kilo factor", () => {
      const kilo = PREFIXES.find((p) => p.id === "kilo");
      expect(kilo?.factor).toBe(1000);
    });

    it("should have correct milli factor", () => {
      const milli = PREFIXES.find((p) => p.id === "milli");
      expect(milli?.factor).toBe(0.001);
    });

    it("should have a 'none' prefix with factor 1", () => {
      const none = PREFIXES.find((p) => p.id === "none");
      expect(none).toBeDefined();
      expect(none?.factor).toBe(1);
    });
  });

  describe("Length Category", () => {
    const lengthCategory = CONVERSION_DATA.find((c) => c.id === "length");

    it("should exist with meter as base unit", () => {
      expect(lengthCategory).toBeDefined();
      expect(lengthCategory?.baseUnit).toBe("meter");
    });

    it("should have meter with factor 1", () => {
      const meter = lengthCategory?.units.find((u) => u.id === "m");
      expect(meter).toBeDefined();
      expect(meter?.factor).toBe(1);
    });

    it("should have correct inch to meter conversion", () => {
      const inch = lengthCategory?.units.find((u) => u.id === "in");
      expect(inch?.factor).toBeCloseTo(0.0254, 5);
    });

    it("should have correct foot to meter conversion", () => {
      const foot = lengthCategory?.units.find((u) => u.id === "ft");
      expect(foot?.factor).toBeCloseTo(0.3048, 5);
    });

    it("should have correct mile to meter conversion", () => {
      const mile = lengthCategory?.units.find((u) => u.id === "mi");
      expect(mile?.factor).toBeCloseTo(1609.344, 3);
    });
  });

  describe("Mass Category", () => {
    const massCategory = CONVERSION_DATA.find((c) => c.id === "mass");

    it("should exist with kilogram as base unit", () => {
      expect(massCategory).toBeDefined();
      expect(massCategory?.baseUnit).toBe("kilogram");
    });

    it("should have gram with correct factor", () => {
      const gram = massCategory?.units.find((u) => u.id === "g");
      expect(gram?.factor).toBe(0.001);
    });
  });

  describe("All Categories", () => {
    it("should have multiple categories defined", () => {
      expect(CONVERSION_DATA.length).toBeGreaterThan(10);
    });

    it("each category should have at least one unit", () => {
      CONVERSION_DATA.forEach((category) => {
        expect(category.units.length).toBeGreaterThan(0);
      });
    });

    it("each category should have a baseUnit defined", () => {
      CONVERSION_DATA.forEach((category) => {
        expect(category.baseUnit).toBeDefined();
        expect(category.baseUnit.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("Unit Conversion Logic", () => {
  it("should convert between units using factors", () => {
    const lengthCategory = CONVERSION_DATA.find((c) => c.id === "length");
    const meter = lengthCategory?.units.find((u) => u.id === "m");
    const foot = lengthCategory?.units.find((u) => u.id === "ft");

    if (meter && foot) {
      const metersValue = 1;
      const feetValue = metersValue / foot.factor;
      expect(feetValue).toBeCloseTo(3.28084, 4);
    }
  });

  it("should handle prefix multiplication correctly", () => {
    const kilo = PREFIXES.find((p) => p.id === "kilo");
    const milli = PREFIXES.find((p) => p.id === "milli");

    if (kilo && milli) {
      const kiloToMilliRatio = kilo.factor / milli.factor;
      expect(kiloToMilliRatio).toBe(1e6);
    }
  });
});
