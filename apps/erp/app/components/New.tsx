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
import { useCallback, useRef } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import {
  isNewEntityModalRoute,
  useNewEntityModal
} from "~/components/NewEntityModal";

type NewProps = {
  label?: string;
  to: string;
  variant?: ButtonProps["variant"];
};

const New = ({ label, to, variant = "primary" }: NewProps) => {
  const { i18n, t } = useLingui();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { open } = useNewEntityModal();
  const translatedLabel = label ? i18n._(label) : undefined;
  const display = translatedLabel ? `${t`Add`} ${translatedLabel}` : t`Add`;

  const openAsModal = isNewEntityModalRoute(to);

  const handleClick = useCallback(() => {
    open(to);
  }, [open, to]);

  useKeyboardShortcuts({
    n: (event: KeyboardEvent) => {
      event.stopPropagation();
      buttonRef.current?.click();
    }
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        {openAsModal ? (
          <Button
            leftIcon={<LuCirclePlus />}
            variant={variant}
            ref={buttonRef}
            onClick={handleClick}
          >
            {display}
          </Button>
        ) : (
          <Button
            asChild
            leftIcon={<LuCirclePlus />}
            variant={variant}
            ref={buttonRef}
          >
            <Link
              to={to}
              prefetch="intent"
              state={{ from: `${location.pathname}${location.search}` }}
            >
              {display}
            </Link>
          </Button>
        )}
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
