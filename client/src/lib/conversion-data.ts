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
  | "refractive_power"
  | "sound_pressure"
  | "fuel_economy"
  | "lightbulb";

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

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Conversion factor to base unit
  offset?: number; // For temperature (e.g. Celsius to Kelvin)
  description?: string;
  allowPrefixes?: boolean;
  beerWine?: boolean; // For beer/wine units that are conditionally shown
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
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1 },
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
      { id: "d_sid", name: "Sidereal Day", symbol: "d (sid)", factor: 86164.0905 },
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
      { id: "m2", name: "Square Meter", symbol: "m²", factor: 1, allowPrefixes: true },
      { id: "ha", name: "Hectare", symbol: "ha", factor: 10000 },
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
    baseUnit: "cubic meter",
    baseSISymbol: "m³",
    units: [
      { id: "l", name: "Liter", symbol: "L", factor: 0.001, allowPrefixes: true },
      { id: "m3", name: "Cubic Meter", symbol: "m³", factor: 1, allowPrefixes: false },
      { id: "ft3", name: "Cubic Foot", symbol: "ft³", factor: 0.0283168 },
      { id: "yd3", name: "Cubic Yard", symbol: "yd³", factor: 0.764555 },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00000492892 },
      { id: "tsp_imp", name: "Teaspoon (Imp)", symbol: "tsp", factor: 0.00000591939 },
      {
        id: "tbsp",
        name: "Tablespoon (US)",
        symbol: "tbsp",
        factor: 0.0000147868,
      },
      {
        id: "tbsp_imp",
        name: "Tablespoon (Imp)",
        symbol: "tbsp",
        factor: 0.0000177582,
      },
      { id: "floz", name: "Fluid Ounce (US)", symbol: "fl oz", factor: 0.0000295735 },
      { id: "floz_imp", name: "Fluid Ounce (Imp)", symbol: "fl oz", factor: 0.0000284130625 },
      { id: "cup", name: "Cup (US)", symbol: "cp", factor: 0.000236588 },
      { id: "pt", name: "Pint (US)", symbol: "pt", factor: 0.000473176 },
      { id: "pt_imp", name: "Pint (Imp)", symbol: "pt", factor: 0.00056826125 },
      { id: "qt", name: "Quart (US)", symbol: "qt", factor: 0.000946353 },
      { id: "qt_imp", name: "Quart (Imp)", symbol: "qt", factor: 0.0011365225 },
      { id: "gal", name: "Gallon (US)", symbol: "gal", factor: 0.00378541 },
      { id: "gal_imp", name: "Gallon (Imp)", symbol: "gal", factor: 0.00454609 },
      { id: "bbl", name: "Barrel (Oil)", symbol: "bbl", factor: 0.158987 },
      { id: "bu", name: "Bushel", symbol: "bu", factor: 0.0352391 },
      { id: "ac_ft", name: "Acre-foot", symbol: "ac⋅ft", factor: 1233.48184 },
      { id: "mi3", name: "Cubic Mile", symbol: "mi³", factor: 4.16818e9 },
      { id: "bottle_wine", name: "Bottle (Wine)", symbol: "btl", factor: 0.00075, beerWine: true },
      { id: "magnum_wine", name: "Magnum (Wine)", symbol: "mag", factor: 0.0015, beerWine: true },
      { id: "bottle_beer_small", name: "Bottle (Beer, small)", symbol: "btl", factor: 0.00035, beerWine: true },
      { id: "bottle_beer_longneck", name: "Bottle (Beer, longneck)", symbol: "btl", factor: 0.000354882, beerWine: true },
      { id: "bottle_beer_large", name: "Bottle (Beer, large)", symbol: "btl", factor: 0.0005, beerWine: true },
      { id: "mini_keg", name: "Mini Keg (Beer)", symbol: "mini keg", factor: 0.005, beerWine: true },
      { id: "pony_keg", name: "Pony Keg (Beer)", symbol: "pony", factor: 0.0147, beerWine: true },
      { id: "keg_beer", name: "Keg (Beer)", symbol: "keg", factor: 0.0587, beerWine: true },
      { id: "bbl_beer", name: "Barrel (Beer)", symbol: "bbl", factor: 0.117, beerWine: true },
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
      { id: "g", name: "g-force", symbol: "g", factor: 9.80665 },
      { id: "ftps2", name: "Foot/sq sec", symbol: "ft⋅s⁻²", factor: 0.3048 },
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
      { id: "rpm", name: "Revolutions/Minute", symbol: "rpm", factor: 0.0166667 },
      { id: "rps", name: "Revolutions/Second", symbol: "rps", factor: 1 },
      { id: "bpm", name: "Beats/Minute", symbol: "BPM", factor: 0.0166667 },
      { id: "rad_s", name: "Radians/Second", symbol: "rad/s", factor: 0.159155 },
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
      { id: "abf", name: "Abfarad", symbol: "abF", factor: 1e-9 },
      { id: "statf", name: "Statfarad", symbol: "statF", factor: 1.11265e-12 },
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

  // --- RADIATION & CHEMISTRY ---
  {
    id: "radioactivity",
    name: "Radioactivity",
    baseUnit: "becquerel",
    baseSISymbol: "s⁻¹",
    units: [
      { id: "bq", name: "Becquerel", symbol: "Bq", factor: 1, allowPrefixes: true },
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
    baseSISymbol: "sr",
    units: [
      { id: "sr", name: "Steradian", symbol: "sr", factor: 1, allowPrefixes: true },
      { id: "sp", name: "Spat", symbol: "sp", factor: 12.56637 },
      { id: "sqdeg", name: "Square Degree", symbol: "deg²", factor: 0.0003046 },
    ],
  },
  {
    id: "angular_velocity",
    name: "Angular Velocity",
    baseUnit: "radian/second",
    baseSISymbol: "rad⋅s⁻¹",
    units: [
      { id: "rad_s", name: "Radian/Second", symbol: "rad⋅s⁻¹", factor: 1 },
      { id: "deg_s", name: "Degree/Second", symbol: "°/s", factor: 0.0174533 },
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
      { id: "ns", name: "Newton-second", symbol: "N⋅s", factor: 1 },
      { id: "lbfts", name: "lb⋅ft/s", symbol: "lb⋅ft⋅s⁻¹", factor: 0.138255 },
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
      { id: "gcm3", name: "g/cm³", symbol: "g⋅cm⁻³", factor: 1000 },
      { id: "lbft3", name: "lb/ft³", symbol: "lb⋅ft⁻³", factor: 16.0185 },
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
      { id: "btu_hftf", name: "BTU/(h⋅ft⋅°F)", symbol: "BTU/(h⋅ft⋅°F)", factor: 1.73073 },
      { id: "cal_scmC", name: "cal/(s⋅cm⋅°C)", symbol: "cal/(s⋅cm⋅°C)", factor: 418.4 },
    ],
  },
  {
    id: "specific_heat",
    name: "Specific Heat Capacity",
    baseUnit: "joule/kilogram-kelvin",
    baseSISymbol: "J⋅kg⁻¹⋅K⁻¹",
    units: [
      { id: "jkgk", name: "J/(kg⋅K)", symbol: "J⋅kg⁻¹⋅K⁻¹", factor: 1 },
      { id: "cal_gC", name: "cal/(g⋅°C)", symbol: "cal/(g⋅°C)", factor: 4184 },
      { id: "btu_lbF", name: "BTU/(lb⋅°F)", symbol: "BTU/(lb⋅°F)", factor: 4186.8 },
      { id: "kjkgk", name: "kJ/(kg⋅K)", symbol: "kJ⋅kg⁻¹⋅K⁻¹", factor: 1000 },
    ],
  },
  {
    id: "entropy",
    name: "Entropy",
    baseUnit: "joule/kelvin",
    baseSISymbol: "J⋅K⁻¹",
    units: [
      { id: "jk", name: "Joule/Kelvin", symbol: "J⋅K⁻¹", factor: 1 },
      { id: "kjk", name: "Kilojoule/Kelvin", symbol: "kJ⋅K⁻¹", factor: 1000 },
      { id: "calk", name: "Calorie/Kelvin", symbol: "cal⋅K⁻¹", factor: 4.184 },
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
      { id: "ftlb", name: "Foot-pound", symbol: "ft⋅lb", factor: 1.35582 },
      { id: "inlb", name: "Inch-pound", symbol: "in⋅lb", factor: 0.112985 },
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
      { id: "m3min", name: "Cubic Metre/minute", symbol: "m³⋅min⁻¹", factor: 0.0166667 },
      { id: "m3h", name: "Cubic Metre/hour", symbol: "m³⋅h⁻¹", factor: 0.000277778 },
      { id: "ls", name: "Liter/second", symbol: "L⋅s⁻¹", factor: 0.001 },
      { id: "lmin", name: "Liter/minute", symbol: "L⋅min⁻¹", factor: 1.6667e-5 },
      { id: "lh", name: "Liter/hour", symbol: "L⋅h⁻¹", factor: 2.7778e-7 },
      { id: "cm3s", name: "Cubic Centimetre/second", symbol: "cm³⋅s⁻¹", factor: 1e-6 },
      { id: "cm3min", name: "Cubic Centimetre/minute", symbol: "cm³⋅min⁻¹", factor: 1.6667e-8 },
      { id: "cm3h", name: "Cubic Centimetre/hour", symbol: "cm³⋅h⁻¹", factor: 2.7778e-10 },
      { id: "ft3s", name: "Cubic Foot/second", symbol: "ft³⋅s⁻¹", factor: 0.0283168 },
      { id: "cfm", name: "Cubic Foot/minute", symbol: "CFM", factor: 0.000471947 },
      { id: "ft3h", name: "Cubic Foot/hour", symbol: "ft³⋅h⁻¹", factor: 7.8658e-6 },
      { id: "gals", name: "US Gallon/second", symbol: "gal⋅s⁻¹", factor: 0.003785412 },
      { id: "gpm", name: "US Gallon/minute", symbol: "GPM", factor: 6.309e-5 },
      { id: "galh", name: "US Gallon/hour", symbol: "gal⋅h⁻¹", factor: 1.0515e-6 },
      { id: "gald", name: "US Gallon/day", symbol: "gal⋅d⁻¹", factor: 4.3815e-8 },
      { id: "impgals", name: "Imperial Gallon/second", symbol: "Imp gal⋅s⁻¹", factor: 0.00454609 },
      { id: "impgalmin", name: "Imperial Gallon/minute", symbol: "Imp gal⋅min⁻¹", factor: 7.577e-5 },
      { id: "impgalh", name: "Imperial Gallon/hour", symbol: "Imp gal⋅h⁻¹", factor: 1.2628e-6 },
      { id: "bbls", name: "Barrel/second", symbol: "bbl⋅s⁻¹", factor: 0.158987295 },
      { id: "bblmin", name: "Barrel/minute", symbol: "bbl⋅min⁻¹", factor: 0.00264979 },
      { id: "bblh", name: "Barrel/hour", symbol: "bbl⋅h⁻¹", factor: 4.4165e-5 },
      { id: "bbld", name: "Barrel/day", symbol: "bbl⋅d⁻¹", factor: 1.8401e-6 },
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
      { id: "cdsr", name: "Candela-Steradian", symbol: "cd⋅sr", factor: 1 },
      { id: "lm", name: "Lumen", symbol: "lm", factor: 1, allowPrefixes: true },
      { id: "candlepower", name: "Candlepower (spherical)", symbol: "cp", factor: 12.566371 },
      { id: "talbot", name: "Talbot", symbol: "T", factor: 1, description: "Lumen-second (photographic)" },
    ],
  },
  {
    id: "illuminance",
    name: "Illuminance",
    baseUnit: "lux",
    baseSISymbol: "cd⋅sr⋅m⁻²",
    units: [
      { id: "lx", name: "Lux", symbol: "lx", factor: 1, allowPrefixes: true },
      { id: "fc", name: "Foot-candle", symbol: "fc", factor: 10.7639 },
      { id: "ph", name: "Phot", symbol: "ph", factor: 10000 },
      { id: "nox", name: "Nox", symbol: "nox", factor: 0.001 },
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
      { id: "bar", name: "Bar", symbol: "bar", factor: 100000 },
      { id: "ubar", name: "Microbar", symbol: "µbar", factor: 0.1 },
      { id: "dyncm2", name: "Dyne/cm²", symbol: "dyn⋅cm⁻²", factor: 0.1 },
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
      { id: "mol_m3", name: "Mole/m³", symbol: "mol⋅m⁻³", factor: 0.001 },
      { id: "ppm", name: "Parts per Million", symbol: "ppm", factor: 1e-6 },
      { id: "ppb", name: "Parts per Billion", symbol: "ppb", factor: 1e-9 },
      { id: "ppt", name: "Parts per Trillion", symbol: "ppt", factor: 1e-12 },
      { id: "percent", name: "Percent", symbol: "%", factor: 0.01 },
      { id: "permille", name: "Per Mille", symbol: "‰", factor: 0.001 },
    ],
  },

  // --- HUMAN/PRACTICAL ---
  {
    id: "fuel_economy",
    name: "Fuel Economy",
    baseUnit: "kilometer/liter",
    baseSISymbol: "km⋅L⁻¹",
    units: [
      { id: "km_l", name: "Kilometers/Liter", symbol: "km/L", factor: 1 },
      { id: "mpg_us", name: "Miles/Gallon (US)", symbol: "mpg (US)", factor: 0.425144 },
      { id: "mpg_imp", name: "Miles/Gallon (Imp)", symbol: "mpg (Imp)", factor: 0.354006 },
      { id: "mi_l", name: "Miles/Liter", symbol: "mi/L", factor: 1.60934 },
      { id: "km_gal_us", name: "Kilometers/Gallon (US)", symbol: "km/gal", factor: 0.264172 },
    ],
  },
  {
    id: "lightbulb",
    name: "Lightbulb Efficiency",
    baseUnit: "lumen",
    baseSISymbol: "lm",
    units: [
      { id: "lm", name: "Lumen", symbol: "lm", factor: 1, allowPrefixes: true },
      { id: "sodium_w", name: "Sodium Vapor Lamp (watts)", symbol: "W (Na)", factor: 100 },
      { id: "led_w", name: "LED Bulb (watts)", symbol: "W (LED)", factor: 95 },
      { id: "fluorescent_w", name: "Fluorescent Bulb (watts)", symbol: "W (CFL)", factor: 70 },
      { id: "halogen_w", name: "Halogen Bulb (watts)", symbol: "W (hal)", factor: 20 },
      { id: "incandescent_w", name: "Incandescent Bulb (watts)", symbol: "W (inc)", factor: 15 },
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
