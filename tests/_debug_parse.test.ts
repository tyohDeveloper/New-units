import { describe, it } from 'vitest';
import { parseUnitText } from '../client/src/lib/conversion-data';
describe('debug', () => {
  it('234J', () => {
    const r = parseUnitText('234J');
    console.log('234J ->', JSON.stringify({ categoryId: r.categoryId, unitId: r.unitId, originalValue: r.originalValue }));
  });
  it('456 m²·kg·s⁻²', () => {
    const r = parseUnitText('456 m²·kg·s⁻²');
    console.log('m²·kg·s⁻² ->', JSON.stringify({ categoryId: r.categoryId, unitId: r.unitId, originalValue: r.originalValue, dimensions: r.dimensions }));
  });
});
