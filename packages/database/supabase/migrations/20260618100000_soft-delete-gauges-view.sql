-- Hide soft-deleted gauges from the list view (same pattern as jobs / item list views).

DROP VIEW IF EXISTS "gauges";
CREATE VIEW "gauges" WITH (SECURITY_INVOKER = true) AS
SELECT
  g.*,
  CASE
    WHEN g."gaugeStatus" = 'Inactive' THEN 'Out-of-Calibration'
    WHEN g."nextCalibrationDate" IS NOT NULL AND g."nextCalibrationDate" < CURRENT_DATE THEN 'Out-of-Calibration'
    ELSE g."gaugeCalibrationStatus"
  END AS "gaugeCalibrationStatusWithDueDate"
FROM "gauge" g
WHERE g."deletedAt" IS NULL;
