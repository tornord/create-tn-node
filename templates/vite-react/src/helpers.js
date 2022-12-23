const { round } = Math;
export const round2 = (x) => round(x * 100) / 100;

/**
 * Replica of d3 scaleLinear
 * https://www.npmjs.com/package/d3-scale
 * @param {number[] | null} domain array of length 2, [start, end]
 * @param {number[] | null} range array of length 2, [start, end]
 * @returns {(x: number) => number}
 */
export function scaleLinear(domain, range) {
  const res = (x) => {
    const t = (x - res._domain[0]) / (res._domain[1] - res._domain[0]);
    return (1 - t) * res._range[0] + t * res._range[1];
  };
  res._domain = domain;
  res._range = range;
  res.domain = (xs) => {
    res._domain = xs.slice();
    return res;
  };
  res.range = (xs) => {
    res._range = xs.slice();
    return res;
  };
  res.invert = (x) => {
    const t = (x - res._range[0]) / (res._range[1] - res._range[0]);
    return (1 - t) * res._domain[0] + t * res._domain[1];
  };
  return res;
}
