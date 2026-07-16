-- Style sizes: a size lookup + per-style assignment, mirroring style colors.

CREATE TABLE "styleSize" (
  "id" TEXT NOT NULL DEFAULT id('ssz'),
  "sizeCode" TEXT NOT NULL,
  "sizeName" TEXT NOT NULL,
  "companyId" TEXT,
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT REFERENCES "user"("id"),
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "styleSize_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "styleSize_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleSize_sizeCode_companyId_key" UNIQUE ("sizeCode", "companyId")
);

CREATE INDEX "styleSize_companyId_idx" ON "styleSize" ("companyId");

ALTER TABLE "styleSize" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."styleSize"
FOR SELECT USING (
  "companyId" IS NULL OR "companyId" = ANY (
    (SELECT get_companies_with_employee_role())::text[]
  )
);
CREATE POLICY "INSERT" ON "public"."styleSize"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_create'))::text[]
  )
);
CREATE POLICY "UPDATE" ON "public"."styleSize"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_update'))::text[]
  )
);
CREATE POLICY "DELETE" ON "public"."styleSize"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_delete'))::text[]
  )
);

CREATE TABLE "styleSizeAssignment" (
  "styleId" TEXT NOT NULL,
  "styleSizeId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL REFERENCES "user"("id"),

  CONSTRAINT "styleSizeAssignment_pkey" PRIMARY KEY ("styleId", "styleSizeId", "companyId"),
  CONSTRAINT "styleSizeAssignment_styleId_companyId_fkey"
    FOREIGN KEY ("styleId", "companyId") REFERENCES "style"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "styleSizeAssignment_styleSizeId_fkey"
    FOREIGN KEY ("styleSizeId") REFERENCES "styleSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "styleSizeAssignment_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "styleSizeAssignment_companyId_idx" ON "styleSizeAssignment" ("companyId");

ALTER TABLE "styleSizeAssignment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SELECT" ON "public"."styleSizeAssignment"
FOR SELECT USING (
  "companyId" = ANY ((SELECT get_companies_with_employee_role())::text[])
);
CREATE POLICY "INSERT" ON "public"."styleSizeAssignment"
FOR INSERT WITH CHECK (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_create'))::text[]
  )
);
CREATE POLICY "UPDATE" ON "public"."styleSizeAssignment"
FOR UPDATE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_update'))::text[]
  )
);
CREATE POLICY "DELETE" ON "public"."styleSizeAssignment"
FOR DELETE USING (
  "companyId" = ANY (
    (SELECT get_companies_with_employee_permission('parts_delete'))::text[]
  )
);

-- Standard sizes are seeded per-company by the seed script, not here.

-- Recreate the styles view with a `sizes` aggregate appended (colors kept as-is).
CREATE OR REPLACE VIEW "styles" WITH (SECURITY_INVOKER=true) AS
WITH latest_items AS (
  SELECT DISTINCT ON (i."readableId", i."companyId")
    i.*
  FROM "item" i
  WHERE i."type" = 'Style'
  ORDER BY i."readableId", i."companyId",
    CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END DESC,
    i."createdAt" DESC NULLS LAST
),
item_revisions AS (
  SELECT
    i."readableId",
    i."companyId",
    json_agg(
      json_build_object(
        'id', i.id,
        'revision', i."revision",
        'name', i."name",
        'description', i."description",
        'active', i."active",
        'createdAt', i."createdAt"
      ) ORDER BY
        CASE WHEN i."revision" = '0' OR i."revision" = '' OR i."revision" IS NULL THEN 0 ELSE 1 END,
        i."createdAt"
      ) AS "revisions"
  FROM "item" i
  WHERE i."type" = 'Style'
  GROUP BY i."readableId", i."companyId"
)
SELECT
  li."active",
  li."assignee",
  li."defaultMethodType",
  li."sourcingType",
  li."description",
  li."itemTrackingType",
  li."name",
  li."replenishmentSystem",
  li."unitOfMeasureCode",
  li."notes",
  li."revision",
  li."readableId",
  li."readableIdWithRevision",
  li."id",
  li."companyId",
  li."thumbnailPath",
  (
    SELECT json_agg(json_build_object('id', sc."id", 'colorCode', sc."colorCode", 'colorName', sc."colorName") ORDER BY sc."colorCode")
    FROM "styleColorAssignment" sca
    JOIN "styleColor" sc ON sc."id" = sca."styleColorId"
    WHERE sca."styleId" = s."id"
      AND sca."companyId" = s."companyId"
  ) AS colors,
  ir."revisions",
  s."customFields",
  s."tags",
  ic."itemPostingGroupId",
  li."createdBy",
  li."createdAt",
  li."updatedBy",
  li."updatedAt",
  (
    SELECT json_agg(json_build_object('id', ss."id", 'sizeCode', ss."sizeCode", 'sizeName', ss."sizeName") ORDER BY ss."sizeCode")
    FROM "styleSizeAssignment" ssa
    JOIN "styleSize" ss ON ss."id" = ssa."styleSizeId"
    WHERE ssa."styleId" = s."id"
      AND ssa."companyId" = s."companyId"
  ) AS sizes
FROM "style" s
INNER JOIN latest_items li ON li."id" = s."itemId"
LEFT JOIN item_revisions ir ON ir."readableId" = li."readableId" AND ir."companyId" = li."companyId"
LEFT JOIN "itemCost" ic ON ic."itemId" = li.id;

NOTIFY pgrst, 'reload schema';
