import { AnimatedStatus } from "./AnimatedStatus";
import { Loader } from "./Loader";
import { getStatusMessage } from "./lib/agent";
import type { AgentStatus } from "./lib/types";
import { getToolIcon, getToolMessage } from "./ToolCallIndicator";

interface ChatStatusIndicatorsProps {
  agentStatus: AgentStatus | null;
  currentToolCall: string | null;
  status?: string;
  hasTextContent?: boolean;
}

export function ChatStatusIndicators({
  agentStatus,
  currentToolCall,
  status,
  hasTextContent
}: ChatStatusIndicatorsProps) {
  const statusMessage = getStatusMessage(agentStatus);
  const toolMessage = currentToolCall ? getToolMessage(currentToolCall) : null;

  // Always prioritize tool message over agent status when a tool is running
  const displayMessage = toolMessage || statusMessage;

  // Get icon for current tool - always show icon when tool is running
  const toolIcon = currentToolCall ? getToolIcon(currentToolCall) : null;

  // Keep the spinner turning the entire time the assistant is working until
  // its answer text actually starts streaming in. It sits ALONGSIDE any
  // status/tool message (e.g. "Searching...") rather than being replaced by
  // it — otherwise, in the gap between a tool finishing and the first answer
  // token, the static tool text looked frozen ("the spinner stopped"). Only
  // hasTextContent (the reply starting) or the turn ending (status no longer
  // submitted/streaming) stops it.
  const isWorking = status === "submitted" || status === "streaming";
  const showLoader = isWorking && !hasTextContent;

  return (
    <div className="h-8 flex items-center gap-2">
      <AnimatedStatus
        text={displayMessage ?? null}
        shimmerDuration={0.75}
        fadeDuration={0.1}
        variant="slide"
        className="text-xs font-normal"
        icon={toolIcon}
      />

      {showLoader && <Loader />}
    </div>
  );
}
