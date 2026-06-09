import { cn } from "@carbon/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import { Greeting } from "~/components/Greeting";
import { useModules } from "~/hooks";
import type { Authenticated, NavItem } from "~/types";

export default function AppIndexRoute() {
  const modules = useModules();
  const { locale } = useLocale();
  const date = new Date();

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeZone: getLocalTimeZone()
      }),
    [locale]
  );
  return (
    <div className="p-8 w-full h-full bg-muted">
      <Greeting size="h3" />
      <Subheading>{formatter.format(date)}</Subheading>
      <Hr />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6 mb-8">
        {modules
          .filter((mod) => mod.name !== "Settings")
          .map((module) => (
            <ModuleCard key={module.name} module={module} />
          ))}
      </div>
    </div>
  );
}

const Hr = () => (
  <hr className="h-px my-8 bg-black/10 border-0 dark:bg-white/10" />
);

const Subheading = ({ children, className }: ComponentProps<"p">) => (
  <p className={cn("text-muted-foreground text-base font-light", className)}>
    {children}
  </p>
);

const ModuleCard = ({ module }: { module: Authenticated<NavItem> }) => (
  <Link
    to={module.to}
    prefetch="intent"
    className="flex flex-row gap-4 items-center px-6 py-4 shadow-button-base bg-gradient-to-bl from-card from-50% to-background rounded-lg group ring-2 ring-transparent hover:ring-white/10 cursor-pointer hover:scale-105 transition-all duration-300"
  >
    <div className="p-3 rounded-lg border shrink-0">
      <module.icon className="text-2xl" />
    </div>
    <span className="text-sm border border-border rounded-full py-1 px-4 group-hover:bg-accent font-medium tracking-tight">
      {module.name}
    </span>
  </Link>
);
