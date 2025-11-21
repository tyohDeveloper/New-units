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

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Conversion factor to base unit
  offset?: number; // For temperature (e.g. Celsius to Kelvin)
  description?: string;
}

export interface CategoryDefinition {
  id: UnitCategory;
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const CONVERSION_DATA: CategoryDefinition[] = [
  // --- SI BASE QUANTITIES ---
  {
    id: "length",
    name: "Length",
    baseUnit: "meter",
    units: [
      { id: "nm", name: "Nanometer", symbol: "nm", factor: 1e-9 },
      { id: "um", name: "Micrometer", symbol: "µm", factor: 1e-6 },
      { id: "mm", name: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "cm", name: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "m", name: "Meter", symbol: "m", factor: 1 },
      { id: "km", name: "Kilometer", symbol: "km", factor: 1000 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048 },
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
    units: [
      { id: "mg", name: "Milligram", symbol: "mg", factor: 1e-6 },
      { id: "g", name: "Gram", symbol: "g", factor: 0.001 },
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1 },
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
    units: [
      { id: "ns", name: "Nanosecond", symbol: "ns", factor: 1e-9 },
      { id: "us", name: "Microsecond", symbol: "µs", factor: 1e-6 },
      { id: "ms", name: "Millisecond", symbol: "ms", factor: 0.001 },
      { id: "s", name: "Second", symbol: "s", factor: 1 },
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
    units: [
      { id: "a", name: "Ampere", symbol: "A", factor: 1 },
      { id: "ma", name: "Milliampere", symbol: "mA", factor: 0.001 },
      { id: "ka", name: "Kiloampere", symbol: "kA", factor: 1000 },
      { id: "biot", name: "Biot (abampere)", symbol: "Bi", factor: 10 },
      { id: "statA", name: "Statampere", symbol: "statA", factor: 3.33564e-10 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
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
    units: [
      { id: "mol", name: "Mole", symbol: "mol", factor: 1 },
      { id: "mmol", name: "Millimole", symbol: "mmol", factor: 0.001 },
      { id: "kmol", name: "Kilomole", symbol: "kmol", factor: 1000 },
      { id: "lbmol", name: "Pound-mole", symbol: "lb-mol", factor: 453.59237 },
    ],
  },
  {
    id: "intensity",
    name: "Luminous Intensity",
    baseUnit: "candela",
    units: [
      { id: "cd", name: "Candela", symbol: "cd", factor: 1 },
      { id: "cp", name: "Candlepower", symbol: "cp", factor: 0.981 },
      { id: "hk", name: "Hefnerkerze", symbol: "HK", factor: 0.903 },
    ],
  },

  // --- DERIVED & PRACTICAL ---
  {
    id: "area",
    name: "Area",
    baseUnit: "square meter",
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
    units: [
      { id: "ml", name: "Milliliter", symbol: "ml", factor: 0.001 },
      { id: "l", name: "Liter", symbol: "L", factor: 1 },
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1000 },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892 },
      {
        id: "tbsp",
        name: "Tablespoon (US)",
        symbol: "tbsp",
        factor: 0.0147868,
      },
      { id: "floz", name: "Fluid Ounce", symbol: "fl oz", factor: 0.0295735 },
      { id: "cup", name: "Cup", symbol: "cp", factor: 0.236588 },
      { id: "pt", name: "Pint", symbol: "pt", factor: 0.473176 },
      { id: "qt", name: "Quart", symbol: "qt", factor: 0.946353 },
      { id: "gal", name: "Gallon", symbol: "gal", factor: 3.78541 },
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
    units: [
      { id: "n", name: "Newton", symbol: "N", factor: 1 },
      { id: "kn", name: "Kilonewton", symbol: "kN", factor: 1000 },
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
    units: [
      { id: "pa", name: "Pascal", symbol: "Pa", factor: 1 },
      { id: "kpa", name: "Kilopascal", symbol: "kPa", factor: 1000 },
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
    units: [
      { id: "j", name: "Joule", symbol: "J", factor: 1 },
      { id: "kj", name: "Kilojoule", symbol: "kJ", factor: 1000 },
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
    units: [
      { id: "w", name: "Watt", symbol: "W", factor: 1 },
      { id: "kw", name: "Kilowatt", symbol: "kW", factor: 1000 },
      { id: "hp", name: "Horsepower", symbol: "hp", factor: 745.7 },
      { id: "hp_m", name: "Metric HP", symbol: "hp", factor: 735.499 },
    ],
  },
  {
    id: "frequency",
    name: "Frequency",
    baseUnit: "hertz",
    units: [
      { id: "hz", name: "Hertz", symbol: "Hz", factor: 1 },
      { id: "khz", name: "Kilohertz", symbol: "kHz", factor: 1000 },
      { id: "mhz", name: "Megahertz", symbol: "MHz", factor: 1e6 },
      { id: "ghz", name: "Gigahertz", symbol: "GHz", factor: 1e9 },
      { id: "rpm", name: "RPM", symbol: "rpm", factor: 0.0166667 },
    ],
  },

  // --- ELECTRICAL ---
  {
    id: "charge",
    name: "Electric Charge",
    baseUnit: "coulomb",
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
    units: [
      { id: "v", name: "Volt", symbol: "V", factor: 1 },
      { id: "mv", name: "Millivolt", symbol: "mV", factor: 0.001 },
      { id: "kv", name: "Kilovolt", symbol: "kV", factor: 1000 },
      { id: "statv", name: "Statvolt", symbol: "statV", factor: 299.792 },
    ],
  },
  {
    id: "capacitance",
    name: "Capacitance",
    baseUnit: "farad",
    units: [
      { id: "f", name: "Farad", symbol: "F", factor: 1 },
      { id: "uf", name: "Microfarad", symbol: "µF", factor: 1e-6 },
      { id: "nf", name: "Nanofarad", symbol: "nF", factor: 1e-9 },
      { id: "pf", name: "Picofarad", symbol: "pF", factor: 1e-12 },
    ],
  },
  {
    id: "resistance",
    name: "Resistance",
    baseUnit: "ohm",
    units: [
      { id: "ohm", name: "Ohm", symbol: "Ω", factor: 1 },
      { id: "kohm", name: "Kiloohm", symbol: "kΩ", factor: 1000 },
      { id: "mohm", name: "Megaohm", symbol: "MΩ", factor: 1e6 },
    ],
  },
  {
    id: "conductance",
    name: "Conductance",
    baseUnit: "siemens",
    units: [
      { id: "s", name: "Siemens", symbol: "S", factor: 1 },
      { id: "mho", name: "Mho", symbol: "℧", factor: 1 },
    ],
  },
  {
    id: "magnetic_flux",
    name: "Magnetic Flux",
    baseUnit: "weber",
    units: [
      { id: "wb", name: "Weber", symbol: "Wb", factor: 1 },
      { id: "mx", name: "Maxwell", symbol: "Mx", factor: 1e-8 },
    ],
  },
  {
    id: "magnetic_density",
    name: "Magnetic Flux Density",
    baseUnit: "tesla",
    units: [
      { id: "t", name: "Tesla", symbol: "T", factor: 1 },
      { id: "g", name: "Gauss", symbol: "G", factor: 1e-4 },
    ],
  },
  {
    id: "inductance",
    name: "Inductance",
    baseUnit: "henry",
    units: [
      { id: "h", name: "Henry", symbol: "H", factor: 1 },
      { id: "mh", name: "Millihenry", symbol: "mH", factor: 0.001 },
      { id: "uh", name: "Microhenry", symbol: "µH", factor: 1e-6 },
    ],
  },

  // --- RADIATION & CHEMISTRY ---
  {
    id: "radioactivity",
    name: "Radioactivity",
    baseUnit: "becquerel",
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
    units: [
      { id: "gy", name: "Gray", symbol: "Gy", factor: 1 },
      { id: "rad", name: "Rad", symbol: "rad", factor: 0.01 },
    ],
  },
  {
    id: "equivalent_dose",
    name: "Equivalent Radiation Dose",
    baseUnit: "sievert",
    units: [
      { id: "sv", name: "Sievert", symbol: "Sv", factor: 1 },
      { id: "rem", name: "Rem", symbol: "rem", factor: 0.01 },
    ],
  },
  {
    id: "catalytic",
    name: "Catalytic Activity",
    baseUnit: "katal",
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
    units: [
      { id: "rad", name: "Radian", symbol: "rad", factor: 1 },
      { id: "deg", name: "Degree", symbol: "°", factor: 0.0174533 },
      { id: "grad", name: "Gradian", symbol: "grad", factor: 0.015708 },
      { id: "arcmin", name: "Arcminute", symbol: "′", factor: 0.000290888 },
      { id: "arcsec", name: "Arcsecond", symbol: "″", factor: 4.848e-6 },
    ],
  },
  {
    id: "solid_angle",
    name: "Solid Angle",
    baseUnit: "steradian",
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
    baseUnit: "point",
    units: [
      { id: "pt", name: "Point", symbol: "pt", factor: 1 },
      { id: "pc", name: "Pica", symbol: "pc", factor: 12 },
      { id: "in", name: "Inch", symbol: "in", factor: 72 },
      { id: "mm", name: "Millimeter", symbol: "mm", factor: 2.83465 },
      { id: "px", name: "Pixel (96dpi)", symbol: "px", factor: 0.75 },
    ],
  },
];

export function convert(
  value: number,
  fromId: string,
  toId: string,
  categoryId: UnitCategory,
): number {
  const category = CONVERSION_DATA.find((c) => c.id === categoryId);
  if (!category) return 0;

  const fromUnit = category.units.find((u) => u.id === fromId);
  const toUnit = category.units.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  // Special handling for temperature (using offsets)
  if (categoryId === "temperature") {
    const baseValue = (value + (fromUnit.offset || 0)) * fromUnit.factor;
    return baseValue / toUnit.factor - (toUnit.offset || 0);
  }

  // Standard conversion
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}
