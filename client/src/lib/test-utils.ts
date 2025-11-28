type TestIdProps = { 'data-testid'?: string };

export const testId = (id: string): TestIdProps => {
  if (import.meta.env.DEV) {
    return { 'data-testid': id };
  }
  return {};
};

export const devOnly = <T>(value: T): T | undefined => {
  if (import.meta.env.DEV) {
    return value;
  }
  return undefined;
};
