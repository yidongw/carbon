import { setCompanyId } from "@carbon/auth/company.server";
import { setAuthSession } from "@carbon/auth/session.server";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  // DEV ONLY - Manual login bypass
  const authSession = {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MmYyZjZmMC0wMmVjLTRkZTAtODRjNC1kNDE2NWQxZDZkNDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgxOTI4OTM3LCJpYXQiOjE3ODE5MjUzMzcsImVtYWlsIjoid3kuZG9uZzk2QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzgxOTI1MzM3fV0sInNlc3Npb25faWQiOiIzMjU2MDVmZi1iM2FkLTRmNzgtODAyMS0zNTM0NmExZGM2Y2QiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.PikXNhonJkMFoT_gKBwPrMUcy8VoZhmIsx0q9_Q55mM",
    refreshToken: "qz3gttlpi4kz",
    userId: "72f2f6f0-02ec-4de0-84c4-d4165d1d6d40",
    email: "wy.dong96@gmail.com",
    companyId: "DVgBbwjK8wiGLJtGyzKgvN",
    companyGroupId: "cg_JiKR1d4CNgBK26yoDrESqQ",
    expiresIn: 3600,
    expiresAt: 1781928937
  };

  const sessionCookie = await setAuthSession(request, { authSession });
  const companyIdCookie = setCompanyId(authSession.companyId);

  return redirect(path.to.authenticatedRoot, {
    headers: [
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", companyIdCookie]
    ]
  });
}
