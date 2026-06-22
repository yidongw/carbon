-- Add number field to employees view
DROP VIEW IF EXISTS "employees";
CREATE VIEW "employees" WITH(SECURITY_INVOKER=true) AS
  SELECT
    u.id,
    u."email",
    u."firstName",
    u."lastName",
    u."fullName" AS "name",
    u."avatarUrl",
    u."active",
    u."number",
    e."employeeTypeId",
    e."companyId"
  FROM "user" u
  INNER JOIN "employee" e
    ON e.id = u.id
  WHERE u.active = TRUE;
