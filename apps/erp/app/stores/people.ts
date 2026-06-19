import type { Database } from "@carbon/database";
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
  "id, name, firstName, lastName, avatarUrl" as const;

const $peopleStore = atom<PersonListItem[]>([]);

function sortPeople(people: PersonListItem[]) {
  return [...people].sort((a, b) => a.name.localeCompare(b.name));
}

export function upsertPersonInPeopleStore(person: PersonListItem) {
  const current = $peopleStore.get();
  const next = current.some((entry) => entry.id === person.id)
    ? current.map((entry) =>
        entry.id === person.id ? { ...entry, ...person } : entry
      )
    : [...current, person];
  $peopleStore.set(sortPeople(next));
}

export async function fetchEmployeeForPeopleStore(
  carbon: SupabaseClient<Database>,
  companyId: string,
  employeeId: string
) {
  const retryDelaysMs = [0, 200, 500, 1000, 2000];

  for (const delayMs of retryDelaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const { data, error } = await carbon
      .from("employees")
      .select(PERSON_SELECT)
      .eq("id", employeeId)
      .eq("companyId", companyId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load employee for people store:", error);
      continue;
    }

    if (data) {
      return data;
    }
  }

  return null;
}

export function waitForPersonInStore(userId: string, timeoutMs = 8000) {
  return new Promise<boolean>((resolve) => {
    if ($peopleStore.get().some((person) => person.id === userId)) {
      resolve(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = $peopleStore.listen((people) => {
      if (people.some((person) => person.id === userId)) {
        unsubscribe();
        clearTimeout(timer);
        resolve(true);
      }
    });

    timer = setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, timeoutMs);
  });
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
