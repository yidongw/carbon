import type { BadgeProps } from "@carbon/react";
import { Badge, cn, useMode } from "@carbon/react";
import type { Color } from "@carbon/utils";
import { getColor, getColorByValue } from "@carbon/utils";
import { CARD_ACTION_VALUE_CLASS } from "~/components/Table/components/CardFieldChip";

type EnumerableProps = BadgeProps & {
  value: string | null;
  color?: Color;
};

const Enumerable = ({
  value,
  color,
  className,
  onClick,
  ...props
}: EnumerableProps) => {
  const mode = useMode();
  if (!value) return null;

  const style = color ? getColor(color, mode) : getColorByValue(value, mode);
  return (
    <Badge
      style={{ ...style, borderColor: `${style.color}33` }}
      className={cn(onClick && CARD_ACTION_VALUE_CLASS, className)}
      onClick={onClick}
      {...props}
    >
      {value}
    </Badge>
  );
};

export { Enumerable };
