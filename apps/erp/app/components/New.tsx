import type { ButtonProps } from "@carbon/react";
import {
  Button,
  HStack,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useKeyboardShortcuts
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useRef } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";
import { useReadOnly } from "~/hooks/useReadOnly";

type NewProps = {
  label?: string;
  to: string;
  variant?: ButtonProps["variant"];
};

const New = ({ label, to, variant = "primary" }: NewProps) => {
  const { t } = useLingui();
  const readOnly = useReadOnly();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useKeyboardShortcuts({
    n: (event: KeyboardEvent) => {
      event.stopPropagation();
      buttonRef.current?.click();
    }
  });

  // Read-only free companies can't create anything; hide every New affordance
  // uniformly here so call sites don't each have to guard it (the server blocks
  // the create regardless). The `n` shortcut above no-ops since buttonRef is null.
  if (readOnly) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          asChild
          leftIcon={<LuCirclePlus />}
          variant={variant}
          ref={buttonRef}
        >
          <Link to={to} prefetch="intent">
            {/* On mobile keep just "Add" (+ the icon) to save horizontal space;
                the entity name only shows from md up. */}
            {label ? (
              <>
                {t`Add`}
                <span className="hidden md:inline"> {label}</span>
              </>
            ) : (
              t`Add`
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <HStack>
          <Kbd>N</Kbd>
        </HStack>
      </TooltipContent>
    </Tooltip>
  );
};

export default New;
