import { getCarbonServiceRole } from "../lib/supabase/client.server";
import { findUserIdByIdentity, linkIdentity } from "./identity.server";

// Aliyun's verify-code service is mainland-China only, so the national 11-digit
// number always carries a +86 country code. We canonicalize to E.164 so it
// resolves consistently and the profile's PhoneInput can show the country.
export function toE164Phone(phone: string): string {
  return phone.startsWith("+") ? phone : `+86${phone}`;
}

// Placeholder email so Supabase can anchor the auth user; only used at creation.
// Sessions are later minted against the auth user's *current* email (which a
// linked real email replaces), via getCanonicalAuthEmail.
function syntheticPhoneEmail(e164: string): string {
  return `phone+${e164.replace(/\D/g, "")}@carbon.internal`;
}

async function getUserById(userId: string) {
  const serviceRole = getCarbonServiceRole();
  const { data, error } = await serviceRole
    .from("user")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[phone] user load failed", error);
    return null;
  }
  return data;
}

/**
 * Look up an existing user by phone identity, without creating one. Used to gate
 * Enterprise deployments, where accounts must be provisioned, not self-created.
 */
export async function findPhoneUser(phone: string) {
  const userId = await findUserIdByIdentity("phone", toE164Phone(phone));
  return userId ? getUserById(userId) : null;
}

/**
 * Resolve the user for a phone login, creating one (and linking the phone
 * identity) on first sign-in. Identity is assumed already proven by a checked
 * SMS code (see checkSmsVerifyCode). Mirrors findOrCreateWeChatUser.
 */
export async function findOrCreatePhoneUser(phone: string) {
  const serviceRole = getCarbonServiceRole();
  const e164 = toE164Phone(phone);

  const existingId = await findUserIdByIdentity("phone", e164);
  if (existingId) return getUserById(existingId);

  const { data: authUser, error: authError } =
    await serviceRole.auth.admin.createUser({
      email: syntheticPhoneEmail(e164),
      email_confirm: true,
      user_metadata: { phone: e164 }
    });

  if (authError || !authUser.user) {
    console.error("[phone findOrCreate] createUser failed", authError);
    return null;
  }

  // The create_public_user trigger inserts a bare row; set the contact phone and
  // null the public email, then register the phone as a login identity.
  const { data: updatedUser } = await serviceRole
    .from("user")
    .update({ email: null, phone: e164 })
    .eq("id", authUser.user.id)
    .select("*")
    .single();

  const link = await linkIdentity(authUser.user.id, "phone", e164);
  if (!link.success) {
    console.error("[phone findOrCreate] identity link failed", link);
  }

  return updatedUser;
}
