export const applyRegionalSpelling = (unitName: string, language: string): string => {
  if (language !== 'en' && language !== 'en-us') return unitName;

  if (language === 'en-us') {
    return unitName
      .replace(/\s*\(Petrol\)/g, '')
      .replace(/\s*\(Paraffin\)/g, '');
  }

  return unitName
    .replace(/Gasoline\s*\(Petrol\)/g, 'Petrol')
    .replace(/Kerosene\s*\(Paraffin\)/g, 'Paraffin')
    .replace(/Gasoline/g, 'Petrol')
    .replace(/Kerosene/g, 'Paraffin')
    .replace(/Meter/g, 'Metre')
    .replace(/meter/g, 'metre')
    .replace(/Liter/g, 'Litre')
    .replace(/liter/g, 'litre');
};
