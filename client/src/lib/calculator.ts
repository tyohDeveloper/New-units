export interface DimensionalFormula {
  length?: number;
  mass?: number;
  time?: number;
  current?: number;
  temperature?: number;
  amount?: number;
  intensity?: number;
  angle?: number;
  solid_angle?: number;
}

export interface DerivedUnitInfo {
  symbol: string;
  category: string;
  unitId: string;
  dimensions: DimensionalFormula;
  allowPrefixes: boolean;
}

export interface CategoryDimensionInfo {
  name: string;
  dimensions: DimensionalFormula;
  isBase: boolean;
}

export const SI_DERIVED_UNITS: DerivedUnitInfo[] = [
  { symbol: 'N', category: 'force', unitId: 'n', dimensions: { mass: 1, length: 1, time: -2 }, allowPrefixes: true },
  { symbol: 'Pa', category: 'pressure', unitId: 'pa', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: true },
  { symbol: 'J', category: 'energy', unitId: 'j', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'W', category: 'power', unitId: 'w', dimensions: { mass: 1, length: 2, time: -3 }, allowPrefixes: true },
  { symbol: 'C', category: 'charge', unitId: 'c', dimensions: { current: 1, time: 1 }, allowPrefixes: true },
  { symbol: 'V', category: 'potential', unitId: 'v', dimensions: { mass: 1, length: 2, time: -3, current: -1 }, allowPrefixes: true },
  { symbol: 'F', category: 'capacitance', unitId: 'f', dimensions: { mass: -1, length: -2, time: 4, current: 2 }, allowPrefixes: true },
  { symbol: 'Ω', category: 'resistance', unitId: 'ohm', dimensions: { mass: 1, length: 2, time: -3, current: -2 }, allowPrefixes: true },
  { symbol: 'S', category: 'conductance', unitId: 's', dimensions: { mass: -1, length: -2, time: 3, current: 2 }, allowPrefixes: true },
  { symbol: 'Wb', category: 'magnetic_flux', unitId: 'wb', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'T', category: 'magnetic_density', unitId: 't', dimensions: { mass: 1, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'H', category: 'inductance', unitId: 'h', dimensions: { mass: 1, length: 2, time: -2, current: -2 }, allowPrefixes: true },
  { symbol: 'lm', category: 'luminous_flux', unitId: 'lm', dimensions: { intensity: 1, solid_angle: 1 }, allowPrefixes: true },
  { symbol: 'lx', category: 'illuminance', unitId: 'lx', dimensions: { intensity: 1, solid_angle: 1, length: -2 }, allowPrefixes: true },
  { symbol: 'Bq', category: 'radioactivity', unitId: 'bq', dimensions: { time: -1 }, allowPrefixes: true },
  { symbol: 'Gy', category: 'absorbed_dose', unitId: 'gy', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'Sv', category: 'equivalent_dose', unitId: 'sv', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'kat', category: 'catalytic', unitId: 'kat', dimensions: { amount: 1, time: -1 }, allowPrefixes: true },
  { symbol: 'rad', category: 'angle', unitId: 'rad', dimensions: { angle: 1 }, allowPrefixes: true },
  { symbol: 'sr', category: 'solid_angle', unitId: 'sr', dimensions: { solid_angle: 1 }, allowPrefixes: true },
];

export const CATEGORY_DIMENSIONS: Record<string, CategoryDimensionInfo> = {
  length: { name: 'Length', dimensions: { length: 1 }, isBase: true },
  mass: { name: 'Mass', dimensions: { mass: 1 }, isBase: true },
  time: { name: 'Time', dimensions: { time: 1 }, isBase: true },
  current: { name: 'Electric Current', dimensions: { current: 1 }, isBase: true },
  temperature: { name: 'Temperature', dimensions: { temperature: 1 }, isBase: true },
  amount: { name: 'Amount of Substance', dimensions: { amount: 1 }, isBase: true },
  intensity: { name: 'Luminous Intensity', dimensions: { intensity: 1 }, isBase: true },
  angle: { name: 'Plane Angle', dimensions: { angle: 1 }, isBase: true },
  solid_angle: { name: 'Solid Angle', dimensions: { solid_angle: 1 }, isBase: true },
  
  area: { name: 'Area', dimensions: { length: 2 }, isBase: false },
  volume: { name: 'Volume', dimensions: { length: 3 }, isBase: false },
  speed: { name: 'Speed', dimensions: { length: 1, time: -1 }, isBase: false },
  acceleration: { name: 'Acceleration', dimensions: { length: 1, time: -2 }, isBase: false },
  force: { name: 'Force', dimensions: { mass: 1, length: 1, time: -2 }, isBase: false },
  pressure: { name: 'Pressure', dimensions: { mass: 1, length: -1, time: -2 }, isBase: false },
  energy: { name: 'Energy', dimensions: { mass: 1, length: 2, time: -2 }, isBase: false },
  power: { name: 'Power', dimensions: { mass: 1, length: 2, time: -3 }, isBase: false },
  frequency: { name: 'Frequency', dimensions: { time: -1 }, isBase: false },
  momentum: { name: 'Momentum', dimensions: { mass: 1, length: 1, time: -1 }, isBase: false },
  angular_momentum: { name: 'Angular Momentum', dimensions: { mass: 1, length: 2, time: -1 }, isBase: false },
  angular_velocity: { name: 'Angular Velocity', dimensions: { angle: 1, time: -1 }, isBase: false },
  torque: { name: 'Torque', dimensions: { mass: 1, length: 2, time: -2 }, isBase: false },
  density: { name: 'Density', dimensions: { mass: 1, length: -3 }, isBase: false },
  flow: { name: 'Flow Rate', dimensions: { length: 3, time: -1 }, isBase: false },
  viscosity: { name: 'Viscosity', dimensions: { mass: 1, length: -1, time: -1 }, isBase: false },
  kinematic_viscosity: { name: 'Kinematic Viscosity', dimensions: { length: 2, time: -1 }, isBase: false },
  surface_tension: { name: 'Surface Tension', dimensions: { mass: 1, time: -2 }, isBase: false },
  
  thermal_conductivity: { name: 'Thermal Conductivity', dimensions: { mass: 1, length: 1, time: -3, temperature: -1 }, isBase: false },
  specific_heat: { name: 'Specific Heat', dimensions: { length: 2, time: -2, temperature: -1 }, isBase: false },
  entropy: { name: 'Entropy', dimensions: { mass: 1, length: 2, time: -2, temperature: -1 }, isBase: false },
  
  charge: { name: 'Electric Charge', dimensions: { current: 1, time: 1 }, isBase: false },
  potential: { name: 'Electric Potential', dimensions: { mass: 1, length: 2, time: -3, current: -1 }, isBase: false },
  capacitance: { name: 'Capacitance', dimensions: { mass: -1, length: -2, time: 4, current: 2 }, isBase: false },
  resistance: { name: 'Resistance', dimensions: { mass: 1, length: 2, time: -3, current: -2 }, isBase: false },
  conductance: { name: 'Conductance', dimensions: { mass: -1, length: -2, time: 3, current: 2 }, isBase: false },
  magnetic_flux: { name: 'Magnetic Flux', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, isBase: false },
  magnetic_density: { name: 'Magnetic Flux Density', dimensions: { mass: 1, time: -2, current: -1 }, isBase: false },
  inductance: { name: 'Inductance', dimensions: { mass: 1, length: 2, time: -2, current: -2 }, isBase: false },
  electric_field: { name: 'Electric Field', dimensions: { mass: 1, length: 1, time: -3, current: -1 }, isBase: false },
  magnetic_field_h: { name: 'Magnetic Field (H)', dimensions: { current: 1, length: -1 }, isBase: false },
  
  radioactivity: { name: 'Radioactivity', dimensions: { time: -1 }, isBase: false },
  radioactive_decay: { name: 'Radioactive Decay', dimensions: { time: -1 }, isBase: false },
  radiation_dose: { name: 'Radiation Dose', dimensions: { length: 2, time: -2 }, isBase: false },
  absorbed_dose: { name: 'Absorbed Dose', dimensions: { length: 2, time: -2 }, isBase: false },
  equivalent_dose: { name: 'Equivalent Dose', dimensions: { length: 2, time: -2 }, isBase: false },
  cross_section: { name: 'Cross-Section', dimensions: { length: 2 }, isBase: false },
  photon: { name: 'Photon Energy', dimensions: { mass: 1, length: 2, time: -2 }, isBase: false },
  
  luminous_flux: { name: 'Luminous Flux', dimensions: { intensity: 1, solid_angle: 1 }, isBase: false },
  illuminance: { name: 'Illuminance', dimensions: { intensity: 1, solid_angle: 1, length: -2 }, isBase: false },
  sound_pressure: { name: 'Sound Pressure', dimensions: { mass: 1, length: -1, time: -2 }, isBase: false },
  sound_intensity: { name: 'Sound Intensity', dimensions: { mass: 1, time: -3 }, isBase: false },
  acoustic_impedance: { name: 'Acoustic Impedance', dimensions: { mass: 1, length: -2, time: -1 }, isBase: false },
  refractive_power: { name: 'Refractive Power', dimensions: { length: -1 }, isBase: false },
  
  catalytic: { name: 'Catalytic Activity', dimensions: { amount: 1, time: -1 }, isBase: false },
  concentration: { name: 'Concentration', dimensions: { amount: 1, length: -3 }, isBase: false },
  
  fuel: { name: 'Fuel Energy', dimensions: { mass: 1, length: 2, time: -2 }, isBase: false },
  
  fuel_economy: { name: 'Fuel Economy', dimensions: { length: -2 }, isBase: false },
  lightbulb: { name: 'Lightbulb Efficiency', dimensions: { intensity: 1, solid_angle: 1 }, isBase: false },
  
  data: { name: 'Data/Information', dimensions: {}, isBase: false },
  math: { name: 'Math Functions', dimensions: {}, isBase: false },
};

export const dimensionsEqual = (d1: DimensionalFormula, d2: DimensionalFormula): boolean => {
  const keys1 = Object.keys(d1) as (keyof DimensionalFormula)[];
  const keys2 = Object.keys(d2) as (keyof DimensionalFormula)[];
  
  const nonZeroKeys1 = keys1.filter(k => d1[k] !== 0 && d1[k] !== undefined);
  const nonZeroKeys2 = keys2.filter(k => d2[k] !== 0 && d2[k] !== undefined);
  
  if (nonZeroKeys1.length !== nonZeroKeys2.length) return false;
  
  for (const key of nonZeroKeys1) {
    if ((d1[key] || 0) !== (d2[key] || 0)) return false;
  }
  
  return true;
};

export const isDimensionless = (d: DimensionalFormula): boolean => {
  return Object.keys(d).filter(k => d[k as keyof DimensionalFormula] !== 0).length === 0;
};

// Categories to exclude from cross-domain matching (archaic, specialty, other)
const EXCLUDED_CROSS_DOMAIN_CATEGORIES = [
  'archaic_length', 'archaic_mass', 'archaic_volume', 'archaic_area', 'archaic_energy', 'archaic_power',
  'typography', 'cooking', 'beer_wine_volume', 'fuel_economy', 'lightbulb', 'rack_geometry', 'shipping',
  'data', 'math'
];

export const findCrossDomainMatches = (
  dimensions: DimensionalFormula, 
  currentCategory?: string
): string[] => {
  const matches: string[] = [];
  
  if (isDimensionless(dimensions)) return matches;
  
  for (const [catId, info] of Object.entries(CATEGORY_DIMENSIONS)) {
    if (catId === currentCategory || info.isBase) continue;
    
    // Skip archaic, specialty, and other excluded categories
    if (EXCLUDED_CROSS_DOMAIN_CATEGORIES.includes(catId)) continue;
    
    if (isDimensionless(info.dimensions)) continue;
    
    if (dimensionsEqual(dimensions, info.dimensions)) {
      matches.push(info.name);
    }
  }
  
  return matches;
};

export const isValidSymbolRepresentation = (symbol: string): boolean => {
  if (!symbol || symbol === '1') return true;
  
  const baseUnitPatterns = ['kg', 'm', 's', 'A', 'K', 'mol', 'cd', 'rad', 'sr'];
  
  const parts = symbol.split('⋅');
  
  const extractBaseUnit = (part: string): string => {
    return part.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, '');
  };
  
  const baseUnitsFound: string[] = [];
  for (const part of parts) {
    const baseUnit = extractBaseUnit(part);
    if (baseUnitPatterns.includes(baseUnit)) {
      if (baseUnitsFound.includes(baseUnit)) {
        return false;
      }
      baseUnitsFound.push(baseUnit);
    }
  }
  
  return true;
};

export const countUnits = (symbol: string): number => {
  if (!symbol || symbol === '1') return 0;
  return symbol.split('⋅').length;
};

export const multiplyDimensions = (
  d1: DimensionalFormula, 
  d2: DimensionalFormula
): DimensionalFormula => {
  const result: DimensionalFormula = { ...d1 };
  for (const [dim, exp] of Object.entries(d2)) {
    const key = dim as keyof DimensionalFormula;
    result[key] = (result[key] || 0) + (exp || 0);
    if (result[key] === 0) delete result[key];
  }
  return result;
};

export const divideDimensions = (
  d1: DimensionalFormula, 
  d2: DimensionalFormula
): DimensionalFormula => {
  const result: DimensionalFormula = { ...d1 };
  for (const [dim, exp] of Object.entries(d2)) {
    const key = dim as keyof DimensionalFormula;
    result[key] = (result[key] || 0) - (exp || 0);
    if (result[key] === 0) delete result[key];
  }
  return result;
};

export const formatDimensions = (dims: DimensionalFormula): string => {
  const superscripts: Record<string, string> = {
    '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  
  const toSuperscript = (n: number): string => {
    return n.toString().split('').map(c => superscripts[c] || c).join('');
  };
  
  const baseSymbols: Record<string, string> = {
    length: 'm',
    mass: 'kg',
    time: 's',
    current: 'A',
    temperature: 'K',
    amount: 'mol',
    intensity: 'cd',
    angle: 'rad',
    solid_angle: 'sr'
  };
  
  const order: (keyof DimensionalFormula)[] = [
    'mass', 'length', 'time', 'current', 'temperature', 'amount', 'intensity', 'angle', 'solid_angle'
  ];
  
  const positive: string[] = [];
  const negative: string[] = [];
  
  for (const dim of order) {
    const exp = dims[dim];
    if (exp && exp !== 0) {
      const symbol = baseSymbols[dim];
      const part = exp === 1 ? symbol : `${symbol}${toSuperscript(exp)}`;
      if (exp > 0) {
        positive.push(part);
      } else {
        negative.push(part);
      }
    }
  }
  
  return [...positive, ...negative].join('⋅');
};
