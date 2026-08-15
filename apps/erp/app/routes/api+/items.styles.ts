import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getStylesList } from "~/modules/items";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});

  const styles = await getStylesList(client, companyId);
  if (styles.error) {
    return data(
      styles,
      await flash(request, error(styles.error, "Failed to get styles"))
    );
  }

  return styles;
}
