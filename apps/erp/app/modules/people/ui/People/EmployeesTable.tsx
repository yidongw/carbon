import {
  Badge,
  Button,
  Checkbox,
  HStack,
  MenuIcon,
  MenuItem
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuCirclePlus,
  LuMail,
  LuMapPin,
  LuNetwork,
  LuPencil,
  LuToggleRight,
  LuUser,
  LuUserCheck
} from "react-icons/lu";
import { useNavigate, useRevalidator } from "react-router";
import { Avatar, EmployeeAvatar, Hyperlink, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useLocations } from "~/components/Form/Location";
import { editableCell } from "~/components/InlineEditor";
import { overlay, useOverlay } from "~/components/Overlay";
import { useFormatPersonName, usePermissions, useUrlParams } from "~/hooks";
import { DataType } from "~/modules/shared";
import { path } from "~/utils/path";
import type { AttributeCategory, Person } from "../../types";

// People inline edits fan out (firstName/lastName -> user, location ->
// employeeJob), keyed by user id — same as the employees permissions table,
// so they share the employees bulk-update action.
const PEOPLE_UPDATE = {
  action: path.to.bulkUpdateEmployee,
  idKey: "ids" as const
};

type EmployeesTableProps = {
  attributeCategories: AttributeCategory[];
  data: Person[];
  count: number;
  departmentByEmployeeId: Record<string, string | null>;
};

const EmployeesTable = memo(
  ({
    attributeCategories,
    data,
    count,
    departmentByEmployeeId
  }: EmployeesTableProps) => {
    const { t } = useLingui();
    const { locale } = useLocale();
    const formatPersonName = useFormatPersonName();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const locations = useLocations();
    const [params] = useUrlParams();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewEmployee = useCallback(() => {
      openOverlay(overlay.to.newEmployee(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const renderGenericAttribute = useCallback(
      (
        value?: string | number | boolean,
        dataType?: DataType,
        user?: {
          id: string;
          fullName: string | null;
          avatarUrl: string | null;
        } | null
      ) => {
        if (!value || !dataType) return null;

        if (dataType === DataType.Boolean) {
          return value === true ? "Yes" : "No";
        }

        if (dataType === DataType.Date) {
          return new Date(value as string).toLocaleDateString(locale);
        }

        if (dataType === DataType.Numeric) {
          return Number(value).toLocaleString();
        }

        if (dataType === DataType.Text || dataType === DataType.List) {
          return value;
        }

        if (dataType === DataType.User) {
          if (!user) return null;
          const name = formatPersonName({ fullName: user.fullName });
          return (
            <HStack>
              <Avatar
                size="sm"
                name={name || undefined}
                path={user.avatarUrl}
              />
              <p>{name}</p>
            </HStack>
          );
        }

        return "Unknown";
      },
      [formatPersonName, locale]
    );

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      const defaultColumns: ColumnDef<(typeof data)[number]>[] = [
        {
          header: t`Account`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.personDetails(row.original.id!)}>
              <EmployeeAvatar
                size="sm"
                employeeId={row.original.id}
                fallback={{
                  firstName: row.original.firstName,
                  lastName: row.original.lastName,
                  fullName: row.original.name,
                  avatarUrl: row.original.avatarUrl
                }}
              />
            </Hyperlink>
          ),
          meta: {
            icon: <LuUser />
          }
        },

        {
          accessorKey: "firstName",
          header: t`First Name`,
          cell: editableCell<Person>({
            kind: "text",
            field: "firstName",
            update: PEOPLE_UPDATE,
            value: (r) => r.firstName
          }),
          meta: {
            icon: <LuUser />
          }
        },
        {
          accessorKey: "lastName",
          header: t`Last Name`,
          cell: editableCell<Person>({
            kind: "text",
            field: "lastName",
            update: PEOPLE_UPDATE,
            value: (r) => r.lastName
          }),
          meta: {
            icon: <LuUser />
          }
        },
        {
          accessorKey: "email",
          header: t`Email or Phone`,
          // Phone-only invitees have no email — show their phone so they aren't
          // blank. `phone` isn't in the generated view types until db:types runs.
          cell: (item) =>
            item.getValue<string | null>() ||
            (item.row.original as { phone?: string | null }).phone ||
            "",
          meta: {
            icon: <LuMail />
          }
        },
        {
          id: "department",
          header: t`Department`,
          cell: ({ row }) => departmentByEmployeeId[row.original.id!] ?? null,
          meta: {
            icon: <LuNetwork />
          }
        },
        {
          id: "locationId",
          header: t`Location`,
          cell: editableCell<Person>({
            kind: "picker",
            field: "locationId",
            update: PEOPLE_UPDATE,
            value: (r) => r.locationId,
            clearable: true,
            options: locations,
            fallbackLabel: (r) => r.locationName
          }),
          meta: {
            filter: {
              type: "static",
              options: locations.map((location) => ({
                value: location.value,
                label: <Enumerable value={location.label} />
              }))
            },
            icon: <LuMapPin />
          }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: (item) => {
            const status = item.getValue<
              "Active" | "Invited" | "Inactive" | null
            >();
            if (status === "Active")
              return <Badge variant="green">{t`Active`}</Badge>;
            if (status === "Invited")
              return <Badge variant="yellow">{t`Invited`}</Badge>;
            return <Badge variant="secondary">{t`Inactive`}</Badge>;
          },
          meta: {
            filter: {
              type: "static",
              options: [
                { value: "Active", label: t`Active` },
                { value: "Invited", label: t`Invited` },
                { value: "Inactive", label: t`Inactive` }
              ]
            },
            icon: <LuUserCheck />
          }
        },
        {
          accessorKey: "active",
          header: t`Active`,
          cell: (item) => <Checkbox isChecked={item.getValue<boolean>()} />,
          meta: {
            icon: <LuToggleRight />
          }
        }
      ];

      const additionalColumns: ColumnDef<(typeof data)[number]>[] = [];

      attributeCategories.forEach((category) => {
        if (category.userAttribute && Array.isArray(category.userAttribute)) {
          category.userAttribute.forEach((attribute) => {
            additionalColumns.push({
              id: attribute.id,
              header: attribute?.name ?? "",
              cell: ({ row }) =>
                renderGenericAttribute(
                  row?.original?.attributes?.[attribute?.id]?.value,
                  row?.original?.attributes?.[attribute?.id]?.dataType,
                  row?.original?.attributes?.[attribute?.id]?.user
                )
            });
          });
        }
      });

      return [...defaultColumns, ...additionalColumns];
    }, [
      attributeCategories,
      departmentByEmployeeId,
      locations,
      renderGenericAttribute,
      t
    ]);

    const renderContextMenu = useMemo(() => {
      return permissions.can("update", "people")
        ? (row: (typeof data)[number]) => {
            return (
              <MenuItem
                onClick={() =>
                  navigate(
                    `${path.to.personDetails(row.id!)}?${params.toString()}`
                  )
                }
              >
                <MenuIcon icon={<LuPencil />} />
                <Trans>Edit Employee</Trans>
              </MenuItem>
            );
          }
        : undefined;
    }, [navigate, params, permissions]);

    return (
      <>
        <Table<(typeof data)[number]>
          count={count}
          columns={columns}
          data={data}
          defaultColumnPinning={{
            left: ["Select", "Account"]
          }}
          primaryAction={
            permissions.can("create", "users") && (
              <Button
                type="button"
                variant="primary"
                leftIcon={<LuCirclePlus />}
                onClick={openNewEmployee}
              >
                <Trans>Add Employee</Trans>
              </Button>
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Employees`}
          table="employee"
          withSavedView
        />
      </>
    );
  }
);

EmployeesTable.displayName = "EmployeesTable";

export default EmployeesTable;
