import { useLingui } from "@lingui/react/macro";
import type { MouseEvent, PointerEvent, PropsWithChildren } from "react";
import { useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./Dropdown";
import { IconButton } from "./IconButton";
import { Menu } from "./Menu";

type ActionMenuProps = PropsWithChildren<{
  icon?: JSX.Element;
  disabled?: boolean;
}>;

const TAP_MOVEMENT_THRESHOLD = 8;

const ActionMenu = ({ children, ...props }: ActionMenuProps) => {
  const { t } = useLingui();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressTap = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    suppressTap.current = false;
    event.stopPropagation();
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = pointerStart.current;
    if (!start || suppressTap.current) return;

    const deltaX = Math.abs(event.clientX - start.x);
    const deltaY = Math.abs(event.clientY - start.y);
    if (
      deltaX > TAP_MOVEMENT_THRESHOLD ||
      deltaY > TAP_MOVEMENT_THRESHOLD
    ) {
      suppressTap.current = true;
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (suppressTap.current) {
      event.preventDefault();
      event.stopPropagation();
    }
    pointerStart.current = null;
  };

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (suppressTap.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressTap.current = false;
      return;
    }
    event.stopPropagation();
  };

  return (
    <Menu type="dropdown">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={t`Action Menu`}
            variant="secondary"
            icon={<BsThreeDotsVertical />}
            // Stop at pointerdown for parents that activate on pointer events
            // (drag handlers, row navigation) and at click as a fallback.
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={onClick}
            {...props}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </Menu>
  );
};

export { ActionMenu };
