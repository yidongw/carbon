import { atom } from "nanostores";

// Active per-color "Apply on Variants" filter, shared between the BOM list
// editor (BillOfMaterial) and the left BoMExplorer so a color tab drives both.
// null = 全部 (all variants); otherwise an itemAttributeValue id.
export const $bomVariantFilter = atom<string | null>(null);
