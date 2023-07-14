const { round } = Math;
export const round2 = (x: number) => round(x * 100) / 100;

/**
 * Replica of d3 scaleLinear
 * https://www.npmjs.com/package/d3-scale
 */
export function scaleLinear(domain: number[] = [0, 1], range: number[] = [0, 1]): (x: number) => number {
  const res = (x: number) => {
    const t = (x - res._domain[0]) / (res._domain[1] - res._domain[0]);
    return (1 - t) * res._range[0] + t * res._range[1];
  };
  res._domain = domain;
  res._range = range;
  res.domain = (xs: number[]) => {
    res._domain = xs.slice();
    return res;
  };
  res.range = (xs: number[]) => {
    res._range = xs.slice();
    return res;
  };
  res.invert = (x: number) => {
    const t = (x - res._range[0]) / (res._range[1] - res._range[0]);
    return (1 - t) * res._domain[0] + t * res._domain[1];
  };
  return res;
}
