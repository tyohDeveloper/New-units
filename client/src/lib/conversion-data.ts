export type UnitCategory =
  | "length"
  | "mass"
  | "time"
  | "current"
  | "temperature"
  | "amount"
  | "intensity" // SI Base
  | "area"
  | "volume"
  | "speed"
  | "acceleration"
  | "force"
  | "pressure"
  | "energy"
  | "power"
  | "frequency"
  | "charge"
  | "potential"
  | "capacitance"
  | "resistance"
  | "conductance"
  | "inductance"
  | "magnetic_flux"
  | "magnetic_density"
  | "radioactivity"
  | "radiation_dose"
  | "equivalent_dose"
  | "catalytic"
  | "angle"
  | "solid_angle"
  | "angular_velocity"
  | "momentum"
  | "luminous_flux"
  | "illuminance"
  | "luminous_exitance"
  | "luminance"
  | "torque"
  | "density"
  | "flow"
  | "viscosity"
  | "surface_tension"
  | "thermal_conductivity"
  | "specific_heat"
  | "entropy"
  | "concentration"
  | "data"
  | "rack_geometry"
  | "shipping"
  | "math"
  | "beer_wine_volume"
  | "refractive_power"
  | "sound_pressure"
  | "fuel_economy"
  | "lightbulb"
  | "photon"
  | "radioactive_decay"
  | "cross_section"
  | "kinematic_viscosity"
  | "electric_field"
  | "magnetic_field_h"
  | "sound_intensity"
  | "acoustic_impedance"
  | "fuel"
  | "archaic_length"
  | "archaic_mass"
  | "archaic_volume"
  | "archaic_area"
  | "archaic_energy"
  | "archaic_power";

export interface Prefix {
  id: string;
  name: string;
  symbol: string;
  factor: number;
}

export const PREFIXES: Prefix[] = [
  { id: 'yotta', name: 'Yotta', symbol: 'Y', factor: 1e24 },
  { id: 'zetta', name: 'Zetta', symbol: 'Z', factor: 1e21 },
  { id: 'exa', name: 'Exa', symbol: 'E', factor: 1e18 },
  { id: 'peta', name: 'Peta', symbol: 'P', factor: 1e15 },
  { id: 'tera', name: 'Tera', symbol: 'T', factor: 1e12 },
  { id: 'giga', name: 'Giga', symbol: 'G', factor: 1e9 },
  { id: 'mega', name: 'Mega', symbol: 'M', factor: 1e6 },
  { id: 'kilo', name: 'Kilo', symbol: 'k', factor: 1e3 },
  { id: 'none', name: '', symbol: '', factor: 1 },
  { id: 'centi', name: 'Centi', symbol: 'c', factor: 1e-2 },
  { id: 'milli', name: 'Milli', symbol: 'm', factor: 1e-3 },
  { id: 'micro', name: 'Micro', symbol: 'µ', factor: 1e-6 },
  { id: 'nano', name: 'Nano', symbol: 'n', factor: 1e-9 },
  { id: 'pico', name: 'Pico', symbol: 'p', factor: 1e-12 },
  { id: 'femto', name: 'Femto', symbol: 'f', factor: 1e-15 },
  { id: 'atto', name: 'Atto', symbol: 'a', factor: 1e-18 },
  { id: 'zepto', name: 'Zepto', symbol: 'z', factor: 1e-21 },
  { id: 'yocto', name: 'Yocto', symbol: 'y', factor: 1e-24 },
];

export const BINARY_PREFIXES: Prefix[] = [
  { id: 'exbi', name: 'Exbi', symbol: 'Ei', factor: 1152921504606846976 },
  { id: 'pebi', name: 'Pebi', symbol: 'Pi', factor: 1125899906842624 },
  { id: 'tebi', name: 'Tebi', symbol: 'Ti', factor: 1099511627776 },
  { id: 'gibi', name: 'Gibi', symbol: 'Gi', factor: 1073741824 },
  { id: 'mebi', name: 'Mebi', symbol: 'Mi', factor: 1048576 },
  { id: 'kibi', name: 'Kibi', symbol: 'Ki', factor: 1024 },
];

export const ALL_PREFIXES: Prefix[] = [...PREFIXES, ...BINARY_PREFIXES].sort((a, b) => b.factor - a.factor);

/**
 * Find the optimal SI prefix for a value to minimize displayed digits.
 * The goal is to keep values in the range [1, 1000) when possible.
 * For example: 1500000 J → 1.5 MJ, 0.000001 m → 1 µm
 * 
 * @param value - The numeric value to find a prefix for
 * @param unitSymbol - The unit symbol (used to check for 'kg' which can't use prefixes)
 * @param precision - Optional precision setting to ensure value is displayable
 * @returns Object with the best prefix and the adjusted value
 */
export function findOptimalPrefix(
  value: number, 
  unitSymbol: string = '',
  precision: number = 8
): { prefix: Prefix; adjustedValue: number } {
  const nonePrefix = PREFIXES.find(p => p.id === 'none')!;
  
  // If unit contains 'kg', can't use prefixes (kg is already prefixed)
  if (unitSymbol.includes('kg')) {
    return { prefix: nonePrefix, adjustedValue: value };
  }
  
  const absValue = Math.abs(value);
  if (absValue === 0 || !isFinite(absValue)) {
    return { prefix: nonePrefix, adjustedValue: value };
  }
  
  // Find the prefix that results in a value closest to 1-1000 range
  // This minimizes the number of digits before the decimal point
  let bestPrefix = nonePrefix;
  let bestScore = Math.abs(Math.log10(absValue)); // Score: distance from 1
  
  for (const prefix of PREFIXES) {
    if (prefix.id === 'none') continue;
    
    const adjustedAbs = absValue / prefix.factor;
    
    // Ideal range is [1, 1000) - gives 1-3 digits before decimal
    if (adjustedAbs >= 1 && adjustedAbs < 1000) {
      // Score based on closeness to 1 (lower is better)
      const score = Math.abs(Math.log10(adjustedAbs));
      if (score < bestScore) {
        bestScore = score;
        bestPrefix = prefix;
      }
    }
  }
  
  // Precision-aware fallback: if the value with no prefix would round to 0,
  // find a prefix that makes it displayable at the given precision
  const adjustedWithBest = value / bestPrefix.factor;
  const roundedWithBest = parseFloat(adjustedWithBest.toFixed(precision));
  
  if (roundedWithBest === 0 && value !== 0) {
    // Value would round to 0, try to find a smaller prefix
    for (const prefix of PREFIXES) {
      if (prefix.factor >= bestPrefix.factor) continue; // Only try smaller prefixes
      const adjusted = absValue / prefix.factor;
      const rounded = parseFloat(adjusted.toFixed(precision));
      if (rounded !== 0) {
        bestPrefix = prefix;
        break;
      }
    }
  }
  
  return { 
    prefix: bestPrefix, 
    adjustedValue: value / bestPrefix.factor 
  };
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Conversion factor to base unit
  offset?: number; // For temperature (e.g. Celsius to Kelvin)
  description?: string;
  allowPrefixes?: boolean;
  mathFunction?: 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'sqrt' | 'log10' | 'ln' | 'exp' | 'abs'; // For math function units
  isInverse?: boolean; // For photon wavelength: E = constant/λ (inverse relationship)
}

export interface CategoryDefinition {
  id: UnitCategory;
  name: string;
  baseUnit: string;
  baseSISymbol?: string;
  units: UnitDefinition[];
}

export const CONVERSION_DATA: CategoryDefinition[] = [
  // --- SI BASE QUANTITIES ---
  {
    id: "length",
    name: "Length",
    baseUnit: "meter",
    baseSISymbol: "m",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1, allowPrefixes: true },
      { id: "angstrom", name: "Angstrom", symbol: "Å", factor: 1e-10 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048, allowPrefixes: true },
      { id: "ft_in", name: "Foot:Inch", symbol: "ft:in", factor: 0.3048 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "nmi", name: "Nautical Mile", symbol: "nmi", factor: 1852 },
      { id: "au", name: "Astronomical Unit", symbol: "AU", factor: 1.496e11 },
      { id: "ly", name: "Light Year", symbol: "ly", factor: 9.461e15 },
      { id: "parsec", name: "Parsec", symbol: "pc", factor: 3.0857e16 },
    ],
  },
  {
    id: "mass",
    name: "Mass",
    baseUnit: "kilogram",
    baseSISymbol: "kg",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1 },
      { id: "ev_c2", name: "Electronvolt/c²", symbol: "eV⋅c⁻²", factor: 1.78266192e-36, allowPrefixes: true },
      { id: "g", name: "Gram", symbol: "g", factor: 0.001, allowPrefixes: true },
      { id: "oz", name: "Ounce", symbol: "oz", factor: 0.0283495 },
      { id: "oz_t", name: "Troy Ounce", symbol: "oz t", factor: 0.0311035 },
      { id: "lb_t", name: "Troy Pound", symbol: "lb t", factor: 0.3732417 },
      { id: "lb", name: "Pound", symbol: "lb", factor: 0.453592 },
      { id: "st", name: "Stone", symbol: "st", factor: 6.35029 },
      { id: "slug", name: "Slug", symbol: "slug", factor: 14.5939 },
      { id: "ton_us", name: "Short Ton (US)", symbol: "ton", factor: 907.185 },
      { id: "t", name: "Tonne", symbol: "t", factor: 1000 },
      { id: "ton_uk", name: "Long Ton (UK)", symbol: "ton", factor: 1016.05 },
    ],
  },
  {
    id: "time",
    name: "Time",
    baseUnit: "second",
    baseSISymbol: "s",
    units: [
      { id: "s", name: "Second", symbol: "s", factor: 1, allowPrefixes: true },
      { id: "shake", name: "Shake", symbol: "shake", factor: 1e-8 },
      { id: "min", name: "Minute", symbol: "min", factor: 60 },
      { id: "h", name: "Hour", symbol: "h", factor: 3600 },
      { id: "d_sid", name: "Sidereal Day", symbol: "d (sid)", factor: 86164.0905 },
      { id: "d", name: "Day", symbol: "d", factor: 86400 },
      { id: "wk", name: "Week", symbol: "wk", factor: 604800 },
      { id: "mo", name: "Month (Avg)", symbol: "mo", factor: 2.628e6 },
      { id: "y", name: "Year", symbol: "yr", factor: 3.154e7 },
    ],
  },
  {
    id: "current",
    name: "Electric Current",
    baseUnit: "ampere",
    baseSISymbol: "A",
    units: [
      { id: "a", name: "Ampere", symbol: "A", factor: 1, allowPrefixes: true },
      { id: "statA", name: "Statampere", symbol: "statA", factor: 3.33564e-10 },
      { id: "biot", name: "Biot (abampere)", symbol: "Bi", factor: 10 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    baseUnit: "kelvin",
    baseSISymbol: "K",
    units: [
      { id: "k", name: "Kelvin", symbol: "K", factor: 1, offset: 0, allowPrefixes: true },
      { id: "c", name: "Celsius", symbol: "°C", factor: 1, offset: 273.15 },
      {
        id: "f",
        name: "Fahrenheit",
        symbol: "°F",
        factor: 0.5555555555555556,
        offset: 459.67,
      },
      {
        id: "r",
        name: "Rankine",
        symbol: "°R",
        factor: 0.5555555555555556,
        offset: 0,
      },
    ],
  },
  {
    id: "amount",
    name: "Amount of Substance",
    baseUnit: "mole",
    baseSISymbol: "mol",
    units: [
      { id: "mol", name: "Mole", symbol: "mol", factor: 1, allowPrefixes: true },
      { id: "lbmol", name: "Pound-mole", symbol: "lb-mol", factor: 453.59237 },
    ],
  },
  {
    id: "intensity",
    name: "Luminous Intensity",
    baseUnit: "candela",
    baseSISymbol: "cd",
    units: [
      { id: "cd", name: "Candela", symbol: "cd", factor: 1, allowPrefixes: true },
      { id: "hk", name: "Hefnerkerze", symbol: "HK", factor: 0.903 },
      { id: "cp", name: "Candlepower", symbol: "cp", factor: 0.981 },
    ],
  },


  // --- DERIVED & PRACTICAL ---
  {
    id: "area",
    name: "Area",
    baseUnit: "square meter",
    baseSISymbol: "m²",
    units: [
      { id: "m2", name: "Square Meter", symbol: "m²", factor: 1, allowPrefixes: true },
      { id: "barn", name: "Barn", symbol: "b", factor: 1e-28 },
      { id: "sqin", name: "Square Inch", symbol: "in²", factor: 0.00064516 },
      { id: "sqft", name: "Square Foot", symbol: "ft²", factor: 0.092903 },
      { id: "sqyd", name: "Square Yard", symbol: "yd²", factor: 0.836127 },
      { id: "acre", name: "Acre", symbol: "ac", factor: 4046.86 },
      { id: "ha", name: "Hectare", symbol: "ha", factor: 10000 },
      { id: "sqmi", name: "Square Mile", symbol: "mi²", factor: 2.59e6 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    baseUnit: "cubic meter",
    baseSISymbol: "m³",
    units: [
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1, allowPrefixes: false },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00000492892 },
      { id: "tsp_imp", name: "Teaspoon (Imp)", symbol: "tsp", factor: 0.00000591939 },
      { id: "tbsp", name: "Tablespoon (US)", symbol: "tbsp", factor: 0.0000147868 },
      { id: "tbsp_imp", name: "Tablespoon (Imp)", symbol: "tbsp", factor: 0.0000177582 },
      { id: "floz_imp", name: "Fluid Ounce (Imp)", symbol: "fl oz", factor: 0.0000284130625 },
      { id: "floz", name: "Fluid Ounce (US)", symbol: "fl oz", factor: 0.0000295735 },
      { id: "cup", name: "Cup (US)", symbol: "cp", factor: 0.000236588 },
      { id: "pt", name: "Pint (US Fluid)", symbol: "pt", factor: 0.000473176 },
      { id: "pt_dry", name: "Pint (US Dry)", symbol: "dry pt", factor: 0.00055061 },
      { id: "pt_imp", name: "Pint (Imp)", symbol: "pt", factor: 0.00056826125 },
      { id: "qt", name: "Quart (US Fluid)", symbol: "qt", factor: 0.000946353 },
      { id: "l", name: "Liter", symbol: "L", factor: 0.001, allowPrefixes: true },
      { id: "qt_dry", name: "Quart (US Dry)", symbol: "dry qt", factor: 0.00110122 },
      { id: "qt_imp", name: "Quart (Imp)", symbol: "qt", factor: 0.0011365225 },
      { id: "gal", name: "Gallon (US)", symbol: "gal", factor: 0.00378541 },
      { id: "gal_imp", name: "Gallon (Imp)", symbol: "gal", factor: 0.00454609 },
      { id: "pk", name: "Peck (US)", symbol: "pk", factor: 0.00880977 },
      { id: "ft3", name: "Cubic Foot", symbol: "ft³", factor: 0.0283168 },
      { id: "bu", name: "Bushel (US)", symbol: "bu", factor: 0.0352391 },
      { id: "bbl", name: "Barrel (Oil)", symbol: "bbl", factor: 0.158987 },
      { id: "yd3", name: "Cubic Yard", symbol: "yd³", factor: 0.764555 },
      { id: "ac_ft", name: "Acre-foot", symbol: "ac⋅ft", factor: 1233.48184 },
      { id: "mi3", name: "Cubic Mile", symbol: "mi³", factor: 4.16818e9 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    baseUnit: "meter/second",
    baseSISymbol: "m⋅s⁻¹",
    units: [
      { id: "mps", name: "Meter/Second", symbol: "m⋅s⁻¹", factor: 1 },
      { id: "kmh", name: "Kilometer/Hour", symbol: "km⋅h⁻¹", factor: 0.277778 },
      { id: "mph", name: "Mile/Hour", symbol: "mph", factor: 0.44704 },
      { id: "kn", name: "Knot", symbol: "kn", factor: 0.514444 },
      { id: "mach", name: "Mach", symbol: "Ma", factor: 343 },
      { id: "c", name: "Speed of Light", symbol: "c", factor: 299792458 },
    ],
  },
  {
    id: "acceleration",
    name: "Acceleration",
    baseUnit: "meter/sq second",
    baseSISymbol: "m⋅s⁻²",
    units: [
      { id: "mps2", name: "Meter/sq sec", symbol: "m⋅s⁻²", factor: 1 },
      { id: "gal", name: "Gal", symbol: "Gal", factor: 0.01 },
      { id: "ftps2", name: "Foot/sq sec", symbol: "ft⋅s⁻²", factor: 0.3048 },
      { id: "g", name: "g-force", symbol: "g", factor: 9.80665 },
    ],
  },
  {
    id: "force",
    name: "Force",
    baseUnit: "newton",
    baseSISymbol: "kg⋅m⋅s⁻²",
    units: [
      { id: "n", name: "Newton", symbol: "N", factor: 1, allowPrefixes: true },
      { id: "dyn", name: "Dyne", symbol: "dyn", factor: 1e-5 },
      { id: "lbf", name: "Pound-force", symbol: "lbf", factor: 4.44822 },
      { id: "kgf", name: "Kilogram-force", symbol: "kgf", factor: 9.80665 },
      { id: "kip", name: "Kip", symbol: "kip", factor: 4448.22 },
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    baseUnit: "pascal",
    baseSISymbol: "kg⋅m⁻¹⋅s⁻²",
    units: [
      { id: "pa", name: "Pascal", symbol: "Pa", factor: 1, allowPrefixes: true },
      { id: "torr", name: "Torr", symbol: "Torr", factor: 133.322 },
      { id: "mmhg", name: "mmHg (Blood)", symbol: "mmHg", factor: 133.322 },
      { id: "psi", name: "PSI", symbol: "psi", factor: 6894.76 },
      { id: "bar", name: "Bar", symbol: "bar", factor: 100000 },
      { id: "atm", name: "Atmosphere", symbol: "atm", factor: 101325 },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    baseUnit: "joule",
    baseSISymbol: "kg⋅m²⋅s⁻²",
    units: [
      { id: "j", name: "Joule", symbol: "J", factor: 1, allowPrefixes: true },
      { id: "ev", name: "Electronvolt", symbol: "eV", factor: 1.602176634e-19, allowPrefixes: true },
      { id: "cal", name: "Calorie", symbol: "cal", factor: 4.184 },
      { id: "btu", name: "BTU", symbol: "BTU", factor: 1055.06 },
      { id: "wh", name: "Watt-hour", symbol: "Wh", factor: 3600 },
      { id: "kcal", name: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { id: "kwh", name: "Kilowatt-hour", symbol: "kWh", factor: 3.6e6 },
      { id: "therm", name: "Therm", symbol: "therm", factor: 1.05506e8 },
      { id: "tnt", name: "Ton of TNT", symbol: "tTNT", factor: 4.184e9 },
      { id: "boe", name: "Barrel of Oil Equivalent", symbol: "BOE", factor: 6.1e9 },
      { id: "tce", name: "Ton of Coal Equivalent", symbol: "TCE", factor: 2.93e10 },
    ],
  },
  {
    id: "power",
    name: "Power",
    baseUnit: "watt",
    baseSISymbol: "kg⋅m²⋅s⁻³",
    units: [
      { id: "w", name: "Watt", symbol: "W", factor: 1, allowPrefixes: true },
      { id: "btu_h", name: "BTU per Hour", symbol: "BTU⋅h⁻¹", factor: 0.293071 },
      { id: "hp_m", name: "Metric HP", symbol: "hp (M)", factor: 735.499 },
      { id: "hp", name: "Horsepower", symbol: "hp", factor: 745.7 },
      { id: "ton_ref", name: "Ton of Refrigeration", symbol: "TR", factor: 3516.85 },
    ],
  },
  {
    id: "frequency",
    name: "Frequency",
    baseUnit: "hertz",
    baseSISymbol: "s⁻¹",
    units: [
      { id: "hz", name: "Hertz", symbol: "Hz", factor: 1, allowPrefixes: true },
      { id: "rpm", name: "Revolutions/Minute", symbol: "rpm", factor: 0.0166667 },
      { id: "bpm", name: "Beats/Minute", symbol: "BPM", factor: 0.0166667 },
      { id: "rad_s", name: "Radians/Second", symbol: "rad⋅s⁻¹", factor: 0.159155 },
      { id: "rps", name: "Revolutions/Second", symbol: "rps", factor: 1 },
    ],
  },

  // --- ELECTRICAL ---
  {
    id: "charge",
    name: "Electric Charge",
    baseUnit: "coulomb",
    baseSISymbol: "A⋅s",
    units: [
      { id: "c", name: "Coulomb", symbol: "C", factor: 1, allowPrefixes: true },
      { id: "mah", name: "Milliamp-hour", symbol: "mAh", factor: 3.6 },
      { id: "ah", name: "Ampere-hour", symbol: "Ah", factor: 3600 },
      { id: "faraday", name: "Faraday", symbol: "F", factor: 96485 },
    ],
  },
  {
    id: "potential",
    name: "Electric Potential",
    baseUnit: "volt",
    baseSISymbol: "kg⋅m²⋅s⁻³⋅A⁻¹",
    units: [
      { id: "v", name: "Volt", symbol: "V", factor: 1, allowPrefixes: true },
      { id: "statv", name: "Statvolt", symbol: "statV", factor: 299.792 },
    ],
  },
  {
    id: "capacitance",
    name: "Capacitance",
    baseUnit: "farad",
    baseSISymbol: "kg⁻¹⋅m⁻²⋅s⁴⋅A²",
    units: [
      { id: "f", name: "Farad", symbol: "F", factor: 1, allowPrefixes: true },
      { id: "statf", name: "Statfarad", symbol: "statF", factor: 1.11265e-12 },
      { id: "abf", name: "Abfarad", symbol: "abF", factor: 1e-9 },
    ],
  },
  {
    id: "resistance",
    name: "Resistance",
    baseUnit: "ohm",
    baseSISymbol: "kg⋅m²⋅s⁻³⋅A⁻²",
    units: [
      { id: "ohm", name: "Ohm", symbol: "Ω", factor: 1, allowPrefixes: true },
    ],
  },
  {
    id: "conductance",
    name: "Conductance",
    baseUnit: "siemens",
    baseSISymbol: "kg⁻¹⋅m⁻²⋅s³⋅A²",
    units: [
      { id: "s", name: "Siemens", symbol: "S", factor: 1, allowPrefixes: true },
      { id: "mho", name: "Mho", symbol: "℧", factor: 1 },
    ],
  },
  {
    id: "magnetic_flux",
    name: "Magnetic Flux",
    baseUnit: "weber",
    baseSISymbol: "kg⋅m²⋅s⁻²⋅A⁻¹",
    units: [
      { id: "wb", name: "Weber", symbol: "Wb", factor: 1, allowPrefixes: true },
      { id: "mx", name: "Maxwell", symbol: "Mx", factor: 1e-8 },
    ],
  },
  {
    id: "magnetic_density",
    name: "Magnetic Flux Density",
    baseUnit: "tesla",
    baseSISymbol: "kg⋅s⁻²⋅A⁻¹",
    units: [
      { id: "t", name: "Tesla", symbol: "T", factor: 1, allowPrefixes: true },
      { id: "g", name: "Gauss", symbol: "G", factor: 1e-4 },
    ],
  },
  {
    id: "inductance",
    name: "Inductance",
    baseUnit: "henry",
    baseSISymbol: "kg⋅m²⋅s⁻²⋅A⁻²",
    units: [
      { id: "h", name: "Henry", symbol: "H", factor: 1, allowPrefixes: true },
    ],
  },

  // --- RADIATION & PHYSICS ---
  {
    id: "radioactivity",
    name: "Radioactivity",
    baseUnit: "becquerel",
    baseSISymbol: "s⁻¹",
    units: [
      { id: "bq", name: "Becquerel", symbol: "Bq", factor: 1, allowPrefixes: true },
      { id: "rd", name: "Rutherford", symbol: "Rd", factor: 1e6 },
      { id: "ci", name: "Curie", symbol: "Ci", factor: 3.7e10 },
    ],
  },
  {
    id: "radiation_dose",
    name: "Absorbed Radiation Dose",
    baseUnit: "gray",
    baseSISymbol: "m²⋅s⁻²",
    units: [
      { id: "gy", name: "Gray", symbol: "Gy", factor: 1, allowPrefixes: true },
      { id: "rad", name: "Rad", symbol: "rad", factor: 0.01 },
    ],
  },
  {
    id: "equivalent_dose",
    name: "Equivalent Radiation Dose",
    baseUnit: "sievert",
    baseSISymbol: "m²⋅s⁻²",
    units: [
      { id: "sv", name: "Sievert", symbol: "Sv", factor: 1, allowPrefixes: true },
      { id: "rem", name: "Rem", symbol: "rem", factor: 0.01 },
    ],
  },
  {
    id: "photon",
    name: "Photon/Light",
    baseUnit: "electronvolt",
    baseSISymbol: "eV",
    units: [
      // Energy (base unit) - direct relationship
      { id: "eV", name: "Electronvolt", symbol: "eV", factor: 1, allowPrefixes: true },
      // Frequency - direct relationship: E = hν, so ν = E/h
      // 1 eV photon has frequency = 1 eV / (4.135667696e-15 eV·s) = 2.417989242e14 Hz
      // factor = h in eV·s = 4.135667696e-15 (multiply eV by this to get Hz)
      { id: "Hz", name: "Hertz", symbol: "Hz", factor: 4.135667696e-15, allowPrefixes: true },
      // Wavelength - INVERSE relationship: E = hc/λ, so λ = hc/E
      // hc = 1.239841984e-6 eV·m
      // Use nano prefix for nm (no separate nm unit to avoid prefix stacking)
      { id: "m_wave", name: "Meter (wavelength)", symbol: "m", factor: 1.239841984e-6, allowPrefixes: true, isInverse: true },
    ],
  },
  {
    id: "radioactive_decay",
    name: "Radioactive Decay",
    baseUnit: "per_second",
    baseSISymbol: "s⁻¹",
    units: [
      // Decay constant λ (base unit) - probability of decay per unit time
      { id: "per_s", name: "Per Second (λ)", symbol: "s⁻¹", factor: 1, allowPrefixes: true },
      { id: "per_min", name: "Per Minute (λ)", symbol: "min⁻¹", factor: 1/60 },
      { id: "per_hr", name: "Per Hour (λ)", symbol: "h⁻¹", factor: 1/3600 },
      { id: "per_day", name: "Per Day (λ)", symbol: "d⁻¹", factor: 1/86400 },
      { id: "per_year", name: "Per Year (λ)", symbol: "y⁻¹", factor: 1/31557600 },
      // Half-life t½ = ln(2)/λ - INVERSE relationship
      { id: "half_s", name: "Half-life (seconds)", symbol: "s", factor: 0.693147180559945, isInverse: true },
      { id: "half_min", name: "Half-life (minutes)", symbol: "min", factor: 0.693147180559945 * 60, isInverse: true },
      { id: "half_hr", name: "Half-life (hours)", symbol: "h", factor: 0.693147180559945 * 3600, isInverse: true },
      { id: "half_day", name: "Half-life (days)", symbol: "d", factor: 0.693147180559945 * 86400, isInverse: true },
      { id: "half_year", name: "Half-life (years)", symbol: "y", factor: 0.693147180559945 * 31557600, isInverse: true },
      // Mean lifetime τ = 1/λ - INVERSE relationship
      { id: "tau_s", name: "Mean Lifetime (seconds)", symbol: "τ (s)", factor: 1, isInverse: true },
      { id: "tau_min", name: "Mean Lifetime (minutes)", symbol: "τ (min)", factor: 60, isInverse: true },
      { id: "tau_hr", name: "Mean Lifetime (hours)", symbol: "τ (h)", factor: 3600, isInverse: true },
      { id: "tau_day", name: "Mean Lifetime (days)", symbol: "τ (d)", factor: 86400, isInverse: true },
      { id: "tau_year", name: "Mean Lifetime (years)", symbol: "τ (y)", factor: 31557600, isInverse: true },
    ],
  },
  {
    id: "cross_section",
    name: "Cross-Section",
    baseUnit: "barn",
    baseSISymbol: "m²",
    units: [
      { id: "barn", name: "Barn", symbol: "b", factor: 1, allowPrefixes: true },
      { id: "fm2", name: "Square Femtometer", symbol: "fm²", factor: 0.01 },
      { id: "cm2_cs", name: "Square Centimeter", symbol: "cm²", factor: 1e24 },
      { id: "m2_cs", name: "Square Meter", symbol: "m²", factor: 1e28 },
    ],
  },
  {
    id: "kinematic_viscosity",
    name: "Kinematic Viscosity",
    baseUnit: "m2_per_s",
    baseSISymbol: "m²⋅s⁻¹",
    units: [
      { id: "m2_per_s", name: "Square Meter per Second", symbol: "m²⋅s⁻¹", factor: 1, allowPrefixes: true },
      { id: "centistokes", name: "Centistokes", symbol: "cSt", factor: 1e-6 },
      { id: "stokes", name: "Stokes", symbol: "St", factor: 1e-4 },
      { id: "ft2_per_s", name: "Square Foot per Second", symbol: "ft²⋅s⁻¹", factor: 0.09290304 },
    ],
  },
  {
    id: "electric_field",
    name: "Electric Field Strength",
    baseUnit: "v_per_m",
    baseSISymbol: "V⋅m⁻¹",
    units: [
      { id: "v_per_m", name: "Volt per Meter", symbol: "V⋅m⁻¹", factor: 1, allowPrefixes: true },
      { id: "v_per_cm", name: "Volt per Centimeter", symbol: "V⋅cm⁻¹", factor: 100 },
      { id: "kv_per_m", name: "Kilovolt per Meter", symbol: "kV⋅m⁻¹", factor: 1000 },
      { id: "statv_per_cm", name: "Statvolt per Centimeter", symbol: "statV⋅cm⁻¹", factor: 29979.2458 },
      { id: "kv_per_cm", name: "Kilovolt per Centimeter", symbol: "kV⋅cm⁻¹", factor: 100000 },
    ],
  },
  {
    id: "magnetic_field_h",
    name: "Magnetic Field Strength (H)",
    baseUnit: "a_per_m",
    baseSISymbol: "A⋅m⁻¹",
    units: [
      { id: "a_per_m", name: "Ampere per Meter", symbol: "A⋅m⁻¹", factor: 1, allowPrefixes: true },
      { id: "oersted", name: "Oersted", symbol: "Oe", factor: 79.5774715 },
      { id: "ka_per_m", name: "Kiloampere per Meter", symbol: "kA⋅m⁻¹", factor: 1000 },
    ],
  },
  {
    id: "sound_intensity",
    name: "Sound Intensity",
    baseUnit: "w_per_m2",
    baseSISymbol: "W⋅m⁻²",
    units: [
      { id: "w_per_m2", name: "Watt per Square Meter", symbol: "W⋅m⁻²", factor: 1, allowPrefixes: true },
      { id: "i0", name: "Reference Intensity (I₀)", symbol: "I₀", factor: 1e-12 },
      { id: "w_per_cm2", name: "Watt per Square Centimeter", symbol: "W⋅cm⁻²", factor: 10000 },
    ],
  },
  {
    id: "acoustic_impedance",
    name: "Acoustic Impedance",
    baseUnit: "rayl",
    baseSISymbol: "Pa⋅s⋅m⁻¹",
    units: [
      { id: "rayl", name: "Rayl", symbol: "rayl", factor: 1, allowPrefixes: true },
      { id: "pa_s_per_m", name: "Pascal-second per Meter", symbol: "Pa⋅s⋅m⁻¹", factor: 1 },
      { id: "mrayl", name: "Megarayl", symbol: "MRayl", factor: 1e6 },
    ],
  },

  // --- CHEMISTRY ---
  {
    id: "catalytic",
    name: "Catalytic Activity",
    baseUnit: "katal",
    baseSISymbol: "mol⋅s⁻¹",
    units: [
      { id: "kat", name: "Katal", symbol: "kat", factor: 1, allowPrefixes: true },
      { id: "u", name: "Enzyme Unit", symbol: "U", factor: 1.667e-8 },
    ],
  },

  // --- ANGLES ---
  {
    id: "angle",
    name: "Plane Angle",
    baseUnit: "radian",
    baseSISymbol: "rad",
    units: [
      { id: "rad", name: "Radian", symbol: "rad", factor: 1, allowPrefixes: true },
      { id: "arcsec", name: "Arcsecond", symbol: "″", factor: 4.848e-6 },
      { id: "arcmin", name: "Arcminute", symbol: "′", factor: 0.000290888 },
      { id: "grad", name: "Gradian", symbol: "grad", factor: 0.015708 },
      { id: "deg", name: "Degree", symbol: "°", factor: 0.0174533 },
      { id: "deg_dms", name: "Degree (DMS)", symbol: "° ′ ″", factor: 0.0174533 },
    ],
  },
  {
    id: "solid_angle",
    name: "Solid Angle",
    baseUnit: "steradian",
    baseSISymbol: "sr",
    units: [
      { id: "sr", name: "Steradian", symbol: "sr", factor: 1, allowPrefixes: true },
      { id: "sqdeg", name: "Square Degree", symbol: "deg²", factor: 0.0003046 },
      { id: "sp", name: "Spat", symbol: "sp", factor: 12.56637 },
    ],
  },
  {
    id: "angular_velocity",
    name: "Angular Velocity",
    baseUnit: "radian/second",
    baseSISymbol: "rad⋅s⁻¹",
    units: [
      { id: "rad_s", name: "Radian/Second", symbol: "rad⋅s⁻¹", factor: 1 },
      { id: "deg_s", name: "Degree/Second", symbol: "°⋅s⁻¹", factor: 0.0174533 },
      { id: "rpm", name: "Revolutions/Minute", symbol: "rpm", factor: 0.10472 },
      { id: "rps", name: "Revolutions/Second", symbol: "rps", factor: 6.28319 },
    ],
  },
  {
    id: "momentum",
    name: "Momentum",
    baseUnit: "kilogram meter/second",
    baseSISymbol: "kg⋅m⋅s⁻¹",
    units: [
      { id: "kgms", name: "kg⋅m/s", symbol: "kg⋅m⋅s⁻¹", factor: 1 },
      { id: "lbfts", name: "lb⋅ft/s", symbol: "lb⋅ft⋅s⁻¹", factor: 0.138255 },
      { id: "ns", name: "Newton-second", symbol: "N⋅s", factor: 1 },
      { id: "slugfts", name: "slug⋅ft/s", symbol: "slug⋅ft⋅s⁻¹", factor: 4.44822 },
    ],
  },

  // --- OTHER PHYSICAL PROPERTIES ---
  {
    id: "density",
    name: "Density",
    baseUnit: "kg/m³",
    baseSISymbol: "kg⋅m⁻³",
    units: [
      { id: "kgm3", name: "kg/m³", symbol: "kg⋅m⁻³", factor: 1 },
      { id: "lbft3", name: "lb/ft³", symbol: "lb⋅ft⁻³", factor: 16.0185 },
      { id: "gcm3", name: "g/cm³", symbol: "g⋅cm⁻³", factor: 1000 },
    ],
  },
  {
    id: "viscosity",
    name: "Viscosity (Dynamic)",
    baseUnit: "pascal-second",
    baseSISymbol: "kg⋅m⁻¹⋅s⁻¹",
    units: [
      { id: "pas", name: "Pascal-second", symbol: "Pa·s", factor: 1 },
      { id: "cp", name: "Centipoise", symbol: "cP", factor: 0.001 },
      { id: "poise", name: "Poise", symbol: "P", factor: 0.1 },
    ],
  },
  {
    id: "surface_tension",
    name: "Surface Tension",
    baseUnit: "newton/meter",
    baseSISymbol: "kg⋅s⁻²",
    units: [
      { id: "nm", name: "Newton/meter", symbol: "N⋅m⁻¹", factor: 1 },
      {
        id: "dynecm",
        name: "Dyne/centimeter",
        symbol: "dyn⋅cm⁻¹",
        factor: 0.001,
      },
    ],
  },
  {
    id: "thermal_conductivity",
    name: "Thermal Conductivity",
    baseUnit: "watt/meter-kelvin",
    baseSISymbol: "W⋅m⁻¹⋅K⁻¹",
    units: [
      { id: "wmk", name: "W/(m⋅K)", symbol: "W⋅m⁻¹⋅K⁻¹", factor: 1 },
      { id: "btu_hftf", name: "BTU/(h⋅ft⋅°F)", symbol: "BTU⋅h⁻¹⋅ft⁻¹⋅°F⁻¹", factor: 1.73073 },
      { id: "cal_scmC", name: "cal/(s⋅cm⋅°C)", symbol: "cal⋅s⁻¹⋅cm⁻¹⋅°C⁻¹", factor: 418.4 },
    ],
  },
  {
    id: "specific_heat",
    name: "Specific Heat Capacity",
    baseUnit: "joule/kilogram-kelvin",
    baseSISymbol: "J⋅kg⁻¹⋅K⁻¹",
    units: [
      { id: "jkgk", name: "J/(kg⋅K)", symbol: "J⋅kg⁻¹⋅K⁻¹", factor: 1 },
      { id: "kjkgk", name: "kJ/(kg⋅K)", symbol: "kJ⋅kg⁻¹⋅K⁻¹", factor: 1000 },
      { id: "cal_gC", name: "cal/(g⋅°C)", symbol: "cal⋅g⁻¹⋅°C⁻¹", factor: 4184 },
      { id: "btu_lbF", name: "BTU/(lb⋅°F)", symbol: "BTU⋅lb⁻¹⋅°F⁻¹", factor: 4186.8 },
    ],
  },
  {
    id: "entropy",
    name: "Entropy",
    baseUnit: "joule/kelvin",
    baseSISymbol: "J⋅K⁻¹",
    units: [
      { id: "jk", name: "Joule/Kelvin", symbol: "J⋅K⁻¹", factor: 1 },
      { id: "calk", name: "Calorie/Kelvin", symbol: "cal⋅K⁻¹", factor: 4.184 },
      { id: "kjk", name: "Kilojoule/Kelvin", symbol: "kJ⋅K⁻¹", factor: 1000 },
      { id: "kcalk", name: "Kilocalorie/Kelvin", symbol: "kcal⋅K⁻¹", factor: 4184 },
    ],
  },
  {
    id: "torque",
    name: "Torque",
    baseUnit: "newton meter",
    baseSISymbol: "kg⋅m²⋅s⁻²",
    units: [
      { id: "nm", name: "Newton-meter", symbol: "N⋅m", factor: 1 },
      { id: "inlb", name: "Inch-pound", symbol: "in⋅lb", factor: 0.112985 },
      { id: "ftlb", name: "Foot-pound", symbol: "ft⋅lb", factor: 1.35582 },
      { id: "kgm", name: "Kilogram-meter", symbol: "kg⋅m", factor: 9.80665 },
    ],
  },
  {
    id: "flow",
    name: "Flow Rate (Volumetric)",
    baseUnit: "cubic metre/second",
    baseSISymbol: "m³⋅s⁻¹",
    units: [
      { id: "m3s", name: "Cubic Metre/second", symbol: "m³⋅s⁻¹", factor: 1 },
      { id: "cm3h", name: "Cubic Centimetre/hour", symbol: "cm³⋅h⁻¹", factor: 2.7778e-10 },
      { id: "cm3min", name: "Cubic Centimetre/minute", symbol: "cm³⋅min⁻¹", factor: 1.6667e-8 },
      { id: "gald", name: "US Gallon/day", symbol: "gal⋅d⁻¹", factor: 4.3815e-8 },
      { id: "lh", name: "Liter/hour", symbol: "L⋅h⁻¹", factor: 2.7778e-7 },
      { id: "cm3s", name: "Cubic Centimetre/second", symbol: "cm³⋅s⁻¹", factor: 1e-6 },
      { id: "galh", name: "US Gallon/hour", symbol: "gal⋅h⁻¹", factor: 1.0515e-6 },
      { id: "impgalh", name: "Imperial Gallon/hour", symbol: "Imp gal⋅h⁻¹", factor: 1.2628e-6 },
      { id: "bbld", name: "Barrel/day", symbol: "bbl⋅d⁻¹", factor: 1.8401e-6 },
      { id: "ft3h", name: "Cubic Foot/hour", symbol: "ft³⋅h⁻¹", factor: 7.8658e-6 },
      { id: "lmin", name: "Liter/minute", symbol: "L⋅min⁻¹", factor: 1.6667e-5 },
      { id: "bblh", name: "Barrel/hour", symbol: "bbl⋅h⁻¹", factor: 4.4165e-5 },
      { id: "gpm", name: "US Gallon/minute", symbol: "GPM", factor: 6.309e-5 },
      { id: "impgalmin", name: "Imperial Gallon/minute", symbol: "Imp gal⋅min⁻¹", factor: 7.577e-5 },
      { id: "m3h", name: "Cubic Metre/hour", symbol: "m³⋅h⁻¹", factor: 0.000277778 },
      { id: "cfm", name: "Cubic Foot/minute", symbol: "CFM", factor: 0.000471947 },
      { id: "ls", name: "Liter/second", symbol: "L⋅s⁻¹", factor: 0.001 },
      { id: "bblmin", name: "Barrel/minute", symbol: "bbl⋅min⁻¹", factor: 0.00264979 },
      { id: "gals", name: "US Gallon/second", symbol: "gal⋅s⁻¹", factor: 0.003785412 },
      { id: "impgals", name: "Imperial Gallon/second", symbol: "Imp gal⋅s⁻¹", factor: 0.00454609 },
      { id: "m3min", name: "Cubic Metre/minute", symbol: "m³⋅min⁻¹", factor: 0.0166667 },
      { id: "ft3s", name: "Cubic Foot/second", symbol: "ft³⋅s⁻¹", factor: 0.0283168 },
      { id: "bbls", name: "Barrel/second", symbol: "bbl⋅s⁻¹", factor: 0.158987295 },
      { id: "sv", name: "Sverdrup", symbol: "Sv", factor: 1e6 },
    ],
  },

  // --- LIGHT & SOUND ---
  {
    id: "luminous_flux",
    name: "Luminous Flux (Human)",
    baseUnit: "lumen",
    baseSISymbol: "cd⋅sr",
    units: [
      { id: "lm", name: "Lumen", symbol: "lm", factor: 1, allowPrefixes: true },
      { id: "cdsr", name: "Candela-Steradian", symbol: "cd⋅sr", factor: 1 },
      { id: "talbot", name: "Talbot", symbol: "T", factor: 1, description: "Lumen-second (photographic)" },
      { id: "candlepower", name: "Candlepower (spherical)", symbol: "cp", factor: 12.566371 },
    ],
  },
  {
    id: "illuminance",
    name: "Illuminance",
    baseUnit: "lux",
    baseSISymbol: "cd⋅sr⋅m⁻²",
    units: [
      { id: "lx", name: "Lux", symbol: "lx", factor: 1, allowPrefixes: true },
      { id: "nox", name: "Nox", symbol: "nox", factor: 0.001 },
      { id: "fc", name: "Foot-candle", symbol: "fc", factor: 10.7639 },
      { id: "ph", name: "Phot", symbol: "ph", factor: 10000 },
    ],
  },
  {
    id: "refractive_power",
    name: "Refractive Power (Vision)",
    baseUnit: "reciprocal-meter",
    baseSISymbol: "m⁻¹",
    units: [
      { id: "m-1", name: "Reciprocal Meter", symbol: "m⁻¹", factor: 1 },
      { id: "d", name: "Diopter", symbol: "D", factor: 1 },
    ],
  },
  {
    id: "sound_pressure",
    name: "Sound Pressure",
    baseUnit: "pascal",
    baseSISymbol: "kg⋅m⁻¹⋅s⁻²",
    units: [
      { id: "pa", name: "Pascal", symbol: "Pa", factor: 1 },
      { id: "ubar", name: "Microbar", symbol: "µbar", factor: 0.1 },
      { id: "dyncm2", name: "Dyne/cm²", symbol: "dyn⋅cm⁻²", factor: 0.1 },
      { id: "bar", name: "Bar", symbol: "bar", factor: 100000 },
    ],
  },

  // --- CHEMISTRY ---
  {
    id: "concentration",
    name: "Concentration",
    baseUnit: "mole/liter",
    baseSISymbol: "mol⋅L⁻¹",
    units: [
      { id: "mol_l", name: "Mole/Liter", symbol: "mol⋅L⁻¹", factor: 1, allowPrefixes: true },
      { id: "ppt", name: "Parts per Trillion", symbol: "ppt", factor: 1e-12 },
      { id: "ppb", name: "Parts per Billion", symbol: "ppb", factor: 1e-9 },
      { id: "ppm", name: "Parts per Million", symbol: "ppm", factor: 1e-6 },
      { id: "mol_m3", name: "Mole/m³", symbol: "mol⋅m⁻³", factor: 0.001 },
      { id: "permille", name: "Per Mille", symbol: "‰", factor: 0.001 },
      { id: "percent", name: "Percent", symbol: "%", factor: 0.01 },
    ],
  },

  // --- HUMAN/PRACTICAL ---
  {
    id: "fuel_economy",
    name: "Fuel Economy",
    baseUnit: "kilometer/liter",
    baseSISymbol: "km⋅L⁻¹",
    units: [
      { id: "km_l", name: "Kilometers/Liter", symbol: "km⋅L⁻¹", factor: 1 },
      { id: "km_gal_us", name: "Kilometers/Gallon (US)", symbol: "km⋅gal⁻¹", factor: 0.264172 },
      { id: "mpg_imp", name: "Miles/Gallon (Imp)", symbol: "mpg (Imp)", factor: 0.354006 },
      { id: "mpg_us", name: "Miles/Gallon (US)", symbol: "mpg (US)", factor: 0.425144 },
      { id: "mi_l", name: "Miles/Liter", symbol: "mi⋅L⁻¹", factor: 1.60934 },
      { id: "km_kwh", name: "Kilometers/kWh (EV)", symbol: "km⋅kWh⁻¹", factor: 9.5 },
      { id: "mi_kwh", name: "Miles/kWh (EV)", symbol: "mi⋅kWh⁻¹", factor: 15.29 },
    ],
  },
  {
    id: "lightbulb",
    name: "Lightbulb Efficiency",
    baseUnit: "lumen",
    baseSISymbol: "lm",
    units: [
      { id: "lm", name: "Lumen", symbol: "lm", factor: 1, allowPrefixes: true },
      { id: "incandescent_w", name: "Incandescent Bulb (watts)", symbol: "W (inc)", factor: 15 },
      { id: "halogen_w", name: "Halogen Bulb (watts)", symbol: "W (hal)", factor: 20 },
      { id: "fluorescent_w", name: "Fluorescent Bulb (watts)", symbol: "W (CFL)", factor: 70 },
      { id: "led_w", name: "LED Bulb (watts)", symbol: "W (LED)", factor: 95 },
      { id: "sodium_w", name: "Sodium Vapor Lamp (watts)", symbol: "W (Na)", factor: 100 },
    ],
  },
  {
    id: "fuel",
    name: "Fuel Energy",
    baseUnit: "joule",
    baseSISymbol: "J",
    units: [
      { id: "j", name: "Joule", symbol: "J", factor: 1, allowPrefixes: true },
      { id: "cal", name: "Calorie", symbol: "cal", factor: 4.184, allowPrefixes: true },
      { id: "btu", name: "BTU", symbol: "BTU", factor: 1055.06 },
      { id: "wh", name: "Watt-hour", symbol: "Wh", factor: 3600, allowPrefixes: true },
      { id: "kg_tnt", name: "Kilogram of TNT", symbol: "kg (TNT)", factor: 4184000 },
      { id: "kg_dynamite", name: "Kilogram of Dynamite", symbol: "kg (dyn)", factor: 7500000 },
      { id: "lb_ethanol", name: "Pound of Ethanol", symbol: "lb (ethanol)", factor: 26800000 / 2.20462 },
      { id: "lb_e85", name: "Pound of E-85", symbol: "lb (E-85)", factor: 29200000 / 2.20462 },
      { id: "lb_kerosene", name: "Pound of Kerosene (Paraffin)", symbol: "lb (kero)", factor: 43300000 / 2.20462 },
      { id: "lb_jetfuel", name: "Pound of Jet Fuel", symbol: "lb (jet)", factor: 43500000 / 2.20462 },
      { id: "lb_lng", name: "Pound of LNG", symbol: "lb (LNG)", factor: 45000000 / 2.20462 },
      { id: "lb_gasoline", name: "Pound of Gasoline (Petrol)", symbol: "lb (gas)", factor: 45300000 / 2.20462 },
      { id: "lb_diesel", name: "Pound of Diesel", symbol: "lb (diesel)", factor: 45400000 / 2.20462 },
      { id: "lb_propane", name: "Pound of Propane", symbol: "lb (propane)", factor: 50300000 / 2.20462 },
      { id: "l_lng", name: "Litre of LNG", symbol: "L (LNG)", factor: 20300000 },
      { id: "l_ethanol", name: "Litre of Ethanol", symbol: "L (ethanol)", factor: 21200000 },
      { id: "l_e85", name: "Litre of E-85", symbol: "L (E-85)", factor: 22800000 },
      { id: "l_propane", name: "Litre of Propane (LPG)", symbol: "L (propane)", factor: 25700000 },
      { id: "kg_ethanol", name: "Kilogram of Ethanol", symbol: "kg (ethanol)", factor: 26800000 },
      { id: "kg_e85", name: "Kilogram of E-85", symbol: "kg (E-85)", factor: 29200000 },
      { id: "l_gasoline", name: "Litre of Gasoline (Petrol)", symbol: "L (gas)", factor: 34200000 },
      { id: "l_jetfuel", name: "Litre of Jet Fuel (Jet A)", symbol: "L (jet)", factor: 35000000 },
      { id: "l_kerosene", name: "Litre of Kerosene (Paraffin)", symbol: "L (kero)", factor: 35100000 },
      { id: "l_diesel", name: "Litre of Diesel", symbol: "L (diesel)", factor: 38600000 },
      { id: "kg_kerosene", name: "Kilogram of Kerosene (Paraffin)", symbol: "kg (kero)", factor: 43300000 },
      { id: "kg_jetfuel", name: "Kilogram of Jet Fuel", symbol: "kg (jet)", factor: 43500000 },
      { id: "kg_lng", name: "Kilogram of LNG", symbol: "kg (LNG)", factor: 45000000 },
      { id: "kg_gasoline", name: "Kilogram of Gasoline (Petrol)", symbol: "kg (gas)", factor: 45300000 },
      { id: "kg_diesel", name: "Kilogram of Diesel", symbol: "kg (diesel)", factor: 45400000 },
      { id: "kg_propane", name: "Kilogram of Propane", symbol: "kg (propane)", factor: 50300000 },
      { id: "gal_lng", name: "Gallon of LNG (US)", symbol: "gal (LNG)", factor: 20300000 * 3.78541 },
      { id: "gal_ethanol", name: "Gallon of Ethanol (US)", symbol: "gal (ethanol)", factor: 21200000 * 3.78541 },
      { id: "gal_e85", name: "Gallon of E-85 (US)", symbol: "gal (E-85)", factor: 22800000 * 3.78541 },
      { id: "gal_propane", name: "Gallon of Propane (US)", symbol: "gal (propane)", factor: 25700000 * 3.78541 },
      { id: "therm", name: "Therm (US)", symbol: "therm", factor: 105505600 },
      { id: "gal_gasoline", name: "Gallon of Gasoline (US)", symbol: "gal (gas)", factor: 34200000 * 3.78541 },
      { id: "gal_jetfuel", name: "Gallon of Jet Fuel (US)", symbol: "gal (jet)", factor: 35000000 * 3.78541 },
      { id: "gal_kerosene", name: "Gallon of Kerosene (US)", symbol: "gal (kero)", factor: 35100000 * 3.78541 },
      { id: "gal_diesel", name: "Gallon of Diesel (US)", symbol: "gal (diesel)", factor: 38600000 * 3.78541 },
      { id: "t_tnt", name: "Tonne of TNT", symbol: "t (TNT)", factor: 4184000000 },
      { id: "t_dynamite", name: "Tonne of Dynamite", symbol: "t (dyn)", factor: 7500000000 },
      { id: "tce", name: "Tonne of Coal Equivalent", symbol: "tce", factor: 29307600000 },
      { id: "toe", name: "Tonne of Oil Equivalent", symbol: "toe", factor: 41868000000 },
    ],
  },

  // --- COMPUTING ---
  {
    id: "data",
    name: "Data/Information",
    baseUnit: "byte",
    baseSISymbol: "B",
    units: [
      { id: "b", name: "Byte", symbol: "B", factor: 1, allowPrefixes: true },
      { id: "bit", name: "Bit", symbol: "bit", factor: 0.125, allowPrefixes: true },
    ],
  },
  {
    id: "rack_geometry",
    name: "Rack Geometry",
    baseUnit: "metre",
    baseSISymbol: "m",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1, allowPrefixes: true },
      { id: "angstrom", name: "Angstrom", symbol: "Å", factor: 1e-10 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "u", name: "Rack Unit Height", symbol: "U", factor: 1.75 * 0.0254 },
      { id: "u2", name: "2U Height", symbol: "2U", factor: 3.5 * 0.0254 },
      { id: "u4", name: "4U Height", symbol: "4U", factor: 7 * 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048, allowPrefixes: true },
      { id: "ft_in", name: "Foot:Inch", symbol: "ft:in", factor: 0.3048 },
      { id: "rack_12u", name: "Quarter Rack (12U)", symbol: "12U", factor: 12 * 1.75 * 0.0254 },
      { id: "u_width", name: "U Width (19\")", symbol: "U-W", factor: 19 * 0.0254 },
      { id: "cabinet_width", name: "Cabinet Width (24\")", symbol: "Cab-W", factor: 24 * 0.0254 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "rack_24u", name: "Half Rack (24U)", symbol: "24U", factor: 24 * 1.75 * 0.0254 },
      { id: "fathom", name: "Fathom", symbol: "ftm", factor: 1.8288 },
      { id: "rack_42u", name: "Full Rack (42U)", symbol: "42U", factor: 42 * 1.75 * 0.0254 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "nmi", name: "Nautical Mile", symbol: "nmi", factor: 1852 },
      { id: "au", name: "Astronomical Unit", symbol: "AU", factor: 1.496e11 },
      { id: "ly", name: "Light Year", symbol: "ly", factor: 9.461e15 },
      { id: "parsec", name: "Parsec", symbol: "pc", factor: 3.0857e16 },
    ],
  },
  {
    id: "shipping",
    name: "Shipping Containers",
    baseUnit: "metre",
    baseSISymbol: "m",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1, allowPrefixes: true },
      { id: "angstrom", name: "Angstrom", symbol: "Å", factor: 1e-10 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "link", name: "Link (Gunter)", symbol: "li", factor: 0.201168 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048, allowPrefixes: true },
      { id: "ft_in", name: "Foot:Inch", symbol: "ft:in", factor: 0.3048 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "fathom", name: "Fathom", symbol: "ftm", factor: 1.8288 },
      { id: "teu_w", name: "TEU Width", symbol: "TEU-W", factor: 8 * 0.3048 },
      { id: "deu_w", name: "DEU Width", symbol: "DEU-W", factor: 8 * 0.3048 },
      { id: "teu_h", name: "TEU Height", symbol: "TEU-H", factor: 8.5 * 0.3048 },
      { id: "deu_h", name: "DEU Height", symbol: "DEU-H", factor: 8.5 * 0.3048 },
      { id: "rod", name: "Rod", symbol: "rd", factor: 5.0292 },
      { id: "teu", name: "TEU (20ft Container)", symbol: "TEU", factor: 20 * 0.3048 },
      { id: "deu", name: "DEU (40ft Container)", symbol: "DEU", factor: 40 * 0.3048 },
      { id: "chain", name: "Chain", symbol: "ch", factor: 20.1168 },
      { id: "furlong", name: "Furlong", symbol: "fur", factor: 201.168 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "nmi", name: "Nautical Mile", symbol: "nmi", factor: 1852 },
      { id: "au", name: "Astronomical Unit", symbol: "AU", factor: 1.496e11 },
      { id: "ly", name: "Light Year", symbol: "ly", factor: 9.461e15 },
      { id: "parsec", name: "Parsec", symbol: "pc", factor: 3.0857e16 },
    ],
  },
  {
    id: "beer_wine_volume",
    name: "Beer & Wine",
    baseUnit: "cubic meter",
    baseSISymbol: "m³",
    units: [
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1, allowPrefixes: false },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00000492892 },
      { id: "tsp_imp", name: "Teaspoon (Imp)", symbol: "tsp", factor: 0.00000591939 },
      { id: "tbsp", name: "Tablespoon (US)", symbol: "tbsp", factor: 0.0000147868 },
      { id: "tbsp_imp", name: "Tablespoon (Imp)", symbol: "tbsp", factor: 0.0000177582 },
      { id: "floz_imp", name: "Fluid Ounce (Imp)", symbol: "fl oz", factor: 0.0000284130625 },
      { id: "floz", name: "Fluid Ounce (US)", symbol: "fl oz", factor: 0.0000295735 },
      { id: "glass_wine", name: "Glass (Wine)", symbol: "glass", factor: 0.00015 },
      { id: "cup", name: "Cup (US)", symbol: "cp", factor: 0.000236588 },
      { id: "bottle_beer_small", name: "Bottle (Beer, small)", symbol: "btl", factor: 0.00035 },
      { id: "bottle_beer_longneck", name: "Bottle (Beer, longneck)", symbol: "btl", factor: 0.000354882 },
      { id: "pt", name: "Pint (US)", symbol: "pt", factor: 0.000473176 },
      { id: "bottle_beer_large", name: "Bottle (Beer, large)", symbol: "btl", factor: 0.0005 },
      { id: "pt_imp", name: "Pint (Imp)", symbol: "pt", factor: 0.00056826125 },
      { id: "bottle_wine", name: "Bottle (Wine)", symbol: "btl", factor: 0.00075 },
      { id: "qt", name: "Quart (US)", symbol: "qt", factor: 0.000946353 },
      { id: "l", name: "Liter", symbol: "L", factor: 0.001, allowPrefixes: true },
      { id: "qt_imp", name: "Quart (Imp)", symbol: "qt", factor: 0.0011365225 },
      { id: "magnum_wine", name: "Magnum (Wine)", symbol: "mag", factor: 0.0015 },
      { id: "gal", name: "Gallon (US)", symbol: "gal", factor: 0.00378541 },
      { id: "gal_imp", name: "Gallon (Imp)", symbol: "gal", factor: 0.00454609 },
      { id: "mini_keg", name: "Mini Keg (Beer)", symbol: "mini keg", factor: 0.005 },
      { id: "pony_keg", name: "Pony Keg (Beer)", symbol: "pony", factor: 0.0147 },
      { id: "ft3", name: "Cubic Foot", symbol: "ft³", factor: 0.0283168 },
      { id: "bu", name: "Bushel", symbol: "bu", factor: 0.0352391 },
      { id: "keg_beer", name: "Keg (Beer)", symbol: "keg", factor: 0.0587 },
      { id: "bbl_beer", name: "Barrel (Beer)", symbol: "bbl", factor: 0.117 },
      { id: "bbl", name: "Barrel (Oil)", symbol: "bbl", factor: 0.158987 },
      { id: "yd3", name: "Cubic Yard", symbol: "yd³", factor: 0.764555 },
      { id: "ac_ft", name: "Acre-foot", symbol: "ac⋅ft", factor: 1233.48184 },
      { id: "mi3", name: "Cubic Mile", symbol: "mi³", factor: 4.16818e9 },
    ],
  },
  {
    id: "math",
    name: "Math",
    baseUnit: "number",
    baseSISymbol: "1",
    units: [
      { id: "num", name: "Number", symbol: "1", factor: 1 },
      { id: "pi", name: "Pi (π)", symbol: "π", factor: Math.PI },
      { id: "e", name: "Euler's Number (e)", symbol: "e", factor: Math.E },
      { id: "sqrt2", name: "Square Root of 2", symbol: "√2", factor: Math.SQRT2 },
      { id: "sin", name: "Sine", symbol: "sin", factor: 1, mathFunction: 'sin' },
      { id: "cos", name: "Cosine", symbol: "cos", factor: 1, mathFunction: 'cos' },
      { id: "tan", name: "Tangent", symbol: "tan", factor: 1, mathFunction: 'tan' },
      { id: "asin", name: "Arc Sine", symbol: "asin", factor: 1, mathFunction: 'asin' },
      { id: "acos", name: "Arc Cosine", symbol: "acos", factor: 1, mathFunction: 'acos' },
      { id: "atan", name: "Arc Tangent", symbol: "atan", factor: 1, mathFunction: 'atan' },
      { id: "sqrt", name: "Square Root", symbol: "√", factor: 1, mathFunction: 'sqrt' },
      { id: "log10", name: "Log Base 10", symbol: "log₁₀", factor: 1, mathFunction: 'log10' },
      { id: "ln", name: "Natural Log", symbol: "ln", factor: 1, mathFunction: 'ln' },
      { id: "exp", name: "Exponential (eˣ)", symbol: "exp", factor: 1, mathFunction: 'exp' },
      { id: "abs", name: "Absolute Value", symbol: "|x|", factor: 1, mathFunction: 'abs' },
    ],
  },

  // --- ARCHAIC & REGIONAL UNITS ---
  {
    id: "archaic_length",
    name: "Archaic Length",
    baseUnit: "metre",
    baseSISymbol: "m",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1, allowPrefixes: true },
      { id: "digit", name: "Digit (Egyptian)", symbol: "digit", factor: 0.01875 },
      { id: "sun_jp", name: "Sun (Japan)", symbol: "sun", factor: 0.0303030 },
      { id: "cun_cn", name: "Cun (China)", symbol: "cun", factor: 0.03333 },
      { id: "palm", name: "Palm", symbol: "palm", factor: 0.075 },
      { id: "hand", name: "Hand", symbol: "hh", factor: 0.1016 },
      { id: "link", name: "Link (Gunter)", symbol: "li", factor: 0.201168 },
      { id: "span", name: "Span", symbol: "span", factor: 0.2286 },
      { id: "shaku_jp", name: "Shaku (Japan)", symbol: "shaku", factor: 0.303030 },
      { id: "ja_kr", name: "Ja (Korea)", symbol: "ja", factor: 0.303030 },
      { id: "chi_cn", name: "Chi (China)", symbol: "chi", factor: 0.3333 },
      { id: "chek_hk", name: "Chek (Hong Kong)", symbol: "chek", factor: 0.371 },
      { id: "cubit_common", name: "Cubit (Common)", symbol: "cubit", factor: 0.4572 },
      { id: "hath_in", name: "Hath (India)", symbol: "hath", factor: 0.46 },
      { id: "cubit_royal", name: "Cubit (Egyptian Royal)", symbol: "cubit-R", factor: 0.524 },
      { id: "arshin_ru", name: "Arshin (Russia)", symbol: "arshin", factor: 0.7112 },
      { id: "vara_es", name: "Vara (Spain)", symbol: "vara", factor: 0.8359 },
      { id: "gaj_in", name: "Gaj (India)", symbol: "gaj", factor: 0.9144 },
      { id: "ell_en", name: "Ell (English)", symbol: "ell", factor: 1.143 },
      { id: "pace", name: "Pace (Roman)", symbol: "pace", factor: 1.48 },
      { id: "ken_jp", name: "Ken (Japan)", symbol: "ken", factor: 1.818 },
      { id: "fathom", name: "Fathom", symbol: "ftm", factor: 1.8288 },
      { id: "jo_jp", name: "Jō (Japan)", symbol: "jo", factor: 3.03 },
      { id: "zhang_cn", name: "Zhang (China)", symbol: "zhang", factor: 3.333 },
      { id: "rod", name: "Rod/Pole/Perch", symbol: "rd", factor: 5.0292 },
      { id: "chain", name: "Chain (Gunter)", symbol: "ch", factor: 20.1168 },
      { id: "stade", name: "Stade (Greek)", symbol: "stade", factor: 185 },
      { id: "furlong", name: "Furlong", symbol: "fur", factor: 201.168 },
      { id: "ri_kr", name: "Ri (Korea)", symbol: "ri-kr", factor: 392.727 },
      { id: "li_cn", name: "Li (China)", symbol: "li-cn", factor: 500 },
      { id: "ri_jp", name: "Ri (Japan)", symbol: "ri-jp", factor: 3927.27 },
      { id: "league", name: "League", symbol: "lea", factor: 4828.032 },
    ],
  },
  {
    id: "archaic_mass",
    name: "Archaic Mass",
    baseUnit: "kilogram",
    baseSISymbol: "kg",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1, allowPrefixes: true },
      { id: "grain", name: "Grain", symbol: "gr", factor: 0.00006479891 },
      { id: "ratti", name: "Ratti (South Asia)", symbol: "ratti", factor: 0.0001215 },
      { id: "carat", name: "Carat (Metric)", symbol: "ct", factor: 0.0002 },
      { id: "fun_jp", name: "Fun (Japan)", symbol: "fun", factor: 0.000375 },
      { id: "g", name: "Gram", symbol: "g", factor: 0.001, allowPrefixes: true },
      { id: "scruple", name: "Scruple (Apothecary)", symbol: "s ap", factor: 0.001296 },
      { id: "pennyweight", name: "Pennyweight", symbol: "dwt", factor: 0.00155517 },
      { id: "dram", name: "Dram", symbol: "dr", factor: 0.001771845 },
      { id: "momme_jp", name: "Momme (Japan)", symbol: "momme", factor: 0.00375 },
      { id: "don_kr", name: "Don (Korea)", symbol: "don", factor: 0.00375 },
      { id: "mace_cn", name: "Mace (China, PRC)", symbol: "mace", factor: 0.005 },
      { id: "tola", name: "Tola (South Asia)", symbol: "tola", factor: 0.0116638 },
      { id: "baht_th", name: "Baht (Thailand)", symbol: "baht", factor: 0.015244 },
      { id: "troy_oz", name: "Troy Ounce", symbol: "oz t", factor: 0.0311035 },
      { id: "ryo_jp", name: "Ryō (Japan)", symbol: "ryo", factor: 0.0375 },
      { id: "tael_cn", name: "Tael (China, PRC)", symbol: "tael", factor: 0.05 },
      { id: "troy_lb", name: "Troy Pound", symbol: "lb t", factor: 0.3732417 },
      { id: "pfund_de", name: "Pfund (German)", symbol: "pfund", factor: 0.4677 },
      { id: "livre_fr", name: "Livre (French)", symbol: "livre", factor: 0.4895 },
      { id: "jin_cn", name: "Jin (China, PRC)", symbol: "jin", factor: 0.5 },
      { id: "geun_kr", name: "Geun (Korea)", symbol: "geun", factor: 0.6 },
      { id: "catty_hk", name: "Catty (HK/Traditional)", symbol: "catty", factor: 0.60478982 },
      { id: "seer", name: "Seer (South Asia)", symbol: "seer", factor: 0.9331 },
      { id: "kan_jp", name: "Kan (Japan)", symbol: "kan", factor: 3.75 },
      { id: "stone_uk", name: "Stone (UK)", symbol: "st", factor: 6.35029 },
      { id: "maund", name: "Maund (South Asia)", symbol: "maund", factor: 37.324 },
      { id: "dan_cn", name: "Dan (China, PRC)", symbol: "dan", factor: 50 },
      { id: "picul_hk", name: "Picul (HK/Traditional)", symbol: "picul", factor: 60.478982 },
    ],
  },
  {
    id: "archaic_volume",
    name: "Archaic Volume",
    baseUnit: "litre",
    baseSISymbol: "L",
    units: [
      { id: "l", name: "Litre", symbol: "L", factor: 1, allowPrefixes: true },
      { id: "minim", name: "Minim (US)", symbol: "min", factor: 0.0000616115 },
      { id: "ml", name: "Millilitre", symbol: "mL", factor: 0.001 },
      { id: "fl_scruple", name: "Fluid Scruple", symbol: "fl s", factor: 0.00123223 },
      { id: "fl_dram", name: "Fluid Dram", symbol: "fl dr", factor: 0.00369669 },
      { id: "teaspoon", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892 },
      { id: "tablespoon", name: "Tablespoon (US)", symbol: "tbsp", factor: 0.0147868 },
      { id: "apoth_oz", name: "Apothecary Ounce", symbol: "fl oz ap", factor: 0.0295735 },
      { id: "jigger", name: "Jigger", symbol: "jigger", factor: 0.044355 },
      { id: "gill_us", name: "Gill (US)", symbol: "gi", factor: 0.118294 },
      { id: "gill_imp", name: "Gill (Imperial)", symbol: "gi Imp", factor: 0.142065 },
      { id: "hop_kr", name: "Hop (Korea)", symbol: "hop", factor: 0.18039 },
      { id: "go_jp", name: "Go (Japan)", symbol: "go", factor: 0.18039 },
      { id: "cup_us", name: "Cup (US)", symbol: "cup", factor: 0.236588 },
      { id: "sheng_cn", name: "Sheng (China)", symbol: "sheng", factor: 1.0355 },
      { id: "sho_jp", name: "Sho (Japan)", symbol: "sho", factor: 1.8039 },
      { id: "doe_kr", name: "Doe (Korea)", symbol: "doe", factor: 1.8039 },
      { id: "peck_us", name: "Peck (US)", symbol: "pk", factor: 8.80977 },
      { id: "dou_cn", name: "Dou (China)", symbol: "dou", factor: 10.355 },
      { id: "to_jp", name: "To (Japan)", symbol: "to", factor: 18.039 },
      { id: "mal_kr", name: "Mal (Korea)", symbol: "mal", factor: 18.039 },
      { id: "amphora", name: "Amphora (Greek)", symbol: "amphora", factor: 26.026 },
      { id: "bushel_us", name: "Bushel (US)", symbol: "bu", factor: 35.2391 },
      { id: "firkin", name: "Firkin", symbol: "firkin", factor: 40.9148 },
      { id: "dan_vol_cn", name: "Dan (China volume)", symbol: "dan-v", factor: 103.55 },
      { id: "koku_jp", name: "Koku (Japan)", symbol: "koku", factor: 180.39 },
      { id: "hogshead", name: "Hogshead", symbol: "hhd", factor: 238.481 },
      { id: "m3", name: "Cubic Metre", symbol: "m³", factor: 1000, allowPrefixes: true },
      { id: "cord_us", name: "Cord (US)", symbol: "cord", factor: 3624.56 },
    ],
  },
  {
    id: "archaic_area",
    name: "Archaic Area",
    baseUnit: "square metre",
    baseSISymbol: "m²",
    units: [
      { id: "m2", name: "Square Metre", symbol: "m²", factor: 1, allowPrefixes: true },
      { id: "danchi_ma", name: "Danchi-ma (Japan)", symbol: "danchi", factor: 1.445 },
      { id: "edoma", name: "Edoma/Kantō-ma (Japan)", symbol: "edoma", factor: 1.5488 },
      { id: "jo_tatami", name: "Jō/Tatami (Japan)", symbol: "jo", factor: 1.62 },
      { id: "chukyoma", name: "Chūkyō-ma (Japan)", symbol: "chukyoma", factor: 1.6562 },
      { id: "kyoma", name: "Kyōma (Japan)", symbol: "kyoma", factor: 1.8241 },
      { id: "pyeong_kr", name: "Pyeong (Korea)", symbol: "pyeong", factor: 3.3058 },
      { id: "tsubo_jp", name: "Tsubo (Japan)", symbol: "tsubo", factor: 3.306 },
      { id: "se_kr", name: "Se (Korea)", symbol: "se", factor: 99.174 },
      { id: "qirat_eg", name: "Qirat (Egypt)", symbol: "qirat", factor: 175.03 },
      { id: "mu_cn", name: "Mu (China)", symbol: "mu", factor: 666.67 },
      { id: "tan_jp", name: "Tan (Japan)", symbol: "tan", factor: 991.7 },
      { id: "dunam_il", name: "Dunam (Israel)", symbol: "dunam", factor: 1000 },
      { id: "jerib", name: "Jerib (Middle East)", symbol: "jerib", factor: 2000 },
      { id: "morgen", name: "Morgen (German)", symbol: "morgen", factor: 2500 },
      { id: "bigha", name: "Bigha (South Asia)", symbol: "bigha", factor: 2529 },
      { id: "feddan_eg", name: "Feddan (Egypt)", symbol: "feddan", factor: 4200.833 },
      { id: "cho_jp", name: "Chō (Japan)", symbol: "cho", factor: 9917.36 },
      { id: "desyatina", name: "Desyatina (Russia)", symbol: "desyatina", factor: 10925 },
      { id: "qing_cn", name: "Qing (China)", symbol: "qing", factor: 66666.67 },
      { id: "section_us", name: "Section (US)", symbol: "section", factor: 2589988 },
      { id: "township_us", name: "Township (US)", symbol: "twp", factor: 93239571 },
    ],
  },
  {
    id: "archaic_energy",
    name: "Archaic Energy",
    baseUnit: "joule",
    baseSISymbol: "kg⋅m²⋅s⁻²",
    units: [
      { id: "j", name: "Joule", symbol: "J", factor: 1, allowPrefixes: true },
      { id: "erg", name: "Erg (CGS)", symbol: "erg", factor: 1e-7 },
      { id: "ft_lbf", name: "Foot-pound Force", symbol: "ft⋅lbf", factor: 1.3558179483 },
      { id: "thermie", name: "Thermie", symbol: "th", factor: 4.1868e6 },
      { id: "quad", name: "Quad", symbol: "quad", factor: 1.055e18 },
    ],
  },
  {
    id: "archaic_power",
    name: "Archaic Power",
    baseUnit: "watt",
    baseSISymbol: "kg⋅m²⋅s⁻³",
    units: [
      { id: "w", name: "Watt", symbol: "W", factor: 1, allowPrefixes: true },
      { id: "erg_s", name: "Erg per Second", symbol: "erg⋅s⁻¹", factor: 1e-7 },
      { id: "ft_lbf_s", name: "Foot-pound per Second", symbol: "ft⋅lbf⋅s⁻¹", factor: 1.3558179483 },
      { id: "boiler_hp", name: "Boiler Horsepower", symbol: "hp (boiler)", factor: 9810.55 },
    ],
  },
];

export function applyMathFunction(value: number, func: UnitDefinition['mathFunction']): number {
  switch (func) {
    case 'sin': return Math.sin(value);
    case 'cos': return Math.cos(value);
    case 'tan': return Math.tan(value);
    case 'asin': return Math.asin(value);
    case 'acos': return Math.acos(value);
    case 'atan': return Math.atan(value);
    case 'sqrt': return Math.sqrt(value);
    case 'log10': return Math.log10(value);
    case 'ln': return Math.log(value);
    case 'exp': return Math.exp(value);
    case 'abs': return Math.abs(value);
    default: return value;
  }
}

export function convert(
  value: number,
  fromId: string,
  toId: string,
  categoryId: UnitCategory,
  fromPrefixFactor: number = 1,
  toPrefixFactor: number = 1
): number {
  const category = CONVERSION_DATA.find((c) => c.id === categoryId);
  if (!category) return 0;

  const fromUnit = category.units.find((u) => u.id === fromId);
  const toUnit = category.units.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  // Handle math functions specially
  if (categoryId === 'math' && fromUnit.mathFunction) {
    return applyMathFunction(value * fromPrefixFactor, fromUnit.mathFunction);
  }

  // Apply prefixes to the value directly for the input
  const val = value * fromPrefixFactor;

  // Special handling for temperature (using offsets)
  if (categoryId === "temperature") {
    // Convert to base unit (Celsius in this config)
    // Note: Prefixes on Temperature with offsets (C, F) are non-standard/ambiguous.
    // Assuming prefix applies to the unit scale.
    const baseValue = (val + (fromUnit.offset || 0)) * fromUnit.factor;
    
    // Convert from base unit to target
    // We need to solve: result * toPrefixFactor = (baseValue / toUnit.factor) - toUnit.offset
    // Actually, inverse of above:
    // val_target_unit = baseValue / toUnit.factor - (toUnit.offset || 0)
    // result = val_target_unit / toPrefixFactor
    
    const targetUnitValue = (baseValue / toUnit.factor) - (toUnit.offset || 0);
    return targetUnitValue / toPrefixFactor;
  }

  // Handle inverse units (like photon wavelength where E = hc/λ)
  // For inverse units: baseValue = factor / val (instead of val * factor)
  // For converting to inverse units: result = factor / baseValue (instead of baseValue / factor)
  let baseValue: number;
  if (fromUnit.isInverse) {
    // Inverse input: E = hc/λ → baseValue = factor / val
    baseValue = fromUnit.factor / val;
  } else {
    // Standard input
    baseValue = val * fromUnit.factor;
  }

  let result: number;
  if (toUnit.isInverse) {
    // Inverse output: λ = hc/E → result = factor / baseValue
    result = toUnit.factor / baseValue;
  } else {
    // Standard output
    result = baseValue / toUnit.factor;
  }

  return result / toPrefixFactor;
}
