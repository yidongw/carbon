/**
 * Public entry point for the integration-test harness, consumed by other
 * packages/apps via the `@carbon/database/test` export.
 *
 * (Vitest globalSetup files and *.integration.test.ts live alongside this but
 * are not re-exported — they are entry points for the test runner, not library
 * surface.)
 */
export { isDockerAvailable } from "./dockerHarness";
export { startTestDatabase, type TestDatabase } from "./testDatabase";
export { startSupabaseStack, type SupabaseStack } from "./supabaseStack";
export { createPool, withRollback } from "./harness";
export { provisionTestCompany, type ProvisionedCompany } from "./provision";
export { createTestClient } from "./supabaseClient";
export { signJwt, serviceRoleToken, authenticatedToken } from "./jwt";
