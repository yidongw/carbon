/**
 * A composable building block of `seedDemoData`.
 *
 * The pattern: `seedDemoData` is assembled from small per-domain seed functions
 * like this one. `seedDemoData` calls them all to build the full demo company;
 * a module's integration test calls **just the one it needs** to get realistic
 * read/update/delete data — no separate test seed, no duplication.
 *
 * This one seeds the per-company style palette + size run into
 * `itemAttributeValue` (the `iat_color` / `iat_size` system attributes). The
 * item-attribute API tests call it directly.
 */
import type { PoolClient } from "pg";
import { styleReferenceRows } from "../styleReference";

export interface SeedContext {
  companyId: string;
  userId: string;
  /** Localizes color names; sizes are by code. */
  language?: string;
}

export async function seedDemoStyleAttributeValues(
  client: PoolClient,
  { companyId, userId, language }: SeedContext
): Promise<void> {
  const { colors, sizes } = styleReferenceRows(language);

  for (const c of colors) {
    await client.query(
      `INSERT INTO "itemAttributeValue" ("attributeId", "code", "name", "companyId", "createdBy", "sortOrder")
       VALUES ('iat_color', $1, $2, $3, $4, 100)
       ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING`,
      [c.colorCode, c.colorName, companyId, userId]
    );
  }

  for (const s of sizes) {
    await client.query(
      `INSERT INTO "itemAttributeValue" ("attributeId", "code", "name", "sortOrder", "companyId", "createdBy")
       VALUES ('iat_size', $1, $2, $3, $4, $5)
       ON CONFLICT ("attributeId", "code", "companyId") DO NOTHING`,
      [s.sizeCode, s.sizeName, s.sortOrder, companyId, userId]
    );
  }
}
