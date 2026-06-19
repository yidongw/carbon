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

async function persistPeopleToIdb(people: PersonListItem[]) {
  const idb = (await import("localforage")).default;
  await idb.setItem("people", people);
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
