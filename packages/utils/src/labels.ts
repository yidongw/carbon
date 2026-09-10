export type ProductLabelItem = {
  itemId: string;
  revision?: string;
  quantity?: number;
  number: string;
  trackedEntityId: string;
  trackingType: string;
  /** Custom-field values for the tracked entity, keyed by field id. */
  customFields?: Record<string, unknown>;
};

export type LabelSize = {
  id: string;
  name: string;
  width: number;
  height: number;
  metric?: boolean;
  /** Multi-up sheet layout (e.g. Avery). Omitted = a single label per page. */
  rows?: number;
  columns?: number;
  rotated?: boolean;
  zpl?: {
    dpi: number;
    width: number;
    height: number;
  };
};

/** Dimensions as `2" x 1"` or `100mm x 50mm` (width x height). */
export function getLabelSizeDimensions(size: LabelSize): string {
  if (size.metric) {
    const widthMm = Math.round(size.width * 25.4);
    const heightMm = Math.round(size.height * 25.4);
    return `${widthMm}mm x ${heightMm}mm`;
  }
  return `${size.width}" x ${size.height}"`;
}

/** Display label as `2" x 1"` for thermal sizes or `Avery 5163 4" x 2"` for sheets. */
export function getLabelSizeLabel(size: LabelSize): string {
  const dimensions = getLabelSizeDimensions(size);
  return size.zpl ? dimensions : `${size.name} ${dimensions}`;
}

const MM_PER_IN = 25.4;

/**
 * Garment bundle tag (扎标) sizes in millimetres (width × height, portrait).
 * PDF-only (no ZPL) — the bundle work-order ticket prints one ticket per tag.
 */
const BUNDLE_TAG_MM: [number, number][] = [
  [30, 65],
  [30, 70],
  [35, 65],
  [35, 70],
  [35, 80],
  [40, 60],
  [40, 65],
  [40, 80],
  [40, 90],
  [40, 100],
  [50, 65],
  [50, 80],
  [50, 90],
  [50, 100]
];

const bundleTagSizes: LabelSize[] = BUNDLE_TAG_MM.map(([w, h]) => ({
  id: `bundleTag${w}x${h}mm`,
  name: `Bundle Tag ${w}x${h}mm`,
  width: w / MM_PER_IN,
  height: h / MM_PER_IN,
  metric: true
}));

/**
 * Garment care label (水洗唛) sizes in millimetres (width × height, portrait).
 * One care label per garment piece, carrying its unique RFID code (QR + text).
 * Bitmap/TSPL only (Chinese text) — printed on the Bluetooth garment printer.
 */
const CARE_LABEL_MM: [number, number][] = [
  [40, 60],
  [30, 60],
  [35, 75],
  [40, 80],
  [50, 80]
];

const careLabelSizes: LabelSize[] = CARE_LABEL_MM.map(([w, h]) => ({
  id: `careLabel${w}x${h}mm`,
  name: `Care Label ${w}x${h}mm`,
  width: w / MM_PER_IN,
  height: h / MM_PER_IN,
  metric: true
}));

export const labelSizes: LabelSize[] = [
  {
    id: "avery5163",
    name: "Avery 5163",
    width: 4,
    height: 2
  },
  {
    id: "label2x1",
    name: "Label 2x1",
    width: 2,
    height: 1,
    zpl: {
      dpi: 203,
      width: 2,
      height: 1
    }
  },
  {
    id: "label4x2",
    name: "Label 4x2",
    width: 4,
    height: 2,
    zpl: {
      dpi: 203,
      width: 4,
      height: 2
    }
  },
  {
    id: "label100x50mm",
    name: "Label 100x50mm",
    width: 3.937,
    height: 1.969,
    metric: true,
    zpl: {
      dpi: 203,
      width: 3.937,
      height: 1.969
    }
  },
  {
    id: "label50x25mm",
    name: "Label 50x25mm",
    width: 1.969,
    height: 0.984,
    metric: true,
    zpl: {
      dpi: 203,
      width: 1.969,
      height: 0.984
    }
  },
  ...bundleTagSizes,
  ...careLabelSizes
];
