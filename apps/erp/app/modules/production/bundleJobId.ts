function normalizeSegment(value: string) {
  return value.trim().replace(/\s+/g, "-").toUpperCase();
}

export function buildBundleJobReadableId(args: {
  styleCode: string;
  colorCode: string;
  sizeCode: string | null;
  bundleSequence: number;
}) {
  const segments = [
    normalizeSegment(args.styleCode),
    normalizeSegment(args.colorCode)
  ];

  if (args.sizeCode) {
    segments.push(normalizeSegment(args.sizeCode));
  }

  segments.push(`B${String(args.bundleSequence).padStart(3, "0")}`);

  return segments.join("-");
}
