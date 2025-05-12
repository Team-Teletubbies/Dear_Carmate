export type Segment = 'cars' | 'customers' | 'users';

export const getLastPathSegment = (path: string): Segment => {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (last === 'cars' || last === 'customers' || last === 'users') {
    return last;
  }
  throw new Error(`Invalid path segment: ${last}`);
};
