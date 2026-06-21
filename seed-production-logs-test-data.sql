-- Script to seed test data for Production Logs feature testing
-- Run this against the preview database to create a job with pickups and quantities

-- First, ensure we have a test employee (using bypass@mail.com user)
DO $$
DECLARE
  v_user_id uuid;
  v_company_id uuid;
  v_employee_id uuid;
  v_item_id uuid;
  v_location_id uuid;
  v_process_id uuid;
  v_workcenter_id uuid;
  v_job_id uuid;
  v_job_readable_id text;
  v_operation_id uuid;
BEGIN
  -- Get the bypass user ID and company
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'bypass@mail.com' LIMIT 1;
  SELECT "companyId" INTO v_company_id FROM "user" WHERE id = v_user_id LIMIT 1;

  IF v_user_id IS NULL OR v_company_id IS NULL THEN
    RAISE NOTICE 'bypass@mail.com user not found';
    RETURN;
  END IF;

  -- Get or create employee for the user
  SELECT id INTO v_employee_id FROM employee WHERE "userId" = v_user_id LIMIT 1;

  IF v_employee_id IS NULL THEN
    INSERT INTO employee ("companyId", "userId", "createdBy")
    VALUES (v_company_id, v_user_id, v_user_id)
    RETURNING id INTO v_employee_id;
    RAISE NOTICE 'Created employee: %', v_employee_id;
  END IF;

  -- Get an existing item (SHIRT82 or any other)
  SELECT id INTO v_item_id FROM item WHERE "companyId" = v_company_id LIMIT 1;

  IF v_item_id IS NULL THEN
    RAISE NOTICE 'No items found in company';
    RETURN;
  END IF;

  -- Get default location
  SELECT id INTO v_location_id FROM location WHERE "companyId" = v_company_id LIMIT 1;

  -- Get or create a simple process
  SELECT id INTO v_process_id FROM process WHERE "companyId" = v_company_id LIMIT 1;

  IF v_process_id IS NULL THEN
    INSERT INTO process (name, description, "companyId", "createdBy")
    VALUES ('Assembly', 'Test assembly process', v_company_id, v_user_id)
    RETURNING id INTO v_process_id;
  END IF;

  -- Get or create a work center
  SELECT id INTO v_workcenter_id FROM "workCenter" WHERE "companyId" = v_company_id LIMIT 1;

  IF v_workcenter_id IS NULL THEN
    INSERT INTO "workCenter" (name, description, "companyId", "createdBy")
    VALUES ('Main Floor', 'Main production floor', v_company_id, v_user_id)
    RETURNING id INTO v_workcenter_id;
  END IF;

  -- Create a test job
  v_job_readable_id := 'JOB-TEST-' || floor(random() * 1000)::text;

  INSERT INTO job ("jobId", "itemId", "unitOfMeasureCode", "locationId", status, quantity, "companyId", "createdBy")
  VALUES (v_job_readable_id, v_item_id, 'EA', v_location_id, 'Ready'::\"jobStatus\", 100, v_company_id, v_user_id)
  RETURNING id INTO v_job_id;

  RAISE NOTICE 'Created job: % (ID: %)', v_job_readable_id, v_job_id;

  -- Create a job operation
  INSERT INTO "jobOperation" ("jobId", "order", "processId", "workCenterId", description, "laborTime", "laborUnit", "companyId", "createdBy")
  VALUES (v_job_id, 1, v_process_id, v_workcenter_id, 'Assembly Operation', 60, 'minutes', v_company_id, v_user_id)
  RETURNING id INTO v_operation_id;

  RAISE NOTICE 'Created operation: %', v_operation_id;

  -- Create job make method (required for pickups)
  INSERT INTO "jobMakeMethod" ("jobId", "itemId", "companyId", "createdBy")
  VALUES (v_job_id, v_item_id, v_company_id, v_user_id);

  -- Create some pickups
  INSERT INTO "jobOperationPickup" ("jobOperationId", "employeeId", quantity, configuration, "companyId", "createdBy")
  VALUES
    (v_operation_id, v_employee_id, 30, '{"size": "L", "color": "blue"}'::jsonb, v_company_id, v_user_id),
    (v_operation_id, v_employee_id, 25, '{"size": "M", "color": "red"}'::jsonb, v_company_id, v_user_id),
    (v_operation_id, v_employee_id, 20, '{"size": "S", "color": "green"}'::jsonb, v_company_id, v_user_id);

  RAISE NOTICE 'Created 3 pickups (total: 75 units)';

  -- Create a report ID for quantities
  DECLARE
    v_report_id uuid := gen_random_uuid();
  BEGIN
    -- Create production quantities
    INSERT INTO "productionQuantity" ("jobOperationId", "employeeId", "reportId", quantity, type, configuration, "companyId", "createdBy")
    VALUES
      (v_operation_id, v_employee_id, v_report_id, 50, 'Production', '{"size": "L", "color": "blue"}'::jsonb, v_company_id, v_user_id);

    RAISE NOTICE 'Created 1 production quantity (50 units)';

    -- Create some rework
    INSERT INTO "productionQuantity" ("jobOperationId", "employeeId", "reportId", quantity, type, configuration, "companyId", "createdBy")
    VALUES
      (v_operation_id, v_employee_id, gen_random_uuid(), 5, 'Rework', '{"size": "M", "color": "red"}'::jsonb, v_company_id, v_user_id);

    RAISE NOTICE 'Created 1 rework quantity (5 units)';

    -- Create some scrap
    INSERT INTO "productionQuantity" ("jobOperationId", "employeeId", "reportId", quantity, type, "companyId", "createdBy")
    VALUES
      (v_operation_id, v_employee_id, gen_random_uuid(), 3, 'Scrap', v_company_id, v_user_id);

    RAISE NOTICE 'Created 1 scrap quantity (3 units)';
  END;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Test data created successfully!';
  RAISE NOTICE 'Job ID: %', v_job_id;
  RAISE NOTICE 'Access at: /x/job/%/production-logs', v_job_id;
  RAISE NOTICE 'Pickups: 75 units (30 + 25 + 20)';
  RAISE NOTICE 'Production: 50 units';
  RAISE NOTICE 'Remaining: 25 units';
  RAISE NOTICE 'Rework: 5 units';
  RAISE NOTICE 'Scrap: 3 units';
  RAISE NOTICE '========================================';
END $$;
