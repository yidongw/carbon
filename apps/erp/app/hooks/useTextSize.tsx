import { useRouteData } from "@carbon/react";
import type { TextSize } from "@carbon/utils";
import { DEFAULT_TEXT_SIZE, textSizeValidator } from "@carbon/utils";
import { useFetchers } from "react-router";
import { path } from "~/utils/path";

export function useOptimisticTextSize() {
  const fetchers = useFetchers();
  const textSizeFetcher = fetchers.find(
    (f) => f.formAction === path.to.textSize
  );

  if (textSizeFetcher && textSizeFetcher.formData) {
    const textSize = { textSize: textSizeFetcher.formData.get("textSize") };
    const submission = textSizeValidator.safeParse(textSize);

    if (submission.success) {
      return submission.data.textSize;
    }
  }
}

export function useTextSize(): TextSize {
  const optimisticTextSize = useOptimisticTextSize();
  const routeData = useRouteData<{ textSize: TextSize }>(path.to.root);

  let textSize = routeData?.textSize ?? DEFAULT_TEXT_SIZE;

  if (optimisticTextSize) {
    textSize = optimisticTextSize;
  }

  return textSize;
}
