import { scaleLinear } from "./scaleLinear";

test("scaleLinear", () => {
  const s1 = scaleLinear([0, 1], [0, 1]);
  expect(s1(0)).toBe(0);
  expect(s1(1)).toBe(1);

  const s2 = scaleLinear([0, 1], [100, 300]);
  expect(s2(0.25)).toBe(150);
  expect(s2(0.75)).toBe(250);

  const s3 = scaleLinear([10, 0], [100, 300]);
  expect(s3(2.5)).toBe(250);
  expect(s3(7.5)).toBe(150);

  const s4 = scaleLinear([10, 0], [100, 300]);
  expect(s4(12.5)).toBe(50);

  const s5 = scaleLinear().domain([10, 0]).range([100, 300]);
  expect(s5(5)).toBe(200);

  const s6 = scaleLinear();
  expect(() => s6(0)).toThrow(TypeError);

  const s7 = scaleLinear().domain([10, 130]).range([0, 960]);
  expect(s7(20)).toBe(80);
  expect(s7(50)).toBe(320);
});
