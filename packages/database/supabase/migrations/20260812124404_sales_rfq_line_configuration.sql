ALTER TABLE "salesRfqLine" ADD COLUMN IF NOT EXISTS "configuration" JSONB;

DROP VIEW IF EXISTS "salesRfqLines";
CREATE OR REPLACE VIEW "public"."salesRfqLines" WITH (SECURITY_INVOKER=true) AS
  SELECT srl.id,
    srl."salesRfqId",
    srl."itemId",
    srl.description,
    srl.quantity,
    srl."unitOfMeasureCode",
    srl."order",
    srl."internalNotes",
    srl."externalNotes",
    srl."companyId",
    srl."customFields",
    srl."createdAt",
    srl."createdBy",
    srl."updatedAt",
    srl."updatedBy",
    srl."modelUploadId",
    srl."customerPartId",
    srl."customerPartRevision",
    srl.tags,
    srl.configuration,
    mu.id AS "modelId",
    mu."autodeskUrn",
    mu."modelPath",
    mu.name AS "modelName",
    mu.size AS "modelSize",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS "itemName",
    i."defaultMethodType" AS "methodType",
    i."readableId" AS "itemReadableId",
    i.type AS "itemType"
   FROM (("salesRfqLine" srl
     LEFT JOIN item i ON ((i.id = srl."itemId")))
     LEFT JOIN "modelUpload" mu ON ((mu.id = srl."modelUploadId")));

NOTIFY pgrst, 'reload schema';
