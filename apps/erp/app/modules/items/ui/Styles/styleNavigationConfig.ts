type StyleNavigationOptions = {
  itemTrackingType: string | null | undefined;
  replenishmentSystem: string | null | undefined;
};

export function getStyleNavigationKeys({
  itemTrackingType,
  replenishmentSystem
}: StyleNavigationOptions) {
  // Purchasing is only relevant when the style is bought from a supplier. A
  // "Make" style is produced in-house, so — like Parts — it hides Purchasing.
  const purchasingKeys =
    replenishmentSystem === "Make" ? ([] as const) : (["purchasing"] as const);
  const inventoryKeys =
    itemTrackingType === "Non-Inventory"
      ? ([] as const)
      : (["planning", "inventory"] as const);

  return [
    "details",
    ...purchasingKeys,
    "accounting",
    ...inventoryKeys,
    "sales"
  ] as const;
}
