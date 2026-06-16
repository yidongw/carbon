import { useChatActions } from "@ai-sdk-tools/store";
import { useCarbon } from "@carbon/auth";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import {
  LuCheck,
  LuCircleAlert,
  LuCircleCheck,
  LuX
} from "react-icons/lu";
import { useUser } from "~/hooks";
import { path } from "~/utils/path";

export type ProposalChange = {
  name: string;
  description: string;
  module: string;
  classification: "WRITE" | "DESTRUCTIVE";
  arguments: Record<string, unknown>;
};

export type ProposalToolOutput = {
  status: "awaiting_confirmation";
  proposalId: string;
  title: string;
  summary: string;
  changes: ProposalChange[];
};

type ConfirmResultItem = {
  name: string;
  description: string;
  success: boolean;
  data?: unknown;
  error?: string;
};

type ConfirmResponse = {
  proposalId: string;
  title: string;
  summary: string;
  succeeded: number;
  failed: number;
  results: ConfirmResultItem[];
};

type CardState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; response: ConfirmResponse }
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return JSON.stringify(value);
}

function flattenArgs(
  args: Record<string, unknown>
): Array<{ field: string; value: string }> {
  const rows: Array<{ field: string; value: string }> = [];
  for (const [key, value] of Object.entries(args)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(
        value as Record<string, unknown>
      )) {
        rows.push({ field: `${key}.${subKey}`, value: formatValue(subValue) });
      }
    } else {
      rows.push({ field: key, value: formatValue(value) });
    }
  }
  return rows;
}

function summariseResult(item: ConfirmResultItem): string {
  if (!item.success) return `Failed: ${item.error ?? "unknown error"}`;
  const data = item.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const id = obj.id ?? obj.readableId ?? obj.purchaseOrderId;
    if (id) return `Created/updated ${String(id)}`;
  }
  return "Success";
}

type ProposalCardProps = {
  output: ProposalToolOutput;
};

export function ProposalCard({ output }: ProposalCardProps) {
  const [state, setState] = useState<CardState>({ kind: "idle" });
  const { sendMessage } = useChatActions();
  const { accessToken } = useCarbon();
  const { t } = useLingui();
  const {
    id: userId,
    company: { id: companyId }
  } = useUser();

  const isDestructive = output.changes.some(
    (c) => c.classification === "DESTRUCTIVE"
  );

  const handleConfirm = async () => {
    setState({ kind: "submitting" });
    try {
      const res = await fetch(path.to.api.chatConfirmProposal, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-company-id": companyId,
          "x-user-id": userId
        },
        body: JSON.stringify({ proposalId: output.proposalId })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
          body.error || `Confirmation failed (HTTP ${res.status})`;
        setState({ kind: "error", message });
        sendMessage({
          role: "user",
          parts: [
            {
              type: "text",
              text: `The user tried to confirm the proposed changes, but execution failed: ${message}`
            }
          ]
        });
        return;
      }

      const response: ConfirmResponse = await res.json();
      setState({ kind: "done", response });

      const summary = response.results
        .map(
          (r) =>
            `- ${r.description} → ${r.success ? "succeeded" : `failed (${r.error})`}`
        )
        .join("\n");

      sendMessage({
        role: "user",
        parts: [
          {
            type: "text",
            text: `The user confirmed the proposed changes. Results:\n${summary}\n\nPlease acknowledge the outcome briefly.`
          }
        ]
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setState({ kind: "error", message });
    }
  };

  const handleCancel = () => {
    setState({ kind: "cancelled" });
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: "The user cancelled the proposed changes. Do not retry them; ask if anything else is needed."
        }
      ]
    });
  };

  const decided = state.kind !== "idle" && state.kind !== "submitting";

  return (
    <Card className="my-4 max-w-full">
      <CardHeader className="flex flex-col items-start gap-1 px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          {isDestructive ? (
            <LuCircleAlert className="text-red-500 size-4" />
          ) : (
            <LuCircleCheck className="text-blue-500 size-4" />
          )}
          <CardTitle className="text-sm font-medium">{output.title}</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">{output.summary}</p>
        <p className="text-xs text-muted-foreground">
          {output.changes.length === 1
            ? t`1 change pending your approval`
            : t`${output.changes.length} changes pending your approval`}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {output.changes.map((change, idx) => {
          const rows = flattenArgs(change.arguments);
          const resultForChange =
            state.kind === "done" ? state.response.results[idx] : undefined;
          return (
            <div
              key={`${change.name}-${idx}`}
              className="border-b last:border-b-0"
            >
              <div className="px-4 py-2 bg-muted/30 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {change.description}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {change.module}.{change.name}
                    {change.classification === "DESTRUCTIVE" && (
                      <span className="ml-2 text-red-500">[DESTRUCTIVE]</span>
                    )}
                  </span>
                </div>
                {resultForChange && (
                  <span
                    className={
                      resultForChange.success
                        ? "text-xs text-green-600"
                        : "text-xs text-red-600"
                    }
                  >
                    {summariseResult(resultForChange)}
                  </span>
                )}
              </div>
              {rows.length > 0 && (
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="w-1/3">{t`Field`}</Th>
                      <Th>{t`Value`}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {rows.map((row) => (
                      <Tr key={row.field}>
                        <Td className="font-mono text-xs">{row.field}</Td>
                        <Td className="font-mono text-xs break-all">
                          {row.value}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 px-4 py-3 border-t">
        <div className="text-xs text-muted-foreground">
          {state.kind === "submitting" && t`Executing changes…`}
          {state.kind === "done" &&
            t`${state.response.succeeded} succeeded, ${state.response.failed} failed`}
          {state.kind === "cancelled" && t`Cancelled`}
          {state.kind === "error" && (
            <span className="text-red-500">{state.message}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            isDisabled={decided || state.kind === "submitting"}
            leftIcon={<LuX />}
          >
            {t`Cancel`}
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "primary"}
            size="sm"
            onClick={handleConfirm}
            isDisabled={decided || state.kind === "submitting"}
            isLoading={state.kind === "submitting"}
            leftIcon={<LuCheck />}
          >
            {t`Confirm`}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
