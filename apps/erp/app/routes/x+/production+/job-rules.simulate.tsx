import { requirePermissions } from "@carbon/auth/auth.server";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  LuCircle,
  LuCircleCheck,
  LuFlaskConical,
  LuShieldCheck,
  LuUsers
} from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getJobAssignmentRules, getJobsForSimulation } from "~/modules/people";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Simulate`,
  to: path.to.jobRulesSimulate
};

type Condition = {
  field: string;
  operator: string;
  value: string | string[];
};

/** Evaluates a single condition against a job. */
function evaluateCondition(condition: Condition, job: any): boolean {
  const { field, operator, value } = condition;
  let jobValue: string | string[] | null | undefined;

  if (field === "tags") {
    jobValue = job.tags ?? [];
  } else if (field === "processId" || field === "workCenterId") {
    // Gather all unique values across operations
    const ops: any[] =
      (job.jobMakeMethod ?? []).flatMap((mm: any) => mm.jobOperation ?? []);
    jobValue = ops.map((op: any) => op[field]).filter(Boolean);
  } else {
    jobValue = job[field];
  }

  switch (operator) {
    case "eq":
      return String(jobValue) === String(value);
    case "neq":
      return String(jobValue) !== String(value);
    case "in": {
      const vals = Array.isArray(value)
        ? value
        : String(value)
            .split(",")
            .map((v) => v.trim());
      return vals.some((v) =>
        Array.isArray(jobValue)
          ? jobValue.includes(v)
          : String(jobValue) === v
      );
    }
    case "contains":
      if (Array.isArray(jobValue)) {
        return jobValue.some((jv) =>
          String(jv).toLowerCase().includes(String(value).toLowerCase())
        );
      }
      return String(jobValue ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase());
    default:
      return false;
  }
}

/** Returns the first matching rule for a job (sorted by priority). */
function matchJobToRules(
  job: any,
  rules: any[]
): { rule: any; matched: boolean } {
  for (const rule of rules) {
    const conditions: Condition[] = Array.isArray(rule.conditions)
      ? rule.conditions
      : [];

    // No conditions = matches all
    if (conditions.length === 0) {
      return { rule, matched: true };
    }

    const allMatch = conditions.every((cond) => evaluateCondition(cond, job));
    if (allMatch) {
      return { rule, matched: true };
    }
  }
  return { rule: null, matched: false };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const [rulesResult, jobsResult] = await Promise.all([
    getJobAssignmentRules(client, companyId),
    getJobsForSimulation(client, companyId)
  ]);

  const activeRules = (rulesResult.data ?? []).filter((r: any) => r.active);
  const jobs = jobsResult.data ?? [];

  // Run simulation
  const results = jobs.map((job: any) => {
    const { rule, matched } = matchJobToRules(job, activeRules);
    return {
      jobId: job.id,
      jobReadableId: job.jobId,
      status: job.status,
      customerId: job.customerId,
      matchedRule: matched ? rule : null,
      matched
    };
  });

  const matchedCount = results.filter((r: any) => r.matched).length;
  const unmatchedCount = results.filter((r: any) => !r.matched).length;

  return {
    results,
    activeRules,
    totalJobs: jobs.length,
    matchedCount,
    unmatchedCount
  };
}

export default function JobRulesSimulateRoute() {
  const { results, activeRules, totalJobs, matchedCount, unmatchedCount } =
    useLoaderData<typeof loader>();
  const { t } = useLingui();

  return (
    <VStack spacing={0} className="h-full overflow-auto">
      <div className="flex flex-shrink-0 items-center justify-between gap-3 px-4 py-2 bg-card border-b border-border h-[50px]">
        <HStack spacing={2}>
          <LuFlaskConical className="size-5 text-muted-foreground" />
          <Heading size="h4">
            <Trans>Assignment Rule Simulation</Trans>
          </Heading>
        </HStack>
      </div>

      <div className="flex flex-col gap-4 w-full p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground">
        <div className="grid w-full gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex-row gap-2">
              <LuShieldCheck className="text-muted-foreground" />
              <CardTitle>
                <Trans>Active Rules</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums">
                {activeRules.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row gap-2">
              <LuFlaskConical className="text-muted-foreground" />
              <CardTitle>
                <Trans>Jobs Checked</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums">
                {totalJobs}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row gap-2">
              <LuCircleCheck className="text-muted-foreground" />
              <CardTitle>
                <Trans>Would Match</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums text-green-600 dark:text-green-400">
                {matchedCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row gap-2">
              <LuCircle className="text-muted-foreground" />
              <CardTitle>
                <Trans>No Match</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-medium tracking-tighter tabular-nums text-amber-600 dark:text-amber-400">
                {unmatchedCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {activeRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans>Active Rules (in priority order)</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeRules.map((rule: any) => (
                  <div
                    key={rule.id}
                    className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs"
                  >
                    <LuShieldCheck className="size-3.5 text-primary" />
                    <span className="font-medium">#{rule.priority}</span>
                    <span>{rule.name}</span>
                    <span className="text-muted-foreground">→</span>
                    <LuUsers className="size-3" />
                    <span className="text-muted-foreground">
                      {rule.targetGroupName}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Job Matching Results</Trans>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <Thead>
                <Tr>
                  <Th>{t`Job`}</Th>
                  <Th>{t`Status`}</Th>
                  <Th>{t`Match`}</Th>
                  <Th>{t`Matched Rule`}</Th>
                  <Th>{t`Would Assign To`}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results.length === 0 ? (
                  <Tr>
                    <Td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Trans>No active jobs to simulate against</Trans>
                    </Td>
                  </Tr>
                ) : (
                  results.map((r: any) => (
                    <Tr key={r.jobId}>
                      <Td className="font-mono font-medium text-sm">
                        {r.jobReadableId}
                      </Td>
                      <Td>
                        <Badge variant="outline">{r.status}</Badge>
                      </Td>
                      <Td>
                        {r.matched ? (
                          <HStack
                            spacing={1}
                            className="text-green-600 dark:text-green-400 text-sm"
                          >
                            <LuCircleCheck className="size-4" />
                            <Trans>Matched</Trans>
                          </HStack>
                        ) : (
                          <HStack
                            spacing={1}
                            className="text-muted-foreground text-sm"
                          >
                            <LuCircle className="size-4" />
                            <Trans>No match</Trans>
                          </HStack>
                        )}
                      </Td>
                      <Td className="text-sm">
                        {r.matchedRule ? (
                          <span className="font-medium">
                            {r.matchedRule.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td>
                        {r.matchedRule ? (
                          <HStack spacing={1} className="text-sm">
                            <LuUsers className="size-3.5 text-muted-foreground" />
                            <span>
                              {r.matchedRule.targetGroupName ?? "—"}
                            </span>
                          </HStack>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </VStack>
  );
}
