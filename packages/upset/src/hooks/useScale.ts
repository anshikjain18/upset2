import { useMemo } from 'react';
import { scaleLinear } from 'd3';

export function useScale(domain: [number, number], range: [number, number]) {
  return useMemo(
    () => scaleLinear().domain(domain).range(range),
    [domain, range],
  );
}
