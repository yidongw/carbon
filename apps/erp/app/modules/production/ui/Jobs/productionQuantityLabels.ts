import { formatDurationMilliseconds } from "@carbon/utils";
import { useLingui } from "@lingui/react/macro";

export const PRODUCTION_QUANTITY_TYPES = [
  "Production",
  "Rework",
  "Scrap"
] as const;

export type ProductionQuantityType = (typeof PRODUCTION_QUANTITY_TYPES)[number];

export function useProductionQuantityTypeLabel() {
  const { t } = useLingui();

  return (type: string) => {
    switch (type) {
      case "Production":
        return t`Production`;
      case "Rework":
        return t`Rework`;
      case "Scrap":
        return t`Scrap`;
      default:
        return type;
    }
  };
}

type ProductionQuantityActivityItem = {
  type: string;
  quantity: number | null;
  scrapReason?: { name: string | null } | null;
};

export function useProductionQuantityActivityMessage() {
  const { t } = useLingui();

  return (item: ProductionQuantityActivityItem) => {
    const qty = item.quantity;
    switch (item.type) {
      case "Scrap": {
        const reason = item.scrapReason?.name;
        return reason
          ? t`recorded ${qty} units (${reason})`
          : t`recorded ${qty} units`;
      }
      default:
        return t`recorded ${qty} units`;
    }
  };
}

export function useOperationTypeLabel() {
  const { t } = useLingui();

  return (type: string) => {
    switch (type) {
      case "Inside":
        return t`Inside`;
      case "Outside":
        return t`Outside`;
      default:
        return type;
    }
  };
}

export function useOperationOrderLabel() {
  const { t } = useLingui();

  return (order: string) => {
    switch (order) {
      case "After Previous":
        return t`After Previous`;
      case "With Previous":
        return t`With Previous`;
      default:
        return order;
    }
  };
}

export function useRelativeCreatedUpdatedText() {
  const { t } = useLingui();

  return (isUpdated: boolean, relativeTime: string) =>
    isUpdated ? t`Updated ${relativeTime}` : t`Created ${relativeTime}`;
}

type ProductionEventActivityItem = {
  type: string | null;
  duration: number | null;
};

export function useProductionEventActivityMessage() {
  const { t } = useLingui();

  return (item: ProductionEventActivityItem) => {
    switch (item.type ?? "") {
      case "Setup":
        return item.duration
          ? t`did ${formatDurationMilliseconds(item.duration * 1000)} of setup`
          : t`started setup`;
      case "Labor":
        return item.duration
          ? t`did ${formatDurationMilliseconds(item.duration * 1000)} of labor`
          : t`started labor`;
      case "Machine":
        return item.duration
          ? t`did ${formatDurationMilliseconds(item.duration * 1000)} of machine`
          : t`started machine`;
      default:
        return "";
    }
  };
}
