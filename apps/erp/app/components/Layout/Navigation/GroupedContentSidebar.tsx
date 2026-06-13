import {
  Button,
  buttonVariants,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  useDebounce,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuChevronRight,
  LuEllipsisVertical,
  LuGripVertical,
  LuTrash
} from "react-icons/lu";
import { Link, useNavigate, useSubmit } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { useOptimisticLocation } from "~/hooks";
import type { RouteGroup } from "~/types";
import { path } from "~/utils/path";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

function routeIsActive(
  routeTo: string,
  pathname: string,
  search: string,
  exact: boolean
) {
  const routePathname = routeTo.split("?")[0];
  if (exact) return pathname === routePathname;
  return (
    pathname.includes(routePathname) &&
    !`${pathname}${search}`.includes("view=")
  );
}

const MobileGroupedNav = ({
  groups,
  exactMatch = false
}: {
  groups: RouteGroup[];
  exactMatch?: boolean;
}) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const location = useOptimisticLocation();

  const directGroupNames = [t`Dashboard`, t`Manage`];

  return (
    <div className="w-full flex items-center gap-1 px-2 py-1.5 bg-card border-b border-border overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {groups.map((group) => {
        if (directGroupNames.includes(group.name)) {
          return group.routes.map((route) => {
            const isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
            return (
              <Button
                key={route.name}
                asChild
                leftIcon={route.icon}
                variant={isActive ? "active" : "ghost"}
                size="sm"
                className="shrink-0"
              >
                <Link
                  to={route.to + (route.q ? `?q=${route.q}` : "")}
                  prefetch="intent"
                  replace
                >
                  {route.name}
                </Link>
              </Button>
            );
          });
        }

        if (group.routes.length === 1) {
          const route = group.routes[0];
          const isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
          return (
            <Button
              key={route.name}
              asChild
              leftIcon={route.icon}
              variant={isActive ? "active" : "ghost"}
              size="sm"
              className="shrink-0"
            >
              <Link
                to={route.to + (route.q ? `?q=${route.q}` : "")}
                prefetch="intent"
                replace
              >
                {route.name}
              </Link>
            </Button>
          );
        }

        const isGroupActive = group.routes.some((route) =>
          routeIsActive(route.to, location.pathname, location.search, exactMatch)
        );

        return (
          <DropdownMenu key={group.name}>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "shrink-0 gap-1 hover:bg-transparent",
                isGroupActive
                  ? "font-semibold text-foreground border-b-2 border-foreground/70 rounded-b-none"
                  : ""
              )}
            >
              {group.name}
              <LuChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {group.routes.map((route) => {
                const isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
                return (
                  <DropdownMenuItem
                    key={route.name}
                    onSelect={() =>
                      navigate(route.to + (route.q ? `?q=${route.q}` : ""), { replace: true })
                    }
                    className={cn(
                      isActive && "bg-active text-active-foreground"
                    )}
                  >
                    {route.icon && <DropdownMenuIcon icon={route.icon} />}
                    {route.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};

const GroupedContentSidebar = ({
  groups,
  width = 240,
  exactMatch = false
}: {
  groups: RouteGroup[];
  width?: number;
  exactMatch?: boolean;
}) => {
  return (
    <>
      {/* Mobile: horizontal nav bar. md:hidden removes it from flow on desktop (no JS, no flash). */}
      <div className="md:hidden">
        <MobileGroupedNav groups={groups} exactMatch={exactMatch} />
      </div>
      {/* Desktop: collapsible sidebar. display:contents makes CollapsibleSidebar a direct grid child. */}
      <div className="hidden md:contents">
        <GroupedContentSidebarDesktop groups={groups} width={width} exactMatch={exactMatch} />
      </div>
    </>
  );
};

const GroupedContentSidebarDesktop = ({
  groups,
  width = 240,
  exactMatch = false
}: {
  groups: RouteGroup[];
  width?: number;
  exactMatch?: boolean;
}) => {
  const { t } = useLingui();
  const location = useOptimisticLocation();
  const submit = useSubmit();

  const [expandedViews, setExpandedViews] = useState<Record<string, boolean>>(
    () =>
      groups.reduce(
        (acc, group) => {
          group.routes.forEach((route) => {
            if (route.views?.length) {
              acc[route.name] = true;
            }
          });
          return acc;
        },
        {} as Record<string, boolean>
      )
  );

  const [selectedView, setSelectedView] = useState<{
    id: string;
    name: string;
    to: string;
    sortOrder: number;
  } | null>(null);

  const toggleViews = (routeName: string) => {
    setExpandedViews((prev) => ({
      ...prev,
      [routeName]: !prev[routeName]
    }));
  };

  return (
    <CollapsibleSidebar width={width}>
      <div className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full w-full pb-8">
        <VStack>
          {groups.map((group) => (
            <VStack
              key={group.name}
              className="border-b border-border p-2 pb-4 space-y-0.5"
            >
              <h4 className="text-xxs text-foreground/70 uppercase font-light tracking-wide pl-4 py-1">
                {group.name}
              </h4>
              {group.routes.map((route) => {
                const isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);

                const hasViews = route.views && route.views.length > 0;
                const isExpanded = expandedViews[route.name];

                if (hasViews && !(route.name in expandedViews)) {
                  setExpandedViews((prev) => ({
                    ...prev,
                    [route.name]: true
                  }));
                }

                return (
                  <div className="w-full flex flex-col" key={route.name}>
                    <div className="flex items-center gap-x-0.5 relative">
                      <Button
                        asChild
                        leftIcon={route.icon}
                        variant={isActive ? "active" : "ghost"}
                        className={cn(
                          "justify-start flex-grow truncate",
                          isActive
                            ? "shadow-none dark:shadow-button-base"
                            : "hover:bg-active hover:text-active-foreground hover:scale-100 focus-visible:scale-100"
                        )}
                      >
                        <Link
                          to={route.to + (route.q ? `?q=${route.q}` : "")}
                          prefetch="intent"
                        >
                          {route.name}
                        </Link>
                      </Button>
                      {hasViews && (
                        <IconButton
                          aria-label={t`Toggle views`}
                          icon={
                            isExpanded ? <LuChevronDown /> : <LuChevronRight />
                          }
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleViews(route.name)}
                          className="absolute right-1 flex-shrink-0 text-foreground/70 hover:text-foreground"
                        />
                      )}
                    </div>
                    {hasViews && isExpanded && (
                      <ViewsReorderGroup
                        views={route.views ?? []}
                        location={location}
                        onReorder={(updates) => {
                          const formData = new FormData();
                          formData.append("updates", JSON.stringify(updates));
                          submit(formData, {
                            action: path.to.saveViewOrder,
                            method: "post",
                            navigate: false
                          });
                        }}
                        onDelete={(view) => setSelectedView(view)}
                      />
                    )}
                  </div>
                );
              })}
            </VStack>
          ))}
        </VStack>
      </div>
      {selectedView && (
        <ConfirmDelete
          isOpen={!!selectedView}
          action={path.to.deleteSavedView(selectedView.id)}
          name={selectedView.name}
          text={t`Are you sure you want to delete the view "${selectedView.name}"?`}
          onCancel={() => setSelectedView(null)}
          onSubmit={() => {
            setSelectedView(null);
          }}
        />
      )}
    </CollapsibleSidebar>
  );
};

const ViewsReorderGroup = ({
  views,
  location,
  onReorder,
  onDelete
}: {
  views: { id: string; name: string; to: string; sortOrder: number }[];
  location: ReturnType<typeof useOptimisticLocation>;
  onReorder: (
    updates: { id: string; name: string; to: string; sortOrder: number }[]
  ) => void;
  onDelete: (view: {
    id: string;
    name: string;
    to: string;
    sortOrder: number;
  }) => void;
}) => {
  const { t } = useLingui();
  const [sortedViews, setSortedViews] = useState(() => {
    if (views && views[Symbol.iterator]) {
      return [...views].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [];
  });

  const viewNames = views
    .map((view) => view.name)
    .sort()
    .join(",");

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    setSortedViews([...views].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [views.length, viewNames]);

  const debouncedOnReorder = useDebounce(onReorder, 500, true);

  return (
    <Reorder.Group
      axis="y"
      values={sortedViews}
      onReorder={(newOrder) => {
        const updates = newOrder.map((view, index) => ({
          ...view,
          sortOrder: index
        }));

        setSortedViews(updates);
        debouncedOnReorder(updates);
      }}
      className="flex flex-col gap-y-0.5 my-0.5"
    >
      {sortedViews.map((view) => {
        const isViewActive = `${location.pathname}${location.search}`.includes(
          `view=${view.id}`
        );

        return (
          <Reorder.Item key={view.to} value={view} className="w-full">
            <div className="group/view flex items-center relative">
              <Button
                asChild
                variant={isViewActive ? "active" : "ghost"}
                className={cn(
                  "justify-start text-sm pl-7 pr-7 truncate flex-grow !shadow-none",
                  isViewActive
                    ? "shadow-none border-active-foreground/30 dark:border-none dark:shadow-button-base"
                    : "hover:bg-active hover:text-active-foreground"
                )}
              >
                <Link to={view.to} prefetch="intent">
                  {view.name}
                </Link>
              </Button>
              <IconButton
                aria-label={t`Drag handle`}
                icon={<LuGripVertical />}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 opacity-0 group-hover/view:opacity-100 absolute left-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    aria-label={t`Options`}
                    icon={<LuEllipsisVertical />}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 flex-shrink-0 opacity-0 group-hover/view:opacity-100 data-[state=open]:opacity-100 text-foreground/70 hover:text-foreground"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem destructive onSelect={() => onDelete(view)}>
                    <DropdownMenuIcon icon={<LuTrash />} />
                    <Trans>Delete View</Trans>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

export default GroupedContentSidebar;
