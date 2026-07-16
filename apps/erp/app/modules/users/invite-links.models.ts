import { z } from "zod";
import { zfd } from "zod-form-data";

// Valid userIdentity login-method types an invite link may require, in the order
// the joiner must complete them. See 20260717000000_invite-link-login-methods.sql.
export const INVITE_LOGIN_METHODS = [
  "wechat",
  "phone",
  "email",
  "google",
  "azure"
] as const;
export type InviteLoginMethod = (typeof INVITE_LOGIN_METHODS)[number];

export const createInviteLinkValidator = z.object({
  label: zfd.text(z.string().optional()),
  employeeTypeId: z.string().min(1, { message: "Employee type is required" }),
  locationId: z.string().min(1, { message: "Location is required" }),
  expiresAt: zfd.text(z.string().optional()),
  // Ordered, comma-joined list of required login methods; empty = any method.
  loginMethods: zfd.text(z.string().optional())
});

/** Parse the comma-joined `loginMethods` field into a clean ordered array. */
export function parseInviteLoginMethods(raw?: string | null): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(",")) {
    const method = part.trim();
    if (
      (INVITE_LOGIN_METHODS as readonly string[]).includes(method) &&
      !seen.has(method)
    ) {
      seen.add(method);
      result.push(method);
    }
  }
  return result;
}

export const revokeInviteLinkValidator = z.object({
  id: z.string().min(1, { message: "Invite link is required" })
});

export const updateInviteLinkExpiryValidator = z.object({
  id: z.string().min(1, { message: "Invite link is required" }),
  expiresAt: zfd.text(z.string().optional())
});

export const reviewMembershipApplicationValidator = z.object({
  id: z.string().min(1, { message: "Application is required" }),
  action: z.enum(["approve", "reject"]),
  locationId: zfd.text(z.string().optional())
});
