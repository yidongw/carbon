/**
 * Shared client-side completeness check for the attribute-set create fields.
 *
 * The attribute set itself is optional — an item can be created without one.
 * But once a set is chosen, every attribute of that set must carry a value (the
 * selection freezes right after creation, so it could never be completed later).
 * Registered as an additional validator on the create forms so those values
 * behave like ordinary required fields: submitting an incomplete set yields an
 * inline error on the offending field and blocks the submit, matching the rest
 * of the form. The field keys returned here match the rendered field names
 * (`av__<attributeId>`), and the value check mirrors
 * parseAttributeValueSelectionsFromFormData.
 */
export type AttributeSelectionState = {
  /** Attribute ids of the currently selected set that each need a value. */
  requiredAttributeIds: string[];
  /** Whether a set is currently chosen (no set chosen = nothing required). */
  setChosen: boolean;
};

/**
 * Raw (English) message keyed into `validationErrorMessages`, so the field's
 * `formatError` renders it translated — same as any other validator string.
 */
export const ATTRIBUTE_VALUE_REQUIRED =
  "Select at least one value for this attribute.";

export function attributeSelectionFieldErrors(
  formData: FormData,
  state: AttributeSelectionState
): Record<string, string | undefined> {
  const errors: Record<string, string | undefined> = {};

  // The set is optional; only require values once a set has been chosen.
  if (!state.setChosen) return errors;

  for (const attributeId of state.requiredAttributeIds) {
    const prefix = `av__${attributeId}[`;
    let hasValue = false;
    for (const [key, value] of formData.entries()) {
      if (key.startsWith(prefix) && typeof value === "string" && value) {
        hasValue = true;
        break;
      }
    }
    if (!hasValue) {
      errors[`av__${attributeId}`] = ATTRIBUTE_VALUE_REQUIRED;
    }
  }

  return errors;
}
