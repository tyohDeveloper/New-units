export interface PreferredRepresentation {
  displaySymbol: string;
  isSI: boolean;
  allowPrefixes: boolean;
}

export const PREFERRED_REPRESENTATIONS: Record<string, PreferredRepresentation> = {
  'length:2,time:-1': { displaySymbol: 'St', isSI: false, allowPrefixes: true },
  'length:2,mass:1,time:-1': { displaySymbol: 'J⋅s', isSI: true, allowPrefixes: true },
  'length:2,time:-2': { displaySymbol: 'Gy', isSI: true, allowPrefixes: true },
  'length:-2,mass:1,time:-1': { displaySymbol: 'Pa⋅s⋅m⁻¹', isSI: true, allowPrefixes: true },
  'mass:1,time:-3': { displaySymbol: 'W⋅m⁻²', isSI: true, allowPrefixes: true },
};
