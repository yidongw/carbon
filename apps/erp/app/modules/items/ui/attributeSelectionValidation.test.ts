import { describe, expect, it } from "vitest";
import { attributeSelectionFieldErrors } from "./attributeSelectionValidation";

function formDataWith(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) fd.append(key, value);
  return fd;
}

describe("attributeSelectionFieldErrors", () => {
  const MSG = "Select at least one value for this attribute.";

  it("returns no errors when no set is chosen (the set is optional)", () => {
    const errors = attributeSelectionFieldErrors(new FormData(), {
      requiredAttributeIds: [],
      setChosen: false
    });
    expect(errors).toEqual({});
  });

  it("does not require a set even when attributes could apply", () => {
    // A set is available but the user left it unchosen — allowed.
    const errors = attributeSelectionFieldErrors(new FormData(), {
      requiredAttributeIds: ["attr_1"],
      setChosen: false
    });
    expect(errors).toEqual({});
  });

  it("flags only the attribute missing a value once a set is chosen", () => {
    const errors = attributeSelectionFieldErrors(
      formDataWith({ "av__attr_1[0]": "v1" }),
      {
        requiredAttributeIds: ["attr_1", "attr_2"],
        setChosen: true
      }
    );
    expect(errors.av__attr_1).toBeUndefined();
    expect(errors.av__attr_2).toBe(MSG);
  });

  it("returns no errors when every attribute has a value", () => {
    const errors = attributeSelectionFieldErrors(
      formDataWith({ "av__attr_1[0]": "v1", "av__attr_2[0]": "v2" }),
      {
        requiredAttributeIds: ["attr_1", "attr_2"],
        setChosen: true
      }
    );
    expect(errors).toEqual({});
  });

  it("treats an empty-string value as missing", () => {
    const errors = attributeSelectionFieldErrors(
      formDataWith({ "av__attr_1[0]": "" }),
      {
        requiredAttributeIds: ["attr_1"],
        setChosen: true
      }
    );
    expect(errors.av__attr_1).toBe(MSG);
  });
});
