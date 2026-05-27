import type { Result } from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { deactivateUser } from "@carbon/auth/users.server";
import { InviteEmail } from "@carbon/documents/email";
import { CarbonEdition, getAppUrl, RESEND_DOMAIN } from "@carbon/env";
import { sendEmail } from "@carbon/lib/resend.server";
import { updateSubscriptionQuantityForCompany } from "@carbon/stripe/stripe.server";
import { Edition } from "@carbon/utils";
import { render } from "@react-email/components";
import { nanoid } from "nanoid";
import { inngest } from "../../client";

export const userAdminFunction = inngest.createFunction(
  { id: "user-admin", retries: 3 },
  { event: "carbon/user-admin" },
  async ({ event, step }) => {
    const serviceRole = getCarbonServiceRole();
    const payload = event.data;

    const result = await step.run("user-admin-action", async () => {
      console.log(`User admin update ${payload.type} for ${payload.id}`);

      let result: Result = { success: false, message: "Unknown action" };

      switch (payload.type) {
        case "deactivate":
          console.log(`Deactivating ${payload.id}`);
          result = await deactivateUser(
            serviceRole,
            payload.id,
            payload.companyId
          );
          if (result.success && CarbonEdition === Edition.Cloud) {
            await updateSubscriptionQuantityForCompany(payload.companyId);
          }
          break;
        case "resend":
          const { id: userId, companyId, location, ip } = payload;
          console.log(`Resending invite for ${payload.id}`);
          const [company, user] = await Promise.all([
            serviceRole
              .from("company")
              .select("name")
              .eq("id", companyId)
              .single(),
            serviceRole
              .from("user")
              .select("email, phone, fullName")
              .eq("id", userId)
              .single()
          ]);

          if (!company.data || !user.data) {
            throw new Error("Failed to load company or user");
          }

          // Invites link to a person by email OR phone (phone invites have no
          // email). `phone` isn't in the generated types until db:types runs.
          const inviteEmail = user.data.email;
          const invitePhone = user.data.phone;
          const orFilter = [
            inviteEmail ? `email.eq.${inviteEmail}` : null,
            invitePhone ? `phone.eq.${invitePhone}` : null
          ]
            .filter(Boolean)
            .join(",");

          if (!orFilter) {
            return {
              success: false,
              message: "No invite record found for user"
            };
          }

          // Match by email OR phone, limited to one row — a user could carry both
          // an email and a phone invite in the same company (would break single()).
          const existingInvite = await serviceRole
            .from("invite")
            .select("id, createdBy")
            .or(orFilter)
            .eq("companyId", companyId)
            .limit(1)
            .maybeSingle();

          if (existingInvite.error || !existingInvite.data) {
            return {
              success: false,
              message: "No invite record found for user"
            };
          }

          const newCode = nanoid();
          const refreshed = await serviceRole
            .from("invite")
            .update({ code: newCode, acceptedAt: null, revokedAt: null })
            .eq("id", existingInvite.data.id)
            .select("code")
            .single();

          if (refreshed.error || !refreshed.data) {
            return {
              success: false,
              message: "Failed to refresh invite"
            };
          }

          // Phone invites carry no link to deliver (Aliyun's SMS template is
          // code-only); they're accepted on phone login, so nothing to email.
          if (inviteEmail) {
            const inviter = await serviceRole
              .from("user")
              .select("email, fullName")
              .eq("id", existingInvite.data.createdBy)
              .single();

          await sendEmail({
            from: `Jilio <no-reply@${RESEND_DOMAIN}>`,
            to: user.data.email ?? "",
            subject: `You have been invited to join ${company.data?.name} on Jilio`,
            headers: {
              "X-Entity-Ref-ID": nanoid()
            },
            html: await render(
              InviteEmail({
                invitedByEmail: inviter.data?.email ?? user.data.email ?? "",
                invitedByName: inviter.data?.fullName ?? "",
                email: user.data.email ?? undefined,
                name: user.data.fullName ?? "",
                companyName: company.data.name,
                inviteLink: `${getAppUrl()}/invite/${refreshed.data.code}`,
                ip,
                location
              })
            )
          });

          result = {
            success: true,
            message: `Successfully resent invite for ${payload.id}`
          };
          break;
      }

      if (result.success) {
        console.log(`Success ${payload.id}`);
      } else {
        console.error(
          `Admin action ${payload.type} failed for ${payload.id}: ${result.message}`
        );
      }

      return result;
    });

    return result;
  }
);
