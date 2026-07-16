import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Switch,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useFetcher } from "react-router";
import type { AuthenticatedRouteGroup } from "~/types";

/**
 * Toggles that show/hide each nav sub-item of a module (persisted to
 * companySettings.hiddenSubmodules). `groups` should come from the module's
 * submodule hook with { includeHidden: true } so hidden items still appear here.
 */
export function SubmoduleVisibility({
  groups,
  hidden
}: {
  groups: AuthenticatedRouteGroup[];
  hidden: string[];
}) {
  const fetcher = useFetcher();

  const optimistic = fetcher.formData?.get("hiddenSubmodules");
  const current: string[] =
    typeof optimistic === "string" ? JSON.parse(optimistic) : hidden;

  const toggle = (to: string, show: boolean) => {
    const next = show
      ? current.filter((x) => x !== to)
      : Array.from(new Set([...current, to]));
    fetcher.submit(
      { intent: "hiddenSubmodules", hiddenSubmodules: JSON.stringify(next) },
      { method: "post" }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Trans>Navigation</Trans>
        </CardTitle>
        <CardDescription>
          <Trans>Show or hide items in this module's sidebar.</Trans>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VStack spacing={4} className="max-w-[420px]">
          {groups.map((group) => (
            <VStack key={group.name} spacing={1} className="w-full">
              <span className="text-xxs uppercase text-muted-foreground tracking-wide font-light">
                {group.name}
              </span>
              {group.routes.map((route) => (
                <HStack
                  key={route.to}
                  className="justify-between w-full py-1.5 border-b border-border last:border-0"
                >
                  <HStack spacing={2} className="min-w-0">
                    <span className="text-muted-foreground">{route.icon}</span>
                    <span className="text-sm truncate">{route.name}</span>
                  </HStack>
                  <Switch
                    checked={!current.includes(route.to)}
                    onCheckedChange={(checked) => toggle(route.to, checked)}
                  />
                </HStack>
              ))}
            </VStack>
          ))}
        </VStack>
      </CardContent>
    </Card>
  );
}
