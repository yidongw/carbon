/**
 * Strip FormData-only fields and coerce empty strings to null before
 * PostgREST SO/PO line writes. Empty strings blow up optional UUID/date FKs.
 */
export function sanitizeOrderLineWriteRow(
  row: Record<string, unknown>
): Record<string, unknown> {
  const {
    variantQuantities: _variantQuantities,
    serviceId: _serviceId,
    ...rest
  } = row;
  return Object.fromEntries(
    Object.entries(rest).map(([key, value]) => [
      key,
      value === "" ? null : value
    ])
  );
}
