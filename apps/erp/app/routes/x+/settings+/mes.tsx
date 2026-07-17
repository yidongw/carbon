import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  HStack,
  ScrollArea,
  Switch,
  toast,
  VStack
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuBadgeCheck,
  LuBanknote,
  LuCalendarDays,
  LuCirclePlay,
  LuCircleStop,
  LuClipboardList,
  LuGitBranchPlus,
  LuGitPullRequestCreateArrow,
  LuHistory,
  LuPackageCheck,
  LuWrench
} from "react-icons/lu";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useFetcher, useLoaderData } from "react-router";
import {
  getCompanySettings,
  updateHiddenMesSectionsSetting
} from "~/modules/settings";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`MES`,
  to: path.to.mesSettings
};

// Section keys must stay in sync with the MES app's home/sidebar sections
// (apps/mes/app/routes/x+/_index.tsx and components/AppSidebar.tsx).
const MES_SECTIONS: { key: string; label: string; icon: IconType }[] = [
  { key: "schedule", label: "Schedule", icon: LuCalendarDays },
  { key: "assigned", label: "Assigned", icon: LuClipboardList },
  { key: "active", label: "Active", icon: LuActivity },
  { key: "recent", label: "Recent", icon: LuHistory },
  { key: "jobs", label: "Jobs", icon: LuCirclePlay },
  { key: "reportApprovals", label: "Report Approvals", icon: LuBadgeCheck },
  { key: "salary", label: "My Salary", icon: LuBanknote },
  { key: "maintenance", label: "Maintenance", icon: LuWrench },
  { key: "picking", label: "Picking", icon: LuPackageCheck },
  {
    key: "addInventory",
    label: "Add Inventory",
    icon: LuGitPullRequestCreateArrow
  },
  { key: "removeInventory", label: "Remove Inventory", icon: LuGitBranchPlus },
  { key: "endOperations", label: "End Operations", icon: LuCircleStop }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "settings"
  });

  const companySettings = await getCompanySettings(client, companyId);

  if (!companySettings.data)
    throw redirect(
      path.to.settings,
      await flash(
        request,
        error(companySettings.error, "Failed to get company settings")
      )
    );
  return { companySettings: companySettings.data };
}

export async function action({ request }: ActionFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    update: "settings"
  });

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "hiddenMesSections") {
    let hiddenMesSections: string[] = [];
    try {
      hiddenMesSections = JSON.parse(
        String(formData.get("hiddenMesSections") ?? "[]")
      );
    } catch {
      // keep empty on parse failure
    }
    const update = await updateHiddenMesSectionsSetting(
      client,
      companyId,
      hiddenMesSections
    );
    if (update.error) return { success: false, message: update.error.message };
    return { success: true, message: "MES sections updated" };
  }

  return { success: false, message: "Unknown intent" };
}

export default function MesSettingsRoute() {
  const { companySettings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.data?.success === true && fetcher?.data?.message) {
      toast.success(fetcher.data.message);
    }

    if (fetcher.data?.success === false && fetcher?.data?.message) {
      toast.error(fetcher.data.message);
    }
  }, [fetcher.data?.message, fetcher.data?.success]);

  const optimistic = fetcher.formData?.get("hiddenMesSections");
  const hidden: string[] =
    typeof optimistic === "string"
      ? JSON.parse(optimistic)
      : (companySettings.hiddenMesSections ?? []);

  const toggle = (key: string, show: boolean) => {
    const next = show
      ? hidden.filter((x) => x !== key)
      : Array.from(new Set([...hidden, key]));
    fetcher.submit(
      { intent: "hiddenMesSections", hiddenMesSections: JSON.stringify(next) },
      { method: "post" }
    );
  };

  return (
    <ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <VStack
        spacing={4}
        className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4"
      >
        <Heading size="h3">
          <Trans>MES</Trans>
        </Heading>

        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Sections</Trans>
            </CardTitle>
            <CardDescription>
              <Trans>
                Show or hide sections on the MES home screen and sidebar.
              </Trans>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VStack spacing={1} className="max-w-[420px]">
              {MES_SECTIONS.map((section) => (
                <HStack
                  key={section.key}
                  className="justify-between w-full py-1.5 border-b border-border last:border-0"
                >
                  <HStack spacing={2} className="min-w-0">
                    <span className="text-muted-foreground">
                      <section.icon />
                    </span>
                    <span className="text-sm truncate">{section.label}</span>
                  </HStack>
                  <Switch
                    checked={!hidden.includes(section.key)}
                    onCheckedChange={(checked) => toggle(section.key, checked)}
                  />
                </HStack>
              ))}
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </ScrollArea>
  );
}
