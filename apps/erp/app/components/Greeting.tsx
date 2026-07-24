import { Heading, useInterval } from "@carbon/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useLingui } from "@lingui/react/macro";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "~/hooks";

export function Greeting(props: ComponentProps<typeof Heading>) {
  const { t } = useLingui();
  const user = useUser();
  const [currentTime, setCurrentTime] = useState(() => now(getLocalTimeZone()));

  // The server renders in its own (UTC) timezone, so the greeting's hour bucket
  // can differ from the client's local time and break hydration. Suppress the
  // warning on the text node (below) and re-read the clock once mounted so the
  // greeting settles to the client's timezone.
  useEffect(() => {
    setCurrentTime(now(getLocalTimeZone()));
  }, []);

  useInterval(
    () => {
      setCurrentTime(now(getLocalTimeZone()));
    },
    60 * 60 * 1000
  );

  const greeting = useMemo(() => {
    if (currentTime.hour >= 3 && currentTime.hour < 12) {
      return t`Good morning, ${user.firstName}`;
    } else if (currentTime.hour >= 12 && currentTime.hour < 18) {
      return t`Good afternoon, ${user.firstName}`;
    } else {
      return t`Good evening, ${user.firstName}`;
    }
  }, [currentTime.hour, t, user.firstName]);

  return (
    <Heading size="h3" suppressHydrationWarning {...props}>
      {greeting}
    </Heading>
  );
}
