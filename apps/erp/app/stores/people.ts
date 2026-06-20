import { atom } from "nanostores";
import { useMemo } from "react";
import { useFormatPersonName, useNanoStore } from "~/hooks";
import type { ListItem } from "~/types";

export type PersonListItem = ListItem & {
  avatarUrl: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

const $peopleStore = atom<PersonListItem[]>([]);

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
