import { cn, HStack, IconButton, useIsMobile } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback } from "react";
import { LuArrowLeft, LuSquarePen } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import { usePermissions, useUser } from "~/hooks";
import { path } from "~/utils/path";
import AvatarMenu from "../../AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import CreateMenu from "./CreateMenu";
import Notifications from "./Notifications";
import Search from "./Search";
import Suggestion from "./Suggestion";
import { useTopbarLeft } from "./TopbarContext";

const Topbar = () => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();
  const user = useUser();
  const notificationsKey = `${user.id}:${user.company.id}`;
  const onDashboard = location.pathname === path.to.authenticatedRoot;
  const isMobile = useIsMobile();
  const { setLeftSlotEl, hasDetailTopbar } = useTopbarLeft();
  const hideBreadcrumbsOnMobile = isMobile && hasDetailTopbar;

  const slotRef = useCallback(
    (el: HTMLDivElement | null) => setLeftSlotEl(el),
    [setLeftSlotEl]
  );

  return (
    <div className="h-[49px] flex items-center bg-background text-foreground px-4 top-0 sticky z-10 gap-2">
      <div className="flex items-center flex-1 min-w-0 gap-1">
        <div className="md:hidden flex-shrink-0">
          {!onDashboard ? (
            <IconButton
              aria-label={t`Back`}
              icon={<LuArrowLeft />}
              variant="ghost"
              onClick={() => navigate(-1)}
            />
          ) : null}
        </div>
        <div
          data-breadcrumbs
          className={cn(
            "flex items-center min-w-0 flex-shrink",
            hideBreadcrumbsOnMobile && "hidden"
          )}
        >
          <Breadcrumbs />
        </div>
        {/* Portal target — detail identity renders after breadcrumbs */}
        <div
          data-slot
          ref={slotRef}
          className="flex items-center min-w-0 overflow-hidden"
        />
      </div>
      <HStack spacing={1} className="flex-shrink-0 py-2">
        {permissions.is("employee") ? <Search /> : null}
        <div className="hidden md:block">
          <Suggestion />
        </div>
        <CreateMenu
          trigger={
            <IconButton
              aria-label={t`Create`}
              icon={<LuSquarePen />}
              variant="ghost"
            />
          }
        />
        <Notifications key={notificationsKey} />
        <AvatarMenu />
      </HStack>
    </div>
  );
};

export default Topbar;
