export const fixPrecision = (num: number): number => {
  if (num === 0) return 0;
  if (!isFinite(num)) return num;
  return parseFloat(num.toPrecision(17));
};
