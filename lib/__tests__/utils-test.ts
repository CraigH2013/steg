import { uniqueCharsOf, hexOf, charToHex, hexToChar } from "../utils";

describe("uniqueCharsOf", () => {
  it("is case sensitive", () => {
    expect(uniqueCharsOf("Aa")).toEqual(["A", "a"]);
    expect(uniqueCharsOf("Aa")).not.toEqual(["A"]);
  });

  it("keeps order of characters", () => {
    expect(uniqueCharsOf("Aa")).not.toEqual(["a", "A"]);
  });

  it("handles whitespace correctly", () => {
    expect(uniqueCharsOf("a a  a   a    a")).toEqual(["a", " "]);
  });

  it("works for special characters", () => {
    expect(uniqueCharsOf("\tA\nB")).toEqual(["\t", "A", "\n", "B"]);
  });
});

describe("hexOf", () => {
  it("has correct length", () => {
    expect(hexOf(0, false)).toBe("00");
    expect(hexOf(0, false, 1)).toBe("0");
    expect(hexOf(255, false)).toBe("ff");
    expect(hexOf(255, false, 1)).toBe("ff");
    expect(hexOf(255, false, 0)).toBe("ff");
  });

  it("works for strings", () => {
    expect(hexOf("23")).toBe("0x17");
    expect(hexOf("0b10111")).toBe("0x17");
    expect(hexOf("0o27")).toBe("0x17");
    expect(hexOf("0x17")).toBe("0x17");
  });

  it("handles bad values", () => {
    expect(() => hexOf("abc")).toThrow("`value` must be a number");
    expect(() => hexOf(3.14)).toThrow("`value` must be an integer");
    expect(() => hexOf("3.14")).toThrow("`value` must be an integer");
  });
});

describe("hexToChar", () => {
  it("works for string values without 0x prefix", () => {
    expect(hexToChar("61")).toBe("a");
    expect(hexToChar("61")).not.toBe("=");
  });

  it("works for string values with prefix", () => {
    expect(hexToChar("0x61")).toBe("a");
  });

  it("works for number values", () => {
    expect(hexToChar(0x61)).toBe("a");
    expect(hexToChar(61)).toBe("=");
  });
});

describe("charToHex", () => {
  it("uses prefix and length correctly", () => {
    expect(charToHex("a")).toBe("0x61");
    expect(charToHex("a", true, 4)).toBe("0x0061");
    expect(charToHex("a", false, 4)).toBe("0061");
    expect(charToHex("a", false)).toBe("61");
  });
});
