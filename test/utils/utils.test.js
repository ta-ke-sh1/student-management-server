const Utils = require("../../utils/utils.js");

const utils = new Utils();

describe("isNonEmptyObject", () => {
  it("Return false for an empty object", async () => {
    const obj = {};
    const result = await utils.isNonEmptyObject(obj);
    expect(result).toBe(false);
  });

  it("Return true for an object with empty string value", async () => {
    const obj = { key: "" };
    const result = await utils.isNonEmptyObject(obj);
    expect(result).toBe(true);
  });

  it("Return true for an object with undefined value", async () => {
    const obj = { key: undefined };
    const result = await utils.isNonEmptyObject(obj);
    expect(result).toBe(true);
  });

  it("Return false for an object with non-empty string value", async () => {
    const obj = { key: "value" };
    const result = await utils.isNonEmptyObject(obj);
    expect(result).toBe(false);
  });

  it("Return false for an object with non-undefined value", async () => {
    const obj = { key: "value", anotherKey: 123 };
    const result = await utils.isNonEmptyObject(obj);
    expect(result).toBe(false);
  });
});
