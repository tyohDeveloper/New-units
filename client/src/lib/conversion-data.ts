
export type UnitCategory = 'length' | 'mass' | 'volume' | 'area' | 'temperature' | 'time' | 'digital' | 'energy' | 'pressure' | 'power' | 'printing';

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
  {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'meter',
    units: [
      // SI / Metric
      { id: 'nm', name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', factor: 1e-6 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      
      // US / Imperial
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
      
      // Survey (US)
      { id: 'link', name: 'Link (Gunter)', symbol: 'li', factor: 0.201168 },
      { id: 'rod', name: 'Rod / Pole / Perch', symbol: 'rd', factor: 5.0292 },
      { id: 'chain', name: 'Chain (Gunter)', symbol: 'ch', factor: 20.1168 },
      { id: 'furlong', name: 'Furlong', symbol: 'fur', factor: 201.168 },
      
      // Archaic / Miscellaneous
      { id: 'cubit_biblical', name: 'Biblical Cubit', symbol: 'cubit', factor: 0.4572, description: 'Approximate length of a forearm' },
      { id: 'hand', name: 'Hand', symbol: 'hh', factor: 0.1016, description: 'Used for horses' },
      { id: 'league_land', name: 'League (Land)', symbol: 'lea', factor: 4828.032 },
      { id: 'fathom', name: 'Fathom', symbol: 'ftm', factor: 1.8288, description: 'Used for water depth' },
      { id: 'parsec', name: 'Parsec', symbol: 'pc', factor: 3.0857e16 },
      { id: 'au', name: 'Astronomical Unit', symbol: 'AU', factor: 1.496e11 },
      { id: 'lightyear', name: 'Light Year', symbol: 'ly', factor: 9.461e15 },
      { id: 'smoot', name: 'Smoot', symbol: 'sm', factor: 1.7018, description: 'MIT bridge measurement' }
    ]
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    baseUnit: 'kilogram',
    units: [
      // SI
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 1e-6 },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 't', name: 'Metric Tonne', symbol: 't', factor: 1000 },
      
      // US / Imperial
      { id: 'oz', name: 'Ounce (Av)', symbol: 'oz', factor: 0.0283495 },
      { id: 'lb', name: 'Pound (Av)', symbol: 'lb', factor: 0.453592 },
      { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029 },
      { id: 'ton_us', name: 'Short Ton (US)', symbol: 'ton', factor: 907.185 },
      { id: 'ton_uk', name: 'Long Ton (UK)', symbol: 'ton', factor: 1016.05 },
      
      // Precious Metals (Troy)
      { id: 'gr', name: 'Grain', symbol: 'gr', factor: 6.47989e-5 },
      { id: 'dwt', name: 'Pennyweight', symbol: 'dwt', factor: 0.00155517 },
      { id: 'oz_t', name: 'Troy Ounce', symbol: 'oz t', factor: 0.0311035 },
      { id: 'lb_t', name: 'Troy Pound', symbol: 'lb t', factor: 0.373242 },
      { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.0002, description: 'For gems' },
      
      // Archaic
      { id: 'slug', name: 'Slug', symbol: 'slug', factor: 14.5939 },
      { id: 'talent_biblical', name: 'Talent (Biblical)', symbol: 'talent', factor: 34.2, description: 'Heavy biblical weight' },
      { id: 'shekel', name: 'Shekel', symbol: 'shekel', factor: 0.0114 }
    ]
  },
  {
    id: 'volume',
    name: 'Volume & Capacity',
    baseUnit: 'liter',
    units: [
      // SI
      { id: 'ml', name: 'Milliliter', symbol: 'ml', factor: 0.001 },
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      
      // US Liquid
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', factor: 0.00492892 },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', factor: 0.0147868 },
      { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cp', factor: 0.236588 },
      { id: 'pt', name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      
      // Imperial
      { id: 'floz_imp', name: 'Fluid Ounce (Imp)', symbol: 'fl oz', factor: 0.0284131 },
      { id: 'pt_imp', name: 'Pint (Imp)', symbol: 'pt', factor: 0.568261 },
      { id: 'gal_imp', name: 'Gallon (Imp)', symbol: 'gal', factor: 4.54609 },
      
      // Barrels & Casks
      { id: 'bbl_oil', name: 'Oil Barrel', symbol: 'bbl', factor: 158.987 },
      { id: 'bbl_beer', name: 'Beer Barrel (US)', symbol: 'bbl', factor: 117.348 },
      { id: 'bbl_wine', name: 'Wine Barrel', symbol: 'bbl', factor: 119.24 },
      { id: 'hogshead', name: 'Hogshead (US)', symbol: 'hhd', factor: 238.481 },
      { id: 'butt', name: 'Butt / Pipe', symbol: 'butt', factor: 476.962, description: 'Two hogsheads' },
      { id: 'tun', name: 'Tun', symbol: 'tun', factor: 953.924, description: 'Two butts' },
      { id: 'firkin', name: 'Firkin', symbol: 'fir', factor: 40.9148, description: 'Quarter barrel' },
      { id: 'kilderkin', name: 'Kilderkin', symbol: 'kil', factor: 81.8296, description: 'Half barrel' },
      
      // Dry
      { id: 'pk', name: 'Peck (US)', symbol: 'pk', factor: 8.80977 },
      { id: 'bu', name: 'Bushel (US)', symbol: 'bu', factor: 35.2391 },
      
      // Archaic / Cooking
      { id: 'cord', name: 'Cord (Firewood)', symbol: 'cd', factor: 3624.56 },
      { id: 'gill', name: 'Gill (US)', symbol: 'gi', factor: 0.118294 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'square meter',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', factor: 1 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', factor: 10000 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
      { id: 'sqin', name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { id: 'sqyd', name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.86 },
      { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', factor: 2.59e6 },
      { id: 'barn', name: 'Barn', symbol: 'b', factor: 1e-28, description: 'Nuclear physics area' },
      { id: 'dunam', name: 'Dunam', symbol: 'dunam', factor: 1000, description: 'Ottoman measure' }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', factor: 0.5555555555555556, offset: -32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', factor: 1, offset: -273.15 },
      { id: 'r', name: 'Rankine', symbol: '°R', factor: 0.5555555555555556, offset: -491.67 }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    baseUnit: 'second',
    units: [
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { id: 's', name: 'Second', symbol: 's', factor: 1 },
      { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
      { id: 'h', name: 'Hour', symbol: 'h', factor: 3600 },
      { id: 'd', name: 'Day', symbol: 'd', factor: 86400 },
      { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800 },
      { id: 'mo', name: 'Month (Avg)', symbol: 'mo', factor: 2.628e6 },
      { id: 'y', name: 'Year', symbol: 'yr', factor: 3.154e7 },
      { id: 'fortnight', name: 'Fortnight', symbol: 'ftn', factor: 1.21e6 },
      { id: 'jiffy', name: 'Jiffy (Physics)', symbol: 'jiffy', factor: 3e-24 },
      { id: 'shake', name: 'Shake', symbol: 'shake', factor: 1e-8 }
    ]
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    baseUnit: 'byte',
    units: [
      { id: 'b', name: 'Bit', symbol: 'b', factor: 0.125 },
      { id: 'B', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'KB', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      { id: 'MB', name: 'Megabyte', symbol: 'MB', factor: 1048576 },
      { id: 'GB', name: 'Gigabyte', symbol: 'GB', factor: 1.074e9 },
      { id: 'TB', name: 'Terabyte', symbol: 'TB', factor: 1.1e12 },
      { id: 'PB', name: 'Petabyte', symbol: 'PB', factor: 1.126e15 },
      { id: 'nibble', name: 'Nibble', symbol: 'nibble', factor: 0.5, description: '4 bits' }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'pascal',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', factor: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000 },
      { id: 'psi', name: 'PSI', symbol: 'psi', factor: 6894.76 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', factor: 101325 },
      { id: 'torr', name: 'Torr', symbol: 'Torr', factor: 133.322 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    baseUnit: 'joule',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', factor: 1 },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
      { id: 'cal', name: 'Calorie', symbol: 'cal', factor: 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3.6e6 },
      { id: 'btu', name: 'BTU', symbol: 'BTU', factor: 1055.06 },
      { id: 'erg', name: 'Erg', symbol: 'erg', factor: 1e-7 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', factor: 1.602e-19 },
      { id: 'tnt', name: 'Ton of TNT', symbol: 'tTNT', factor: 4.184e9 }
    ]
  },
  {
    id: 'printing',
    name: 'Typography & Printing',
    baseUnit: 'point',
    units: [
      { id: 'pt', name: 'Point (PostScript)', symbol: 'pt', factor: 1 },
      { id: 'pc', name: 'Pica', symbol: 'pc', factor: 12 },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 72 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 2.83465 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 28.3465 },
      { id: 'px', name: 'Pixel (96dpi)', symbol: 'px', factor: 0.75 },
      { id: 'didot', name: 'Didot Point', symbol: 'dd', factor: 1.07 },
      { id: 'cicero', name: 'Cicero', symbol: 'cic', factor: 12.84 }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    baseUnit: 'watt',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', factor: 1 },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', factor: 1000 },
      { id: 'hp', name: 'Horsepower (Mech)', symbol: 'hp', factor: 745.7 },
      { id: 'hp_m', name: 'Horsepower (Metric)', symbol: 'hp', factor: 735.499 }
    ]
  }
];

export function convert(value: number, fromId: string, toId: string, categoryId: UnitCategory): number {
  const category = CONVERSION_DATA.find(c => c.id === categoryId);
  if (!category) return 0;

  const fromUnit = category.units.find(u => u.id === fromId);
  const toUnit = category.units.find(u => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  // Special handling for temperature (using offsets)
  if (categoryId === 'temperature') {
    // Convert to base (Celsius)
    // Formula: (val - offset_from) / factor_from_base_to_unit ? 
    // Actually, usually defined as: Celsius = (F - 32) * 5/9
    // My definitions: F factor = 5/9, offset = -32.
    // Base = (Value + Offset) * Factor? No that's not quite right for generic linear.
    
    // Let's stick to standard formula:
    // Base = (Value + InputOffset) * InputFactor  <-- Wait, F to C is (F - 32) * 5/9.
    // So if InputOffset is -32 and InputFactor is 5/9...
    // (212 - 32) * 0.555 = 100. Correct.
    
    // Now Base to Target:
    // Target = (Base / OutputFactor) - OutputOffset
    // (100 / 0.555) - (-32) = 180 + 32 = 212. Correct.
    
    const baseValue = (value + (fromUnit.offset || 0)) * fromUnit.factor;
    return (baseValue / toUnit.factor) - (toUnit.offset || 0);
  }

  // Standard conversion
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}
