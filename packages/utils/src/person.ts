export type PersonNameParts = {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
};

export function formatPersonName(
  person: PersonNameParts,
  lastNameFirst = false
): string {
  const firstName = person.firstName?.trim() ?? "";
  const lastName = person.lastName?.trim() ?? "";

  if (firstName || lastName) {
    const parts = lastNameFirst
      ? [lastName, firstName]
      : [firstName, lastName];
    return parts.filter(Boolean).join(" ");
  }

  return person.fullName?.trim() ?? "";
}
