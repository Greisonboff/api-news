import { describe, expect, it } from "vitest";
import { sample } from "../src/utils/sample";

describe("sample", () => {
  const items = Array.from({ length: 20 }, (_, i) => i);

  it("retorna `count` itens distintos do array original", () => {
    const result = sample(items, 5);
    expect(result).toHaveLength(5);
    expect(new Set(result).size).toBe(5);
    result.forEach((item) => expect(items).toContain(item));
  });

  it("retorna todos quando `count` é maior que o array", () => {
    expect(sample([1, 2, 3], 10).sort()).toEqual([1, 2, 3]);
  });

  it("não altera o array original", () => {
    const copy = [...items];
    sample(items, 10);
    expect(items).toEqual(copy);
  });

  it("varia entre chamadas", () => {
    const results = new Set(
      Array.from({ length: 20 }, () => sample(items, 3).join(",")),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});
