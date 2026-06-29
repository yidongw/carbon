import { getCarbonServiceRole } from "../lib/supabase/client.server";

// The synthetic email lives ONLY on the auth user: our magic-link session mint
// (generateLink) is email-based and needs it to locate this user later. The public
// user.email is nulled so a fake address is never surfaced. Mirrors the WeChat path.
export function syntheticPhoneEmail(phone: string): string {
  return `phone+${phone}@carbon.internal`;
}

// Aliyun's verify-code service is mainland-China only, so the national 11-digit
// number always carries a +86 country code. Store it in E.164 so the profile's
// PhoneInput (react-phone-number-input, international mode) can resolve the country.
function toE164(phone: string): string {
  return phone.startsWith("+") ? phone : `+86${phone}`;
}

/**
 * Resolve the Carbon user for a phone number, creating one on first sign-in.
 * `phone` is the national number entered at login; it is stored as E.164.
 * Identity is assumed already proven by a checked SMS code (see checkSmsVerifyCode).
 * Mirrors findOrCreateWeChatUser.
 */
export async function findOrCreatePhoneUser(phone: string) {
  const serviceRole = getCarbonServiceRole();
  const e164 = toE164(phone);

  // Match the canonical E.164 form or any legacy bare-national row.
  const existing = await serviceRole
    .from("user")
    .select("*")
    .in("phone", [e164, phone])
    .maybeSingle();

  if (existing.data) {
    // Backfill legacy rows to E.164 so the country selector resolves.
    if (existing.data.phone !== e164) {
      const { data: normalized } = await serviceRole
        .from("user")
        .update({ phone: e164 })
        .eq("id", existing.data.id)
        .select("*")
        .single();
      return normalized ?? existing.data;
    }
    return existing.data;
  }

  const { data: authUser, error: authError } =
    await serviceRole.auth.admin.createUser({
      email: syntheticPhoneEmail(phone),
      email_confirm: true,
      user_metadata: { phone: e164 }
    });

  if (authError || !authUser.user) {
    console.error("[phone findOrCreate] createUser failed", authError);
    return null;
  }

  // The create_public_user trigger fires synchronously and inserts a bare row.
  // Update it with the phone and null the public email (rather than insert again,
  // which would conflict on the primary key).
  const { data: updatedUser } = await serviceRole
    .from("user")
    .update({ email: null, phone: e164 })
    .eq("id", authUser.user.id)
    .select("*")
    .single();

  return updatedUser;
}
