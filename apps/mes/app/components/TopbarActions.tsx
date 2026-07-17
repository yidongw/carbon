import Suggestion from "./Suggestion";
import { TopbarProfile } from "./TopbarProfile";

/**
 * The right-hand cluster of the MES top bar (like the ERP topbar): the
 * Suggestion action and the profile menu. Used on every page's header.
 */
export function TopbarActions() {
  return (
    <>
      <Suggestion variant="topbar" />
      <TopbarProfile />
    </>
  );
}
