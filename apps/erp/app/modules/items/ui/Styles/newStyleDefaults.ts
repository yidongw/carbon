import type { z } from "zod";
import type { styleValidator } from "../../style.models";

/** Static defaults for create-Style overlays/forms (no StyleForm import). */
export const newStyleInitialValues: z.infer<typeof styleValidator> = {
  id: "",
  revision: "0",
  name: "",
  description: "",
  itemTrackingType: "Inventory",
  replenishmentSystem: "Make",
  defaultMethodType: "Make to Order",
  unitOfMeasureCode: "EA",
  unitCost: 0,
  lotSize: 0,
  shelfLifeCalculateFromBom: false
};
