import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { setCompanyId } from "@carbon/auth/company.server";
import { updateCompanySession } from "@carbon/auth/session.server";
import { ValidatedForm, validationError, validator } from "@carbon/form";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  VStack
} from "@carbon/react";
import { isInternalEmail } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type ActionFunctionArgs,
  Link,
  redirect,
  useLoaderData
} from "react-router";
import {
  AddressAutocomplete,
  Currency,
  Hidden,
  Input,
  Submit
} from "~/components/Form";
import { useOnboarding } from "~/hooks";
import {
  addressValidator,
  getCompany,
  getEmployeeCompanies
} from "~/modules/settings";
import { provisionOnboardingCompany } from "~/services/onboarding.server";
import {
  getOnboardingDraft,
  setOnboardingDraft
} from "~/services/onboarding-draft.server";
import { path } from "~/utils/path";

export async function loader({ request }: ActionFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});

  const company = await getCompany(client, companyId ?? 1);
  const draft = await getOnboardingDraft(request);

  if (company.error || !company.data) {
    return {
      company: null,
      draft
    };
  }

  return { company: company.data, draft };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId, email } = await requirePermissions(request, {});

  // One created company per user: a user who is already an employee of a company
  // cannot create (or re-onboard) another — they can only join via invitations.
  const existingCompanies = await getEmployeeCompanies(client, userId);
  if ((existingCompanies.data?.length ?? 0) > 0) {
    throw redirect(path.to.authenticatedRoot);
  }

  const formData = await request.formData();

  const validation = await validator(addressValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { next, ...companyData } = validation.data;

  // Internal users get a dedicated data-choice step (demo template / backup
  // import) that creates the company; stash this step's input for it.
  if (isInternalEmail(email)) {
    const draftCookie = await setOnboardingDraft(request, {
      company: companyData
    });

    throw redirect(next, {
      headers: [["Set-Cookie", draftCookie]]
    });
  }

  // Public signups skip the data-choice step and create a clean company here.
  const serviceRole = getCarbonServiceRole();
  const companyId = await provisionOnboardingCompany(serviceRole, client, {
    userId,
    companyData,
    backup: null
  });

  const companyRecord = await serviceRole
    .from("company")
    .select("companyGroupId")
    .eq("id", companyId)
    .single();
  const sessionCookie = await updateCompanySession(
    request,
    companyId,
    companyRecord.data?.companyGroupId ?? ""
  );
  const companyIdCookie = setCompanyId(companyId);

  throw redirect(next, {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}

export default function OnboardingCompany() {
  const { t } = useLingui();
  const { company, draft } = useLoaderData<typeof loader>();
  const { next, previous } = useOnboarding();

  const initialValues = {
    name: company?.name ?? draft?.company?.name ?? "",
    addressLine1: company?.addressLine1 ?? draft?.company?.addressLine1 ?? "",
    addressLine2: company?.addressLine2 ?? draft?.company?.addressLine2 ?? "",
    city: company?.city ?? draft?.company?.city ?? "",
    stateProvince:
      company?.stateProvince ?? draft?.company?.stateProvince ?? "",
    postalCode: company?.postalCode ?? draft?.company?.postalCode ?? "",
    countryCode: company?.countryCode ?? draft?.company?.countryCode ?? "CN",
    baseCurrencyCode:
      company?.baseCurrencyCode ?? draft?.company?.baseCurrencyCode ?? "CNY",
    website: company?.website ?? draft?.company?.website ?? ""
  };

  return (
    <Card className="max-w-lg">
      <ValidatedForm
        validator={addressValidator}
        defaultValues={initialValues}
        method="post"
      >
        <CardHeader>
          <CardTitle>
            <Trans>Now let's set up your company</Trans>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="next" value={next} />
          <VStack spacing={4}>
            <Input autoFocus name="name" label={t`Company Name`} />
            <AddressAutocomplete />
            <Input name="website" label={t`Website`} />
            <Currency name="baseCurrencyCode" label={t`Base Currency`} />
          </VStack>
        </CardContent>

        <CardFooter>
          <HStack>
            <Button
              variant="solid"
              isDisabled={!previous}
              size="md"
              asChild
              tabIndex={-1}
            >
              <Link to={previous} prefetch="intent">
                <Trans>Previous</Trans>
              </Link>
            </Button>
            <Submit>
              <Trans>Next</Trans>
            </Submit>
          </HStack>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
}
