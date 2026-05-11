/**
 * /x/.../new modal routes render the same Card-based forms as full-page create.
 * The dialog shell stays for overlay + focus trap + close control, but should not
 * add a second “white box” or extra vertical padding around that Card.
 */
export const newEntityRouteModalContentClassName =
  "w-full !max-w-4xl mx-auto !gap-0 !pt-0 !px-0 !pb-0 bg-transparent border-0 shadow-none sm:rounded-none dark:!shadow-none";

export const newEntityRouteModalBodyClassName = "!p-0 !m-0 w-full";

/** Sits in the Card header row once outer modal padding is removed. */
export const newEntityRouteModalCloseButtonClassName = "top-3.5 right-5";
