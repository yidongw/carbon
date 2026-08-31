import {
  CardHeader,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  HStack,
  IconButton,
  useIsMobile
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { LuEllipsisVertical } from "react-icons/lu";

type DocumentHeaderProps = {
  title: string;
  subtitle?: string;
  status?: ReactNode;
  menuItems?: ReactNode;
  actions?: ReactNode;
};

const DocumentHeader = ({
  title,
  subtitle,
  status,
  menuItems,
  actions
}: DocumentHeaderProps) => {
  const { t } = useLingui();
  const isMobile = useIsMobile();
  // On mobile the action buttons overflow, so collapse them into the same
  // "more options" menu. Render the actions in exactly one place (menu on
  // mobile, inline on desktop) — rendering both and toggling with CSS keeps
  // the action dropdowns mounted twice and breaks their click handling.
  const actionsInMenu = isMobile && !!actions;
  const showMenu = !!menuItems || actionsInMenu;
  return (
    <CardHeader className="flex-row items-center justify-between gap-2">
      <div className="min-w-0">
        <HStack>
          <Heading as="h1" size="h3">
            {title}
          </Heading>
          <Copy text={title} />
          {showMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  aria-label={t`More options`}
                  icon={<LuEllipsisVertical />}
                  variant="secondary"
                  size="sm"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {menuItems}
                {actionsInMenu && (
                  <>
                    {menuItems && <DropdownMenuSeparator />}
                    <div className="flex flex-col items-stretch gap-1 p-1">
                      {actions}
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {status}
        </HStack>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && !isMobile && <HStack>{actions}</HStack>}
    </CardHeader>
  );
};

export default DocumentHeader;
