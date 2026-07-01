import { getCarbonServiceRole } from "../lib/supabase/client.server";

// Every way a person can sign in. email/google/azure all ultimately carry an
// email on the Supabase auth user; wechat/phone are app-managed and resolve to
// the owning user through this table. See 20260630000000_user-identity.sql.
export type LoginMethod = "email" | "google" | "azure" | "wechat" | "phone";

export type IdentityMutationResult =
  | { success: true }
  | { success: false; reason: "conflict" | "last_method" | "error" };

/** A user's linked login methods, for the profile "Login methods" card. */
export async function getUserIdentities(userId: string) {
  const serviceRole = getCarbonServiceRole();
  const { data, error } = await serviceRole
    .from("userIdentity")
    .select("id, type, value, verifiedAt, createdAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: true });

  if (error) {
    console.error("[identity] list failed", error);
    return [];
  }
  return data ?? [];
}

/** Resolve which user owns a given identity (the heart of login resolution). */
export async function findUserIdByIdentity(
  type: LoginMethod,
  value: string
): Promise<string | null> {
  const serviceRole = getCarbonServiceRole();
  const { data, error } = await serviceRole
    .from("userIdentity")
    .select("userId")
    .eq("type", type)
    .eq("value", value)
    .maybeSingle();

  // Surface lookup errors as "unknown" rather than risk mis-resolving identity.
  if (error) {
    console.error("[identity] lookup failed", error);
    return null;
  }
  return data?.userId ?? null;
}

/**
 * Attach a login method to a user. Idempotent if it already belongs to this
 * user; blocks (conflict) if it belongs to another — we never silently move an
 * identity between accounts.
 */
export async function linkIdentity(
  userId: string,
  type: LoginMethod,
  value: string,
  { verified = true }: { verified?: boolean } = {}
): Promise<IdentityMutationResult> {
  const serviceRole = getCarbonServiceRole();

  const existingOwner = await findUserIdByIdentity(type, value);
  if (existingOwner) {
    return existingOwner === userId
      ? { success: true }
      : { success: false, reason: "conflict" };
  }

  const { error } = await serviceRole.from("userIdentity").insert({
    userId,
    type,
    value,
    verifiedAt: verified ? new Date().toISOString() : null
  });

  if (error) {
    // A unique-violation here means it was linked concurrently to someone else.
    console.error("[identity] link failed", error);
    return { success: false, reason: "conflict" };
  }
  return { success: true };
}

/**
 * Remove a login method. Refuses to remove the user's last one so the account
 * can't be locked out.
 */
export async function unlinkIdentity(
  userId: string,
  type: LoginMethod,
  value: string
): Promise<IdentityMutationResult> {
  const serviceRole = getCarbonServiceRole();

  const identities = await getUserIdentities(userId);
  if (identities.length <= 1) {
    return { success: false, reason: "last_method" };
  }

  const { error } = await serviceRole
    .from("userIdentity")
    .delete()
    .eq("userId", userId)
    .eq("type", type)
    .eq("value", value);

  if (error) {
    console.error("[identity] unlink failed", error);
    return { success: false, reason: "error" };
  }

  // Free whatever the removed identity occupies on the auth user, so the
  // identifier can be registered again:
  // - email/google/azure: the auth email IS the real address — free it once no
  //   email-family method remains.
  // - phone/wechat: for accounts that originated from that method, the auth email
  //   is its synthetic (phone+…/wechat+…) — free it when the auth email still
  //   matches (i.e. it wasn't already replaced by a linked real email).
  // The account stays reachable via its remaining methods, which mint sessions
  // against this (now placeholder) canonical email.
  const isEmailFamily =
    type === "email" || type === "google" || type === "azure";

  let shouldFree = false;
  if (isEmailFamily) {
    shouldFree = !identities.some(
      (i) =>
        !(i.type === type && i.value === value) &&
        (i.type === "email" || i.type === "google" || i.type === "azure")
    );
  } else {
    const synthetic =
      type === "phone"
        ? `phone+${value.replace(/\D/g, "")}@carbon.internal`
        : type === "wechat"
          ? `wechat+${value.toLowerCase()}@carbon.internal`
          : null;
    const currentEmail = (await getCanonicalAuthEmail(userId))?.toLowerCase();
    shouldFree = !!synthetic && currentEmail === synthetic.toLowerCase();
  }

  if (shouldFree) {
    const { error: resetError } = await serviceRole.auth.admin.updateUserById(
      userId,
      { email: `freed-${userId}@carbon.internal`, email_confirm: true }
    );
    if (resetError) {
      console.error("[identity] freeing auth email failed", resetError);
    }
    // Clear the public email too — it has a partial-unique index, so a leftover
    // value would block re-registering it (no-op when already null).
    await serviceRole.from("user").update({ email: null }).eq("id", userId);
  }

  return { success: true };
}

/**
 * The auth user's current email. Any login method mints its session by
 * generateLink against this address, so it stays correct even after a
 * phone/wechat user links a real email (which replaces the synthetic one).
 */
export async function getCanonicalAuthEmail(
  userId: string
): Promise<string | null> {
  const serviceRole = getCarbonServiceRole();
  const { data, error } = await serviceRole.auth.admin.getUserById(userId);

  if (error || !data.user?.email) {
    console.error("[identity] canonical email lookup failed", error);
    return null;
  }
  return data.user.email;
}
