import type { Database } from "@carbon/database";
import { fetchAllFromTable } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { atom } from "nanostores";
import { useMemo } from "react";
import { useFormatPersonName, useNanoStore } from "~/hooks";
import type { ListItem } from "~/types";

export type PersonListItem = ListItem & {
  avatarUrl: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

const PERSON_SELECT =
  "id, name, firstName, lastName, email, avatarUrl" as const;

const $peopleStore = atom<PersonListItem[]>([]);

function sortPeople(people: PersonListItem[]) {
  return [...people].sort((a, b) => a.name.localeCompare(b.name));
}

async function persistPeopleToIdb(people: PersonListItem[]) {
  const idb = (await import("localforage")).default;
  await idb.setItem("people", people);
}

function upsertPersonInStore(person: PersonListItem) {
  const current = $peopleStore.get();
  const next = current.some((entry) => entry.id === person.id)
    ? current.map((entry) => (entry.id === person.id ? { ...entry, ...person } : entry))
    : [...current, person];
  const sorted = sortPeople(next);
  $peopleStore.set(sorted);
  return sorted;
}

export async function refetchPeople(
  carbon: SupabaseClient<Database>,
  companyId: string
) {
  const { data, error } = await fetchAllFromTable<PersonListItem>(
    carbon,
    "employees",
    PERSON_SELECT,
    (query) => query.eq("companyId", companyId).order("name")
  );

  if (error || !data) {
    console.error("Failed to refetch people:", error);
    return;
  }

  $peopleStore.set(data);
  await persistPeopleToIdb(data);
}

export async function ensurePersonInStore(
  carbon: SupabaseClient<Database>,
  companyId: string,
  userId: string
) {
  const retryDelaysMs = [0, 200, 500];

  for (const delayMs of retryDelaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const { data, error } = await carbon
      .from("employees")
      .select(PERSON_SELECT)
      .eq("id", userId)
      .eq("companyId", companyId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch employee for people store:", error);
      continue;
    }

    if (data) {
      const sorted = upsertPersonInStore(data);
      await persistPeopleToIdb(sorted);
      return true;
    }
  }

  await refetchPeople(carbon, companyId);
  return false;
}

export const usePeople = () => {
  const [people, setPeople] = useNanoStore($peopleStore, "people");
  const formatPersonName = useFormatPersonName();

  const formattedPeople = useMemo(
    () =>
      people.map((person) => ({
        ...person,
        name:
          formatPersonName({
            firstName: person.firstName,
            lastName: person.lastName,
            fullName: person.name
          }) || person.name
      })),
    [people, formatPersonName]
  );

  return [formattedPeople, setPeople] as const;
};
