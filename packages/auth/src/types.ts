import type { getCompanies } from "./services/users";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  companyId: string;
  companyGroupId: string;
  email: string | null;
  expiresIn: number;
  expiresAt: number;
  console?: string;
  /** Dev bypass logins skip session expiration enforcement. */
  bypass?: boolean;
}

export type Company = NonNullable<
  Awaited<ReturnType<typeof getCompanies>>["data"]
>[number];

export type CompanyPermission = {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

export type Permission = {
  view: string[];
  create: string[];
  update: string[];
  delete: string[];
};

export type Result = {
  success: boolean;
  message?: string;
  // Optional secondary line for the toast (e.g. the underlying error detail).
  description?: string;
  flash?: "success" | "error";
};
