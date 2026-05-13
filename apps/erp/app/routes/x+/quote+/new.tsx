import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import { quoteValidator, upsertQuote } from "~/modules/sales";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Quotes`,
  to: path.to.quotes,
  module: "sales"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales",
    bypassRls: true
  });

  const formData = await request.formData();
  const validation = await validator(quoteValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  let quoteId = validation.data.quoteId;
  const useNextSequence = !quoteId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(client, "quote", companyId);
    if (nextSequence.error) {
      return data(
        {
          error: {
            message: "Failed to get next sequence"
          }
        },
        await flash(
          request,
          error(nextSequence.error, "Failed to get next sequence")
        )
      );
    }
    quoteId = nextSequence.data;
  }

  if (!quoteId) throw new Error("quoteId is not defined");

  const createQuote = await upsertQuote(client, {
    ...validation.data,
    quoteId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createQuote.error || !createQuote.data?.[0]) {
    return data(
      {
        data: createQuote.data,
        error: {
          message: "Failed to insert quote"
        }
      },
      await flash(request, error(createQuote.error, "Failed to insert quote"))
    );
  }

  return data(createQuote, { status: 201 });
}

export default function QuoteNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newQuote}
      searchParams={params}
      onClose={() => {
        if (from) {
          navigate(from);
        } else {
          navigate(-1);
        }
      }}
    />
  );
}
