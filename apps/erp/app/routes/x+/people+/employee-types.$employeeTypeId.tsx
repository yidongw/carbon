import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import {
  EmployeeTypeForm,
  employeeTypePermissionsValidator,
  employeeTypeValidator,
  getEmployeeType,
  getModules,
  getPermissionsByEmployeeType,
  MES_PERMISSIONS,
  upsertEmployeeType,
  upsertEmployeeTypePermissions
} from "~/modules/users";
import {
  makeCompanyPermissionsFromEmployeeType,
  makeEmptyPermissionsFromModules
} from "~/modules/users/users.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "users",
    role: "employee"
  });

  const { employeeTypeId } = params;
  if (!employeeTypeId) throw notFound("employeeTypeId not found");

  const [employeeType, employeeTypePermissions, modules] = await Promise.all([
    getEmployeeType(client, employeeTypeId),
    getPermissionsByEmployeeType(client, employeeTypeId),
    getModules(client)
  ]);

  // Render the full module catalog (all-false), then overlay this type's stored
  // permissions. Otherwise the matrix only shows modules that already have a row,
  // so a type seeded with a subset (e.g. an MES type) can never be granted the
  // missing modules — including Items (`parts`). Both maps key by the PascalCase
  // module name, so a shallow overlay merges cleanly.
  const stored = makeCompanyPermissionsFromEmployeeType(
    employeeTypePermissions.data ?? [],
    companyId
  );

  return {
    employeeType: employeeType?.data,
    employeeTypePermissions: {
      ...makeEmptyPermissionsFromModules(modules.data ?? []),
      ...stored
    }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId } = await requirePermissions(request, {
    update: "users"
  });

  const validation = await validator(employeeTypeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, mesOnly, data: permissionData } = validation.data;
  if (!id) throw notFound("id not found");

  const permissions = JSON.parse(permissionData);
  const jsonValidation =
    employeeTypePermissionsValidator.safeParse(permissions);
  if (jsonValidation.success === false) {
    return data(
      {},
      await flash(
        request,
        error(jsonValidation.error, "Failed to parse permissions")
      )
    );
  }

  const updateEmployeeType = await upsertEmployeeType(client, {
    id,
    name,
    mesOnly
  });

  if (updateEmployeeType.error) {
    return data(
      {},
      await flash(
        request,
        error(updateEmployeeType.error, "Failed to update employee type")
      )
    );
  }

  const updateEmployeeTypePermissions = await upsertEmployeeTypePermissions(
    client,
    id,
    companyId,
    mesOnly ? MES_PERMISSIONS : permissions
  );

  if (updateEmployeeTypePermissions.error) {
    return data(
      {},
      await flash(
        request,
        error(
          updateEmployeeTypePermissions.error,
          "Failed to update employee type permissions"
        )
      )
    );
  }

  throw redirect(
    path.to.employeeTypes,
    await flash(request, success("Updated employee type"))
  );
}

export default function EditEmployeeTypesRoute() {
  const { employeeType, employeeTypePermissions } =
    useLoaderData<typeof loader>();

  const initialValues = {
    id: employeeType?.id ?? "",
    name: employeeType?.name ?? "",
    mesOnly: employeeType?.mesOnly ?? false,
    permissions: employeeTypePermissions
  };

  return (
    <EmployeeTypeForm
      key={initialValues.id}
      // @ts-expect-error
      initialValues={initialValues}
    />
  );
}
