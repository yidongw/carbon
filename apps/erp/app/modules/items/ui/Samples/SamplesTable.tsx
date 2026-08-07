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
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import { path } from "~/utils/path";

type SamplesTableProps = {
  data: StyleSample[];
  count: number;
};

type StyleAttributeColumn = {
  attributeId: string;
  code: string;
  name: string;
  values: Array<{ id: string; code: string; name: string }>;
};

function styleAttributes(row: StyleSample): StyleAttributeColumn[] {
  const attrs = (row as { attributes?: unknown }).attributes;
  return Array.isArray(attrs) ? (attrs as StyleAttributeColumn[]) : [];
}

const SamplesTable = memo(({ data, count }: SamplesTableProps) => {
  const { t, i18n } = useLingui();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const permissions = usePermissions();
  const canCreate = permissions.can("create", "parts");

  const attrMeta = useMemo(() => {
    const meta = new Map<string, { code: string; name: string }>();
    for (const row of data) {
      for (const a of styleAttributes(row)) {
        if (!a.code) continue;
        if (!meta.has(a.code)) {
          meta.set(a.code, { code: a.code, name: a.name || a.code });
        }
      }
    }
    return meta;
  }, [data]);

  const attrCodes = useMemo(() => {
    return Array.from(attrMeta.keys()).sort((a, b) => {
      const rank = (c: string) => (c === "Color" ? 0 : c === "Size" ? 1 : 2);
      const d = rank(a) - rank(b);
      return d !== 0 ? d : a.localeCompare(b);
    });
  }, [attrMeta]);

  const columns = useMemo<ColumnDef<StyleSample>[]>(() => {
    const cols: ColumnDef<StyleSample>[] = [
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
      }
    ];

    for (const code of attrCodes) {
      const meta = attrMeta.get(code)!;
      cols.push({
        id: `attr-${code}`,
        header: translateItemAttributeCatalogName(meta.name || code, i18n),
        cell: ({ row }) => {
          const attr = styleAttributes(row.original).find(
            (a) => a.code === code
          );
          const values = attr?.values ?? [];
          if (values.length === 0) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <HStack spacing={1} className="flex-wrap">
              {values.map((v) => (
                <Badge
                  key={v.id}
                  variant="outline"
                  title={`${meta.name}: ${v.code}`}
                >
                  {v.name || v.code}
                </Badge>
              ))}
            </HStack>
          );
        },
        meta: { icon: <LuPalette /> }
      });
    }

    cols.push({
      accessorKey: "sampleCount",
      header: t`Samples`,
      cell: ({ row }) => {
        const samples = (row.original.samples ?? []) as Array<{
          label?: string;
          attributes?: Record<string, string>;
          quantity: number;
        }>;
        const sampleItemId = row.original.sampleItemId;
        const chips = samples.map((s, i) => {
          const label =
            s.label ??
            (s.attributes
              ? Object.values(s.attributes).filter(Boolean).join(" · ")
              : "");
          return (
            <Badge
              key={`${label}-${i}`}
              variant="outline"
              className="font-normal"
            >
              {label || "—"}
              <span className="ml-1 font-mono text-muted-foreground">
                ×{s.quantity}
              </span>
            </Badge>
          );
        });
        return (
          <HStack spacing={1} className="flex-wrap py-1">
            {sampleItemId && samples.length > 0 ? (
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
    });

    return cols;
  }, [t, i18n, attrCodes, attrMeta, canCreate, openOverlay, revalidator]);

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
