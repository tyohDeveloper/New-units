export type UnitCategory =
  | "length"
  | "mass"
  | "time"
  | "current"
  | "temperature"
  | "amount"
  | "intensity"
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
  | "angular_momentum"
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
  | "archaic_power"
  | "typography"
  | "cooking";

export interface Prefix {
  id: string;
  name: string;
  symbol: string;
  factor: number;
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number;
  offset?: number;
  description?: string;
  allowPrefixes?: boolean;
  mathFunction?: 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'sqrt' | 'cbrt' | 'root4' | 'log10' | 'log2' | 'ln' | 'exp' | 'abs' | 'sinh' | 'cosh' | 'tanh' | 'asinh' | 'acosh' | 'atanh' | 'floor' | 'ceil' | 'round' | 'trunc' | 'sign' | 'square' | 'cube' | 'pow4';
  isInverse?: boolean;
}

export interface CategoryDefinition {
  id: UnitCategory;
  name: string;
  baseUnit: string;
  baseSISymbol?: string;
  units: UnitDefinition[];
}
