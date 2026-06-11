import { ValidatedForm } from "@carbon/form";
import {
  Avatar,
  Badge,
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ScrollArea,
  useDisclosure,
  useIsMobile,
  useMode,
  VStack
} from "@carbon/react";
import { Link } from "react-router";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { BsFillHexagonFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { LuChevronsUpDown } from "react-icons/lu";
import { Form, useMatches } from "react-router";
import { DetailNavIconBadge, DetailNavTrail, useDetailNav } from "../DetailNav";
import { z } from "zod";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs as BreadcrumbsBase
} from "~/components";
import {
  AddressAutocomplete,
  Currency,
  Input,
  Submit
} from "~/components/Form";
import { useRouteData, useUser } from "~/hooks";
import type { Company } from "~/modules/settings";
import { companyValidator } from "~/modules/settings/settings.models";
import { path } from "~/utils/path";

export const BreadcrumbHandle = z.object({
  breadcrumb: z.any(),
  to: z.string().optional()
});
export type BreadcrumbHandleType = z.infer<typeof BreadcrumbHandle>;

const BreadcrumbHandleMatch = z.object({
  handle: BreadcrumbHandle
});

const Breadcrumbs = () => {
  const { i18n } = useLingui();
  const matches = useMatches();
  const { detailNav } = useDetailNav();

  const translateBreadcrumb = (value: unknown): ReactNode => {
    if (typeof value === "object" && value !== null && "id" in value) {
      return i18n._(value as { id: string; message?: string });
    }
    if (typeof value === "string") return i18n._(value);
    return value as ReactNode;
  };

  const breadcrumbs = matches
    .map((m) => {
      const result = BreadcrumbHandleMatch.safeParse(m);
      if (!result.success || !result.data.handle.breadcrumb) return null;

      return {
        breadcrumb: translateBreadcrumb(
          typeof result.data.handle.breadcrumb === "function"
            ? result.data.handle.breadcrumb(m.params)
            : result.data.handle.breadcrumb
        ),
        to: result.data.handle?.to ?? m.pathname
      };
    })
    .filter(Boolean);
  const isMobile = useIsMobile();
  const displayedBreadcrumbs = isMobile ? breadcrumbs.slice(0, 1) : breadcrumbs;
  const { company } = useUser();
  const mode = useMode();
  const logo = mode === "dark" ? company?.logoDarkIcon : company?.logoLightIcon;

  return (
    <HStack className="flex h-full min-w-0 items-center -ml-2" spacing={0}>
      <Button isIcon asChild variant="ghost" size="lg">
        <Link to="/">
          {logo ? (
            <img
              src={logo}
              alt={`${company.name} logo`}
              className="h-auto w-full rounded"
            />
          ) : (
            <BsFillHexagonFill />
          )}
        </Link>
      </Button>

      <BreadcrumbsBase className="min-w-0 line-clamp-1">
        {!isMobile && <CompanyBreadcrumb />}
        {displayedBreadcrumbs.map((breadcrumb, i) => (
          <BreadcrumbItem key={i}>
            <BreadcrumbLink
              isCurrentPage={isMobile || !breadcrumb?.to}
              to={isMobile ? "" : (breadcrumb?.to ?? "")}
            >
              {breadcrumb?.breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        {detailNav && !isMobile ? (
          <BreadcrumbItem>
            {detailNav.idTo ? (
              <BreadcrumbLink to={detailNav.idTo}>
                <HStack spacing={1} className="min-w-0 items-center">
                  <span className="truncate">
                    {detailNav.id}
                    {detailNav.suffix}
                  </span>
                  {detailNav.copyText ? <Copy text={detailNav.copyText} /> : null}
                  {detailNav.badges?.map((badge) => (
                    <DetailNavIconBadge
                      key={badge.key}
                      icon={badge.icon}
                      label={badge.label}
                    />
                  ))}
                </HStack>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink isCurrentPage>
                <DetailNavTrail detailNav={detailNav} />
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ) : null}
      </BreadcrumbsBase>
      {detailNav && isMobile ? <DetailNavTrail detailNav={detailNav} isMobile /> : null}
    </HStack>
  );
};

function CompanyBreadcrumb() {
  const { t } = useLingui();
  const routeData = useRouteData<{ company: Company; companies: Company[] }>(
    path.to.authenticatedRoot
  );
  const user = useUser();

  const hasMultipleCompanies = Boolean(
    routeData?.companies && routeData?.companies.length > 1
  );

  const canCreateCompany = user.admin === true;
  const hasCompanyMenu = canCreateCompany || hasMultipleCompanies;
  const companyForm = useDisclosure();

  const mode = useMode();

  const companyGroups = useMemo(() => {
    if (!routeData?.companies) return [];

    const groups = new Map<
      string,
      { name: string; companies: typeof routeData.companies }
    >();

    for (const c of routeData.companies) {
      const groupName = c.companyGroupName ?? t`Companies`;
      const existing = groups.get(groupName);
      if (existing) {
        existing.companies.push(c);
      } else {
        groups.set(groupName, { name: groupName, companies: [c] });
      }
    }

    // If a group has only one company, move it to "Companies"
    const result = new Map<
      string,
      { name: string; companies: typeof routeData.companies }
    >();
    for (const [key, group] of groups) {
      if (group.companies.length === 1 && key !== "Companies") {
        const existing = result.get("Companies");
        if (existing) {
          existing.companies.push(...group.companies);
        } else {
          result.set("Companies", {
            name: "Companies",
            companies: [...group.companies]
          });
        }
      } else {
        const existing = result.get(key);
        if (existing) {
          existing.companies.push(...group.companies);
        } else {
          result.set(key, group);
        }
      }
    }

    return Array.from(result.values());
  }, [routeData?.companies, t]);

  return (
    <BreadcrumbItem isFirstChild>
      {hasCompanyMenu ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-current="page"
                variant="ghost"
                className="px-2 focus-visible:ring-transparent"
                rightIcon={<LuChevronsUpDown />}
              >
                {routeData?.company.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[240px]">
              <ScrollArea className="max-h-[300px]">
                {companyGroups.map((group, index) => (
                  <DropdownMenuGroup key={group.name}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {group.companies.map((c) => {
                      const logo =
                        mode === "dark" ? c.logoDarkIcon : c.logoLightIcon;
                      return (
                        <Form
                          key={c.companyId}
                          method="post"
                          action={path.to.companySwitch(c.companyId!)}
                        >
                          <DropdownMenuItem
                            className="flex items-center justify-between w-full"
                            asChild
                          >
                            <button type="submit">
                              <HStack>
                                <Avatar
                                  size="xs"
                                  name={c.name ?? undefined}
                                  src={logo ?? undefined}
                                />
                                <span>{c.name}</span>
                              </HStack>
                              <Badge variant="secondary" className="ml-2">
                                {c.employeeType}
                              </Badge>
                            </button>
                          </DropdownMenuItem>
                        </Form>
                      );
                    })}
                  </DropdownMenuGroup>
                ))}
              </ScrollArea>

              {canCreateCompany && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={companyForm.onOpen}>
                      <DropdownMenuIcon icon={<IoMdAdd />} />
                      {t`Add Company`}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Modal
            open={companyForm.isOpen}
            onOpenChange={(open) => {
              if (!open) companyForm.onClose();
            }}
          >
            <ModalContent>
              <ValidatedForm
                action={path.to.newCompany}
                validator={companyValidator}
                method="post"
                onSuccess={companyForm.onClose}
                defaultValues={{
                  countryCode: "US",
                  baseCurrencyCode: "USD"
                }}
              >
                <ModalHeader>
                  <ModalTitle>
                    <Trans>Let's set up your new company</Trans>
                  </ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <VStack spacing={4}>
                    <Input autoFocus name="name" label={t`Company Name`} />
                    <AddressAutocomplete variant="grid" />
                    <Currency
                      name="baseCurrencyCode"
                      label={t`Base Currency`}
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack>
                    <Submit>
                      <Trans>Save</Trans>
                    </Submit>
                  </HStack>
                </ModalFooter>
              </ValidatedForm>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <BreadcrumbLink to="/">{routeData?.company.name}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  );
}

export default Breadcrumbs;
