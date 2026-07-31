import { assertIsPost } from "@carbon/auth";
import { validationError, validator } from "@carbon/form";
import { DEFAULT_TEXT_SIZE, textSizeValidator } from "@carbon/utils";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { getTextSize, setTextSize } from "~/services/textSize.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Text Size`,
  to: path.to.textSize
};

export async function loader({ request }: LoaderFunctionArgs) {
  const textSize = getTextSize(request);

  return {
    textSize: textSize ?? DEFAULT_TEXT_SIZE
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const formData = await request.formData();

  const validation = await validator(textSizeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  return data(
    {},
    {
      headers: { "Set-Cookie": setTextSize(validation.data.textSize) }
    }
  );
}
