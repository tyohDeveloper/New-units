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
  | "frequency"
  | "speed"
  | "acceleration"
  | "force"
  | "pressure"
  | "energy"
  | "power"
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
  | "digital"
  | "printing"
  | "illuminance"
  | "torque"
  | "density"
  | "flow"
  | "viscosity"
  | "surface_tension"
  | "refractive_power"
  | "sound_pressure";

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
  { id: 'hecto', name: 'Hecto', symbol: 'h', factor: 1e2 },
  { id: 'deca', name: 'Deca', symbol: 'da', factor: 1e1 },
  { id: 'none', name: '', symbol: '', factor: 1 },
  { id: 'deci', name: 'Deci', symbol: 'd', factor: 1e-1 },
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

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Conversion factor to base unit
  offset?: number; // For temperature (e.g. Celsius to Kelvin)
  description?: string;
  allowPrefixes?: boolean;
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
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048, allowPrefixes: true },
      { id: "ft_in", name: "Foot:Inch", symbol: "ft:in", factor: 0.3048 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "nmi", name: "Nautical Mile", symbol: "nmi", factor: 1852 },
      { id: "link", name: "Link (Gunter)", symbol: "li", factor: 0.201168 },
      { id: "rod", name: "Rod", symbol: "rd", factor: 5.0292 },
      { id: "chain", name: "Chain", symbol: "ch", factor: 20.1168 },
      { id: "furlong", name: "Furlong", symbol: "fur", factor: 201.168 },
      { id: "fathom", name: "Fathom", symbol: "ftm", factor: 1.8288 },
      { id: "parsec", name: "Parsec", symbol: "pc", factor: 3.0857e16 },
      { id: "au", name: "Astronomical Unit", symbol: "AU", factor: 1.496e11 },
      { id: "ly", name: "Light Year", symbol: "ly", factor: 9.461e15 },
      { id: "angstrom", name: "Angstrom", symbol: "Å", factor: 1e-10 },
    ],
  },
  {
    id: "mass",
    name: "Mass",
    baseUnit: "kilogram",
    baseSISymbol: "kg",
    units: [
      { id: "g", name: "Gram", symbol: "g", factor: 0.001, allowPrefixes: true },
      { id: "t", name: "Tonne", symbol: "t", factor: 1000 },
      { id: "oz", name: "Ounce", symbol: "oz", factor: 0.0283495 },
      { id: "lb", name: "Pound", symbol: "lb", factor: 0.453592 },
      { id: "st", name: "Stone", symbol: "st", factor: 6.35029 },
      { id: "ton_us", name: "Short Ton (US)", symbol: "ton", factor: 907.185 },
      { id: "ton_uk", name: "Long Ton (UK)", symbol: "ton", factor: 1016.05 },
      { id: "gr", name: "Grain", symbol: "gr", factor: 6.47989e-5 },
      { id: "dwt", name: "Pennyweight", symbol: "dwt", factor: 0.00155517 },
      { id: "oz_t", name: "Troy Ounce", symbol: "oz t", factor: 0.0311035 },
      { id: "carat", name: "Carat", symbol: "ct", factor: 0.0002 },
      { id: "slug", name: "Slug", symbol: "slug", factor: 14.5939 },
    ],
  },
  {
    id: "time",
    name: "Time",
    baseUnit: "second",
    baseSISymbol: "s",
    units: [
      { id: "s", name: "Second", symbol: "s", factor: 1, allowPrefixes: true },
      { id: "min", name: "Minute", symbol: "min", factor: 60 },
      { id: "h", name: "Hour", symbol: "h", factor: 3600 },
      { id: "d", name: "Day", symbol: "d", factor: 86400 },
      { id: "wk", name: "Week", symbol: "wk", factor: 604800 },
      { id: "mo", name: "Month (Avg)", symbol: "mo", factor: 2.628e6 },
      { id: "y", name: "Year", symbol: "yr", factor: 3.154e7 },
      { id: "shake", name: "Shake", symbol: "shake", factor: 1e-8 },
    ],
  },
  {
    id: "current",
    name: "Electric Current",
    baseUnit: "ampere",
    baseSISymbol: "A",
    units: [
      { id: "a", name: "Ampere", symbol: "A", factor: 1, allowPrefixes: true },
      { id: "biot", name: "Biot (abampere)", symbol: "Bi", factor: 10 },
      { id: "statA", name: "Statampere", symbol: "statA", factor: 3.33564e-10 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
    baseSISymbol: "K",
    units: [
      { id: "c", name: "Celsius", symbol: "°C", factor: 1, offset: 0 },
      {
        id: "f",
        name: "Fahrenheit",
        symbol: "°F",
        factor: 0.5555555555555556,
        offset: -32,
      },
      { id: "k", name: "Kelvin", symbol: "K", factor: 1, offset: -273.15 },
      {
        id: "r",
        name: "Rankine",
        symbol: "°R",
        factor: 0.5555555555555556,
        offset: -491.67,
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
      { id: "cp", name: "Candlepower", symbol: "cp", factor: 0.981 },
      { id: "hk", name: "Hefnerkerze", symbol: "HK", factor: 0.903 },
    ],
  },


  // --- DERIVED & PRACTICAL ---
  {
    id: "area",
    name: "Area",
    baseUnit: "square meter",
    baseSISymbol: "m²",
    units: [
      { id: "m2", name: "Square Meter", symbol: "m²", factor: 1 },
      { id: "ha", name: "Hectare", symbol: "ha", factor: 10000 },
      { id: "km2", name: "Square Kilometer", symbol: "km²", factor: 1e6 },
      { id: "sqin", name: "Square Inch", symbol: "in²", factor: 0.00064516 },
      { id: "sqft", name: "Square Foot", symbol: "ft²", factor: 0.092903 },
      { id: "sqyd", name: "Square Yard", symbol: "yd²", factor: 0.836127 },
      { id: "acre", name: "Acre", symbol: "ac", factor: 4046.86 },
      { id: "sqmi", name: "Square Mile", symbol: "mi²", factor: 2.59e6 },
      { id: "barn", name: "Barn", symbol: "b", factor: 1e-28 },
      { id: "dunam", name: "Dunam", symbol: "dunam", factor: 1000 },
      { id: "township", name: "Township (US)", symbol: "twp", factor: 9.324e7 },
      { id: "section", name: "Section (US)", symbol: "sec", factor: 2.59e6 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    baseUnit: "liter",
    baseSISymbol: "m³",
    units: [
      { id: "ml", name: "Milliliter", symbol: "ml", factor: 0.001 },
      { id: "l", name: "Liter", symbol: "L", factor: 1, allowPrefixes: true },
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1000 },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892 },
      { id: "tsp_imp", name: "Teaspoon (Imp)", symbol: "tsp", factor: 0.00591939 },
      {
        id: "tbsp",
        name: "Tablespoon (US)",
        symbol: "tbsp",
        factor: 0.0147868,
      },
      {
        id: "tbsp_imp",
        name: "Tablespoon (Imp)",
        symbol: "tbsp",
        factor: 0.0177582,
      },
      { id: "floz", name: "Fluid Ounce (US)", symbol: "fl oz", factor: 0.0295735 },
      { id: "floz_imp", name: "Fluid Ounce (Imp)", symbol: "fl oz", factor: 0.0284131 },
      { id: "cup", name: "Cup (US)", symbol: "cp", factor: 0.236588 },
      { id: "pt", name: "Pint (US)", symbol: "pt", factor: 0.473176 },
      { id: "pt_imp", name: "Pint (Imp)", symbol: "pt", factor: 0.568261 },
      { id: "qt", name: "Quart (US)", symbol: "qt", factor: 0.946353 },
      { id: "qt_imp", name: "Quart (Imp)", symbol: "qt", factor: 1.13652 },
      { id: "gal", name: "Gallon (US)", symbol: "gal", factor: 3.78541 },
      { id: "gal_imp", name: "Gallon (Imp)", symbol: "gal", factor: 4.54609 },
      { id: "bbl", name: "Barrel (Oil)", symbol: "bbl", factor: 158.987 },
      { id: "bbl_beer", name: "Barrel (Beer)", symbol: "bbl", factor: 117.348 },
      { id: "bu", name: "Bushel", symbol: "bu", factor: 35.2391 },
      { id: "shot", name: "Shot (US)", symbol: "shot", factor: 0.044 },
      { id: "fifth", name: "Fifth", symbol: "fifth", factor: 0.757 },
      { id: "handle", name: "Handle", symbol: "handle", factor: 1.75 },
      { id: "ac_ft", name: "Acre-foot", symbol: "ac⋅ft", factor: 1233481.84 },
      { id: "km3", name: "Cubic Kilometer", symbol: "km³", factor: 1e12 },
      { id: "mi3", name: "Cubic Mile", symbol: "mi³", factor: 4.16818e12 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    baseUnit: "meter/second",
    baseSISymbol: "m⋅s⁻¹",
    units: [
      { id: "mps", name: "Meter/Second", symbol: "m/s", factor: 1 },
      { id: "kmh", name: "Kilometer/Hour", symbol: "km/h", factor: 0.277778 },
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
      { id: "mps2", name: "Meter/sq sec", symbol: "m/s²", factor: 1 },
      { id: "g", name: "g-force", symbol: "g", factor: 9.80665 },
      { id: "ftps2", name: "Foot/sq sec", symbol: "ft/s²", factor: 0.3048 },
      { id: "gal", name: "Gal", symbol: "Gal", factor: 0.01 },
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
      { id: "bar", name: "Bar", symbol: "bar", factor: 100000 },
      { id: "psi", name: "PSI", symbol: "psi", factor: 6894.76 },
      { id: "atm", name: "Atmosphere", symbol: "atm", factor: 101325 },
      { id: "torr", name: "Torr", symbol: "Torr", factor: 133.322 },
      { id: "mmhg", name: "mmHg (Blood)", symbol: "mmHg", factor: 133.322 },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    baseUnit: "joule",
    baseSISymbol: "kg⋅m²⋅s⁻²",
    units: [
      { id: "j", name: "Joule", symbol: "J", factor: 1, allowPrefixes: true },
      { id: "cal", name: "Calorie", symbol: "cal", factor: 4.184 },
      { id: "kcal", name: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { id: "wh", name: "Watt-hour", symbol: "Wh", factor: 3600 },
      { id: "kwh", name: "Kilowatt-hour", symbol: "kWh", factor: 3.6e6 },
      { id: "btu", name: "BTU", symbol: "BTU", factor: 1055.06 },
      { id: "ev", name: "Electronvolt", symbol: "eV", factor: 1.602e-19 },
      { id: "tnt", name: "Ton of TNT", symbol: "tTNT", factor: 4.184e9 },
    ],
  },
  {
    id: "power",
    name: "Power",
    baseUnit: "watt",
    baseSISymbol: "kg⋅m²⋅s⁻³",
    units: [
      { id: "w", name: "Watt", symbol: "W", factor: 1, allowPrefixes: true },
      { id: "hp", name: "Horsepower", symbol: "hp", factor: 745.7 },
      { id: "hp_m", name: "Metric HP", symbol: "hp", factor: 735.499 },
    ],
  },
  {
    id: "frequency",
    name: "Frequency",
    baseUnit: "hertz",
    baseSISymbol: "s⁻¹",
    units: [
      { id: "hz", name: "Hertz", symbol: "Hz", factor: 1, allowPrefixes: true },
      { id: "rpm", name: "RPM", symbol: "rpm", factor: 0.0166667 },
    ],
  },

  // --- ELECTRICAL ---
  {
    id: "charge",
    name: "Electric Charge",
    baseUnit: "coulomb",
    baseSISymbol: "A⋅s",
    units: [
      { id: "c", name: "Coulomb", symbol: "C", factor: 1 },
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
      { id: "s", name: "Siemens", symbol: "S", factor: 1 },
      { id: "mho", name: "Mho", symbol: "℧", factor: 1 },
    ],
  },
  {
    id: "magnetic_flux",
    name: "Magnetic Flux",
    baseUnit: "weber",
    baseSISymbol: "kg⋅m²⋅s⁻²⋅A⁻¹",
    units: [
      { id: "wb", name: "Weber", symbol: "Wb", factor: 1 },
      { id: "mx", name: "Maxwell", symbol: "Mx", factor: 1e-8 },
    ],
  },
  {
    id: "magnetic_density",
    name: "Magnetic Flux Density",
    baseUnit: "tesla",
    baseSISymbol: "kg⋅s⁻²⋅A⁻¹",
    units: [
      { id: "t", name: "Tesla", symbol: "T", factor: 1 },
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

  // --- RADIATION & CHEMISTRY ---
  {
    id: "radioactivity",
    name: "Radioactivity",
    baseUnit: "becquerel",
    baseSISymbol: "s⁻¹",
    units: [
      { id: "bq", name: "Becquerel", symbol: "Bq", factor: 1 },
      { id: "ci", name: "Curie", symbol: "Ci", factor: 3.7e10 },
      { id: "rd", name: "Rutherford", symbol: "Rd", factor: 1e6 },
    ],
  },
  {
    id: "radiation_dose",
    name: "Absorbed Radiation Dose",
    baseUnit: "gray",
    baseSISymbol: "m²⋅s⁻²",
    units: [
      { id: "gy", name: "Gray", symbol: "Gy", factor: 1 },
      { id: "rad", name: "Rad", symbol: "rad", factor: 0.01 },
    ],
  },
  {
    id: "equivalent_dose",
    name: "Equivalent Radiation Dose",
    baseUnit: "sievert",
    baseSISymbol: "m²⋅s⁻²",
    units: [
      { id: "sv", name: "Sievert", symbol: "Sv", factor: 1 },
      { id: "rem", name: "Rem", symbol: "rem", factor: 0.01 },
    ],
  },
  {
    id: "catalytic",
    name: "Catalytic Activity",
    baseUnit: "katal",
    baseSISymbol: "mol⋅s⁻¹",
    units: [
      { id: "kat", name: "Katal", symbol: "kat", factor: 1 },
      { id: "u", name: "Enzyme Unit", symbol: "U", factor: 1.667e-8 },
    ],
  },

  // --- ANGLES ---
  {
    id: "angle",
    name: "Plane Angle",
    baseUnit: "radian",
    baseSISymbol: "m⋅m⁻¹",
    units: [
      { id: "rad", name: "Radian", symbol: "rad", factor: 1, allowPrefixes: true },
      { id: "deg", name: "Degree", symbol: "°", factor: 0.0174533 },
      { id: "deg_dms", name: "Degree (DMS)", symbol: "° ′ ″", factor: 0.0174533 },
      { id: "grad", name: "Gradian", symbol: "grad", factor: 0.015708 },
      { id: "arcmin", name: "Arcminute", symbol: "′", factor: 0.000290888 },
      { id: "arcsec", name: "Arcsecond", symbol: "″", factor: 4.848e-6 },
    ],
  },
  {
    id: "solid_angle",
    name: "Solid Angle",
    baseUnit: "steradian",
    baseSISymbol: "m²⋅m⁻²",
    units: [
      { id: "sr", name: "Steradian", symbol: "sr", factor: 1 },
      { id: "sp", name: "Spat", symbol: "sp", factor: 12.56637 },
      { id: "sqdeg", name: "Square Degree", symbol: "deg²", factor: 0.0003046 },
    ],
  },

  // --- OTHER PHYSICAL PROPERTIES ---
  {
    id: "density",
    name: "Density",
    baseUnit: "kg/m³",
    baseSISymbol: "kg⋅m⁻³",
    units: [
      { id: "kgm3", name: "kg/m³", symbol: "kg/m³", factor: 1 },
      { id: "gcm3", name: "g/cm³", symbol: "g/cm³", factor: 1000 },
      { id: "lbft3", name: "lb/ft³", symbol: "lb/ft³", factor: 16.0185 },
    ],
  },
  {
    id: "viscosity",
    name: "Viscosity (Dynamic)",
    baseUnit: "pascal-second",
    baseSISymbol: "kg⋅m⁻¹⋅s⁻¹",
    units: [
      { id: "pas", name: "Pascal-second", symbol: "Pa·s", factor: 1 },
      { id: "poise", name: "Poise", symbol: "P", factor: 0.1 },
      { id: "cp", name: "Centipoise", symbol: "cP", factor: 0.001 },
    ],
  },
  {
    id: "surface_tension",
    name: "Surface Tension",
    baseUnit: "newton/meter",
    baseSISymbol: "kg⋅s⁻²",
    units: [
      { id: "nm", name: "Newton/meter", symbol: "N/m", factor: 1 },
      {
        id: "dynecm",
        name: "Dyne/centimeter",
        symbol: "dyn/cm",
        factor: 0.001,
      },
    ],
  },
  {
    id: "torque",
    name: "Torque",
    baseUnit: "newton meter",
    baseSISymbol: "kg⋅m²⋅s⁻²",
    units: [
      { id: "nm", name: "Newton-meter", symbol: "N⋅m", factor: 1 },
      { id: "ftlb", name: "Foot-pound", symbol: "ft⋅lb", factor: 1.35582 },
      { id: "inlb", name: "Inch-pound", symbol: "in⋅lb", factor: 0.112985 },
      { id: "kgm", name: "Kilogram-meter", symbol: "kg⋅m", factor: 9.80665 },
    ],
  },
  {
    id: "flow",
    name: "Flow Rate (Volumetric)",
    baseUnit: "cubic meter/second",
    baseSISymbol: "m³⋅s⁻¹",
    units: [
      { id: "m3s", name: "m³/s", symbol: "m³/s", factor: 1 },
      { id: "lmin", name: "Liter/minute", symbol: "L/min", factor: 1.6667e-5 },
      {
        id: "cfm",
        name: "Cubic ft/minute",
        symbol: "CFM",
        factor: 0.000471947,
      },
      { id: "gpm", name: "Gallon/minute", symbol: "GPM", factor: 6.309e-5 },
    ],
  },

  // --- LIGHT & SOUND ---
  {
    id: "illuminance",
    name: "Illuminance",
    baseUnit: "lux",
    baseSISymbol: "cd⋅sr⋅m⁻²",
    units: [
      { id: "lx", name: "Lux", symbol: "lx", factor: 1 },
      { id: "fc", name: "Foot-candle", symbol: "fc", factor: 10.7639 },
      { id: "ph", name: "Phot", symbol: "ph", factor: 10000 },
      { id: "nox", name: "Nox", symbol: "nox", factor: 0.001 },
    ],
  },
  {
    id: "refractive_power",
    name: "Refractive Power (Vision)",
    baseUnit: "diopter",
    units: [{ id: "d", name: "Diopter", symbol: "D", factor: 1 }],
  },
  {
    id: "sound_pressure",
    name: "Sound Pressure",
    baseUnit: "pascal",
    baseSISymbol: "kg⋅m⁻¹⋅s⁻²",
    units: [
      { id: "pa", name: "Pascal", symbol: "Pa", factor: 1 },
      { id: "bar", name: "Microbar", symbol: "µbar", factor: 0.1 },
      { id: "dyncm2", name: "Dyne/cm²", symbol: "dyn/cm²", factor: 0.1 },
    ],
  },

  // --- SPECIALIZED ---
  {
    id: "digital",
    name: "Digital Storage",
    baseUnit: "byte",
    units: [
      { id: "b", name: "Bit", symbol: "b", factor: 0.125 },
      { id: "B", name: "Byte", symbol: "B", factor: 1 },
      { id: "KB", name: "Kilobyte", symbol: "KB", factor: 1024 },
      { id: "MB", name: "Megabyte", symbol: "MB", factor: 1048576 },
      { id: "GB", name: "Gigabyte", symbol: "GB", factor: 1.074e9 },
      { id: "TB", name: "Terabyte", symbol: "TB", factor: 1.1e12 },
      { id: "PB", name: "Petabyte", symbol: "PB", factor: 1.126e15 },
    ],
  },
  {
    id: "printing",
    name: "Typography",
    baseUnit: "point (PostScript)",
    units: [
      { id: "pt", name: "Point (PostScript)", symbol: "pt", factor: 1 },
      { id: "pt_am", name: "Point (American)", symbol: "pt", factor: 0.996264 },
      { id: "pc", name: "Pica (PostScript)", symbol: "pc", factor: 12 },
      { id: "pc_am", name: "Pica (American)", symbol: "pc", factor: 11.955168 },
      { id: "in", name: "Inch", symbol: "in", factor: 72 },
      { id: "mm", name: "Millimeter", symbol: "mm", factor: 2.83465 },
      { id: "px", name: "Pixel (96dpi)", symbol: "px", factor: 0.75 },
      { id: "didot", name: "Didot", symbol: "dd", factor: 1.07 },
      { id: "cicero", name: "Cicero", symbol: "cc", factor: 12.84 },
    ],
  },
];

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

  // Standard conversion
  const baseValue = val * fromUnit.factor;
  return baseValue / (toUnit.factor * toPrefixFactor);
}
