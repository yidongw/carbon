import { Badge, HStack, IconButton, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { LuBookMarked, LuHash, LuPlus } from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Hyperlink, ItemThumbnail, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import type { StyleSample, StyleSampleFlatRow } from "~/modules/items";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { path } from "~/utils/path";

type SamplesTableProps = {
  data: StyleSample[];
  count: number;
};

function flattenSamples(data: StyleSample[]): StyleSampleFlatRow[] {
  const rows: StyleSampleFlatRow[] = [];
  for (const style of data) {
    const samples = Array.isArray(style.samples) ? style.samples : [];
    if (samples.length === 0) {
      rows.push({
        rowKey: `${style.id ?? style.readableId}-empty`,
        styleId: style.id,
        readableId: style.readableId,
        readableIdWithRevision: style.readableIdWithRevision,
        name: style.name,
        thumbnailPath: style.thumbnailPath,
        sampleItemId: style.sampleItemId ?? null,
        valuesByCode: {},
        quantity: 0
      });
      continue;
    }
    for (const [i, sample] of samples.entries()) {
      const attrs =
        sample.attributes && typeof sample.attributes === "object"
          ? (sample.attributes as Record<string, string>)
          : {};
      rows.push({
        rowKey: `${style.id ?? style.readableId}-${i}-${sample.label ?? i}`,
        styleId: style.id,
        readableId: style.readableId,
        readableIdWithRevision: style.readableIdWithRevision,
        name: style.name,
        thumbnailPath: style.thumbnailPath,
        sampleItemId: style.sampleItemId ?? null,
        valuesByCode: attrs,
        quantity: sample.quantity ?? 0
      });
    }
  }
  return rows;
}

const SamplesTable = memo(({ data, count }: SamplesTableProps) => {
  const { t, i18n } = useLingui();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const permissions = usePermissions();
  const canCreate = permissions.can("create", "parts");

  const flatRows = useMemo(() => flattenSamples(data), [data]);

  const attrCodes = useMemo(() => {
    const codes = new Set<string>();
    for (const row of flatRows) {
      for (const code of Object.keys(row.valuesByCode)) {
        if (code) codes.add(code);
      }
    }
    // Prefer Color then Size then alpha for stable garment layouts.
    return Array.from(codes).sort((a, b) => {
      const rank = (c: string) => (c === "Color" ? 0 : c === "Size" ? 1 : 2);
      const d = rank(a) - rank(b);
      return d !== 0 ? d : a.localeCompare(b);
    });
  }, [flatRows]);

  const columns = useMemo<ColumnDef<StyleSampleFlatRow>[]>(() => {
    const cols: ColumnDef<StyleSampleFlatRow>[] = [
      {
        accessorKey: "readableIdWithRevision",
        header: t`Style`,
        cell: ({ row }) => (
          <HStack className="py-1 w-full min-w-0 max-w-[240px]" spacing={2}>
            <ItemThumbnail
              size="md"
              thumbnailPath={row.original.thumbnailPath}
              type="Style"
            />
            <Hyperlink
              to={
                row.original.styleId ? path.to.style(row.original.styleId) : "#"
              }
              className="min-w-0"
            >
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
      }
    ];

    for (const code of attrCodes) {
      cols.push({
        id: `attr:${code}`,
        header: translateItemAttributeCatalogName(code, i18n),
        cell: ({ row }) => {
          const value = row.original.valuesByCode[code];
          if (!value) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <Badge variant="outline" className="font-normal">
              {value}
            </Badge>
          );
        }
      });
    }

    cols.push({
      accessorKey: "quantity",
      header: t`Qty`,
      cell: ({ row }) => {
        const qty = row.original.quantity;
        const sampleItemId = row.original.sampleItemId;
        const body =
          qty > 0 ? (
            <span className="tabular-nums font-mono">{qty}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        return (
          <HStack spacing={1} className="items-center">
            {sampleItemId && qty > 0 ? (
              <Hyperlink
                to={path.to.inventoryItem(sampleItemId)}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {body}
              </Hyperlink>
            ) : (
              body
            )}
            {canCreate && row.original.readableId ? (
              <IconButton
                aria-label={t`Add sample`}
                variant="secondary"
                size="sm"
                icon={<LuPlus />}
                onClick={(e) => {
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
            ) : null}
          </HStack>
        );
      },
      meta: { icon: <LuHash /> }
    });

    return cols;
  }, [t, i18n, attrCodes, canCreate, openOverlay, revalidator]);

  return (
    <Table<StyleSampleFlatRow>
      count={count}
      columns={columns}
      data={flatRows}
      defaultColumnPinning={{ left: ["readableIdWithRevision"] }}
      getRowHref={(row) =>
        row.styleId ? path.to.style(row.styleId) : undefined
      }
      title={t`Samples`}
      table="style"
      searchReloadDocument
    />
  );
});

SamplesTable.displayName = "SamplesTable";

export default SamplesTable;
