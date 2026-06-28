import { getCarbonServiceRole } from "../lib/supabase/client.server";

// The synthetic email lives ONLY on the auth user: our magic-link session mint
// (generateLink) is email-based and needs it to locate this user later. The public
// user.email is nulled so a fake address is never surfaced. Mirrors the WeChat path.
export function syntheticPhoneEmail(phone: string): string {
  return `phone+${phone}@carbon.internal`;
}

/**
 * Resolve the Carbon user for a phone number, creating one on first sign-in.
 * Identity is assumed already proven by a checked SMS code (see checkSmsVerifyCode).
 * Mirrors findOrCreateWeChatUser.
 */
export async function findOrCreatePhoneUser(phone: string) {
  const serviceRole = getCarbonServiceRole();

  const existing = await serviceRole
    .from("user")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (existing.data) return existing.data;

  const { data: authUser, error: authError } =
    await serviceRole.auth.admin.createUser({
      email: syntheticPhoneEmail(phone),
      email_confirm: true,
      user_metadata: { phone }
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
    .update({ email: null, phone })
    .eq("id", authUser.user.id)
    .select("*")
    .single();

  return updatedUser;
}
