import { sum } from "./helpers";

describe("index", () => {
  test("smoke test", () => {
    expect(true).toEqual(true);
  });
});

describe("helpers", () => {
  test("sum", () => {
    expect(sum([])).toEqual(0);
    expect(sum([1, 2, 3, 4, 5])).toEqual(15);
  });
});
