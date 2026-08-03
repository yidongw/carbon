import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { getLocalTimeZone } from "@internationalized/date";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { useUser } from "~/hooks";
import {
  getPartnerLocations,
  LocationForm,
  locationValidator,
  upsertLocation
} from "~/modules/resources";
import { setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";
import { getCompanyId, locationsQuery } from "~/utils/react-query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "resources"
  });

  // A customer/supplier that already has a warehouse is hidden from the pickers so
  // it isn't given a second one.
  const partnerLocations = await getPartnerLocations(client, companyId);
  const used = (partnerLocations.data ?? []) as {
    customerId: string | null;
    supplierId: string | null;
  }[];

  return {
    excludeCustomers: used
      .map((l) => l.customerId)
      .filter((id): id is string => !!id),
    excludeSuppliers: used
      .map((l) => l.supplierId)
      .filter((id): id is string => !!id)
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "resources"
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(locationValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;

  const createLocation = await upsertLocation(client, {
    ...d,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createLocation.error) {
    return modal
      ? createLocation
      : redirect(
          path.to.locations,
          await flash(
            request,
            error(createLocation.error, "Failed to create location.")
          )
        );
  }

  return modal
    ? createLocation
    : redirect(
        path.to.locations,
        await flash(request, success("Location created"))
      );
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  window.clientCache?.setQueryData(
    locationsQuery(getCompanyId()).queryKey,
    null
  );
  return await serverAction();
}

export default function NewLocationRoute() {
  const navigate = useNavigate();
  const { company } = useUser();
  const { excludeCustomers, excludeSuppliers } = useLoaderData<typeof loader>();
  const onClose = () => navigate(path.to.locations);

  const initialValues = {
    name: "",
    timezone: getLocalTimeZone(),
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    countryCode: company?.countryCode ?? ""
  };

  return (
    <LocationForm
      initialValues={initialValues}
      onClose={onClose}
      excludeCustomers={excludeCustomers}
      excludeSuppliers={excludeSuppliers}
    />
  );
}
