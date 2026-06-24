import { Button } from "@carbon/react";
import { generateId } from "ai";
import { LuCirclePlus } from "react-icons/lu";
import { useUrlParams } from "~/hooks";
import { useChatActions } from "@ai-sdk-tools/store";

export function NewChat() {
  const [, setParams] = useUrlParams();
  const { reset } = useChatActions();

  const handleNewChat = () => {
    reset();
    setParams({ c: generateId() });
  };

  return (
    <Button variant="secondary" isIcon onClick={handleNewChat}>
      <LuCirclePlus size={16} />
    </Button>
  );
}
