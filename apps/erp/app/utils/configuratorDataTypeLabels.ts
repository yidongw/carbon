import { useLingui } from "@lingui/react/macro";

/** Display labels for configuration parameter / batch property data types. */
export function useConfiguratorDataTypeLabel() {
  const { t } = useLingui();

  return (type: string) => {
    switch (type) {
      case "text":
        return t`Text`;
      case "numeric":
        return t`Numeric`;
      case "boolean":
        return t`Boolean`;
      case "list":
        return t`List`;
      case "material":
        return t`Material`;
      case "date":
        return t`Date`;
      default:
        return type;
    }
  };
}
