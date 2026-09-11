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
                    {/*
                      `actions` are real Buttons/links with mixed variants
                      (secondary, primary, outline). Stacked raw they look
                      ragged next to the flat DropdownMenuItem rows above, so
                      flatten every button/link into a uniform, left-aligned
                      menu row: no border/shadow/fill, shared padding, weight
                      and hover. `!` beats the variants' dark-mode utilities.
                    */}
                    <div className="flex flex-col items-stretch gap-1 p-1 [&_a]:h-8 [&_a]:w-full [&_a]:justify-start [&_a]:px-2 [&_a]:font-normal [&_a]:text-foreground [&_a]:before:hidden [&_a]:!border-0 [&_a]:!bg-transparent [&_a]:!bg-none [&_a]:!shadow-none [&_a:hover]:!bg-accent [&_button]:h-8 [&_button]:w-full [&_button]:justify-start [&_button]:px-2 [&_button]:font-normal [&_button]:text-foreground [&_button]:before:hidden [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!bg-none [&_button]:!shadow-none [&_button:hover]:!bg-accent">
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
