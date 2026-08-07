import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { generateQRCode } from "../qr/qr-code";

/** One garment bundle ticket (扎标). */
export interface BundleTicketLabel {
  id: string;
  /** Human-readable bundle id (e.g. `NE-BK-2XL-07`), shown under the QR. */
  readableId?: string | null;
  /** Absolute MES URL the QR encodes (e.g. `${MES_URL}/x/bundle/{id}`). */
  bundleUrl: string;
  /** 款号 — style/item readable id. */
  styleReadableId: string;
  /**
   * Attribute fields to print (e.g. Color / Size / …). Replaces fixed
   * 颜色 / 尺码 rows when present.
   */
  attributeLines?: Array<{ name: string; value: string }> | null;
  /** @deprecated Prefer attributeLines */
  colorName?: string | null;
  /** @deprecated Prefer attributeLines */
  sizeCode?: string | null;
  /** 数量 — this bundle's quantity. */
  quantity: number;
  /** 扎号 — bundle number within the master. */
  sequence?: number | null;
  /** 总扎 — total bundles cut for the master. */
  totalBundles?: number | null;
  /** 总裁 — total cut quantity for the master. */
  totalCut?: number | null;
  /** 客户 — customer name. */
  customerName?: string | null;
  /** 车间 — work center of the current operation; omitted when unassigned. */
  workCenterName?: string | null;
}

interface BundleTicketPDFProps {
  labels: BundleTicketLabel[];
  /**
   * Font family to render with — pass the result of `ensureCJKFont()` so Chinese
   * values (color / customer / work center) render. Defaults to Helvetica.
   */
  fontFamily?: string;
  /** Tag page width in points. Defaults to 40mm. */
  pageWidth?: number;
  /** Tag page height in points. Defaults to 80mm. */
  pageHeight?: number;
  /**
   * Diagnostic: draw the page edge (solid) and the printable area excluding the
   * bottom hole reserve (dashed), to check placement against the physical tag.
   */
  showBorder?: boolean;
}

const MM_TO_PT = 72 / 25.4;
const DEFAULT_WIDTH = 40 * MM_TO_PT;
const DEFAULT_HEIGHT = 80 * MM_TO_PT;
// The hanging punch hole / tear-off line is at the BOTTOM (tail) of these tags.
// The hole is a FIXED physical size on the stock (not proportional), so reserve
// a fixed blank strip at the bottom regardless of tag height.
const TOP_FRACTION = 0.0375;
const HOLE_RESERVE_MM = 16;
const ROW_GAP_MM = 0.7;

type Field = [string, string | number | null | undefined];
const present = (fields: Field[]) =>
  fields.filter(([, v]) => v !== null && v !== undefined && v !== "");

/** Left column: style / attributes / qty. */
function leftRows(label: BundleTicketLabel) {
  const attrFields: Field[] =
    label.attributeLines && label.attributeLines.length > 0
      ? label.attributeLines.map((line) => [`${line.name}: `, line.value])
      : present([
          ["颜色: ", label.colorName],
          ["尺码: ", label.sizeCode]
        ]);
  return present([
    ["款号: ", label.styleReadableId],
    ...attrFields,
    ["数量: ", label.quantity]
  ]);
}

/** Right column: everything else (customer / work center / bundle counts). */
function rightRows(label: BundleTicketLabel) {
  return present([
    ["客户: ", label.customerName],
    ["车间: ", label.workCenterName],
    ["扎号: ", label.sequence],
    ["总扎: ", label.totalBundles],
    ["总裁: ", label.totalCut]
  ]);
}

/**
 * Garment bundle tickets — one ticket per page, sized to the physical tag
 * (default 40×80mm portrait), so each prints as a single label on a thermal
 * tag roll via the printer driver. Layout scales with the tag: a small top
 * margin, the field list, the QR + id centered in the space below it, and a
 * blank reserve at the bottom for the hang hole / tear-off line.
 */
const BundleTicketPDF = ({
  labels,
  fontFamily = "Helvetica",
  pageWidth = DEFAULT_WIDTH,
  pageHeight = DEFAULT_HEIGHT,
  showBorder = false
}: BundleTicketPDFProps) => {
  const heightMm = pageHeight / MM_TO_PT;
  const widthMm = pageWidth / MM_TO_PT;
  const topMm = heightMm * TOP_FRACTION;
  const holeMm = HOLE_RESERVE_MM;
  const contentMm = heightMm - topMm - holeMm;
  // QR capped by both the width and the printable height so it never balloons
  // on a narrow tag nor crowds out the id.
  const qrPt = Math.min(widthMm * 0.55, contentMm * 0.3) * MM_TO_PT;
  const sidePadPt = 2 * MM_TO_PT;

  return (
    <Document>
      {labels.map((label) => {
        const left = leftRows(label);
        const right = rightRows(label);
        // Two columns, so the field block is as tall as the taller column.
        // Target ~42% of the printable height (fewer rows than a single list,
        // so the QR gets more room); generous line factor for the medium face.
        const maxRows = Math.max(1, left.length, right.length);
        const perRowMm =
          (contentMm * 0.42 - (maxRows - 1) * ROW_GAP_MM) / maxRows;
        const valueFont = Math.max(
          5,
          Math.min(11, (perRowMm * MM_TO_PT) / 1.5)
        );
        // Key and value share the same size so they sit on the same line and
        // align cleanly, including when a long value wraps.
        const labelFont = valueFont;
        const idFont = Math.max(4.5, valueFont * 0.62);

        const renderRows = (rows: Field[]) =>
          rows.map(([k, v]) => (
            <View
              key={k}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: ROW_GAP_MM * MM_TO_PT
              }}
            >
              <Text
                style={{
                  fontSize: labelFont,
                  fontWeight: 500,
                  color: "#000000"
                }}
              >
                {k}
              </Text>
              <Text
                style={{
                  fontSize: valueFont,
                  fontWeight: 500,
                  color: "#000000",
                  flex: 1
                }}
              >
                {v}
              </Text>
            </View>
          ));

        return (
          <Page
            key={label.id}
            size={[pageWidth, pageHeight]}
            wrap={false}
            style={{
              fontFamily,
              paddingTop: topMm * MM_TO_PT,
              paddingBottom: holeMm * MM_TO_PT,
              paddingLeft: sidePadPt,
              paddingRight: sidePadPt,
              display: "flex",
              flexDirection: "column"
            }}
          >
            {showBorder && (
              <>
                <View
                  fixed
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: pageWidth,
                    height: pageHeight,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#000000"
                  }}
                />
                <View
                  fixed
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: pageWidth,
                    height: (heightMm - holeMm) * MM_TO_PT,
                    borderWidth: 0.8,
                    borderStyle: "dashed",
                    borderColor: "#e00000"
                  }}
                />
              </>
            )}
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {renderRows(left)}
              </View>
              <View style={{ width: 2 * MM_TO_PT }} />
              <View
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                {renderRows(right)}
              </View>
            </View>

            <View
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 2 * MM_TO_PT
              }}
            >
              <Image
                src={generateQRCode(label.bundleUrl, qrPt / MM_TO_PT)}
                style={{ width: qrPt, height: qrPt, objectFit: "contain" }}
              />
              <Text
                style={{
                  fontSize: idFont,
                  fontWeight: 500,
                  color: "#000000",
                  textAlign: "center",
                  marginTop: 0.5 * MM_TO_PT
                }}
              >
                {label.readableId || label.id}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default BundleTicketPDF;
