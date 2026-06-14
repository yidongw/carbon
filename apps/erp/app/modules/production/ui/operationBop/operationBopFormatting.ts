export function abbreviateOperationUnit(unit: string | null | undefined) {
  switch (unit) {
    case "Minutes/Piece":
      return "min/pc";
    case "Hours/Piece":
      return "hr/pc";
    case "Seconds/Piece":
      return "sec/pc";
    case "Total Minutes":
      return "min";
    case "Total Hours":
      return "hr";
    case "Total Seconds":
      return "sec";
    default:
      return (unit ?? "")
        .replace("Minutes", "min")
        .replace("Minute", "min")
        .replace("Hours", "hr")
        .replace("Hour", "hr")
        .replace("Seconds", "sec")
        .replace("Second", "sec")
        .replace("Piece", "pc")
        .replace("Total ", "");
  }
}

export function formatOperationTabSummary(time: number, unit: string) {
  return `${time} ${abbreviateOperationUnit(unit)}`;
}
