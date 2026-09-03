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

  // Show the spinner whenever the assistant is actively working but has
  // nothing visible to show yet: no status text, no tool running, and no
  // reply text streaming into the bubble. This covers BOTH the initial
  // "submitted" phase and the "streaming" phase before the first token —
  // that streaming-but-empty gap is why follow-up turns showed no loading
  // indicator (only "submitted" was handled before).
  const isWorking = status === "submitted" || status === "streaming";
  const showLoader = isWorking && !displayMessage && !hasTextContent;

  return (
    <div className="h-8 flex items-center">
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
