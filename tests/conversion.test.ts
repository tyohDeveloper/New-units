import { describe, it, expect } from "vitest";
import { CONVERSION_DATA, PREFIXES, UnitCategory } from "@/lib/conversion-data";

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

describe("SI Base Units Display", () => {
  describe("FROM Section SI Base Units", () => {
    it("should have baseSISymbol defined for each category", () => {
      CONVERSION_DATA.forEach((category) => {
        expect(category.baseSISymbol).toBeDefined();
        expect(typeof category.baseSISymbol).toBe("string");
      });
    });

    it("should have correct SI symbols for SI base quantities", () => {
      const siBaseCategories: Record<string, string> = {
        length: "m",
        mass: "kg",
        time: "s",
        current: "A",
        temperature: "K",
        amount: "mol",
        intensity: "cd",
      };

      Object.entries(siBaseCategories).forEach(([categoryId, expectedSymbol]) => {
        const category = CONVERSION_DATA.find((c) => c.id === categoryId);
        expect(category?.baseSISymbol).toBe(expectedSymbol);
      });
    });

    it("should have derived unit SI symbols for derived quantities", () => {
      const derivedCategories: Record<string, string> = {
        area: "m²",
        volume: "m³",
        force: "kg⋅m⋅s⁻²",
        energy: "kg⋅m²⋅s⁻²",
        power: "kg⋅m²⋅s⁻³",
        frequency: "s⁻¹",
      };

      Object.entries(derivedCategories).forEach(([categoryId, expectedSymbol]) => {
        const category = CONVERSION_DATA.find((c) => c.id === categoryId);
        expect(category?.baseSISymbol).toBe(expectedSymbol);
      });
    });
  });

  describe("TO Section Base Factor", () => {
    it("should have at least one unit with factor 1 (or close to 1) in each category", () => {
      const geometryCategories = ['rack_geometry', 'shipping'];
      CONVERSION_DATA.forEach((category) => {
        if (geometryCategories.includes(category.id)) return;
        const hasBaseUnit = category.units.some(
          (unit) => Math.abs(unit.factor - 1) < 0.0001
        );
        expect(hasBaseUnit).toBe(true);
      });
    });

    it("should calculate correct base factor for non-base units", () => {
      const lengthCategory = CONVERSION_DATA.find((c) => c.id === "length");
      const inch = lengthCategory?.units.find((u) => u.id === "in");
      const foot = lengthCategory?.units.find((u) => u.id === "ft");

      expect(inch?.factor).toBeCloseTo(0.0254, 5);
      expect(foot?.factor).toBeCloseTo(0.3048, 5);

      const feetPerInch = foot!.factor / inch!.factor;
      expect(feetPerInch).toBeCloseTo(12, 4);
    });

    it("should have consistent base factors for temperature with offsets", () => {
      const tempCategory = CONVERSION_DATA.find((c) => c.id === "temperature");
      const kelvin = tempCategory?.units.find((u) => u.id === "k");
      const celsius = tempCategory?.units.find((u) => u.id === "c");
      const fahrenheit = tempCategory?.units.find((u) => u.id === "f");

      expect(kelvin?.factor).toBe(1);
      expect(kelvin?.offset === undefined || kelvin?.offset === 0).toBe(true);
      expect(celsius?.offset).toBe(273.15);
      expect(fahrenheit?.offset).toBeDefined();
    });
  });

  describe("TO Section SI Base Units", () => {
    it("should display SI base symbol consistently across categories", () => {
      const categoriesWithComplexSI = ["force", "energy", "power", "pressure"];
      
      categoriesWithComplexSI.forEach((categoryId) => {
        const category = CONVERSION_DATA.find((c) => c.id === categoryId);
        expect(category?.baseSISymbol).toBeDefined();
        expect(category?.baseSISymbol?.includes("⋅")).toBe(true);
      });
    });

    it("should have angular categories with correct SI symbols", () => {
      const angleCategory = CONVERSION_DATA.find((c) => c.id === "angle");
      const solidAngleCategory = CONVERSION_DATA.find((c) => c.id === "solid_angle");

      expect(angleCategory?.baseSISymbol).toBe("rad");
      expect(solidAngleCategory?.baseSISymbol).toBe("sr");
    });
  });
});

describe("Base Quantity Selection", () => {
  const allCategoryIds = CONVERSION_DATA.map((c) => c.id);

  it("should have all categories in a defined order", () => {
    expect(allCategoryIds.length).toBeGreaterThan(30);
    expect(allCategoryIds[0]).toBe("length");
  });

  it("should have SI base quantities at the beginning", () => {
    const siBaseQuantities: UnitCategory[] = [
      "length", "mass", "time", "current", "temperature", "amount", "intensity"
    ];

    siBaseQuantities.forEach((siBase, index) => {
      expect(allCategoryIds.indexOf(siBase)).toBeLessThan(10);
    });
  });

  describe("Arrow Key Navigation Logic", () => {
    it("should navigate to next category on down arrow", () => {
      const currentIndex = allCategoryIds.indexOf("length");
      const nextIndex = (currentIndex + 1) % allCategoryIds.length;
      expect(allCategoryIds[nextIndex]).toBe("mass");
    });

    it("should navigate to previous category on up arrow", () => {
      const currentIndex = allCategoryIds.indexOf("mass");
      const prevIndex = (currentIndex - 1 + allCategoryIds.length) % allCategoryIds.length;
      expect(allCategoryIds[prevIndex]).toBe("length");
    });

    it("should wrap around to first category from last on down arrow", () => {
      const lastIndex = allCategoryIds.length - 1;
      const nextIndex = (lastIndex + 1) % allCategoryIds.length;
      expect(nextIndex).toBe(0);
      expect(allCategoryIds[nextIndex]).toBe("length");
    });

    it("should wrap around to last category from first on up arrow", () => {
      const firstIndex = 0;
      const prevIndex = (firstIndex - 1 + allCategoryIds.length) % allCategoryIds.length;
      expect(prevIndex).toBe(allCategoryIds.length - 1);
    });
  });

  describe("New Categories", () => {
    it("should include frequency category", () => {
      expect(allCategoryIds).toContain("frequency");
      const freqCategory = CONVERSION_DATA.find((c) => c.id === "frequency");
      expect(freqCategory?.baseSISymbol).toBe("s⁻¹");
    });

    it("should include angular velocity category", () => {
      expect(allCategoryIds).toContain("angular_velocity");
      const avCategory = CONVERSION_DATA.find((c) => c.id === "angular_velocity");
      expect(avCategory?.units.some((u) => u.symbol === "rpm")).toBe(true);
    });

    it("should include momentum category", () => {
      expect(allCategoryIds).toContain("momentum");
      const momCategory = CONVERSION_DATA.find((c) => c.id === "momentum");
      expect(momCategory?.baseSISymbol).toBe("kg⋅m⋅s⁻¹");
    });

    it("should include thermodynamic categories", () => {
      expect(allCategoryIds).toContain("thermal_conductivity");
      expect(allCategoryIds).toContain("specific_heat");
      expect(allCategoryIds).toContain("entropy");
    });

    it("should include concentration category", () => {
      expect(allCategoryIds).toContain("concentration");
      const concCategory = CONVERSION_DATA.find((c) => c.id === "concentration");
      expect(concCategory?.units.some((u) => u.symbol === "ppm")).toBe(true);
    });

    it("should include fuel economy category", () => {
      expect(allCategoryIds).toContain("fuel_economy");
      const fuelCategory = CONVERSION_DATA.find((c) => c.id === "fuel_economy");
      expect(fuelCategory?.units.some((u) => u.symbol === "mpg (US)")).toBe(true);
    });

    it("should include data category with prefix support", () => {
      expect(allCategoryIds).toContain("data");
      const dataCategory = CONVERSION_DATA.find((c) => c.id === "data");
      expect(dataCategory?.units.some((u) => u.symbol === "B" && u.allowPrefixes)).toBe(true);
      expect(dataCategory?.units.some((u) => u.symbol === "bit" && u.allowPrefixes)).toBe(true);
    });
  });
});

describe("Archaic & Regional Units", () => {
  describe("Archaic Area Category", () => {
    const areaCategory = CONVERSION_DATA.find((c) => c.id === "archaic_area");

    it("should exist with square metre as base unit", () => {
      expect(areaCategory).toBeDefined();
      expect(areaCategory?.baseUnit).toBe("square metre");
      expect(areaCategory?.baseSISymbol).toBe("m²");
    });

    it("should have Japanese tatami variants with correct factors", () => {
      const kyoma = areaCategory?.units.find((u) => u.id === "kyoma");
      const edoma = areaCategory?.units.find((u) => u.id === "edoma");
      const danchi = areaCategory?.units.find((u) => u.id === "danchi_ma");
      expect(kyoma?.factor).toBeCloseTo(1.8241, 3);
      expect(edoma?.factor).toBeCloseTo(1.5488, 3);
      expect(danchi?.factor).toBeCloseTo(1.445, 3);
    });

    it("should have Korean pyeong with correct factor", () => {
      const pyeong = areaCategory?.units.find((u) => u.id === "pyeong_kr");
      expect(pyeong?.factor).toBeCloseTo(3.3058, 3);
    });

    it("should have Chinese mu with correct factor", () => {
      const mu = areaCategory?.units.find((u) => u.id === "mu_cn");
      expect(mu?.factor).toBeCloseTo(666.67, 1);
    });

    it("should have Israeli dunam with correct factor", () => {
      const dunam = areaCategory?.units.find((u) => u.id === "dunam_il");
      expect(dunam?.factor).toBe(1000);
    });

    it("should have Egyptian feddan with correct factor", () => {
      const feddan = areaCategory?.units.find((u) => u.id === "feddan_eg");
      expect(feddan?.factor).toBeCloseTo(4200.833, 1);
    });
  });

  describe("Archaic Mass Precious Metal Units", () => {
    const massCategory = CONVERSION_DATA.find((c) => c.id === "archaic_mass");

    it("should have metric carat with correct factor (0.2g)", () => {
      const carat = massCategory?.units.find((u) => u.id === "carat");
      expect(carat?.factor).toBe(0.0002);
    });

    it("should have tola with correct factor", () => {
      const tola = massCategory?.units.find((u) => u.id === "tola");
      expect(tola?.factor).toBeCloseTo(0.0116638, 5);
    });

    it("should have Korean don with correct factor", () => {
      const don = massCategory?.units.find((u) => u.id === "don_kr");
      expect(don?.factor).toBe(0.00375);
    });

    it("should have troy pound with correct factor", () => {
      const troyLb = massCategory?.units.find((u) => u.id === "troy_lb");
      expect(troyLb?.factor).toBeCloseTo(0.3732417, 5);
    });
  });

  describe("Archaic Volume Apothecary Units", () => {
    const volumeCategory = CONVERSION_DATA.find((c) => c.id === "archaic_volume");

    it("should have minim with correct factor", () => {
      const minim = volumeCategory?.units.find((u) => u.id === "minim");
      expect(minim?.factor).toBeCloseTo(0.0000616115, 7);
    });

    it("should have fluid scruple with correct factor", () => {
      const flScruple = volumeCategory?.units.find((u) => u.id === "fl_scruple");
      expect(flScruple?.factor).toBeCloseTo(0.00123223, 6);
    });

    it("should have fluid dram with correct factor", () => {
      const flDram = volumeCategory?.units.find((u) => u.id === "fl_dram");
      expect(flDram?.factor).toBeCloseTo(0.00369669, 6);
    });

    it("should have cubic metre for SI conversion", () => {
      const m3 = volumeCategory?.units.find((u) => u.id === "m3");
      expect(m3?.factor).toBe(1000);
      expect(m3?.allowPrefixes).toBe(true);
    });
  });
});
