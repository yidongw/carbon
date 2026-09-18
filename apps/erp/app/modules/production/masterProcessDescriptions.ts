/**
 * Style BOP descriptions first (method order), then any extra descriptions that
 * only exist on master/bundle job ops (e.g. nested prep). Shared by list count
 * and the processes overlay so they stay aligned.
 */
export function mergeMasterProcessDescriptions(
  styleDescriptions: readonly string[],
  jobDescriptions: readonly string[]
): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const raw of [...styleDescriptions, ...jobDescriptions]) {
    const description = raw || "—";
    if (seen.has(description)) continue;
    seen.add(description);
    order.push(description);
  }
  return order;
}
