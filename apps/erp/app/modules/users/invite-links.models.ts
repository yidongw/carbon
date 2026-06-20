import { z } from "zod";
import { zfd } from "zod-form-data";

export const createInviteLinkValidator = z.object({
  label: zfd.text(z.string().optional()),
  employeeTypeId: z.string().min(1, { message: "Employee type is required" }),
  locationId: z.string().min(1, { message: "Location is required" }),
  expiresAt: zfd.text(z.string().optional())
});

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
