import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
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
  /** 颜色 — color name (falls back to code upstream). */
  colorName?: string | null;
  /** 尺码 — size code. */
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
   * Top dead-zone in mm reserved for the tag's hang hole (these garment tags
   * have a ~15×8mm punch at the top center) — nothing prints there.
   */
  holeReserveMm?: number;
}

const MM_TO_PT = 72 / 25.4;
const DEFAULT_WIDTH = 40 * MM_TO_PT;
const DEFAULT_HEIGHT = 80 * MM_TO_PT;
const DEFAULT_HOLE_RESERVE_MM = 14;

const makeTw = (fontFamily: string) =>
  createTw({
    theme: {
      fontFamily: { sans: [fontFamily] },
      extend: {
        colors: { gray: { 300: "#d1d5db", 500: "#7d7d7d" } }
      }
    }
  });

/**
 * Garment bundle tickets — one ticket per page, sized to the physical tag
 * (default 40×80mm portrait), so each prints as a single label on a thermal
 * tag roll via the printer driver.
 */
const BundleTicketPDF = ({
  labels,
  fontFamily = "Helvetica",
  pageWidth = DEFAULT_WIDTH,
  pageHeight = DEFAULT_HEIGHT,
  holeReserveMm = DEFAULT_HOLE_RESERVE_MM
}: BundleTicketPDFProps) => {
  const tw = makeTw(fontFamily);
  // Scale type / QR / spacing to the tag so it reads well from a 30mm tag up to
  // a 50mm one (reference = 40mm wide).
  const scale = pageWidth / DEFAULT_WIDTH;
  const pad = Math.max(4, 6 * scale);
  // Keep the hang-hole zone at the top clear.
  const topReserve = holeReserveMm * MM_TO_PT;
  const labelFont = Math.max(4.5, 7 * scale);
  const valueFont = Math.max(5, 8 * scale);
  const idFont = Math.max(4, 6 * scale);
  const rowGap = Math.max(0.5, 1.5 * scale);
  const qrSize = Math.min(pageWidth - 2 * pad, pageHeight * 0.34);

  const Field = ({
    label,
    value
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <View style={{ ...tw("flex flex-row"), marginBottom: rowGap }}>
        <Text style={{ ...tw("text-gray-500"), fontSize: labelFont }}>
          {label}
        </Text>
        <Text
          style={{ ...tw("flex-1"), fontSize: valueFont, fontWeight: "bold" }}
        >
          {value}
        </Text>
      </View>
    );
  };

  return (
    <Document>
      {labels.map((label) => (
        <Page
          key={label.id}
          size={[pageWidth, pageHeight]}
          style={{
            fontFamily,
            paddingTop: topReserve,
            paddingBottom: pad,
            paddingLeft: pad,
            paddingRight: pad,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <View style={tw("flex flex-col")}>
            <Field label="款号: " value={label.styleReadableId} />
            <Field label="客户: " value={label.customerName} />
            <Field label="颜色: " value={label.colorName} />
            <Field label="尺码: " value={label.sizeCode} />
            <Field label="数量: " value={label.quantity} />
            <Field label="车间: " value={label.workCenterName} />
            <Field label="扎号: " value={label.sequence} />
            <Field label="总扎: " value={label.totalBundles} />
            <Field label="总裁: " value={label.totalCut} />
          </View>

          <View style={tw("flex flex-col items-center")}>
            <Image
              src={generateQRCode(label.bundleUrl, qrSize / 72)}
              style={{ width: qrSize, height: qrSize, objectFit: "contain" }}
            />
            <Text
              style={{
                ...tw("text-center"),
                fontSize: idFont,
                color: "#7d7d7d"
              }}
            >
              {label.readableId || label.id}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default BundleTicketPDF;
