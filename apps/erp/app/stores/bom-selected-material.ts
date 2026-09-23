import { atom } from "nanostores";

// One-shot "open this material" command from the left BoMExplorer tree to the
// right BillOfMaterial card list, so clicking a leaf material node (which has no
// sub-method to drill into, hence no route change) still expands/highlights its
// card on the same page — mirrors $bomVariantFilter's cross-panel wiring.
//
// It is a command channel, not persistent state: BillOfMaterial applies the id
// and immediately resets it back to null. That way clicking the SAME node again
// (e.g. after collapsing the card) re-fires, since nanostores only notify on a
// changed value. null = no pending command.
export const $bomSelectedMaterialId = atom<string | null>(null);
