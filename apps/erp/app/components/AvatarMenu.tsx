import { CONTROLLED_ENVIRONMENT } from "@carbon/auth";
import {
  getSortedLanguageSelectOptions,
  resolveLanguage
} from "@carbon/locale";
import {
  Badge,
  Avatar as CompanyAvatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HStack,
  ItarDisclosure,
  Switch,
  useDisclosure,
  useEdition,
  useMode
} from "@carbon/react";
import { DEFAULT_TEXT_SIZE, Edition, TEXT_SIZES, themes } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { useCallback, useMemo, useState } from "react";
import {
  LuALargeSmall,
  LuBuilding2,
  LuCheck,
  LuCreditCard,
  LuFileText,
  LuHouse,
  LuLanguages,
  LuLogOut,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuPrinter,
  LuShieldCheck,
  LuSun,
  LuUser
} from "react-icons/lu";
import { Form, Link, useFetcher } from "react-router";
import { Avatar as UserAvatar } from "~/components";
import {
  useFormatPersonName,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import { useTextSize } from "~/hooks/useTextSize";
import { useTheme } from "~/hooks/useTheme";
import type { Company } from "~/modules/settings";
import type { action } from "~/root";
import { startModeTransition } from "~/utils/dom";
import { path } from "~/utils/path";

// Bump on each deploy so we can confirm which build is live (shown at the
// bottom of the avatar menu).
const BUILD_VERSION = "bt-9";

const AvatarMenu = () => {
  const { t } = useLingui();
  const user = useUser();
  const formatPersonName = useFormatPersonName();
  const routeData = useRouteData<{ company: Company; companies: Company[] }>(
    path.to.authenticatedRoot
  );
  const name = formatPersonName({
    firstName: user.firstName,
    lastName: user.lastName
  });
  const { isOwner } = usePermissions();
  const edition = useEdition();

  const mode = useMode();
  const serverTheme = useTheme();

  const nextMode = mode === "dark" ? "light" : "dark";

  const fetcher = useFetcher<typeof action>();

  const onModeToggle = () => {
    const formData = new FormData();
    formData.append("mode", nextMode);
    startModeTransition(nextMode, () => {
      fetcher.submit(formData, { method: "post", action: path.to.root });
    });
  };
  // The UI language is derived from the server-loaded Lingui catalog in the
  // root loader (keyed on the locale cookie). Setting the cookie alone doesn't
  // re-render the already-loaded catalog, and React Router's fetcher
  // revalidation doesn't reliably re-run the root loader on every route (it
  // silently no-ops on data-heavy routes like /x/items/styles), which left the
  // UI stuck on the old language until a manual refresh. Set the cookie with a
  // plain POST and hard-reload once it resolves so the new language always takes
  // effect immediately, regardless of the current route.
  const [switchingLocale, setSwitchingLocale] = useState<string | null>(null);
  const switchLanguage = useCallback((nextLocale: string) => {
    const body = new FormData();
    body.set("locale", nextLocale);
    setSwitchingLocale(nextLocale);
    fetch("/api/locale", {
      method: "post",
      body,
      credentials: "same-origin"
    }).finally(() => window.location.reload());
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const { locale } = useLocale();
  const resolvedLocale = resolveLanguage(locale);

  const languageOptions = useMemo(
    () => getSortedLanguageSelectOptions(locale),
    [locale]
  );
  const canSwitchCompany = Boolean(routeData?.companies?.length);

  const onThemeChange = (t: string) => {
    const newTheme = themes.find((theme) => theme.name === t);
    if (!newTheme) return;
    const variables =
      mode === "dark" ? newTheme.cssVars.dark : newTheme.cssVars.light;

    setSelectedTheme(t);

    const formData = new FormData();
    formData.append("theme", t);
    fetcher.submit(formData, { method: "post", action: path.to.theme });

    Object.entries(variables).forEach(([key, value]) => {
      document.body.style.setProperty(`--${key}`, value);
    });
  };

  const optimisticTheme = selectedTheme ?? serverTheme;

  const textSize = useTextSize();
  const onTextSizeChange = (value: string) => {
    const formData = new FormData();
    formData.append("textSize", value);
    fetcher.submit(formData, { method: "post", action: path.to.textSize });
  };

  const itarDisclosure = useDisclosure();

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="outline-none focus-visible:outline-none">
          <UserAvatar path={user.avatarUrl} name={name} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{t`Signed in as ${name}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={path.to.authenticatedRoot}>
              <DropdownMenuIcon icon={<LuHouse />} />
              <Trans>Dashboard</Trans>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to={path.to.apiIntroduction}>
              <DropdownMenuIcon icon={<LuFileText />} />
              <Trans>API Documentation</Trans>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start">
                <DropdownMenuIcon
                  icon={mode === "dark" ? <LuMoon /> : <LuSun />}
                />
                <Trans>Dark Mode</Trans>
              </div>
              <div>
                <Switch
                  checked={mode === "dark"}
                  onCheckedChange={onModeToggle}
                />
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownMenuIcon icon={<LuPalette />} />
              <Trans>Theme Color</Trans>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={optimisticTheme}
                onValueChange={onThemeChange}
              >
                {themes.map((t) => (
                  <DropdownMenuRadioItem
                    key={t.name}
                    value={t.name}
                    onSelect={(e) => e.preventDefault()}
                    style={
                      {
                        "--theme-primary": `hsl(${
                          t?.activeColor[mode === "dark" ? "dark" : "light"]
                        })`
                      } as React.CSSProperties
                    }
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2 bg-[var(--theme-primary)]" />
                      {t.label}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownMenuIcon icon={<LuALargeSmall />} />
              <Trans>Text Size</Trans>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={textSize}
                onValueChange={onTextSizeChange}
              >
                {TEXT_SIZES.map((size) => (
                  <DropdownMenuRadioItem
                    key={size}
                    value={size}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <span>{size}%</span>
                    {size === DEFAULT_TEXT_SIZE ? (
                      <span className="ml-2 text-muted-foreground">
                        <Trans>Default</Trans>
                      </span>
                    ) : null}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={switchingLocale !== null}>
              <DropdownMenuIcon icon={<LuLanguages />} />
              <Trans>Language</Trans>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {languageOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  disabled={
                    switchingLocale !== null || opt.value === resolvedLocale
                  }
                  onSelect={(event) => {
                    event.preventDefault();
                    switchLanguage(opt.value);
                  }}
                >
                  <span
                    className={
                      opt.value === resolvedLocale ? "font-medium" : undefined
                    }
                  >
                    {opt.label}
                  </span>
                  {opt.value === resolvedLocale ? (
                    <LuCheck className="ml-auto h-4 w-4 shrink-0" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={path.to.profile}>
              <DropdownMenuIcon icon={<LuUser />} />
              <Trans>Account Settings</Trans>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={path.to.accountDevice}>
              <DropdownMenuIcon icon={<LuMonitor />} />
              <Trans>This Device</Trans>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/print-test">
              <DropdownMenuIcon icon={<LuPrinter />} />
              <Trans>Printer Test</Trans>
            </Link>
          </DropdownMenuItem>
          {canSwitchCompany ? (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <DropdownMenuIcon icon={<LuBuilding2 />} />
                <Trans>Companies</Trans>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {routeData?.companies.map((company) => {
                  const logo =
                    mode === "dark"
                      ? company.logoDarkIcon
                      : company.logoLightIcon;
                  const isCurrent = company.companyId === user.company.id;
                  return (
                    <Form
                      key={company.companyId}
                      method="post"
                      action={path.to.companySwitch(company.companyId!)}
                    >
                      <DropdownMenuItem asChild disabled={isCurrent}>
                        <button
                          type="submit"
                          className="flex w-full items-center justify-between"
                        >
                          <HStack>
                            <CompanyAvatar
                              size="xs"
                              name={company.name ?? undefined}
                              src={logo ?? undefined}
                            />
                            <span
                              className={isCurrent ? "font-medium" : undefined}
                            >
                              {company.name}
                            </span>
                          </HStack>
                          <HStack>
                            <Badge variant="secondary" className="ml-2">
                              {company.employeeType}
                            </Badge>
                            {isCurrent ? (
                              <LuCheck className="h-4 w-4 shrink-0" />
                            ) : null}
                          </HStack>
                        </button>
                      </DropdownMenuItem>
                    </Form>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : null}

          {edition === Edition.Cloud && isOwner() && (
            <DropdownMenuItem asChild>
              <Link to={path.to.billing}>
                <DropdownMenuIcon icon={<LuCreditCard />} />
                <span>
                  <Trans>Manage Subscription</Trans>
                </span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownMenuIcon icon={<LuFileText />} />
              <Trans>Terms and Privacy</Trans>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <a href={path.to.legal.termsAndConditions}>
                  <DropdownMenuIcon icon={<LuFileText />} />
                  <Trans>Terms of Service</Trans>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={path.to.legal.privacyPolicy}>
                  <DropdownMenuIcon icon={<LuShieldCheck />} />
                  <Trans>Privacy Policy</Trans>
                </a>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          {CONTROLLED_ENVIRONMENT && (
            <DropdownMenuItem onClick={itarDisclosure.onOpen}>
              <DropdownMenuIcon icon={<LuShieldCheck />} />
              <Trans>About</Trans>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Form method="post" action={path.to.logout}>
              <button type="submit" className="w-full h-full flex items-center">
                <DropdownMenuIcon icon={<LuLogOut />} />
                <span>
                  <Trans>Sign Out</Trans>
                </span>
              </button>
            </Form>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground tabular-nums">
            {t`Build`} {BUILD_VERSION}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {CONTROLLED_ENVIRONMENT && <ItarDisclosure disclosure={itarDisclosure} />}
    </>
  );
};

export default AvatarMenu;
