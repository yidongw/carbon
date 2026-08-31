import {
  Button,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { Reorder } from "framer-motion";
import { BsChevronDown, BsSortUp } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { LuArrowUpDown, LuGripVertical } from "react-icons/lu";
import { useSort } from "./useSort";

type SortProps = {
  columnAccessors: Record<string, string>;
  // When true the sort surface renders as a controlled drawer (no icon trigger)
  // instead of a popover, so it can be opened from an external "..." menu item
  // on mobile — the popover is both too wide for narrow screens and can't anchor
  // to a menu item that unmounts on select.
  asDrawer?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Sort = ({
  columnAccessors,
  asDrawer = false,
  open,
  onOpenChange
}: SortProps) => {
  const { t } = useLingui();
  const {
    sorts,
    removeSortBy,
    reorderSorts,
    toggleSortBy,
    toggleSortByDirection
  } = useSort();
  const hasNoSorts = sorts.length === 0;

  const emptyHint = (
    <>
      <p className="text-sm">
        <Trans>No sorts applied to this view</Trans>
      </p>
      <p className="text-xs text-muted-foreground">
        <Trans>Add a column below to sort the view</Trans>
      </p>
    </>
  );

  const sortList = (
    <Reorder.Group
      axis="y"
      values={sorts}
      onReorder={reorderSorts}
      className="space-y-2"
    >
      {sorts.map((sort) => {
        const [column, direction] = sort.split(":");
        return (
          <Reorder.Item key={sort} value={sort} className="rounded-lg">
            <HStack>
              <IconButton
                aria-label={t`Drag handle`}
                icon={<LuGripVertical />}
                variant="ghost"
              />
              <span className="text-sm flex-grow">
                <>{columnAccessors[column] ?? ""}</>
              </span>
              <Switch
                checked={direction === "asc"}
                onCheckedChange={() => toggleSortByDirection(column)}
              />
              <span className="text-sm text-muted-foreground">
                <Trans>Ascending</Trans>
              </span>
              <IconButton
                aria-label={t`Remove sort by column`}
                icon={<IoMdClose />}
                onClick={() => removeSortBy(sort)}
                variant="ghost"
              />
            </HStack>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );

  const columnPicker = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button rightIcon={<BsChevronDown />} variant="secondary">
          <Trans>Pick a column to sort by</Trans>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {Object.keys(columnAccessors)
          .filter((columnAccessor) => {
            return !sorts
              .map((sort) => sort.split(":")[0])
              .includes(columnAccessor);
          })
          .map((columnAccessor) => {
            return (
              <DropdownMenuItem
                key={columnAccessor}
                onClick={() => toggleSortBy(columnAccessor)}
              >
                <DropdownMenuIcon icon={<BsSortUp />} />
                {columnAccessors[columnAccessor]}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (asDrawer) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Trans>Sort by</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            {hasNoSorts ? emptyHint : sortList}
            {columnPicker}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <IconButton
              aria-label={t`Sort`}
              title={t`Sort`}
              variant={hasNoSorts ? "ghost" : "active"}
              icon={<LuArrowUpDown />}
              className={cn(hasNoSorts && "!border-dashed border-border")}
            />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            <Trans>Sort by</Trans>
          </p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[420px]">
        {hasNoSorts && <PopoverHeader>{emptyHint}</PopoverHeader>}
        {!hasNoSorts && sortList}
        <PopoverFooter>{columnPicker}</PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default Sort;
