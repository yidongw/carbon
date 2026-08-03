import { Badge, HStack, IconButton, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { LuBookMarked, LuPalette, LuPlus, LuScanBarcode } from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Hyperlink, ItemThumbnail, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import type { StyleSample } from "~/modules/items";
import { path } from "~/utils/path";

type SamplesTableProps = {
  data: StyleSample[];
  count: number;
};

const SamplesTable = memo(({ data, count }: SamplesTableProps) => {
  const { t } = useLingui();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const permissions = usePermissions();
  const canCreate = permissions.can("create", "parts");

  const columns = useMemo<ColumnDef<StyleSample>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: t`Style`,
        cell: ({ row }) => (
          <HStack className="py-1 w-full min-w-0 max-w-[240px]" spacing={2}>
            <ItemThumbnail
              size="md"
              thumbnailPath={row.original.thumbnailPath}
              type="Style"
            />
            <Hyperlink to={path.to.style(row.original.id!)} className="min-w-0">
              <VStack spacing={0} className="min-w-0">
                <span className="w-full truncate">
                  {row.original.readableIdWithRevision}
                </span>
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.name}
                </div>
              </VStack>
            </Hyperlink>
          </HStack>
        ),
        meta: { icon: <LuBookMarked /> }
      },
      {
        accessorKey: "colors",
        header: t`Colors`,
        cell: ({ row }) => {
          const colors = (row.original.colors ?? []) as Array<{
            id: string;
            colorCode: string;
            colorName: string;
          }>;
          if (!Array.isArray(colors) || colors.length === 0) return null;
          return (
            <HStack spacing={1} className="flex-wrap">
              {colors.map((color) => (
                <Badge key={color.id} variant="outline" title={color.colorCode}>
                  {color.colorName || color.colorCode}
                </Badge>
              ))}
            </HStack>
          );
        },
        meta: { icon: <LuPalette /> }
      },
      {
        accessorKey: "sampleCount",
        header: t`Samples`,
        cell: ({ row }) => {
          const samples = (row.original.samples ?? []) as Array<{
            colorCode: string;
            colorName: string;
            size: string;
            quantity: number;
          }>;
          const sampleItemId = row.original.sampleItemId;
          const chips = samples.map((s, i) => (
            <Badge
              key={`${s.colorCode}-${s.size}-${i}`}
              variant="outline"
              className="font-normal"
            >
              {`${s.colorName || s.colorCode} · ${s.size}`}
              <span className="ml-1 font-mono text-muted-foreground">
                ×{s.quantity}
              </span>
            </Badge>
          ));
          return (
            <HStack spacing={1} className="flex-wrap py-1">
              {sampleItemId && samples.length > 0 ? (
                // Open the sample item's inventory page (serial list + move /
                // reduce / ship live there — the standard serial-tracking UI).
                <Hyperlink
                  to={path.to.inventoryItem(sampleItemId)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  className="flex flex-wrap items-center gap-1"
                >
                  {chips}
                </Hyperlink>
              ) : (
                chips
              )}
              {canCreate && (
                <IconButton
                  aria-label={t`Add sample`}
                  variant="secondary"
                  size="sm"
                  icon={<LuPlus />}
                  onClick={(e) => {
                    // row is a link; don't navigate to the style page
                    e.preventDefault();
                    e.stopPropagation();
                    openOverlay(
                      overlay.to.newStyleSample({
                        styleId: row.original.readableId!
                      }),
                      { onCreated: () => revalidator.revalidate() }
                    );
                  }}
                />
              )}
            </HStack>
          );
        },
        meta: { icon: <LuScanBarcode /> }
      }
    ];
  }, [t, canCreate, openOverlay, revalidator]);

  return (
    <Table<StyleSample>
      count={count}
      columns={columns}
      data={data}
      defaultColumnPinning={{ left: ["id"] }}
      getRowHref={(row) => (row.id ? path.to.style(row.id) : undefined)}
      title={t`Samples`}
      table="style"
      searchReloadDocument
    />
  );
});

SamplesTable.displayName = "SamplesTable";

export default SamplesTable;
