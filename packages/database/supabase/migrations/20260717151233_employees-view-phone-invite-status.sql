-- The employees view derives an "Invited" status by matching a pending invite to
-- the user. It only matched on email, so phone-only invites (email NULL) were
-- mislabeled "Inactive" and hidden from the Invited status filter. Match on phone too.
-- Also expose the user's phone so phone-only invitees show a contact in the UI.
DROP VIEW IF EXISTS "employees";

CREATE VIEW "employees" WITH(SECURITY_INVOKER=true) AS
  SELECT
    u.id,
    u."email",
    u."phone",
    u."firstName",
    u."lastName",
    u."fullName" AS "name",
    u."avatarUrl",
    u."number",
    e."employeeTypeId",
    e."companyId",
    e."active",
    ej."locationId",
    l."name" AS "locationName",
    CASE
      WHEN e."active" = TRUE THEN 'Active'
      WHEN EXISTS (
        SELECT 1
        FROM "invite" i
        WHERE (
            (i."email" IS NOT NULL AND i."email" = u."email")
            OR (i."phone" IS NOT NULL AND i."phone" = u."phone")
          )
          AND i."companyId" = e."companyId"
          AND i."acceptedAt" IS NULL
          AND i."revokedAt" IS NULL
      ) THEN 'Invited'
      ELSE 'Inactive'
    END AS "status"
  FROM "user" u
  INNER JOIN "employee" e
    ON e.id = u.id
  LEFT JOIN "employeeJob" ej
    ON e.id = ej.id AND e."companyId" = ej."companyId"
  LEFT JOIN "location" l
    ON l.id = ej."locationId"
  WHERE u.active = TRUE;
