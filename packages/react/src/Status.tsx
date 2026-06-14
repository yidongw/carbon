import type { ComponentProps, ReactNode } from "react";
import {
  LuCircleAlert,
  LuCircleCheck,
  LuCircleDashed,
  LuCircleSlash,
  LuClock,
  LuLoaderCircle,
  LuStar
} from "react-icons/lu";
import { Badge } from "./Badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { cn } from "./utils/cn";

type StatusProps = ComponentProps<"div"> & {
  color?: "green" | "orange" | "red" | "yellow" | "blue" | "gray" | "purple";
  tooltip?: ReactNode;
  iconOnly?: boolean;
};

const getStatusIcon = (color: string) => {
  switch (color) {
    case "green":
      return <LuCircleCheck />;
    case "orange":
      return <LuCircleAlert />;
    case "red":
      return <LuCircleSlash />;
    case "yellow":
      return <LuClock />;
    case "blue":
      return <LuLoaderCircle />;
    case "purple":
      return <LuStar />;
    case "gray":
    default:
      return <LuCircleDashed />;
  }
};

const Status = ({
  color = "gray",
  children,
  tooltip,
  iconOnly = false,
  className,
  ...props
}: StatusProps) => {
  const tooltipContent = tooltip ?? children;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={color}
          className={cn(
            "inline-flex items-center gap-1",
            iconOnly && "px-1.5 shrink-0",
            className
          )}
          {...props}
        >
          {getStatusIcon(color)}
          {!iconOnly && children}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltipContent}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export { Status };
