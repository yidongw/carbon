import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import {
  supplierQuoteValidator,
  upsertSupplierQuote
} from "~/modules/purchasing";
import { getNextSequence } from "~/modules/settings/settings.service";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Supplier Quote`,
  to: path.to.supplierQuotes,
  module: "purchasing"
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing",
    bypassRls: true
  });

  const formData = await request.formData();
  const validation = await validator(supplierQuoteValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  let supplierQuoteId = validation.data.supplierQuoteId;
  const useNextSequence = !supplierQuoteId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(
      client,
      "supplierQuote",
      companyId
    );
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
    supplierQuoteId = nextSequence.data;
  }

  if (!supplierQuoteId) throw new Error("supplierQuoteId is not defined");

  const createSupplierQuote = await upsertSupplierQuote(client, {
    ...validation.data,
    supplierQuoteId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSupplierQuote.error || !createSupplierQuote.data?.id) {
    return data(
      {
        data: createSupplierQuote.data,
        error: {
          message: "Failed to insert supplier quote"
        }
      },
      await flash(
        request,
        error(createSupplierQuote.error, "Failed to insert supplier quote")
      )
    );
  }

  return data({ data: createSupplierQuote.data }, { status: 201 });
}

export default function SupplierQuoteNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newSupplierQuote}
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
