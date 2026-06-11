import { useLingui } from "@lingui/react/macro";
import type { PropsWithChildren } from "react";
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

const ActionMenu = ({ children, ...props }: ActionMenuProps) => {
  const { t } = useLingui();
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
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
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
