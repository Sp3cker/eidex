import { describe, expect, test } from "vitest";
import { partitionIndices, indicesOfTruthy, indicesOfFalsey, partitionValues, findDupesAndUniques } from "../lib/utils";

describe("partitionIndices", () => {
  test("partitions using Boolean by default", () => {
    const arr = [0, 1, null, "a", "", false, true] as const;
    const [truthy, falsey] = partitionIndices(arr);
    expect(truthy).toEqual([1, 3, 6]);
    expect(falsey).toEqual([0, 2, 4, 5]);
  });

  test("supports a custom predicate", () => {
    const arr = [{ v: 1 }, { v: 0 }, { v: 2 }];
    const [truthy, falsey] = partitionIndices(arr, (x) => x.v > 0);
    expect(truthy).toEqual([0, 2]);
    expect(falsey).toEqual([1]);
  });

  test("indicesOfTruthy and indicesOfFalsey helpers", () => {
    const arr = [false, true, "", "text", 0, 42];
    expect(indicesOfTruthy(arr)).toEqual([1, 3, 5]);
    expect(indicesOfFalsey(arr)).toEqual([0, 2, 4]);
  });
});

describe("partitionValues", () => {
  test("partitions values using Boolean by default", () => {
    const arr = [0, 1, null, "a", "", false, true] as const;
    const [truthy, falsey] = partitionValues(arr);
    expect(truthy).toEqual([1, "a", true]);
    expect(falsey).toEqual([0, null, "", false]);
  });

  test("supports a custom predicate", () => {
    const arr = [{ v: 1 }, { v: 0 }, { v: 2 }];
    const [truthy, falsey] = partitionValues(arr, (x) => x.v > 0);
    expect(truthy).toEqual([{ v: 1 }, { v: 2 }]);
    expect(falsey).toEqual([{ v: 0 }]);
  });
});

describe("findDupesAndUniques", () => {
  test("finds duplicates and uniques in second array", () => {
    const [dupes, uniques] = findDupesAndUniques([1, 2, 3], [2, 3, 4]);
    expect(dupes).toEqual([2, 3]);
    expect(uniques).toEqual([4]);
  });

  test("finds duplicates and uniques with objects using key function", () => {
    const arrA = [{ id: 1, name: "a" }, { id: 2, name: "b" }];
    const arrB = [{ id: 2, name: "B" }, { id: 3, name: "c" }];
    const [dupes, uniques] = findDupesAndUniques(arrA, arrB, x => x.id);
    expect(dupes).toEqual([{ id: 2, name: "B" }]);
    expect(uniques).toEqual([{ id: 3, name: "c" }]);
  });

  test("handles no duplicates", () => {
    const [dupes, uniques] = findDupesAndUniques([1, 2], [3, 4]);
    expect(dupes).toEqual([]);
    expect(uniques).toEqual([3, 4]);
  });

  test("handles all duplicates", () => {
    const [dupes, uniques] = findDupesAndUniques([1, 2], [1, 2]);
    expect(dupes).toEqual([1, 2]);
    expect(uniques).toEqual([]);
  });

  test("handles empty first array", () => {
    const [dupes, uniques] = findDupesAndUniques([], [1, 2]);
    expect(dupes).toEqual([]);
    expect(uniques).toEqual([1, 2]);
  });

  test("handles empty second array", () => {
    const [dupes, uniques] = findDupesAndUniques([1, 2], []);
    expect(dupes).toEqual([]);
    expect(uniques).toEqual([]);
  });
});
