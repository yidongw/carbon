type StyleNavigationOptions = {
  itemTrackingType: string | null | undefined;
};

export function getStyleNavigationKeys({
  itemTrackingType
}: StyleNavigationOptions) {
  const sharedKeys = ["details", "accounting"] as const;
  const inventoryKeys =
    itemTrackingType === "Non-Inventory"
      ? ([] as const)
      : (["planning", "inventory"] as const);

  return [...sharedKeys, ...inventoryKeys, "sales"] as const;
}
