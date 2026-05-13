import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs } from "react-router";
import { data, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import { salesRfqValidator, upsertSalesRFQ } from "~/modules/sales";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`RFQs`,
  to: path.to.salesRfqs
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const formData = await request.formData();
  const validation = await validator(salesRfqValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  let rfqId = validation.data.rfqId;
  const useNextSequence = !rfqId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(client, "salesRfq", companyId);
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
    rfqId = nextSequence.data;
  }

  if (!rfqId) throw new Error("rfqId is not defined");

  const createSalesRFQ = await upsertSalesRFQ(client, {
    ...validation.data,
    rfqId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSalesRFQ.error || !createSalesRFQ.data?.[0]) {
    return data(
      {
        data: createSalesRFQ.data,
        error: {
          message: "Failed to insert RFQ"
        }
      },
      await flash(request, error(createSalesRFQ.error, "Failed to insert RFQ"))
    );
  }

  return data(createSalesRFQ, { status: 201 });
}

export default function SalesRFQNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newSalesRFQ}
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
