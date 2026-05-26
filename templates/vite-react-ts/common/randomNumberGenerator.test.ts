import { randomNumberGenerator } from ".";

describe("randomNumberGenerator", () => {
  it("returns deterministic sequence for same seed", () => {
    const rng1 = randomNumberGenerator("seed123");
    const rng2 = randomNumberGenerator("seed123");
    const values1 = [rng1(), rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2(), rng2()];
    expect(values1).toEqual(values2);
  });

  it("returns different sequences for different seeds", () => {
    const rng1 = randomNumberGenerator("seedA");
    const rng2 = randomNumberGenerator("seedB");
    const values1 = [rng1(), rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2(), rng2()];
    expect(values1).not.toEqual(values2);
  });

  it("returns values in [0, 1)", () => {
    const rng = randomNumberGenerator("test");
    for (let i = 0; i < 10; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("seed 123 starts with 0.2640513968653977", () => {
    const rng = randomNumberGenerator("123");
    const v = rng();
    expect(v).toBeCloseTo(0.2640513968653977);
  });
});
