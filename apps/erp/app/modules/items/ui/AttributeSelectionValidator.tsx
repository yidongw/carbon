import { useAdditionalValidatorsContext } from "@carbon/form";
import { useEffect, useRef } from "react";
import {
  type AttributeSelectionState,
  attributeSelectionFieldErrors
} from "./attributeSelectionValidation";

type AttributeSelectionValidatorProps = AttributeSelectionState & {
  /** Unique id for this form's registration (forms may render only one). */
  id: string;
};

/**
 * Registers a submit-time validator so the attribute set + its per-attribute
 * values behave like ordinary required fields (inline error on the offending
 * field, blocks submit). Must render **inside** the `ValidatedForm` so the
 * additional-validators context is available. Renders nothing. The English error
 * string it returns is translated at render time by the field's `formatError`
 * (via validationErrorMessages).
 */
const AttributeSelectionValidator = ({
  id,
  requiredAttributeIds,
  setChosen
}: AttributeSelectionValidatorProps) => {
  const additionalValidators = useAdditionalValidatorsContext();

  // Keep the registered function reading the latest selection without churning
  // the register/unregister effect on every change.
  const stateRef = useRef<AttributeSelectionState>({
    requiredAttributeIds,
    setChosen
  });
  stateRef.current = { requiredAttributeIds, setChosen };

  useEffect(() => {
    if (!additionalValidators) return;
    additionalValidators.register(id, (formData) =>
      attributeSelectionFieldErrors(formData, stateRef.current)
    );
    return () => additionalValidators.unregister(id);
  }, [additionalValidators, id]);

  return null;
};

AttributeSelectionValidator.displayName = "AttributeSelectionValidator";

export default AttributeSelectionValidator;
