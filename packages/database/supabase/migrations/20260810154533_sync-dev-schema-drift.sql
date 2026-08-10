-- Catch-up migration: reconcile committed migration history with the dev database.
--
-- The dev DB accumulated schema that was never captured in a committed migration
-- (a global soft-delete feature: deletedAt/deletedBy on ~121 tables + the
-- is_visible() helper; the garment/bundle subsystem: bundle, bundleAllocation,
-- splitBatch, productionQuantitySplitRow + bundleStatus/splitBatchStatus enums;
-- the notification table; and the view/function definitions that depend on them).
-- The 2026-08 items/attributes/config migrations were authored against that DB,
-- so a database built purely from committed migrations (staging, prod, fresh
-- local) diverged from dev and could not reproduce it.
--
-- This migration is the schema delta (generated with `migra`, verified to bring a
-- clean baseline to an exact match with dev) that closes that gap. It is purely
-- additive: creating tables/columns/indexes/constraints/policies/enums and
-- recreating views/functions to match dev. It intentionally does NOT touch the
-- per-company runtime "searchIndex_*" tables. Because dev already contains all of
-- this, the migration is recorded as applied on dev without re-running.

create type "public"."bundleStatus" as enum ('Planned', 'Released', 'In Progress', 'Completed', 'Cancelled');

create type "public"."splitBatchStatus" as enum ('Draft', 'Confirmed', 'Cancelled');












drop view if exists "public"."activeMaintenanceDispatchesByLocation";

drop view if exists "public"."approvalRequests";

drop view if exists "public"."bundleWorkOrders";

drop view if exists "public"."companies";

drop view if exists "public"."consumables";

drop view if exists "public"."contractors";

drop view if exists "public"."customFieldTables";

drop view if exists "public"."customers";

drop view if exists "public"."employeeSalaryRecords";

drop view if exists "public"."employeeSummary";

drop view if exists "public"."employees";

drop view if exists "public"."gauges";

drop view if exists "public"."inspectionDocuments";

drop view if exists "public"."integrations";

drop view if exists "public"."jobMaterialWithMakeMethodId";

drop view if exists "public"."jobOperationsWithDependencies";

drop view if exists "public"."jobOperationsWithMakeMethods";

drop view if exists "public"."jobs";

drop view if exists "public"."kanbans";

drop view if exists "public"."locations";

drop view if exists "public"."maintenanceSchedules";

drop view if exists "public"."masterWorkOrders";

drop view if exists "public"."materials";

drop view if exists "public"."openJobMaterialLines";

drop view if exists "public"."openProductionOrders";

drop view if exists "public"."openPurchaseOrderLines";

drop view if exists "public"."openSalesOrderLines";

drop view if exists "public"."partners";

drop view if exists "public"."parts";

drop view if exists "public"."pickingLists";

drop view if exists "public"."processes";

drop view if exists "public"."purchaseInvoiceLines";

drop view if exists "public"."purchaseInvoices";

drop view if exists "public"."purchaseOrderLines";

drop view if exists "public"."purchaseOrderLocations";

drop view if exists "public"."purchaseOrderSuppliers";

drop view if exists "public"."purchaseOrders";

drop view if exists "public"."purchasingRfqLines";

drop view if exists "public"."purchasingRfqs";

drop view if exists "public"."quoteCustomerDetails";

drop view if exists "public"."quoteLinePrices";

drop view if exists "public"."quoteLines";

drop view if exists "public"."quotes";

drop view if exists "public"."receiptLines";

drop view if exists "public"."receipts";

drop view if exists "public"."salesInvoiceLines";

drop view if exists "public"."salesInvoiceLocations";

drop view if exists "public"."salesInvoices";

drop view if exists "public"."salesOrderCustomers";

drop view if exists "public"."salesOrderLines";

drop view if exists "public"."salesOrderLocations";

drop view if exists "public"."salesOrders";

drop view if exists "public"."salesRfqLines";

drop view if exists "public"."salesRfqs";

drop view if exists "public"."services";

drop view if exists "public"."shifts";

drop view if exists "public"."shipmentLines";

drop view if exists "public"."stockTransferLines";

drop view if exists "public"."storageUnits_recursive";

drop view if exists "public"."styleSamples";

drop view if exists "public"."styles";

drop view if exists "public"."supplierQuoteLines";

drop view if exists "public"."supplierQuotes";

drop view if exists "public"."suppliers";

drop view if exists "public"."timeCardEntries";

drop view if exists "public"."tools";

drop view if exists "public"."userDefaults";

drop view if exists "public"."workCenters";

drop view if exists "public"."workCentersWithBlockingStatus";














































































create table "public"."bundle" (
    "id" text not null default id('bnd'::text),
    "splitBatchId" text not null,
    "jobId" text,
    "itemId" text not null,
    "bundleNumber" text not null,
    "sequence" integer not null,
    "shadeLot" text,
    "quantity" numeric not null,
    "status" "bundleStatus" not null default 'Planned'::"bundleStatus",
    "companyId" text not null,
    "createdBy" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedBy" text,
    "updatedAt" timestamp with time zone
);


alter table "public"."bundle" enable row level security;

create table "public"."bundleAllocation" (
    "id" text not null default id('bal'::text),
    "bundleId" text not null,
    "productionQuantitySplitRowId" text not null,
    "quantity" numeric not null,
    "companyId" text not null,
    "createdBy" text not null,
    "createdAt" timestamp with time zone not null default now()
);


alter table "public"."bundleAllocation" enable row level security;

create table "public"."notification" (
    "id" text not null default xid(),
    "userId" text not null,
    "companyId" text not null,
    "topic" text not null,
    "event" text not null,
    "title" text not null,
    "description" text,
    "from" text,
    "documentType" text,
    "documentId" text,
    "payload" jsonb not null default '{}'::jsonb,
    "readAt" timestamp with time zone,
    "seenAt" timestamp with time zone,
    "digestedInto" text,
    "createdAt" timestamp with time zone not null default now()
);


alter table "public"."notification" enable row level security;

create table "public"."productionQuantitySplitRow" (
    "id" text not null default id('psr'::text),
    "productionQuantityId" text not null,
    "reportId" text not null,
    "jobId" text not null,
    "jobOperationId" text not null,
    "itemId" text not null,
    "rowKey" text not null,
    "shadeLot" text,
    "configurationKey" text not null,
    "rowConfiguration" jsonb,
    "quantity" numeric not null,
    "companyId" text not null,
    "createdBy" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedBy" text,
    "updatedAt" timestamp with time zone
);


alter table "public"."productionQuantitySplitRow" enable row level security;














































































































































create table "public"."splitBatch" (
    "id" text not null default id('sbt'::text),
    "jobId" text not null,
    "jobOperationId" text,
    "itemId" text not null,
    "status" "splitBatchStatus" not null default 'Draft'::"splitBatchStatus",
    "notes" text,
    "companyId" text not null,
    "createdBy" text not null,
    "createdAt" timestamp with time zone not null default now(),
    "updatedBy" text,
    "updatedAt" timestamp with time zone
);


alter table "public"."splitBatch" enable row level security;

alter table "public"."ability" add column "deletedAt" timestamp with time zone;

alter table "public"."ability" add column "deletedBy" text;

alter table "public"."account" add column "deletedAt" timestamp with time zone;

alter table "public"."account" add column "deletedBy" text;

alter table "public"."address" add column "deletedAt" timestamp with time zone;

alter table "public"."address" add column "deletedBy" text;

alter table "public"."apiKey" add column "deletedAt" timestamp with time zone;

alter table "public"."apiKey" add column "deletedBy" text;

alter table "public"."batchProperty" add column "deletedAt" timestamp with time zone;

alter table "public"."batchProperty" add column "deletedBy" text;

alter table "public"."company" add column "deletedAt" timestamp with time zone;

alter table "public"."company" add column "deletedBy" text;

alter table "public"."configurationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."configurationParameter" add column "deletedBy" text;

alter table "public"."configurationParameterGroup" add column "deletedAt" timestamp with time zone;

alter table "public"."configurationParameterGroup" add column "deletedBy" text;

alter table "public"."contractor" add column "deletedAt" timestamp with time zone;

alter table "public"."contractor" add column "deletedBy" text;

alter table "public"."costCenter" add column "deletedAt" timestamp with time zone;

alter table "public"."costCenter" add column "deletedBy" text;

alter table "public"."customField" add column "deletedAt" timestamp with time zone;

alter table "public"."customField" add column "deletedBy" text;

alter table "public"."customer" add column "deletedAt" timestamp with time zone;

alter table "public"."customer" add column "deletedBy" text;

alter table "public"."customerStatus" add column "deletedAt" timestamp with time zone;

alter table "public"."customerStatus" add column "deletedBy" text;

alter table "public"."customerType" add column "deletedAt" timestamp with time zone;

alter table "public"."customerType" add column "deletedBy" text;

alter table "public"."department" add column "deletedAt" timestamp with time zone;

alter table "public"."department" add column "deletedBy" text;

alter table "public"."document" add column "deletedAt" timestamp with time zone;

alter table "public"."document" add column "deletedBy" text;

alter table "public"."externalLink" add column "deletedAt" timestamp with time zone;

alter table "public"."externalLink" add column "deletedBy" text;

alter table "public"."gauge" add column "deletedAt" timestamp with time zone;

alter table "public"."gauge" add column "deletedBy" text;

alter table "public"."gaugeType" add column "deletedAt" timestamp with time zone;

alter table "public"."gaugeType" add column "deletedBy" text;

alter table "public"."group" add column "deletedAt" timestamp with time zone;

alter table "public"."group" add column "deletedBy" text;

alter table "public"."holiday" add column "deletedAt" timestamp with time zone;

alter table "public"."holiday" add column "deletedBy" text;

alter table "public"."inviteLink" add column "loginMethods" text[];

alter table "public"."item" add column "deletedAt" timestamp with time zone;

alter table "public"."item" add column "deletedBy" text;

alter table "public"."itemPostingGroup" add column "deletedAt" timestamp with time zone;

alter table "public"."itemPostingGroup" add column "deletedBy" text;

alter table "public"."itemShelfLife" add column "deletedAt" timestamp with time zone;

alter table "public"."itemShelfLife" add column "deletedBy" text;

alter table "public"."job" add column "deletedAt" timestamp with time zone;

alter table "public"."job" add column "deletedBy" text;

alter table "public"."jobAssignmentRule" add column "deletedAt" timestamp with time zone;

alter table "public"."jobAssignmentRule" add column "deletedBy" text;

alter table "public"."jobMaterial" add column "deletedAt" timestamp with time zone;

alter table "public"."jobMaterial" add column "deletedBy" text;

alter table "public"."jobOperation" add column "deletedAt" timestamp with time zone;

alter table "public"."jobOperation" add column "deletedBy" text;

alter table "public"."jobOperationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."jobOperationParameter" add column "deletedBy" text;

alter table "public"."jobOperationPickup" add column "deletedAt" timestamp with time zone;

alter table "public"."jobOperationPickup" add column "deletedBy" text;

alter table "public"."jobOperationStep" add column "deletedAt" timestamp with time zone;

alter table "public"."jobOperationStep" add column "deletedBy" text;

alter table "public"."jobOperationTool" add column "deletedAt" timestamp with time zone;

alter table "public"."jobOperationTool" add column "deletedBy" text;

alter table "public"."journal" add column "deletedAt" timestamp with time zone;

alter table "public"."journal" add column "deletedBy" text;

alter table "public"."journalLine" add column "deletedAt" timestamp with time zone;

alter table "public"."journalLine" add column "deletedBy" text;

alter table "public"."kanban" add column "deletedAt" timestamp with time zone;

alter table "public"."kanban" add column "deletedBy" text;

alter table "public"."location" add column "deletedAt" timestamp with time zone;

alter table "public"."location" add column "deletedBy" text;

alter table "public"."maintenanceDispatch" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceDispatch" add column "deletedBy" text;

alter table "public"."maintenanceDispatchComment" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceDispatchComment" add column "deletedBy" text;

alter table "public"."maintenanceDispatchEvent" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceDispatchEvent" add column "deletedBy" text;

alter table "public"."maintenanceDispatchItem" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceDispatchItem" add column "deletedBy" text;

alter table "public"."maintenanceFailureMode" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceFailureMode" add column "deletedBy" text;

alter table "public"."maintenanceSchedule" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceSchedule" add column "deletedBy" text;

alter table "public"."maintenanceScheduleItem" add column "deletedAt" timestamp with time zone;

alter table "public"."maintenanceScheduleItem" add column "deletedBy" text;

alter table "public"."materialDimension" add column "deletedAt" timestamp with time zone;

alter table "public"."materialDimension" add column "deletedBy" text;

alter table "public"."materialFinish" add column "deletedAt" timestamp with time zone;

alter table "public"."materialFinish" add column "deletedBy" text;

alter table "public"."materialForm" add column "deletedAt" timestamp with time zone;

alter table "public"."materialForm" add column "deletedBy" text;

alter table "public"."materialGrade" add column "deletedAt" timestamp with time zone;

alter table "public"."materialGrade" add column "deletedBy" text;

alter table "public"."materialSubstance" add column "deletedAt" timestamp with time zone;

alter table "public"."materialSubstance" add column "deletedBy" text;

alter table "public"."materialType" add column "deletedAt" timestamp with time zone;

alter table "public"."materialType" add column "deletedBy" text;

alter table "public"."methodMaterial" add column "deletedAt" timestamp with time zone;

alter table "public"."methodMaterial" add column "deletedBy" text;

alter table "public"."methodOperation" add column "deletedAt" timestamp with time zone;

alter table "public"."methodOperation" add column "deletedBy" text;

alter table "public"."methodOperationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."methodOperationParameter" add column "deletedBy" text;

alter table "public"."methodOperationStep" add column "deletedAt" timestamp with time zone;

alter table "public"."methodOperationStep" add column "deletedBy" text;

alter table "public"."methodOperationTool" add column "deletedAt" timestamp with time zone;

alter table "public"."methodOperationTool" add column "deletedBy" text;

alter table "public"."noQuoteReason" add column "deletedAt" timestamp with time zone;

alter table "public"."noQuoteReason" add column "deletedBy" text;

alter table "public"."nonConformance" add column "deletedAt" timestamp with time zone;

alter table "public"."nonConformance" add column "deletedBy" text;

alter table "public"."partner" add column "deletedAt" timestamp with time zone;

alter table "public"."partner" add column "deletedBy" text;

alter table "public"."pricingRule" add column "deletedAt" timestamp with time zone;

alter table "public"."pricingRule" add column "deletedBy" text;

alter table "public"."procedure" add column "deletedAt" timestamp with time zone;

alter table "public"."procedure" add column "deletedBy" text;

alter table "public"."process" add column "deletedAt" timestamp with time zone;

alter table "public"."process" add column "deletedBy" text;

alter table "public"."productionEvent" add column "deletedAt" timestamp with time zone;

alter table "public"."productionEvent" add column "deletedBy" text;

alter table "public"."productionQuantity" alter column "reportId" drop not null;

alter table "public"."purchaseInvoice" add column "deletedAt" timestamp with time zone;

alter table "public"."purchaseInvoice" add column "deletedBy" text;

alter table "public"."purchaseOrder" add column "deletedAt" timestamp with time zone;

alter table "public"."purchaseOrder" add column "deletedBy" text;

alter table "public"."purchasingRfq" add column "deletedAt" timestamp with time zone;

alter table "public"."purchasingRfq" add column "deletedBy" text;

alter table "public"."qualityDocument" add column "deletedAt" timestamp with time zone;

alter table "public"."qualityDocument" add column "deletedBy" text;

alter table "public"."quote" add column "deletedAt" timestamp with time zone;

alter table "public"."quote" add column "deletedBy" text;

alter table "public"."quoteLine" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteLine" add column "deletedBy" text;

alter table "public"."quoteLinePrice" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteLinePrice" add column "deletedBy" text;

alter table "public"."quoteMakeMethod" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteMakeMethod" add column "deletedBy" text;

alter table "public"."quoteMaterial" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteMaterial" add column "deletedBy" text;

alter table "public"."quoteOperation" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteOperation" add column "deletedBy" text;

alter table "public"."quoteOperationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteOperationParameter" add column "deletedBy" text;

alter table "public"."quoteOperationStep" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteOperationStep" add column "deletedBy" text;

alter table "public"."quoteOperationTool" add column "deletedAt" timestamp with time zone;

alter table "public"."quoteOperationTool" add column "deletedBy" text;

alter table "public"."receipt" add column "deletedAt" timestamp with time zone;

alter table "public"."receipt" add column "deletedBy" text;

alter table "public"."receiptLine" add column "deletedAt" timestamp with time zone;

alter table "public"."receiptLine" add column "deletedBy" text;

alter table "public"."riskRegister" add column "deletedAt" timestamp with time zone;

alter table "public"."riskRegister" add column "deletedBy" text;

alter table "public"."salesInvoice" add column "deletedAt" timestamp with time zone;

alter table "public"."salesInvoice" add column "deletedBy" text;

alter table "public"."salesInvoiceLine" add column "deletedAt" timestamp with time zone;

alter table "public"."salesInvoiceLine" add column "deletedBy" text;

alter table "public"."salesRfq" add column "deletedAt" timestamp with time zone;

alter table "public"."salesRfq" add column "deletedBy" text;

alter table "public"."salesRfqLine" add column "deletedAt" timestamp with time zone;

alter table "public"."salesRfqLine" add column "deletedBy" text;

alter table "public"."scrapReason" add column "deletedAt" timestamp with time zone;

alter table "public"."scrapReason" add column "deletedBy" text;

alter table "public"."shipment" add column "deletedAt" timestamp with time zone;

alter table "public"."shipment" add column "deletedBy" text;

alter table "public"."shipmentLine" add column "deletedAt" timestamp with time zone;

alter table "public"."shipmentLine" add column "deletedBy" text;

alter table "public"."stockTransfer" add column "deletedAt" timestamp with time zone;

alter table "public"."stockTransfer" add column "deletedBy" text;

alter table "public"."storageRule" add column "deletedAt" timestamp with time zone;

alter table "public"."storageRule" add column "deletedBy" text;

alter table "public"."storageType" add column "deletedAt" timestamp with time zone;

alter table "public"."storageType" add column "deletedBy" text;

alter table "public"."storageUnit" add column "deletedAt" timestamp with time zone;

alter table "public"."storageUnit" add column "deletedBy" text;

alter table "public"."suggestion" add column "deletedAt" timestamp with time zone;

alter table "public"."suggestion" add column "deletedBy" text;

alter table "public"."supplier" add column "deletedAt" timestamp with time zone;

alter table "public"."supplier" add column "deletedBy" text;

alter table "public"."supplierQuote" add column "deletedAt" timestamp with time zone;

alter table "public"."supplierQuote" add column "deletedBy" text;

alter table "public"."supplierQuoteLine" add column "deletedAt" timestamp with time zone;

alter table "public"."supplierQuoteLine" add column "deletedBy" text;

alter table "public"."supplierType" add column "deletedAt" timestamp with time zone;

alter table "public"."supplierType" add column "deletedBy" text;

alter table "public"."tableView" add column "deletedAt" timestamp with time zone;

alter table "public"."tableView" add column "deletedBy" text;

alter table "public"."templateConfigurationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."templateConfigurationParameter" add column "deletedBy" text;

alter table "public"."templateMethodMaterial" add column "deletedAt" timestamp with time zone;

alter table "public"."templateMethodMaterial" add column "deletedBy" text;

alter table "public"."templateMethodOperation" add column "deletedAt" timestamp with time zone;

alter table "public"."templateMethodOperation" add column "deletedBy" text;

alter table "public"."templateMethodOperationParameter" add column "deletedAt" timestamp with time zone;

alter table "public"."templateMethodOperationParameter" add column "deletedBy" text;

alter table "public"."templateMethodOperationStep" add column "deletedAt" timestamp with time zone;

alter table "public"."templateMethodOperationStep" add column "deletedBy" text;

alter table "public"."templateMethodOperationTool" add column "deletedAt" timestamp with time zone;

alter table "public"."templateMethodOperationTool" add column "deletedBy" text;

alter table "public"."timeCardEntry" add column "deletedAt" timestamp with time zone;

alter table "public"."timeCardEntry" add column "deletedBy" text;

alter table "public"."training" add column "deletedAt" timestamp with time zone;

alter table "public"."training" add column "deletedBy" text;

alter table "public"."trainingAssignment" add column "deletedAt" timestamp with time zone;

alter table "public"."trainingAssignment" add column "deletedBy" text;

alter table "public"."unitOfMeasure" add column "deletedAt" timestamp with time zone;

alter table "public"."unitOfMeasure" add column "deletedBy" text;

alter table "public"."warehouseTransfer" add column "deletedAt" timestamp with time zone;

alter table "public"."warehouseTransfer" add column "deletedBy" text;

alter table "public"."warehouseTransferLine" add column "deletedAt" timestamp with time zone;

alter table "public"."warehouseTransferLine" add column "deletedBy" text;

alter table "public"."webhook" add column "deletedAt" timestamp with time zone;

alter table "public"."webhook" add column "deletedBy" text;

CREATE INDEX "ability_not_deleted_companyId_idx" ON public.ability USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "address_not_deleted_companyId_idx" ON public.address USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "apiKey_not_deleted_companyId_idx" ON public."apiKey" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "batchProperty_not_deleted_companyId_idx" ON public."batchProperty" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "bundleAllocation_bundleId_idx" ON public."bundleAllocation" USING btree ("bundleId");

CREATE INDEX "bundleAllocation_companyId_idx" ON public."bundleAllocation" USING btree ("companyId");

CREATE UNIQUE INDEX "bundleAllocation_pkey" ON public."bundleAllocation" USING btree (id);

CREATE INDEX "bundleAllocation_productionQuantitySplitRowId_idx" ON public."bundleAllocation" USING btree ("productionQuantitySplitRowId");

CREATE UNIQUE INDEX "bundle_bundleNumber_key" ON public.bundle USING btree ("bundleNumber", "companyId");

CREATE INDEX "bundle_companyId_idx" ON public.bundle USING btree ("companyId");

CREATE INDEX "bundle_itemId_idx" ON public.bundle USING btree ("itemId");

CREATE INDEX "bundle_jobId_idx" ON public.bundle USING btree ("jobId");

CREATE UNIQUE INDEX bundle_pkey ON public.bundle USING btree (id);

CREATE INDEX "bundle_splitBatchId_idx" ON public.bundle USING btree ("splitBatchId");

CREATE INDEX "configurationParameterGroup_not_deleted_companyId_idx" ON public."configurationParameterGroup" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "configurationParameter_not_deleted_companyId_idx" ON public."configurationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "contractor_not_deleted_companyId_idx" ON public.contractor USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "costCenter_not_deleted_companyId_idx" ON public."costCenter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "customField_not_deleted_companyId_idx" ON public."customField" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "customerStatus_not_deleted_companyId_idx" ON public."customerStatus" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "customerType_not_deleted_companyId_idx" ON public."customerType" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "customer_not_deleted_companyId_idx" ON public.customer USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "department_not_deleted_companyId_idx" ON public.department USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "document_not_deleted_companyId_idx" ON public.document USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "externalLink_not_deleted_companyId_idx" ON public."externalLink" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "gaugeType_not_deleted_companyId_idx" ON public."gaugeType" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "gauge_not_deleted_companyId_idx" ON public.gauge USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "group_not_deleted_companyId_idx" ON public."group" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "holiday_not_deleted_companyId_idx" ON public.holiday USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "itemPostingGroup_not_deleted_companyId_idx" ON public."itemPostingGroup" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "itemRule_not_deleted_companyId_idx" ON public."storageRule" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "itemShelfLife_not_deleted_companyId_idx" ON public."itemShelfLife" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "item_not_deleted_companyId_idx" ON public.item USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobAssignmentRule_not_deleted_companyId_idx" ON public."jobAssignmentRule" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobMaterial_not_deleted_companyId_idx" ON public."jobMaterial" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobOperationParameter_not_deleted_companyId_idx" ON public."jobOperationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobOperationPickup_not_deleted_companyId_idx" ON public."jobOperationPickup" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobOperationStep_not_deleted_companyId_idx" ON public."jobOperationStep" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobOperationTool_not_deleted_companyId_idx" ON public."jobOperationTool" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "jobOperation_not_deleted_companyId_idx" ON public."jobOperation" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "job_not_deleted_companyId_idx" ON public.job USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "journalLine_not_deleted_companyId_idx" ON public."journalLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "journal_not_deleted_companyId_idx" ON public.journal USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "kanban_not_deleted_companyId_idx" ON public.kanban USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "location_not_deleted_companyId_idx" ON public.location USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceDispatchComment_not_deleted_companyId_idx" ON public."maintenanceDispatchComment" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceDispatchEvent_not_deleted_companyId_idx" ON public."maintenanceDispatchEvent" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceDispatchItem_not_deleted_companyId_idx" ON public."maintenanceDispatchItem" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceDispatch_not_deleted_companyId_idx" ON public."maintenanceDispatch" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceFailureMode_not_deleted_companyId_idx" ON public."maintenanceFailureMode" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceScheduleItem_not_deleted_companyId_idx" ON public."maintenanceScheduleItem" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "maintenanceSchedule_not_deleted_companyId_idx" ON public."maintenanceSchedule" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialDimension_not_deleted_companyId_idx" ON public."materialDimension" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialFinish_not_deleted_companyId_idx" ON public."materialFinish" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialForm_not_deleted_companyId_idx" ON public."materialForm" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialGrade_not_deleted_companyId_idx" ON public."materialGrade" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialSubstance_not_deleted_companyId_idx" ON public."materialSubstance" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "materialType_not_deleted_companyId_idx" ON public."materialType" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "methodMaterial_not_deleted_companyId_idx" ON public."methodMaterial" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "methodOperationParameter_not_deleted_companyId_idx" ON public."methodOperationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "methodOperationStep_not_deleted_companyId_idx" ON public."methodOperationStep" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "methodOperationTool_not_deleted_companyId_idx" ON public."methodOperationTool" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "methodOperation_not_deleted_companyId_idx" ON public."methodOperation" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "noQuoteReason_not_deleted_companyId_idx" ON public."noQuoteReason" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "nonConformance_not_deleted_companyId_idx" ON public."nonConformance" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE UNIQUE INDEX notification_pkey ON public.notification USING btree (id);

CREATE INDEX notification_user_company_created_idx ON public.notification USING btree ("userId", "companyId", "createdAt" DESC);

CREATE INDEX notification_user_unread_idx ON public.notification USING btree ("userId", "companyId", topic) WHERE (("readAt" IS NULL) AND ("digestedInto" IS NULL));

CREATE INDEX "partner_not_deleted_companyId_idx" ON public.partner USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "pricingRule_not_deleted_companyId_idx" ON public."pricingRule" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "procedure_not_deleted_companyId_idx" ON public.procedure USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "process_not_deleted_companyId_idx" ON public.process USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "productionEvent_not_deleted_companyId_idx" ON public."productionEvent" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "productionQuantitySplitRow_companyId_idx" ON public."productionQuantitySplitRow" USING btree ("companyId");

CREATE INDEX "productionQuantitySplitRow_itemId_idx" ON public."productionQuantitySplitRow" USING btree ("itemId");

CREATE INDEX "productionQuantitySplitRow_jobId_idx" ON public."productionQuantitySplitRow" USING btree ("jobId");

CREATE INDEX "productionQuantitySplitRow_jobOperationId_idx" ON public."productionQuantitySplitRow" USING btree ("jobOperationId");

CREATE UNIQUE INDEX "productionQuantitySplitRow_pkey" ON public."productionQuantitySplitRow" USING btree (id);

CREATE INDEX "productionQuantitySplitRow_productionQuantityId_idx" ON public."productionQuantitySplitRow" USING btree ("productionQuantityId");

CREATE UNIQUE INDEX "productionQuantitySplitRow_productionQuantityId_rowKey_key" ON public."productionQuantitySplitRow" USING btree ("productionQuantityId", "rowKey");

CREATE INDEX "productionQuantitySplitRow_reportId_idx" ON public."productionQuantitySplitRow" USING btree ("reportId");

CREATE INDEX "purchaseInvoice_not_deleted_companyId_idx" ON public."purchaseInvoice" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "purchaseOrder_not_deleted_companyId_idx" ON public."purchaseOrder" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "purchasingRfq_not_deleted_companyId_idx" ON public."purchasingRfq" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "qualityDocument_not_deleted_companyId_idx" ON public."qualityDocument" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteLine_not_deleted_companyId_idx" ON public."quoteLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteMakeMethod_not_deleted_companyId_idx" ON public."quoteMakeMethod" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteMaterial_not_deleted_companyId_idx" ON public."quoteMaterial" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteOperationParameter_not_deleted_companyId_idx" ON public."quoteOperationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteOperationStep_not_deleted_companyId_idx" ON public."quoteOperationStep" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteOperationTool_not_deleted_companyId_idx" ON public."quoteOperationTool" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quoteOperation_not_deleted_companyId_idx" ON public."quoteOperation" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "quote_not_deleted_companyId_idx" ON public.quote USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "receiptLine_not_deleted_companyId_idx" ON public."receiptLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "receipt_not_deleted_companyId_idx" ON public.receipt USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "riskRegister_not_deleted_companyId_idx" ON public."riskRegister" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesInvoiceLine_not_deleted_companyId_idx" ON public."salesInvoiceLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesInvoice_not_deleted_companyId_idx" ON public."salesInvoice" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesOrderLine_not_deleted_companyId_idx" ON public."salesOrderLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesOrder_not_deleted_companyId_idx" ON public."salesOrder" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesRfqLine_not_deleted_companyId_idx" ON public."salesRfqLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "salesRfq_not_deleted_companyId_idx" ON public."salesRfq" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "scrapReason_not_deleted_companyId_idx" ON public."scrapReason" USING btree ("companyId") WHERE ("deletedAt" IS NULL);












































































































































































































































CREATE INDEX "shipmentLine_not_deleted_companyId_idx" ON public."shipmentLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "shipment_not_deleted_companyId_idx" ON public.shipment USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "splitBatch_companyId_idx" ON public."splitBatch" USING btree ("companyId");

CREATE INDEX "splitBatch_itemId_idx" ON public."splitBatch" USING btree ("itemId");

CREATE INDEX "splitBatch_jobId_idx" ON public."splitBatch" USING btree ("jobId");

CREATE INDEX "splitBatch_jobOperationId_idx" ON public."splitBatch" USING btree ("jobOperationId");

CREATE UNIQUE INDEX "splitBatch_pkey" ON public."splitBatch" USING btree (id);

CREATE INDEX "stockTransfer_not_deleted_companyId_idx" ON public."stockTransfer" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "storageType_not_deleted_companyId_idx" ON public."storageType" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "storageUnit_not_deleted_companyId_idx" ON public."storageUnit" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "suggestion_not_deleted_companyId_idx" ON public.suggestion USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "supplierQuoteLine_not_deleted_companyId_idx" ON public."supplierQuoteLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "supplierQuote_not_deleted_companyId_idx" ON public."supplierQuote" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "supplierType_not_deleted_companyId_idx" ON public."supplierType" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "supplier_not_deleted_companyId_idx" ON public.supplier USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "tableView_not_deleted_companyId_idx" ON public."tableView" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateConfigurationParameter_not_deleted_companyId_idx" ON public."templateConfigurationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateMethodMaterial_not_deleted_companyId_idx" ON public."templateMethodMaterial" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateMethodOperationParameter_not_deleted_companyId_idx" ON public."templateMethodOperationParameter" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateMethodOperationStep_not_deleted_companyId_idx" ON public."templateMethodOperationStep" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateMethodOperationTool_not_deleted_companyId_idx" ON public."templateMethodOperationTool" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "templateMethodOperation_not_deleted_companyId_idx" ON public."templateMethodOperation" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "timeCardEntry_not_deleted_companyId_idx" ON public."timeCardEntry" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "trainingAssignment_not_deleted_companyId_idx" ON public."trainingAssignment" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "training_not_deleted_companyId_idx" ON public.training USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "unitOfMeasure_not_deleted_companyId_idx" ON public."unitOfMeasure" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "warehouseTransferLine_not_deleted_companyId_idx" ON public."warehouseTransferLine" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "warehouseTransfer_not_deleted_companyId_idx" ON public."warehouseTransfer" USING btree ("companyId") WHERE ("deletedAt" IS NULL);

CREATE INDEX "webhook_not_deleted_companyId_idx" ON public.webhook USING btree ("companyId") WHERE ("deletedAt" IS NULL);

alter table "public"."bundle" add constraint "bundle_pkey" PRIMARY KEY using index "bundle_pkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_pkey" PRIMARY KEY using index "bundleAllocation_pkey";

alter table "public"."notification" add constraint "notification_pkey" PRIMARY KEY using index "notification_pkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_pkey" PRIMARY KEY using index "productionQuantitySplitRow_pkey";
















































alter table "public"."splitBatch" add constraint "splitBatch_pkey" PRIMARY KEY using index "splitBatch_pkey";

alter table "public"."bundle" add constraint "bundle_bundleNumber_key" UNIQUE using index "bundle_bundleNumber_key";

alter table "public"."bundle" add constraint "bundle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundle" validate constraint "bundle_companyId_fkey";

alter table "public"."bundle" add constraint "bundle_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"(id) not valid;

alter table "public"."bundle" validate constraint "bundle_createdBy_fkey";

alter table "public"."bundle" add constraint "bundle_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundle" validate constraint "bundle_itemId_fkey";

alter table "public"."bundle" add constraint "bundle_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES job(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."bundle" validate constraint "bundle_jobId_fkey";

alter table "public"."bundle" add constraint "bundle_quantity_positive" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."bundle" validate constraint "bundle_quantity_positive";

alter table "public"."bundle" add constraint "bundle_splitBatchId_fkey" FOREIGN KEY ("splitBatchId") REFERENCES "splitBatch"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundle" validate constraint "bundle_splitBatchId_fkey";

alter table "public"."bundle" add constraint "bundle_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"(id) not valid;

alter table "public"."bundle" validate constraint "bundle_updatedBy_fkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES bundle(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundleAllocation" validate constraint "bundleAllocation_bundleId_fkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundleAllocation" validate constraint "bundleAllocation_companyId_fkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"(id) not valid;

alter table "public"."bundleAllocation" validate constraint "bundleAllocation_createdBy_fkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_productionQuantitySplitRowId_fkey" FOREIGN KEY ("productionQuantitySplitRowId") REFERENCES "productionQuantitySplitRow"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bundleAllocation" validate constraint "bundleAllocation_productionQuantitySplitRowId_fkey";

alter table "public"."bundleAllocation" add constraint "bundleAllocation_quantity_positive" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."bundleAllocation" validate constraint "bundleAllocation_quantity_positive";

alter table "public"."notification" add constraint "notification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notification_companyId_fkey";

alter table "public"."notification" add constraint "notification_digestedInto_fkey" FOREIGN KEY ("digestedInto") REFERENCES notification(id) ON DELETE SET NULL not valid;

alter table "public"."notification" validate constraint "notification_digestedInto_fkey";

alter table "public"."notification" add constraint "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notification" validate constraint "notification_userId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_companyId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"(id) not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_createdBy_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_itemId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES job(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_jobId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_jobOperationId_fkey" FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_jobOperationId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_productionQuantityId_fkey" FOREIGN KEY ("productionQuantityId") REFERENCES "productionQuantity"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_productionQuantityId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_productionQuantityId_rowKey_key" UNIQUE using index "productionQuantitySplitRow_productionQuantityId_rowKey_key";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_quantity_positive" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_quantity_positive";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "productionQuantityReport"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_reportId_fkey";

alter table "public"."productionQuantitySplitRow" add constraint "productionQuantitySplitRow_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"(id) not valid;

alter table "public"."productionQuantitySplitRow" validate constraint "productionQuantitySplitRow_updatedBy_fkey";
















































alter table "public"."splitBatch" add constraint "splitBatch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_companyId_fkey";

alter table "public"."splitBatch" add constraint "splitBatch_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"(id) not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_createdBy_fkey";

alter table "public"."splitBatch" add constraint "splitBatch_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_itemId_fkey";

alter table "public"."splitBatch" add constraint "splitBatch_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES job(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_jobId_fkey";

alter table "public"."splitBatch" add constraint "splitBatch_jobOperationId_fkey" FOREIGN KEY ("jobOperationId") REFERENCES "jobOperation"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_jobOperationId_fkey";

alter table "public"."splitBatch" add constraint "splitBatch_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"(id) not valid;

alter table "public"."splitBatch" validate constraint "splitBatch_updatedBy_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_visible(deleted_at timestamp with time zone)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT deleted_at IS NULL
      OR current_setting('app.include_deleted', true) = 'true';
$function$
;

create or replace view "public"."activeMaintenanceDispatchesByLocation" as  SELECT md.id,
    md."maintenanceDispatchId",
    md.content,
    md.status,
    md.priority,
    md.source,
    md.severity,
    md."oeeImpact",
    md."workCenterId",
    md."maintenanceScheduleId",
    md."suspectedFailureModeId",
    md."actualFailureModeId",
    md."plannedStartTime",
    md."plannedEndTime",
    md."actualStartTime",
    md."actualEndTime",
    md.duration,
    md."nonConformanceId",
    md."completedAt",
    md.assignee,
    md."companyId",
    md."createdBy",
    md."createdAt",
    md."updatedBy",
    md."updatedAt",
    wc."locationId",
    wc.name AS "workCenterName",
    l.name AS "locationName",
    assignee."fullName" AS "assigneeName",
    assignee."avatarUrl" AS "assigneeAvatarUrl",
    sfm.name AS "suspectedFailureModeName",
    afm.name AS "actualFailureModeName"
   FROM ((((("maintenanceDispatch" md
     LEFT JOIN "workCenter" wc ON ((md."workCenterId" = wc.id)))
     LEFT JOIN location l ON ((wc."locationId" = l.id)))
     LEFT JOIN "user" assignee ON ((md.assignee = assignee.id)))
     LEFT JOIN "maintenanceFailureMode" sfm ON ((md."suspectedFailureModeId" = sfm.id)))
     LEFT JOIN "maintenanceFailureMode" afm ON ((md."actualFailureModeId" = afm.id)))
  WHERE (md.status = ANY (ARRAY['Open'::"maintenanceDispatchStatus", 'Assigned'::"maintenanceDispatchStatus", 'In Progress'::"maintenanceDispatchStatus"]));


create or replace view "public"."approvalRequests" as  SELECT ar.id,
    ar."documentType",
    ar."documentId",
    ar.status,
    ar."requestedBy",
    ar."requestedAt",
    ar."decisionBy",
    ar."decisionAt",
    ar."decisionNotes",
    ar."companyId",
    ar."createdAt",
        CASE
            WHEN (ar."documentType" = 'purchaseOrder'::"approvalDocumentType") THEN po."purchaseOrderId"
            WHEN (ar."documentType" = 'qualityDocument'::"approvalDocumentType") THEN qd.name
            WHEN (ar."documentType" = 'supplier'::"approvalDocumentType") THEN sup.name
            WHEN (ar."documentType" = 'productionQuantityReport'::"approvalDocumentType") THEN ((COALESCE(j."jobId", ''::text) || ' · '::text) || COALESCE(u."fullName", u."firstName", ''::text))
            ELSE NULL::text
        END AS "documentReadableId",
        CASE
            WHEN (ar."documentType" = 'purchaseOrder'::"approvalDocumentType") THEN s.name
            WHEN (ar."documentType" = 'qualityDocument'::"approvalDocumentType") THEN qd.description
            WHEN (ar."documentType" = 'supplier'::"approvalDocumentType") THEN NULL::text
            WHEN (ar."documentType" = 'productionQuantityReport'::"approvalDocumentType") THEN COALESCE(p.name, jo.description)
            ELSE NULL::text
        END AS "documentDescription"
   FROM ((((((((("approvalRequest" ar
     LEFT JOIN "purchaseOrder" po ON (((ar."documentType" = 'purchaseOrder'::"approvalDocumentType") AND (ar."documentId" = po.id))))
     LEFT JOIN supplier s ON ((po."supplierId" = s.id)))
     LEFT JOIN "qualityDocument" qd ON (((ar."documentType" = 'qualityDocument'::"approvalDocumentType") AND (ar."documentId" = qd.id))))
     LEFT JOIN supplier sup ON (((ar."documentType" = 'supplier'::"approvalDocumentType") AND (ar."documentId" = sup.id))))
     LEFT JOIN "productionQuantityReport" pqr ON (((ar."documentType" = 'productionQuantityReport'::"approvalDocumentType") AND (ar."documentId" = pqr.id))))
     LEFT JOIN job j ON ((pqr."jobId" = j.id)))
     LEFT JOIN "user" u ON ((pqr."employeeId" = u.id)))
     LEFT JOIN "jobOperation" jo ON ((pqr."jobOperationId" = jo.id)))
     LEFT JOIN process p ON ((jo."processId" = p.id)));


create or replace view "public"."bundleWorkOrders" as  SELECT bwo.id,
    bwo."masterWorkOrderId",
    bwo."jobId",
    bwo."companyId",
    bwo.sequence,
    bwo."createdAt",
    bwo."createdBy",
    bwo."updatedAt",
    bwo."updatedBy",
    bwo.tags,
    j."jobId" AS "jobReadableId",
    j.status,
    j.quantity,
    j."dueDate",
    j."itemId",
    i."readableIdWithRevision",
    i.name AS "itemName",
    j.assignee,
    j."quantityComplete",
    bwo."reportedQuantity",
    bwo."lastReportedAt",
    j."assignedAt",
    (( SELECT count(*) AS count
           FROM "jobOperation" jo
          WHERE (jo."jobId" = bwo."jobId")))::integer AS "processCount",
    j."scrapQuantity",
    j."storageUnitId",
    j."locationId",
    j."salesOrderId",
    j."salesOrderLineId",
    iv."valuesKey",
    COALESCE(NULLIF(replace(iv."valuesKey", '|'::text, ' · '::text), ''::text), i.name, i."readableIdWithRevision") AS "attributeLabel",
    COALESCE(( SELECT jsonb_object_agg(ia.code, COALESCE(iav.name, iav.code)) AS jsonb_object_agg
           FROM (("itemVariantAttribute" iva
             JOIN "itemAttribute" ia ON ((ia.id = iva."attributeId")))
             JOIN "itemAttributeValue" iav ON ((iav.id = iva."attributeValueId")))
          WHERE ((iva."itemVariantId" = iv.id) AND (iva."companyId" = bwo."companyId"))), '{}'::jsonb) AS "attributeValues"
   FROM ((("bundleWorkOrder" bwo
     JOIN job j ON ((j.id = bwo."jobId")))
     LEFT JOIN item i ON (((i.id = j."itemId") AND (i."companyId" = j."companyId"))))
     LEFT JOIN "itemVariant" iv ON (((iv."variantItemId" = j."itemId") AND (iv."companyId" = j."companyId"))));


create or replace view "public"."companies" as  SELECT DISTINCT c.id,
    c.name,
    c."taxId",
    c."addressLine1",
    c."addressLine2",
    c.city,
    c."stateProvince",
    c."postalCode",
    c."countryCode",
    c.phone,
    c.fax,
    c.email,
    c.website,
    c."updatedBy",
    c."baseCurrencyCode",
    c."logoDarkIcon",
    c."logoLightIcon",
    c."logoDark",
    c."logoLight",
    c."slackChannel",
    c."createdAt",
    c."suggestionNotificationGroup",
    c."auditLogEnabled",
    c."companyGroupId",
    c."parentCompanyId",
    c."isEliminationEntity",
    c.active,
    c."vatNumber",
    c.eori,
    c."logoWatermark",
    uc."userId",
    uc."companyId",
    uc.role,
    et.name AS "employeeType",
    cg.name AS "companyGroupName",
    cg."ownerId"
   FROM (((("userToCompany" uc
     JOIN company c ON ((c.id = uc."companyId")))
     LEFT JOIN employee e ON (((e.id = uc."userId") AND (e."companyId" = uc."companyId"))))
     LEFT JOIN "employeeType" et ON ((et.id = e."employeeTypeId")))
     LEFT JOIN "companyGroup" cg ON ((cg.id = c."companyGroupId")));


create or replace view "public"."consumables" as  WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."deletedAt",
            i."deletedBy",
            i."sourcingType",
            i."attributeSetId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM (item i
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          WHERE ((i.type = 'Consumable'::"itemType") AND (NOT (EXISTS ( SELECT 1
                   FROM "itemVariant" iv
                  WHERE (iv."variantItemId" = i.id)))))
          ORDER BY i."readableId", i."companyId",
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i."readableId",
            i."companyId",
            json_agg(json_build_object('id', i.id, 'revision', i.revision, 'methodType', i."defaultMethodType", 'type', i.type) ORDER BY
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END, i."createdAt") AS revisions
           FROM item i
          WHERE ((i.type = 'Consumable'::"itemType") AND (NOT (EXISTS ( SELECT 1
                   FROM "itemVariant" iv
                  WHERE (iv."variantItemId" = i.id)))))
          GROUP BY i."readableId", i."companyId"
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN ((li."thumbnailPath" IS NULL) AND (li."modelThumbnailPath" IS NOT NULL)) THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelUploadId",
    li."modelPath",
    li."modelName",
    li."modelSize",
    li."attributeSetId",
    ( SELECT COALESCE(json_agg(attr_row.obj ORDER BY attr_row."sortOrder"), '[]'::json) AS "coalesce"
           FROM ( SELECT COALESCE(isa."sortOrder", 100) AS "sortOrder",
                    json_build_object('attributeId', ia.id, 'code', ia.code, 'name', ia.name, 'values', COALESCE(( SELECT json_agg(json_build_object('id', iav.id, 'code', iav.code, 'name', COALESCE(iav.name, iav.code)) ORDER BY iav."sortOrder", iav.code) AS json_agg
                           FROM ("itemAttributeSelection" ias
                             JOIN "itemAttributeValue" iav ON ((iav.id = ias."attributeValueId")))
                          WHERE ((ias."itemId" = li.id) AND (ias."companyId" = li."companyId") AND (ias."attributeId" = ia.id))), '[]'::json)) AS obj
                   FROM ("itemAttribute" ia
                     LEFT JOIN "itemAttributeSetAttribute" isa ON (((isa."attributeId" = ia.id) AND (isa."attributeSetId" = li."attributeSetId"))))
                  WHERE (EXISTS ( SELECT 1
                           FROM "itemAttributeSelection" ias
                          WHERE ((ias."itemId" = li.id) AND (ias."companyId" = li."companyId") AND (ias."attributeId" = ia.id))))) attr_row) AS attributes,
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    ir.revisions,
    c."customFields",
    c.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'item'::text) AND (eim."entityId" = li.id))) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM (((((consumable c
     JOIN latest_items li ON (((li."readableId" = c.id) AND (li."companyId" = c."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = c.id) AND (ir."companyId" = li."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = li.id) AND (ps."companyId" = li."companyId"))))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = li."unitOfMeasureCode") AND (uom."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)));


create or replace view "public"."contractors" as  SELECT p.id AS "supplierContactId",
    p.active,
    p."hoursPerWeek",
    p."companyId",
    p."customFields",
    s.id AS "supplierId",
    s.name AS "supplierName",
    c."fullName",
    c."firstName",
    c."lastName",
    c.email,
    array_agg(pa."abilityId") AS "abilityIds"
   FROM ((((contractor p
     JOIN "supplierContact" sc ON ((sc.id = p.id)))
     JOIN supplier s ON ((s.id = sc."supplierId")))
     JOIN contact c ON ((c.id = sc."contactId")))
     LEFT JOIN "contractorAbility" pa ON ((pa."contractorId" = p.id)))
  WHERE (p.active = true)
  GROUP BY p.id, p.active, p."hoursPerWeek", p."customFields", p."companyId", s.id, c.id, s.name, c."firstName", c."lastName", c.email;


create or replace view "public"."customFieldTables" as  SELECT cft."table",
    cft.module,
    cft.name,
    c.id AS "companyId",
    COALESCE(cf.fields, '[]'::json) AS fields
   FROM (("customFieldTable" cft
     CROSS JOIN company c)
     LEFT JOIN ( SELECT cf_1."table",
            cf_1."companyId",
            COALESCE(json_agg(json_build_object('id', cf_1.id, 'name', cf_1.name, 'sortOrder', cf_1."sortOrder", 'dataTypeId', cf_1."dataTypeId", 'listOptions', cf_1."listOptions", 'active', cf_1.active, 'tags', cf_1.tags, 'required', cf_1.required)), '[]'::json) AS fields
           FROM "customField" cf_1
          GROUP BY cf_1."table", cf_1."companyId") cf ON (((cf."table" = cft."table") AND (cf."companyId" = c.id))));


create or replace view "public"."customers" as  SELECT c.id,
    c."readableId",
    c.name,
    c."customerTypeId",
    c."customerStatusId",
    ctx."taxId",
    c."accountManagerId",
    c.logo,
    c.assignee,
    c."taxPercent",
    c.tags,
    c.website,
    c."companyId",
    c."createdAt",
    c."createdBy",
    c."updatedAt",
    c."updatedBy",
    c."customFields",
    c."currencyCode",
    c."salesContactId",
    c."defaultCc",
    ctx."vatNumber",
    ctx.eori,
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'customer'::text) AND (eim."entityId" = c.id))) AS "externalId",
    ct.name AS type,
    cs.name AS status,
    so.count AS "orderCount",
    pc."workPhone" AS phone,
    pc.fax
   FROM (((((customer c
     LEFT JOIN "customerTax" ctx ON ((ctx."customerId" = c.id)))
     LEFT JOIN "customerType" ct ON ((ct.id = c."customerTypeId")))
     LEFT JOIN "customerStatus" cs ON ((cs.id = c."customerStatusId")))
     LEFT JOIN ( SELECT "salesOrder"."customerId",
            count(*) AS count
           FROM "salesOrder"
          GROUP BY "salesOrder"."customerId") so ON ((so."customerId" = c.id)))
     LEFT JOIN ( SELECT DISTINCT ON (cc."customerId") cc."customerId",
            co."workPhone",
            co.fax
           FROM ("customerContact" cc
             JOIN contact co ON ((co.id = cc."contactId")))
          ORDER BY cc."customerId") pc ON ((pc."customerId" = c.id)));


create or replace view "public"."employeeSalaryRecords" as  SELECT r.id,
    r."employeeId",
    r."companyId",
    r.year,
    r.month,
    r."totalEarned",
    r."totalPaid",
    r.status,
    r.notes,
    r."createdAt",
    r."createdBy",
    r."updatedAt",
    r."updatedBy",
    u."firstName",
    u."lastName",
    u."fullName" AS "employeeName",
    u."avatarUrl",
    (r."totalEarned" - r."totalPaid") AS "amountOwed",
    d.id AS "departmentId",
    d.name AS "departmentName",
    COALESCE(p."pendingCount", 0) AS "pendingCount",
    COALESCE(p."pendingAmount", (0)::numeric) AS "pendingAmount"
   FROM (((("employeeSalaryRecord" r
     JOIN "user" u ON ((u.id = r."employeeId")))
     LEFT JOIN "employeeJob" ej ON (((ej.id = r."employeeId") AND (ej."companyId" = r."companyId"))))
     LEFT JOIN department d ON ((d.id = ej."departmentId")))
     LEFT JOIN LATERAL ( SELECT (count(*))::integer AS "pendingCount",
            COALESCE(sum((pq.quantity * jo."insideUnitCost")), (0)::numeric) AS "pendingAmount"
           FROM ("productionQuantity" pq
             JOIN "jobOperation" jo ON ((jo.id = pq."jobOperationId")))
          WHERE ((pq."employeeId" = r."employeeId") AND (pq."companyId" = r."companyId") AND (pq.type = 'Production'::"productionQuantityType") AND (pq."paymentYear" IS NULL) AND (pq."invalidatedAt" IS NULL))) p ON (true));


create or replace view "public"."employeeSummary" as  SELECT u.id,
    u."fullName" AS name,
    u."avatarUrl",
    e."companyId",
    ej.title,
    ej."startDate",
    d.name AS "departmentName",
    l.name AS "locationName",
    m."fullName" AS "managerName"
   FROM (((((employee e
     JOIN "user" u ON ((u.id = e.id)))
     LEFT JOIN "employeeJob" ej ON (((e.id = ej.id) AND (e."companyId" = ej."companyId"))))
     LEFT JOIN location l ON ((l.id = ej."locationId")))
     LEFT JOIN "user" m ON ((m.id = ej."managerId")))
     LEFT JOIN department d ON ((d.id = ej."departmentId")));


create or replace view "public"."employees" as  SELECT u.id,
    u.email,
    u.phone,
    u."firstName",
    u."lastName",
    u."fullName" AS name,
    u."avatarUrl",
    u.number,
    e."employeeTypeId",
    e."companyId",
    e.active,
    ej."locationId",
    l.name AS "locationName",
        CASE
            WHEN (e.active = true) THEN 'Active'::text
            WHEN (EXISTS ( SELECT 1
               FROM invite i
              WHERE ((((i.email IS NOT NULL) AND (i.email = u.email)) OR ((i.phone IS NOT NULL) AND (i.phone = u.phone))) AND (i."companyId" = e."companyId") AND (i."acceptedAt" IS NULL) AND (i."revokedAt" IS NULL)))) THEN 'Invited'::text
            ELSE 'Inactive'::text
        END AS status
   FROM ((("user" u
     JOIN employee e ON ((e.id = u.id)))
     LEFT JOIN "employeeJob" ej ON (((e.id = ej.id) AND (e."companyId" = ej."companyId"))))
     LEFT JOIN location l ON ((l.id = ej."locationId")))
  WHERE (u.active = true);


create or replace view "public"."gauges" as  SELECT id,
    "gaugeId",
    "supplierId",
    "modelNumber",
    "serialNumber",
    description,
    "dateAcquired",
    "gaugeTypeId",
    "gaugeCalibrationStatus",
    "gaugeStatus",
    "gaugeRole",
    "calibrationIntervalInMonths",
    "lastCalibrationDate",
    "nextCalibrationDate",
    "locationId",
    "storageUnitId",
    "companyId",
    "customFields",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "lastCalibrationStatus",
    "deletedAt",
    "deletedBy",
        CASE
            WHEN ("gaugeStatus" = 'Inactive'::"gaugeStatus") THEN 'Out-of-Calibration'::"gaugeCalibrationStatus"
            WHEN (("nextCalibrationDate" IS NOT NULL) AND ("nextCalibrationDate" < CURRENT_DATE)) THEN 'Out-of-Calibration'::"gaugeCalibrationStatus"
            ELSE "gaugeCalibrationStatus"
        END AS "gaugeCalibrationStatusWithDueDate"
   FROM gauge g
  WHERE ("deletedAt" IS NULL);


CREATE OR REPLACE FUNCTION public.get_job_method(jid text)
 RETURNS TABLE("jobId" text, "methodMaterialId" text, "jobMakeMethodId" text, "jobMaterialMakeMethodId" text, "itemId" text, "itemReadableId" text, description text, "itemType" text, quantity numeric, "unitCost" numeric, "methodType" "methodType", "parentMaterialId" text, "order" double precision, "isRoot" boolean, kit boolean, revision text, version numeric, "storageUnitId" text)
 LANGUAGE sql
 STABLE
AS $function$
WITH RECURSIVE material AS (
    SELECT
        "jobId",
        "id",
        "id" AS "jobMakeMethodId",
        'Make to Order'::"methodType" AS "methodType",
        "id" AS "jobMaterialMakeMethodId",
        "itemId",
        'Part' AS "itemType",
        1::NUMERIC AS "quantity",
        0::NUMERIC AS "unitCost",
        "parentMaterialId",
        CAST(1 AS DOUBLE PRECISION) AS "order",
        TRUE AS "isRoot",
        FALSE AS "kit",
        "version",
        NULL::TEXT AS "storageUnitId"
    FROM
        "jobMakeMethod"
    WHERE
        "jobId" = jid
        AND "parentMaterialId" IS NULL
    UNION
    SELECT
        child."jobId",
        child."id",
        child."jobMakeMethodId",
        child."methodType",
        child."jobMaterialMakeMethodId",
        child."itemId",
        child."itemType",
        child."quantity",
        child."unitCost",
        parent."id" AS "parentMaterialId",
        child."order",
        FALSE AS "isRoot",
        child."kit",
        child."version",
        child."storageUnitId"
    FROM
        "jobMaterialWithMakeMethodId" child
        INNER JOIN material parent ON parent."jobMaterialMakeMethodId" = child."jobMakeMethodId"
    WHERE parent."methodType" = 'Make to Order'
)
SELECT
  material."jobId",
  material.id as "methodMaterialId",
  material."jobMakeMethodId",
  material."jobMaterialMakeMethodId",
  material."itemId",
  item."readableIdWithRevision" AS "itemReadableId",
  item."name" AS "description",
  material."itemType",
  material."quantity",
  material."unitCost",
  material."methodType",
  material."parentMaterialId",
  material."order",
  material."isRoot",
  material."kit",
  item."revision",
  material."version",
  material."storageUnitId"
FROM material
LEFT JOIN item ON material."itemId" = item.id
WHERE material."jobId" = jid
ORDER BY "order"
$function$
;

CREATE OR REPLACE FUNCTION public.get_job_methods_by_method_id(mid text)
 RETURNS TABLE("jobId" text, "methodMaterialId" text, "jobMakeMethodId" text, "jobMaterialMakeMethodId" text, "itemId" text, "itemReadableId" text, description text, "unitOfMeasureCode" text, "itemType" text, quantity numeric, "unitCost" numeric, "methodType" "methodType", "parentMaterialId" text, "order" double precision, kit boolean, "isRoot" boolean, "storageUnitId" text)
 LANGUAGE sql
 STABLE
AS $function$
WITH RECURSIVE material AS (
    SELECT
        "jobId",
        "id",
        "id" AS "jobMakeMethodId",
        'Make to Order'::"methodType" AS "methodType",
        "id" AS "jobMaterialMakeMethodId",
        "itemId",
        'Part' AS "itemType",
        1::NUMERIC AS "quantity",
        0::NUMERIC AS "unitCost",
        "parentMaterialId",
        CAST(1 AS DOUBLE PRECISION) AS "order",
        FALSE AS "kit",
        TRUE AS "isRoot",
        NULL::TEXT AS "storageUnitId"
    FROM
        "jobMakeMethod"
    WHERE
        "id" = mid
    UNION
    SELECT
        child."jobId",
        child."id",
        child."jobMakeMethodId",
        child."methodType",
        child."jobMaterialMakeMethodId",
        child."itemId",
        child."itemType",
        child."quantity",
        child."unitCost",
        parent."id" AS "parentMaterialId",
        child."order",
        child."kit",
        FALSE AS "isRoot",
        child."storageUnitId"
    FROM
        "jobMaterialWithMakeMethodId" child
        INNER JOIN material parent ON parent."jobMaterialMakeMethodId" = child."jobMakeMethodId"
    WHERE parent."methodType" = 'Make to Order'
)
SELECT
  material."jobId",
  material.id as "methodMaterialId",
  material."jobMakeMethodId",
  material."jobMaterialMakeMethodId",
  material."itemId",
  item."readableId" AS "itemReadableId",
  item."name" AS "description",
  item."unitOfMeasureCode",
  material."itemType",
  material."quantity",
  material."unitCost",
  material."methodType",
  material."parentMaterialId",
  material."order",
  material."kit",
  material."isRoot",
  material."storageUnitId"
FROM material
LEFT JOIN item ON material."itemId" = item.id
ORDER BY "order"
$function$
;

CREATE OR REPLACE FUNCTION public.get_quote_methods(qid text)
 RETURNS TABLE("quoteId" text, "quoteLineId" text, "methodMaterialId" text, "quoteMakeMethodId" text, "quoteMaterialMakeMethodId" text, "itemId" text, "itemReadableId" text, description text, "itemType" text, quantity numeric, "unitCost" numeric, "methodType" "methodType", "parentMaterialId" text, "order" double precision, "isRoot" boolean, kit boolean, revision text, "externalId" jsonb, version numeric, "storageUnitId" text)
 LANGUAGE sql
 STABLE
AS $function$
WITH RECURSIVE material AS (
    SELECT
        "quoteId",
        "quoteLineId",
        "id",
        "id" AS "quoteMakeMethodId",
        'Make to Order'::"methodType" AS "methodType",
        "id" AS "quoteMaterialMakeMethodId",
        "itemId",
        'Part' AS "itemType",
        1::NUMERIC AS "quantity",
        0::NUMERIC AS "unitCost",
        "parentMaterialId",
        CAST(1 AS DOUBLE PRECISION) AS "order",
        TRUE AS "isRoot",
        FALSE AS "kit",
        "version",
        NULL::TEXT AS "storageUnitId"
    FROM
        "quoteMakeMethod"
    WHERE
        "quoteId" = qid
        AND "parentMaterialId" IS NULL
    UNION
    SELECT
        child."quoteId",
        child."quoteLineId",
        child."id",
        child."quoteMakeMethodId",
        child."methodType",
        child."quoteMaterialMakeMethodId",
        child."itemId",
        child."itemType",
        child."quantity",
        child."unitCost",
        parent."id" AS "parentMaterialId",
        child."order",
        FALSE AS "isRoot",
        child."kit",
        child."version",
        child."storageUnitId"
    FROM
        "quoteMaterialWithMakeMethodId" child
        INNER JOIN material parent ON parent."quoteMaterialMakeMethodId" = child."quoteMakeMethodId"
)
SELECT
  material."quoteId",
  material."quoteLineId",
  material.id as "methodMaterialId",
  material."quoteMakeMethodId",
  material."quoteMaterialMakeMethodId",
  material."itemId",
  item."readableIdWithRevision" AS "itemReadableId",
  item."name" AS "description",
  material."itemType",
  material."quantity",
  material."unitCost",
  material."methodType",
  material."parentMaterialId",
  material."order",
  material."isRoot",
  material."kit",
  item."revision",
  (
    SELECT COALESCE(
      jsonb_object_agg(
        eim."integration",
        CASE
          WHEN eim."metadata" IS NOT NULL THEN eim."metadata"
          ELSE to_jsonb(eim."externalId")
        END
      ) FILTER (WHERE eim."externalId" IS NOT NULL),
      '{}'::jsonb
    )
    FROM "externalIntegrationMapping" eim
    WHERE eim."entityType" = 'item' AND eim."entityId" = item.id
  ) AS "externalId",
  material."version",
  material."storageUnitId"
FROM material
LEFT JOIN item ON material."itemId" = item.id
WHERE material."quoteId" = qid
ORDER BY "order"
$function$
;

CREATE OR REPLACE FUNCTION public.get_quote_methods_by_method_id(mid text)
 RETURNS TABLE("quoteId" text, "quoteLineId" text, "methodMaterialId" text, "quoteMakeMethodId" text, "quoteMaterialMakeMethodId" text, "itemId" text, "itemReadableId" text, description text, "unitOfMeasureCode" text, "itemType" text, "itemTrackingType" text, quantity numeric, "unitCost" numeric, "methodType" "methodType", "parentMaterialId" text, "order" double precision, "isRoot" boolean, kit boolean, revision text, "externalId" jsonb, version numeric, "storageUnitId" text)
 LANGUAGE sql
 STABLE
AS $function$
WITH RECURSIVE material AS (
    SELECT
        "quoteId",
        "quoteLineId",
        "id",
        "id" AS "quoteMakeMethodId",
        'Make to Order'::"methodType" AS "methodType",
        "id" AS "quoteMaterialMakeMethodId",
        "version",
        "itemId",
        'Part' AS "itemType",
        1::NUMERIC AS "quantity",
        0::NUMERIC AS "unitCost",
        "parentMaterialId",
        CAST(1 AS DOUBLE PRECISION) AS "order",
        TRUE AS "isRoot",
        FALSE AS "kit",
        NULL::TEXT AS "storageUnitId"
    FROM
        "quoteMakeMethod"
    WHERE
        "id" = mid
    UNION
    SELECT
        child."quoteId",
        child."quoteLineId",
        child."id",
        child."quoteMakeMethodId",
        child."methodType",
        child."quoteMaterialMakeMethodId",
        child."version",
        child."itemId",
        child."itemType",
        child."quantity",
        child."unitCost",
        parent."id" AS "parentMaterialId",
        child."order",
        FALSE AS "isRoot",
        child."kit",
        child."storageUnitId"
    FROM
        "quoteMaterialWithMakeMethodId" child
        INNER JOIN material parent ON parent."quoteMaterialMakeMethodId" = child."quoteMakeMethodId"
    WHERE parent."methodType" = 'Make to Order'
)
SELECT
  material."quoteId",
  material."quoteLineId",
  material.id as "methodMaterialId",
  material."quoteMakeMethodId",
  material."quoteMaterialMakeMethodId",
  material."itemId",
  item."readableIdWithRevision" AS "itemReadableId",
  item."name" AS "description",
  item."unitOfMeasureCode",
  material."itemType",
  item."itemTrackingType",
  material."quantity",
  material."unitCost",
  material."methodType",
  material."parentMaterialId",
  material."order",
  material."isRoot",
  material."kit",
  item."revision",
  (
    SELECT COALESCE(
      jsonb_object_agg(
        eim."integration",
        CASE
          WHEN eim."metadata" IS NOT NULL THEN eim."metadata"
          ELSE to_jsonb(eim."externalId")
        END
      ) FILTER (WHERE eim."externalId" IS NOT NULL),
      '{}'::jsonb
    )
    FROM "externalIntegrationMapping" eim
    WHERE eim."entityType" = 'item' AND eim."entityId" = item.id
  ) AS "externalId",
  material."version",
  material."storageUnitId"
FROM material
LEFT JOIN item ON material."itemId" = item.id
ORDER BY "order"
$function$
;

create or replace view "public"."inspectionDocuments" as  SELECT d.id,
    d."companyId",
    d."partId",
    d."drawingNumber",
    d.version,
    d."storagePath",
    d."fileName",
    d."pageCount",
    d."defaultPageWidth",
    d."defaultPageHeight",
    d."uploadedBy",
    d."createdBy",
    d."createdAt",
    d."updatedBy",
    d."updatedAt",
    i."readableIdWithRevision" AS "partReadableId"
   FROM ("inspectionDocument" d
     LEFT JOIN item i ON ((i.id = d."partId")));


create or replace view "public"."integrations" as  SELECT i.id,
    i.jsonschema,
    c.id AS "companyId",
    COALESCE(ci.metadata, '{}'::json) AS metadata,
    COALESCE(ci.active, false) AS active
   FROM ((integration i
     CROSS JOIN company c)
     LEFT JOIN ( SELECT "companyIntegration".id,
            "companyIntegration".metadata,
            "companyIntegration"."companyId",
            "companyIntegration".active,
            "companyIntegration"."updatedAt",
            "companyIntegration"."updatedBy"
           FROM "companyIntegration") ci ON (((i.id = ci.id) AND (c.id = ci."companyId"))));


create or replace view "public"."jobMaterialWithMakeMethodId" as  SELECT jm.id,
    jm."jobId",
    jm."itemId",
    jm."itemType",
    jm."methodType",
    jm."order",
    jm.description,
    jm.quantity,
    jm."scrapQuantity",
    jm."unitOfMeasureCode",
    jm."unitCost",
    jm."companyId",
    jm."createdAt",
    jm."createdBy",
    jm."updatedAt",
    jm."updatedBy",
    jm."customFields",
    jm."jobMakeMethodId",
    jm."jobOperationId",
    jm."estimatedQuantity",
    jm."defaultStorageUnit",
    jm."storageUnitId",
    jm."quantityIssued",
    jm."quantityToIssue",
    jm."requiresSerialTracking",
    jm."requiresBatchTracking",
    jm.kit,
    jm."itemScrapPercentage",
    jm."deletedAt",
    jm."deletedBy",
    s.name AS "storageUnitName",
    jmm.id AS "jobMaterialMakeMethodId",
    jmm.version,
    i."readableIdWithRevision" AS "itemReadableId",
    i."readableId" AS "itemReadableIdWithoutRevision",
    i."deletedAt" AS "itemDeletedAt"
   FROM ((("jobMaterial" jm
     LEFT JOIN "jobMakeMethod" jmm ON ((jmm."parentMaterialId" = jm.id)))
     LEFT JOIN "storageUnit" s ON ((s.id = jm."storageUnitId")))
     LEFT JOIN item i ON ((i.id = jm."itemId")));


create or replace view "public"."jobOperationsWithDependencies" as  SELECT id,
    "jobId",
    "jobMakeMethodId",
    "order",
    "processId",
    "workCenterId",
    description,
    "setupTime",
    "setupUnit",
    "laborTime",
    "laborUnit",
    "machineTime",
    "machineUnit",
    "operationOrder",
    "laborRate",
    "overheadRate",
    "machineRate",
    "operationType",
    "operationMinimumCost",
    "operationLeadTime",
    "operationUnitCost",
    "operationSupplierProcessId",
    "workInstruction",
    "companyId",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "customFields",
    "operationQuantity",
    "quantityComplete",
    "quantityScrapped",
    "quantityReworked",
    status,
    priority,
    assignee,
    tags,
    "procedureId",
    "startDate",
    "dueDate",
    "hasConflict",
    "conflictReason",
    "targetQuantity",
    "insideUnitCost",
    "deletedAt",
    "deletedBy",
    "manuallyScheduled",
    "reworkId",
    COALESCE(( SELECT array_agg(jod."dependsOnId") AS array_agg
           FROM "jobOperationDependency" jod
          WHERE (jod."operationId" = jo.id)), '{}'::text[]) AS dependencies
   FROM "jobOperation" jo;


create or replace view "public"."jobOperationsWithMakeMethods" as  SELECT mm.id AS "makeMethodId",
    jo.id,
    jo."jobId",
    jo."jobMakeMethodId",
    jo."order",
    jo."processId",
    jo."workCenterId",
    jo.description,
    jo."setupTime",
    jo."setupUnit",
    jo."laborTime",
    jo."laborUnit",
    jo."machineTime",
    jo."machineUnit",
    jo."operationOrder",
    jo."laborRate",
    jo."overheadRate",
    jo."machineRate",
    jo."operationType",
    jo."operationMinimumCost",
    jo."operationLeadTime",
    jo."operationUnitCost",
    jo."operationSupplierProcessId",
    jo."workInstruction",
    jo."companyId",
    jo."createdAt",
    jo."createdBy",
    jo."updatedAt",
    jo."updatedBy",
    jo."customFields",
    jo."operationQuantity",
    jo."quantityComplete",
    jo."quantityScrapped",
    jo."quantityReworked",
    jo.status,
    jo.priority,
    jo.assignee,
    jo.tags,
    jo."procedureId",
    jo."startDate",
    jo."dueDate",
    jo."hasConflict",
    jo."conflictReason",
    jo."targetQuantity",
    jo."insideUnitCost",
    jo."deletedAt",
    jo."deletedBy",
    jo."manuallyScheduled",
    jo."reworkId"
   FROM (("jobOperation" jo
     JOIN "jobMakeMethod" jmm ON ((jo."jobMakeMethodId" = jmm.id)))
     LEFT JOIN "makeMethod" mm ON (((jmm."itemId" = mm."itemId") AND (jmm.version = mm.version))));


create or replace view "public"."jobs" as  WITH job_model AS (
         SELECT j_1.id AS job_id,
            j_1."companyId",
            COALESCE(j_1."modelUploadId", i_1."modelUploadId") AS model_upload_id
           FROM (job j_1
             LEFT JOIN item i_1 ON (((j_1."itemId" = i_1.id) AND (j_1."companyId" = i_1."companyId"))))
        ), root_operation_stats AS (
         SELECT jo."jobId",
            (count(*))::integer AS "operationCount",
            (count(*) FILTER (WHERE (jo.status = 'Done'::"jobOperationStatus")))::integer AS "completedOperationCount"
           FROM ("jobOperation" jo
             JOIN "jobMakeMethod" jmm_1 ON ((jo."jobMakeMethodId" = jmm_1.id)))
          WHERE (jmm_1."parentMaterialId" IS NULL)
          GROUP BY jo."jobId"
        ), root_routing_min_complete AS (
         SELECT jo."jobId",
            min(jo."quantityComplete") AS "quantityFullyComplete"
           FROM ("jobOperation" jo
             JOIN "jobMakeMethod" jmm_1 ON ((jo."jobMakeMethodId" = jmm_1.id)))
          WHERE (jmm_1."parentMaterialId" IS NULL)
          GROUP BY jo."jobId"
        )
 SELECT j.id,
    j."jobId",
    j."itemId",
    j."unitOfMeasureCode",
    j."customerId",
    j."locationId",
    j.status,
    j."dueDate",
    j."deadlineType",
    j.quantity,
    j."scrapQuantity",
    j."productionQuantity",
    j."quantityComplete",
    j."quantityShipped",
    j."quantityReceivedToInventory",
    j."salesOrderId",
    j."salesOrderLineId",
    j."quoteId",
    j."quoteLineId",
    j."modelUploadId",
    j.notes,
    j.assignee,
    j."customFields",
    j."companyId",
    j."createdAt",
    j."createdBy",
    j."updatedAt",
    j."updatedBy",
    j.tags,
    j.configuration,
    j."releasedDate",
    j."completedDate",
    j."estimatedTime",
    j."actualTime",
    j."secondsToComplete",
    j."startDate",
    j."storageUnitId",
    j.priority,
    j."deletedAt",
    j."deletedBy",
    jmm.id AS "jobMakeMethodId",
    i.name,
    i."readableIdWithRevision" AS "itemReadableIdWithRevision",
    i.type AS "itemType",
    i.name AS description,
    i."itemTrackingType",
    i.active,
    i."deletedAt" AS "itemDeletedAt",
    i."replenishmentSystem",
    mu.id AS "modelId",
    mu."autodeskUrn",
    mu."modelPath",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    mu.name AS "modelName",
    mu.size AS "modelSize",
    so."salesOrderId" AS "salesOrderReadableId",
    qo."quoteId" AS "quoteReadableId",
    COALESCE(os."operationCount", 0) AS "operationCount",
    COALESCE(os."completedOperationCount", 0) AS "completedOperationCount",
    COALESCE(rrc."quantityFullyComplete", (0)::numeric) AS "quantityFullyComplete",
    loc.name AS "locationName"
   FROM (((((((((job j
     LEFT JOIN "jobMakeMethod" jmm ON (((jmm."jobId" = j.id) AND (jmm."parentMaterialId" IS NULL))))
     LEFT JOIN item i ON (((j."itemId" = i.id) AND (j."companyId" = i."companyId"))))
     LEFT JOIN job_model jm ON (((j.id = jm.job_id) AND (j."companyId" = jm."companyId"))))
     LEFT JOIN "modelUpload" mu ON ((mu.id = jm.model_upload_id)))
     LEFT JOIN "salesOrder" so ON (((j."salesOrderId" = so.id) AND (j."companyId" = so."companyId"))))
     LEFT JOIN quote qo ON (((j."quoteId" = qo.id) AND (j."companyId" = qo."companyId"))))
     LEFT JOIN root_operation_stats os ON ((os."jobId" = j.id)))
     LEFT JOIN root_routing_min_complete rrc ON ((rrc."jobId" = j.id)))
     LEFT JOIN location loc ON ((loc.id = j."locationId")))
  WHERE (j."deletedAt" IS NULL);


create or replace view "public"."kanbans" as  SELECT k.id,
    k."itemId",
    k."replenishmentSystem",
    k.quantity,
    k."locationId",
    k."storageUnitId",
    k."supplierId",
    k."purchaseUnitOfMeasureCode",
    k."conversionFactor",
    k."autoRelease",
    k."companyId",
    k."createdAt",
    k."createdBy",
    k."updatedAt",
    k."updatedBy",
    k."autoStartJob",
    k."completedBarcodeOverride",
    k."jobId",
    i.name,
    i."readableIdWithRevision",
    j."jobId" AS "jobReadableId",
    l.name AS "locationName",
    s.name AS "storageUnitName",
    su.name AS "supplierName",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath"
   FROM ((((((kanban k
     JOIN item i ON ((k."itemId" = i.id)))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
     JOIN location l ON ((k."locationId" = l.id)))
     LEFT JOIN "storageUnit" s ON ((k."storageUnitId" = s.id)))
     LEFT JOIN supplier su ON ((k."supplierId" = su.id)))
     LEFT JOIN job j ON ((k."jobId" = j.id)));


create or replace view "public"."locations" as  SELECT l.id,
    l.name,
    l."companyId",
    COALESCE(l."addressLine1", ca."addressLine1", sa."addressLine1") AS "addressLine1",
    COALESCE(l."addressLine2", ca."addressLine2", sa."addressLine2") AS "addressLine2",
    COALESCE(l.city, ca.city, sa.city) AS city,
    COALESCE(l."stateProvince", ca."stateProvince", sa."stateProvince") AS "stateProvince",
    COALESCE(l."postalCode", ca."postalCode", sa."postalCode") AS "postalCode",
    COALESCE(l."countryCode", ca."countryCode", sa."countryCode") AS "countryCode",
    l.timezone,
    l.latitude,
    l.longitude,
    l."customerId",
    l."supplierId",
    l."customerLocationId",
    l."supplierLocationId",
    cust.name AS "customerName",
    supp.name AS "supplierName",
    COALESCE(cl.name, sl.name) AS "partnerLocationName",
    ((l."addressLine1" IS NULL) AND ((ca.id IS NOT NULL) OR (sa.id IS NOT NULL))) AS "isAddressInherited",
    l."customFields",
    l.tags,
    l."createdBy",
    l."createdAt",
    l."updatedBy",
    l."updatedAt"
   FROM ((((((location l
     LEFT JOIN "customerLocation" cl ON ((cl.id = l."customerLocationId")))
     LEFT JOIN address ca ON ((ca.id = cl."addressId")))
     LEFT JOIN "supplierLocation" sl ON ((sl.id = l."supplierLocationId")))
     LEFT JOIN address sa ON ((sa.id = sl."addressId")))
     LEFT JOIN customer cust ON ((cust.id = l."customerId")))
     LEFT JOIN supplier supp ON ((supp.id = l."supplierId")));


create or replace view "public"."maintenanceSchedules" as  SELECT ms.id,
    ms.name,
    ms.description,
    ms."workCenterId",
    ms.frequency,
    ms.priority,
    ms."estimatedDuration",
    ms.active,
    ms."lastGeneratedAt",
    ms."nextDueAt",
    ms."companyId",
    ms."createdBy",
    ms."createdAt",
    ms."updatedBy",
    ms."updatedAt",
    ms.monday,
    ms.tuesday,
    ms.wednesday,
    ms.thursday,
    ms.friday,
    ms.saturday,
    ms.sunday,
    ms."skipHolidays",
    wc."locationId",
    wc.name AS "workCenterName",
    l.name AS "locationName"
   FROM (("maintenanceSchedule" ms
     LEFT JOIN "workCenter" wc ON ((ms."workCenterId" = wc.id)))
     LEFT JOIN location l ON ((wc."locationId" = l.id)));


create or replace view "public"."masterWorkOrders" as  SELECT mwo.id,
    mwo."jobId",
    mwo."companyId",
    mwo.tags,
    mwo."createdAt",
    mwo."createdBy",
    mwo."updatedAt",
    mwo."updatedBy",
    j."jobId" AS "jobReadableId",
    j.status,
    j.quantity,
    j."dueDate",
    j."locationId",
    j."itemId",
    i."readableIdWithRevision",
    i.name AS "itemName",
    i.type AS "itemType",
    i."thumbnailPath",
    j."customerId",
    j."startDate",
    j."deadlineType",
    j."salesOrderId",
    j."salesOrderLineId",
    so."salesOrderId" AS "salesOrderReadableId",
    loc.name AS "locationName",
    j.assignee,
    j."scrapQuantity",
    j."storageUnitId"
   FROM (((("masterWorkOrder" mwo
     JOIN job j ON ((j.id = mwo."jobId")))
     LEFT JOIN item i ON (((i.id = j."itemId") AND (i."companyId" = j."companyId"))))
     LEFT JOIN "salesOrder" so ON (((j."salesOrderId" = so.id) AND (j."companyId" = so."companyId"))))
     LEFT JOIN location loc ON ((loc.id = j."locationId")));


create or replace view "public"."materials" as  WITH latest_items AS (
         SELECT DISTINCT ON (i_1."readableId", i_1."companyId") i_1.id,
            i_1."readableId",
            i_1.name,
            i_1.description,
            i_1.type,
            i_1."replenishmentSystem",
            i_1."defaultMethodType",
            i_1."itemTrackingType",
            i_1."unitOfMeasureCode",
            i_1.active,
            i_1."companyId",
            i_1."createdBy",
            i_1."createdAt",
            i_1."updatedBy",
            i_1."updatedAt",
            i_1.assignee,
            i_1."modelUploadId",
            i_1."thumbnailPath",
            i_1.notes,
            i_1."trackingMethod",
            i_1.embedding,
            i_1.revision,
            i_1."readableIdWithRevision",
            i_1."requiresInspection",
            i_1."deletedAt",
            i_1."deletedBy",
            i_1."sourcingType",
            mu_1."modelPath",
            mu_1."thumbnailPath" AS "modelThumbnailPath",
            mu_1.name AS "modelName",
            mu_1.size AS "modelSize"
           FROM (item i_1
             LEFT JOIN "modelUpload" mu_1 ON ((mu_1.id = i_1."modelUploadId")))
          WHERE (i_1.type = 'Material'::"itemType")
          ORDER BY i_1."readableId", i_1."companyId",
                CASE
                    WHEN ((i_1.revision = '0'::text) OR (i_1.revision = ''::text) OR (i_1.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i_1."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i_1."readableId",
            i_1."companyId",
            json_agg(json_build_object('id', i_1.id, 'revision', i_1.revision, 'methodType', i_1."defaultMethodType", 'type', i_1.type) ORDER BY
                CASE
                    WHEN ((i_1.revision = '0'::text) OR (i_1.revision = ''::text) OR (i_1.revision IS NULL)) THEN 0
                    ELSE 1
                END, i_1."createdAt") AS revisions
           FROM item i_1
          WHERE (i_1.type = 'Material'::"itemType")
          GROUP BY i_1."readableId", i_1."companyId"
        )
 SELECT i.active,
    i.assignee,
    i."defaultMethodType",
    i.description,
    i."itemTrackingType",
    i.name,
    i."replenishmentSystem",
    i."unitOfMeasureCode",
    i.notes,
    i.revision,
    i."readableId",
    i."readableIdWithRevision",
    i.id,
    i."companyId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (i."modelThumbnailPath" IS NOT NULL)) THEN i."modelThumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i."modelUploadId",
    i."modelPath",
    i."modelName",
    i."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    ir.revisions,
    mf.name AS "materialForm",
    ms.name AS "materialSubstance",
    md.name AS dimensions,
    mfin.name AS finish,
    mg.name AS grade,
    mt.name AS "materialType",
    m."materialSubstanceId",
    m."materialFormId",
    m."customFields",
    m.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'item'::text) AND (eim."entityId" = i.id))) AS "externalId",
    i."createdBy",
    i."createdAt",
    i."updatedBy",
    i."updatedAt",
    m."gradeId",
    m."dimensionId",
    m."finishId",
    m."materialTypeId"
   FROM ((((((((((((material m
     JOIN latest_items i ON (((i."readableId" = m.id) AND (i."companyId" = m."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = m.id) AND (ir."companyId" = i."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = i.id) AND (ps."companyId" = i."companyId"))))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = i."unitOfMeasureCode") AND (uom."companyId" = i."companyId"))))
     LEFT JOIN "materialForm" mf ON ((mf.id = m."materialFormId")))
     LEFT JOIN "materialSubstance" ms ON ((ms.id = m."materialSubstanceId")))
     LEFT JOIN "materialDimension" md ON ((m."dimensionId" = md.id)))
     LEFT JOIN "materialFinish" mfin ON ((m."finishId" = mfin.id)))
     LEFT JOIN "materialGrade" mg ON ((m."gradeId" = mg.id)))
     LEFT JOIN "materialType" mt ON ((m."materialTypeId" = mt.id)))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)));


create or replace view "public"."openJobMaterialLines" as  SELECT jm.id,
    jm."jobId",
    jmm."parentMaterialId",
    jm."jobMakeMethodId",
    j."jobId" AS "jobReadableId",
    jm."itemId",
    jm."quantityToIssue",
    jm."unitOfMeasureCode",
    jm."companyId",
    i1."replenishmentSystem",
    i1."itemTrackingType",
    ir."leadTime",
    j."locationId",
    j."dueDate"
   FROM ((((("jobMaterial" jm
     JOIN job j ON ((jm."jobId" = j.id)))
     JOIN "jobMakeMethod" jmm ON ((jm."jobMakeMethodId" = jmm.id)))
     JOIN item i1 ON ((jm."itemId" = i1.id)))
     JOIN item i2 ON ((j."itemId" = i2.id)))
     JOIN "itemReplenishment" ir ON ((i2.id = ir."itemId")))
  WHERE ((j.status = ANY (ARRAY['Planned'::"jobStatus", 'Ready'::"jobStatus", 'In Progress'::"jobStatus", 'Paused'::"jobStatus"])) AND (jm."methodType" <> 'Make to Order'::"methodType"));


create or replace view "public"."openProductionOrders" as  SELECT j.id,
    j."itemId",
    j."jobId",
    (j."productionQuantity" - j."quantityReceivedToInventory") AS "quantityToReceive",
    j."unitOfMeasureCode",
    j."companyId",
    i."replenishmentSystem",
    i."itemTrackingType",
    ir."leadTime",
    j."locationId",
    j."dueDate",
    j."deadlineType"
   FROM ((job j
     JOIN item i ON ((j."itemId" = i.id)))
     JOIN "itemReplenishment" ir ON ((i.id = ir."itemId")))
  WHERE ((j.status = ANY (ARRAY['Planned'::"jobStatus", 'Ready'::"jobStatus", 'In Progress'::"jobStatus", 'Paused'::"jobStatus"])) AND (j."salesOrderId" IS NULL));


create or replace view "public"."openPurchaseOrderLines" as  SELECT pol.id,
    pol."purchaseOrderId",
    po."purchaseOrderId" AS "purchaseOrderReadableId",
    po."supplierId",
    pol."itemId",
    (pol."quantityToReceive" * pol."conversionFactor") AS "quantityToReceive",
    i."unitOfMeasureCode",
    pol."purchaseOrderLineType",
    pol."requiredDate" AS "dueDate",
    pol."companyId",
    pol."locationId",
    po."orderDate",
    po.status,
    COALESCE(pol."promisedDate", pod."receiptPromisedDate") AS "promisedDate",
    i."replenishmentSystem",
    i."itemTrackingType",
    ir."leadTime"
   FROM (((("purchaseOrderLine" pol
     JOIN "purchaseOrder" po ON ((pol."purchaseOrderId" = po.id)))
     JOIN "purchaseOrderDelivery" pod ON ((pod.id = po.id)))
     JOIN item i ON ((pol."itemId" = i.id)))
     JOIN "itemReplenishment" ir ON ((i.id = ir."itemId")))
  WHERE ((pol."purchaseOrderLineType" <> 'Service'::"purchaseOrderLineType") AND (po.status = ANY (ARRAY['To Receive'::"purchaseOrderStatus", 'To Receive and Invoice'::"purchaseOrderStatus", 'Planned'::"purchaseOrderStatus"])));


create or replace view "public"."openSalesOrderLines" as  SELECT sol.id,
    sol."salesOrderId",
    sol."itemId",
    sol."promisedDate",
    sol."methodType",
    sol."unitOfMeasureCode",
    sol."quantityToSend",
    sol."salesOrderLineType",
    sol."companyId",
    COALESCE(sol."locationId", so."locationId") AS "locationId",
    i."replenishmentSystem",
    i."itemTrackingType",
    ir."leadTime"
   FROM ((("salesOrderLine" sol
     JOIN "salesOrder" so ON ((sol."salesOrderId" = so.id)))
     JOIN item i ON ((sol."itemId" = i.id)))
     JOIN "itemReplenishment" ir ON ((i.id = ir."itemId")))
  WHERE ((sol."salesOrderLineType" <> 'Service'::"salesOrderLineType") AND (sol."methodType" <> 'Make to Order'::"methodType") AND (so.status = ANY (ARRAY['To Ship'::"salesOrderStatus", 'To Ship and Invoice'::"salesOrderStatus"])));


create or replace view "public"."partners" as  SELECT p.id,
    p."hoursPerWeek",
    p."abilityId",
    p.active,
    p."companyId",
    p."createdBy",
    p."createdAt",
    p."updatedBy",
    p."updatedAt",
    p."customFields",
    p.id AS "supplierLocationId",
    a2.name AS "abilityName",
    s.id AS "supplierId",
    s.name AS "supplierName",
    a.city,
    a."stateProvince" AS state
   FROM ((((partner p
     JOIN "supplierLocation" sl ON ((sl.id = p.id)))
     JOIN supplier s ON ((s.id = sl."supplierId")))
     JOIN address a ON ((a.id = sl."addressId")))
     JOIN ability a2 ON ((a2.id = p."abilityId")))
  WHERE (p.active = true);


create or replace view "public"."parts" as  WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."deletedAt",
            i."deletedBy",
            i."sourcingType",
            mu.id AS "modelUploadId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM (item i
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          WHERE (i.type = 'Part'::"itemType")
          ORDER BY i."readableId", i."companyId",
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i."readableId",
            i."companyId",
            json_agg(json_build_object('id', i.id, 'revision', i.revision, 'name', i.name, 'description', i.description, 'active', i.active, 'createdAt', i."createdAt") ORDER BY
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END, i."createdAt") AS revisions
           FROM item i
          WHERE (i.type = 'Part'::"itemType")
          GROUP BY i."readableId", i."companyId"
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li."sourcingType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN ((li."thumbnailPath" IS NULL) AND (li."modelThumbnailPath" IS NOT NULL)) THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelPath",
    li."modelName",
    li."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    ir.revisions,
    p."customFields",
    p.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'item'::text) AND (eim."entityId" = li.id))) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt",
    p."templateId",
    tmpl.name AS "templateName"
   FROM ((((((part p
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "deletedAt", "deletedBy", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON (((li."readableId" = p.id) AND (li."companyId" = p."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = p.id) AND (ir."companyId" = p."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = li.id) AND (ps."companyId" = li."companyId"))))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = li."unitOfMeasureCode") AND (uom."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)))
     LEFT JOIN template tmpl ON ((tmpl.id = p."templateId")));


create or replace view "public"."pickingLists" as  SELECT pl.id,
    pl."pickingListId",
    pl.status,
    pl."locationId",
    pl.assignee,
    pl."dueDate",
    pl.notes,
    pl."companyId",
    pl."createdBy",
    pl."createdAt",
    pl."updatedBy",
    pl."updatedAt",
    pl."customFields",
    l.name AS "locationName",
    u."fullName" AS "assigneeName",
    u."avatarUrl" AS "assigneeAvatarUrl",
    ( SELECT count(*) AS count
           FROM "pickingListLine" pll
          WHERE (pll."pickingListId" = pl.id)) AS "lineCount",
    ( SELECT count(*) AS count
           FROM "pickingListLine" pll
          WHERE ((pll."pickingListId" = pl.id) AND (pll.status = ANY (ARRAY['Picked'::"pickingListLineStatus", 'Short'::"pickingListLineStatus", 'Cancelled'::"pickingListLineStatus"])))) AS "completedLineCount"
   FROM (("pickingList" pl
     JOIN location l ON ((l.id = pl."locationId")))
     LEFT JOIN "user" u ON ((u.id = pl.assignee)));


create or replace view "public"."processes" as  SELECT p.id,
    p.name,
    p."defaultStandardFactor",
    p."companyId",
    p."customFields",
    p."createdBy",
    p."createdAt",
    p."updatedBy",
    p."updatedAt",
    p."processType",
    p.tags,
    p."completeAllOnScan",
    p.active,
    p."deletedAt",
    p."deletedBy",
    wcp."workCenters",
    sp.suppliers,
    ep.employees
   FROM (((process p
     LEFT JOIN ( SELECT wcp_1."processId",
            array_agg(wcp_1."workCenterId") AS "workCenters"
           FROM ("workCenterProcess" wcp_1
             JOIN "workCenter" wc ON ((wcp_1."workCenterId" = wc.id)))
          GROUP BY wcp_1."processId") wcp ON ((p.id = wcp."processId")))
     LEFT JOIN ( SELECT sp_1."processId",
            jsonb_agg(jsonb_build_object('id', sp_1.id, 'name', s.name)) AS suppliers
           FROM ("supplierProcess" sp_1
             JOIN supplier s ON ((sp_1."supplierId" = s.id)))
          GROUP BY sp_1."processId") sp ON ((p.id = sp."processId")))
     LEFT JOIN ( SELECT ep_1."processId",
            array_agg(ep_1."employeeId") AS employees
           FROM ("employeeProcess" ep_1
             JOIN employee e ON (((ep_1."employeeId" = e.id) AND (ep_1."companyId" = e."companyId"))))
          GROUP BY ep_1."processId") ep ON ((p.id = ep."processId")));


create or replace view "public"."purchaseInvoiceLines" as  SELECT pl.id,
    pl."invoiceId",
    pl."invoiceLineType",
    pl."purchaseOrderId",
    pl."purchaseOrderLineId",
    pl."itemId",
    pl."serviceId",
    pl."locationId",
    pl."storageUnitId",
    pl."assetId",
    pl.description,
    pl.quantity,
    pl."supplierUnitPrice",
    pl."exchangeRate",
    pl."inventoryUnitOfMeasureCode",
    pl."purchaseUnitOfMeasureCode",
    pl."companyId",
    pl."createdBy",
    pl."createdAt",
    pl."updatedBy",
    pl."updatedAt",
    pl."customFields",
    pl."conversionFactor",
    pl.tags,
    pl."internalNotes",
    pl."supplierShippingCost",
    pl."modelUploadId",
    pl."supplierTaxAmount",
    pl."supplierExtendedPrice",
    pl."taxPercent",
    pl."jobOperationId",
    pl."unitPrice",
    pl."extendedPrice",
    pl."shippingCost",
    pl."taxAmount",
    pl."totalAmount",
    pl."accountId",
    pl."costCenterId",
    pl."requiredDate",
    pl."ownerId",
    pl."sortOrder",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i."readableIdWithRevision" AS "itemReadableId",
    i.name AS "itemName",
    i.description AS "itemDescription",
    ic."unitCost",
    sp."supplierPartId",
    a.name AS "accountName",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM (((((((("purchaseInvoiceLine" pl
     JOIN "purchaseInvoice" pi ON ((pi.id = pl."invoiceId")))
     LEFT JOIN "modelUpload" mu ON ((pl."modelUploadId" = mu.id)))
     LEFT JOIN item i ON ((i.id = pl."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")))
     LEFT JOIN "supplierPart" sp ON (((sp."supplierId" = pi."supplierId") AND (sp."itemId" = i.id))))
     LEFT JOIN account a ON ((a.id = pl."accountId")))
     LEFT JOIN "fixedAsset" fa ON ((fa.id = pl."assetId")));


create or replace view "public"."purchaseInvoices" as  SELECT pi.id,
    pi."invoiceId",
    pi."supplierId",
    pi."invoiceSupplierId",
    pi."supplierInteractionId",
    pi."supplierReference",
    pi."invoiceSupplierContactId",
    pi."invoiceSupplierLocationId",
    pi."locationId",
    pi."postingDate",
    pi."dateIssued",
    pi."dateDue",
    pi."datePaid",
    pi."paymentTermId",
    pi."currencyCode",
    pi."exchangeRate",
    pi."exchangeRateUpdatedAt",
    (COALESCE(pl.subtotal, (0)::numeric))::numeric(10,2) AS subtotal,
    pi."totalDiscount",
    ((COALESCE(pl."orderTotal", (0)::numeric) + (COALESCE(pid."supplierShippingCost", (0)::numeric) *
        CASE
            WHEN (pi."exchangeRate" = (0)::numeric) THEN (1)::numeric
            ELSE pi."exchangeRate"
        END)))::numeric(10,2) AS "totalAmount",
    (COALESCE(pl."totalTax", (0)::numeric))::numeric(10,2) AS "totalTax",
    pi.balance,
    pi.assignee,
    pi."createdBy",
    pi."createdAt",
    pi."updatedBy",
    pi."updatedAt",
    pi."internalNotes",
    pi."customFields",
    pi."companyId",
    pl."thumbnailPath",
    pl."itemType",
    (COALESCE(pl."orderTotal", (0)::numeric) + (COALESCE(pid."supplierShippingCost", (0)::numeric) *
        CASE
            WHEN (pi."exchangeRate" = (0)::numeric) THEN (1)::numeric
            ELSE pi."exchangeRate"
        END)) AS "orderTotal",
        CASE
            WHEN ((pi."dateDue" < CURRENT_DATE) AND (pi."datePaid" IS NULL)) THEN 'Overdue'::"purchaseInvoiceStatus"
            ELSE pi.status
        END AS status,
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM (((("purchaseInvoice" pi
     LEFT JOIN ( SELECT pol."invoiceId",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(((COALESCE(pol.quantity, (0)::numeric) * COALESCE(pol."unitPrice", (0)::numeric)) + COALESCE(pol."shippingCost", (0)::numeric))) AS subtotal,
            sum(COALESCE(pol."taxAmount", (0)::numeric)) AS "totalTax",
            sum((((COALESCE(pol.quantity, (0)::numeric) * COALESCE(pol."unitPrice", (0)::numeric)) + COALESCE(pol."shippingCost", (0)::numeric)) + COALESCE(pol."taxAmount", (0)::numeric))) AS "orderTotal",
            min(i.type) AS "itemType"
           FROM (("purchaseInvoiceLine" pol
             LEFT JOIN item i ON ((i.id = pol."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY pol."invoiceId") pl ON ((pl."invoiceId" = pi.id)))
     LEFT JOIN "paymentTerm" pt ON ((pt.id = pi."paymentTermId")))
     LEFT JOIN "purchaseInvoiceDelivery" pid ON ((pid.id = pi.id)))
     LEFT JOIN location loc ON ((loc.id = pi."locationId")));


create or replace view "public"."purchaseOrderLines" as  SELECT DISTINCT ON (pl.id) pl.id,
    pl."purchaseOrderId",
    pl."purchaseOrderLineType",
    pl."itemId",
    pl."assetId",
    pl.description,
    pl."purchaseQuantity",
    pl."quantityReceived",
    pl."quantityInvoiced",
    pl."supplierUnitPrice",
    pl."inventoryUnitOfMeasureCode",
    pl."purchaseUnitOfMeasureCode",
    pl."locationId",
    pl."storageUnitId",
    pl."setupPrice",
    pl."receivedComplete",
    pl."invoicedComplete",
    pl."requiresInspection",
    pl."companyId",
    pl."createdAt",
    pl."createdBy",
    pl."updatedAt",
    pl."updatedBy",
    pl."customFields",
    pl."conversionFactor",
    pl.tags,
    pl."internalNotes",
    pl."externalNotes",
    pl."exchangeRate",
    pl."supplierShippingCost",
    pl."modelUploadId",
    pl."supplierTaxAmount",
    pl."quantityToReceive",
    pl."quantityToInvoice",
    pl."supplierExtendedPrice",
    pl."taxPercent",
    pl."jobId",
    pl."jobOperationId",
    pl."quantityShipped",
    pl."promisedDate",
    pl."unitPrice",
    pl."extendedPrice",
    pl."shippingCost",
    pl."taxAmount",
    pl."accountId",
    pl."requiredDate",
    pl."receivedDate",
    pl."costCenterId",
    pl."ownerId",
    pl."jobOperationSupplierQuantityReportId",
    pl."supplierPartId",
    pl."sortOrder",
    sp."supplierPartId" AS "supplierPartIdFromSupplier",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS "itemName",
    i."readableIdWithRevision" AS "itemReadableId",
    i.description AS "itemDescription",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost",
    jo.description AS "jobOperationDescription",
    a.name AS "accountName",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM ((((((((("purchaseOrderLine" pl
     JOIN "purchaseOrder" so ON ((so.id = pl."purchaseOrderId")))
     LEFT JOIN "modelUpload" mu ON ((pl."modelUploadId" = mu.id)))
     LEFT JOIN item i ON ((i.id = pl."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")))
     LEFT JOIN "jobOperation" jo ON ((jo.id = pl."jobOperationId")))
     LEFT JOIN account a ON ((a.id = pl."accountId")))
     LEFT JOIN "fixedAsset" fa ON ((fa.id = pl."assetId")))
     LEFT JOIN "supplierPart" sp ON (((sp."supplierId" = so."supplierId") AND (sp."itemId" = i.id))));


create or replace view "public"."purchaseOrderLocations" as  SELECT po.id,
    s.name AS "supplierName",
    sa."addressLine1" AS "supplierAddressLine1",
    sa."addressLine2" AS "supplierAddressLine2",
    sa.city AS "supplierCity",
    sa."stateProvince" AS "supplierStateProvince",
    sa."postalCode" AS "supplierPostalCode",
    sa."countryCode" AS "supplierCountryCode",
    sc.name AS "supplierCountryName",
    stx."taxId" AS "supplierTaxId",
    stx."vatNumber" AS "supplierVatNumber",
    stx.eori AS "supplierEori",
    scon."fullName" AS "supplierContactName",
    scon.email AS "supplierContactEmail",
    comp."countryCode" AS "companyCountryCode",
    compc.name AS "companyCountryName",
    dl.name AS "deliveryName",
    dl."addressLine1" AS "deliveryAddressLine1",
    dl."addressLine2" AS "deliveryAddressLine2",
    dl.city AS "deliveryCity",
    dl."stateProvince" AS "deliveryStateProvince",
    dl."postalCode" AS "deliveryPostalCode",
    dl."countryCode" AS "deliveryCountryCode",
    dc.name AS "deliveryCountryName",
    pod."dropShipment",
    c.name AS "customerName",
    ca."addressLine1" AS "customerAddressLine1",
    ca."addressLine2" AS "customerAddressLine2",
    ca.city AS "customerCity",
    ca."stateProvince" AS "customerStateProvince",
    ca."postalCode" AS "customerPostalCode",
    ca."countryCode" AS "customerCountryCode",
    cc.name AS "customerCountryName"
   FROM (((((((((((((((("purchaseOrder" po
     LEFT JOIN supplier s ON ((s.id = po."supplierId")))
     LEFT JOIN "supplierTax" stx ON ((stx."supplierId" = s.id)))
     LEFT JOIN "supplierLocation" sl ON ((sl.id = po."supplierLocationId")))
     LEFT JOIN address sa ON ((sa.id = sl."addressId")))
     LEFT JOIN country sc ON (((sc.alpha2)::text = sa."countryCode")))
     LEFT JOIN "supplierContact" sct ON ((sct.id = po."supplierContactId")))
     LEFT JOIN contact scon ON ((scon.id = sct."contactId")))
     LEFT JOIN company comp ON ((comp.id = po."companyId")))
     LEFT JOIN country compc ON (((compc.alpha2)::text = comp."countryCode")))
     JOIN "purchaseOrderDelivery" pod ON ((pod.id = po.id)))
     LEFT JOIN location dl ON ((dl.id = pod."locationId")))
     LEFT JOIN country dc ON (((dc.alpha2)::text = dl."countryCode")))
     LEFT JOIN customer c ON ((c.id = pod."customerId")))
     LEFT JOIN "customerLocation" cl ON ((cl.id = pod."customerLocationId")))
     LEFT JOIN address ca ON ((ca.id = cl."addressId")))
     LEFT JOIN country cc ON (((cc.alpha2)::text = ca."countryCode")));


create or replace view "public"."purchaseOrderSuppliers" as  SELECT DISTINCT s.id,
    s.name,
    s."companyId"
   FROM (supplier s
     JOIN "purchaseOrder" p ON ((p."supplierId" = s.id)));


create or replace view "public"."purchaseOrders" as  SELECT p.id,
    p."purchaseOrderId",
    p."revisionId",
    p.status,
    p."orderDate",
    p."supplierId",
    p."supplierLocationId",
    p."supplierContactId",
    p."supplierReference",
    p.assignee,
    p."companyId",
    p."closedAt",
    p."closedBy",
    p."customFields",
    p."createdAt",
    p."createdBy",
    p."updatedAt",
    p."updatedBy",
    p."currencyCode",
    p."exchangeRate",
    p."exchangeRateUpdatedAt",
    p.tags,
    p."internalNotes",
    p."externalNotes",
    p."supplierInteractionId",
    p."purchaseOrderType",
    p."jobId",
    p."jobReadableId",
    p."deletedAt",
    p."deletedBy",
    pl."thumbnailPath",
    pl."itemType",
    (pl."orderTotal" + (pd."supplierShippingCost" * p."exchangeRate")) AS "orderTotal",
    pd."shippingMethodId",
    pd."shippingTermId",
    pd."receiptRequestedDate",
    pd."receiptPromisedDate",
    pd."deliveryDate",
    pd."dropShipment",
    pp."paymentTermId",
    pd."locationId",
    pd."supplierShippingCost",
    pd.incoterm,
    pd."incotermLocation",
    u."fullName" AS "createdByFullName",
    u.email AS "createdByEmail",
    u.phone AS "createdByPhone",
    ua."fullName" AS "assigneeFullName",
    ua.email AS "assigneeEmail",
    ua.phone AS "assigneePhone",
    uam."fullName" AS "accountManagerFullName",
    uam.email AS "accountManagerEmail",
    uam.phone AS "accountManagerPhone",
    sm.name AS "shippingMethodName",
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM ((((((((((("purchaseOrder" p
     LEFT JOIN ( SELECT pol."purchaseOrderId",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum((((COALESCE(pol."purchaseQuantity", (0)::numeric) * COALESCE(pol."unitPrice", (0)::numeric)) + COALESCE(pol."shippingCost", (0)::numeric)) + COALESCE(pol."taxAmount", (0)::numeric))) AS "orderTotal",
            min(i.type) AS "itemType"
           FROM (("purchaseOrderLine" pol
             LEFT JOIN item i ON ((i.id = pol."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY pol."purchaseOrderId") pl ON ((pl."purchaseOrderId" = p.id)))
     LEFT JOIN "purchaseOrderDelivery" pd ON ((pd.id = p.id)))
     LEFT JOIN "shippingTerm" st ON ((st.id = pd."shippingTermId")))
     LEFT JOIN "purchaseOrderPayment" pp ON ((pp.id = p.id)))
     LEFT JOIN "user" u ON ((u.id = p."createdBy")))
     LEFT JOIN "user" ua ON ((ua.id = p.assignee)))
     LEFT JOIN supplier s ON ((s.id = p."supplierId")))
     LEFT JOIN "user" uam ON ((uam.id = s."accountManagerId")))
     LEFT JOIN "shippingMethod" sm ON ((sm.id = pd."shippingMethodId")))
     LEFT JOIN "paymentTerm" pt ON ((pt.id = pp."paymentTermId")))
     LEFT JOIN location loc ON ((loc.id = pd."locationId")));


create or replace view "public"."purchasingRfqLines" as  SELECT prl.id,
    prl."purchasingRfqId",
    prl."itemId",
    prl.description,
    prl.quantity,
    prl."purchaseUnitOfMeasureCode",
    prl."inventoryUnitOfMeasureCode",
    prl."conversionFactor",
    prl."order",
    prl."internalNotes",
    prl."externalNotes",
    prl."companyId",
    prl."customFields",
    prl."createdAt",
    prl."createdBy",
    prl."updatedAt",
    prl."updatedBy",
    i.name AS "itemName",
    i."readableId" AS "itemReadableId",
    i.type AS "itemType",
    i."thumbnailPath",
    mu."modelPath"
   FROM (("purchasingRfqLine" prl
     LEFT JOIN item i ON ((i.id = prl."itemId")))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")));


create or replace view "public"."purchasingRfqs" as  SELECT rfq.id,
    rfq."rfqId",
    rfq."revisionId",
    rfq.status,
    rfq."employeeId",
    rfq."rfqDate",
    rfq."expirationDate",
    rfq."internalNotes",
    rfq.notes,
    rfq."locationId",
    rfq.assignee,
    rfq."companyId",
    rfq."customFields",
    rfq."createdAt",
    rfq."createdBy",
    rfq."updatedAt",
    rfq."updatedBy",
    l.name AS "locationName",
    ( SELECT count(*) AS count
           FROM "purchasingRfqSupplier" rs
          WHERE (rs."purchasingRfqId" = rfq.id)) AS "supplierCount",
    ( SELECT COALESCE(array_agg(s.id ORDER BY s.id), ARRAY[]::text[]) AS "coalesce"
           FROM ("purchasingRfqSupplier" rs
             JOIN supplier s ON ((s.id = rs."supplierId")))
          WHERE (rs."purchasingRfqId" = rfq.id)) AS "supplierIds",
    (EXISTS ( SELECT 1
           FROM "purchasingRfqFavorite" rf
          WHERE ((rf."rfqId" = rfq.id) AND (rf."userId" = (auth.uid())::text)))) AS favorite
   FROM ("purchasingRfq" rfq
     LEFT JOIN location l ON ((l.id = rfq."locationId")));


create or replace view "public"."quoteCustomerDetails" as  SELECT q.id AS "quoteId",
    c.name AS "customerName",
    contact."fullName" AS "contactName",
    contact.email AS "contactEmail",
    ca."addressLine1" AS "customerAddressLine1",
    ca."addressLine2" AS "customerAddressLine2",
    ca.city AS "customerCity",
    ca."stateProvince" AS "customerStateProvince",
    ca."postalCode" AS "customerPostalCode",
    ca."countryCode" AS "customerCountryCode",
    country.name AS "customerCountryName",
    ctx."taxId" AS "customerTaxId",
    ctx."vatNumber" AS "customerVatNumber",
    ctx.eori AS "customerEori"
   FROM (((((((quote q
     JOIN customer c ON ((c.id = q."customerId")))
     LEFT JOIN "customerTax" ctx ON ((ctx."customerId" = c.id)))
     LEFT JOIN "customerContact" cc ON ((cc.id = q."customerContactId")))
     LEFT JOIN contact contact ON ((contact.id = cc."contactId")))
     LEFT JOIN "customerLocation" cl ON ((cl.id = q."customerLocationId")))
     LEFT JOIN address ca ON ((ca.id = cl."addressId")))
     LEFT JOIN country country ON (((country.alpha2)::text = ca."countryCode")));


create or replace view "public"."quoteLinePrices" as  SELECT ql.id,
    ql."quoteId",
    ql."quoteRevisionId",
    ql.status,
    ql."estimatorId",
    ql."itemId",
    ql."itemType",
    ql.description,
    ql."customerPartId",
    ql."customerPartRevision",
    ql."methodType",
    ql."unitOfMeasureCode",
    ql."internalNotes",
    ql."companyId",
    ql."createdBy",
    ql."updatedAt",
    ql."updatedBy",
    ql."customFields",
    ql."modelUploadId",
    ql.quantity,
    ql."additionalCharges",
    ql."locationId",
    ql."noQuoteReason",
    ql."taxPercent",
    ql.tags,
    ql."unitPricePrecision",
    ql."externalNotes",
    ql.configuration,
    ql."pricingRuleId",
    ql."priceTrace",
    ql."deletedAt",
    ql."deletedBy",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost",
    qlp.quantity AS qty,
    qlp."unitPrice",
        CASE
            WHEN (q."revisionId" > 0) THEN ((q."quoteId" || '-'::text) || (q."revisionId")::text)
            ELSE q."quoteId"
        END AS "quoteReadableId",
    q."createdAt" AS "quoteCreatedAt",
    q."customerId",
    i."deletedAt" AS "itemDeletedAt"
   FROM (((((("quoteLine" ql
     JOIN quote q ON ((q.id = ql."quoteId")))
     LEFT JOIN "modelUpload" mu ON ((ql."modelUploadId" = mu.id)))
     LEFT JOIN item i ON ((i.id = ql."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")))
     LEFT JOIN "quoteLinePrice" qlp ON ((qlp."quoteLineId" = ql.id)));


create or replace view "public"."quoteLines" as  SELECT ql.id,
    ql."quoteId",
    ql."quoteRevisionId",
    ql.status,
    ql."estimatorId",
    ql."itemId",
    ql."itemType",
    ql.description,
    ql."customerPartId",
    ql."customerPartRevision",
    ql."methodType",
    ql."unitOfMeasureCode",
    ql."internalNotes",
    ql."companyId",
    ql."createdBy",
    ql."updatedAt",
    ql."updatedBy",
    ql."customFields",
    ql."modelUploadId",
    ql.quantity,
    ql."additionalCharges",
    ql."locationId",
    ql."noQuoteReason",
    ql."taxPercent",
    ql.tags,
    ql."unitPricePrecision",
    ql."externalNotes",
    ql.configuration,
    ql."pricingRuleId",
    ql."priceTrace",
    ql."deletedAt",
    ql."deletedBy",
    ql."sortOrder",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost"
   FROM (((("quoteLine" ql
     LEFT JOIN "modelUpload" mu ON ((ql."modelUploadId" = mu.id)))
     JOIN item i ON ((i.id = ql."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")));


create or replace view "public"."quotes" as  SELECT q.id,
    q."quoteId",
    q."revisionId",
    q."dueDate",
    q."expirationDate",
    q.status,
    q."salesPersonId",
    q."estimatorId",
    q."customerId",
    q."customerLocationId",
    q."customerContactId",
    q."customerReference",
    q."locationId",
    q.assignee,
    q."customFields",
    q."companyId",
    q."createdAt",
    q."createdBy",
    q."updatedAt",
    q."updatedBy",
    q."externalNotes",
    q."internalNotes",
    q."currencyCode",
    q."exchangeRate",
    q."exchangeRateUpdatedAt",
    q."externalLinkId",
    q."digitalQuoteAcceptedBy",
    q."digitalQuoteAcceptedByEmail",
    q.tags,
    q."digitalQuoteRejectedBy",
    q."digitalQuoteRejectedByEmail",
    q."opportunityId",
    q."completedDate",
    q."customerEngineeringContactId",
    q."deletedAt",
    q."deletedBy",
    ql."thumbnailPath",
    ql."itemType",
    l.name AS "locationName",
    ql.lines,
    ql."completedLines",
    qs."shippingCost"
   FROM (((quote q
     LEFT JOIN ( SELECT "quoteLine"."quoteId",
            count("quoteLine".id) FILTER (WHERE ("quoteLine".status <> 'No Quote'::"quoteLineStatus")) AS lines,
            count("quoteLine".id) FILTER (WHERE ("quoteLine".status = 'Complete'::"quoteLineStatus")) AS "completedLines",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            min(i.type) AS "itemType"
           FROM (("quoteLine"
             LEFT JOIN item i ON ((i.id = "quoteLine"."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY "quoteLine"."quoteId") ql ON ((ql."quoteId" = q.id)))
     LEFT JOIN "quoteShipment" qs ON ((qs.id = q.id)))
     LEFT JOIN location l ON ((l.id = q."locationId")));


create or replace view "public"."receiptLines" as  SELECT rl.id,
    rl."receiptId",
    rl."lineId",
    rl."itemId",
    rl."orderQuantity",
    rl."outstandingQuantity",
    rl."receivedQuantity",
    rl."locationId",
    rl."storageUnitId",
    rl."unitOfMeasure",
    rl."unitPrice",
    rl."companyId",
    rl."createdAt",
    rl."createdBy",
    rl."updatedAt",
    rl."updatedBy",
    rl."conversionFactor",
    rl."requiresSerialTracking",
    rl."requiresBatchTracking",
    rl."deletedAt",
    rl."deletedBy",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS description,
    i."deletedAt" AS "itemDeletedAt"
   FROM (("receiptLine" rl
     LEFT JOIN item i ON ((i.id = rl."itemId")))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")));


create or replace view "public"."receipts" as  SELECT r.id,
    r."receiptId",
    r."locationId",
    r."sourceDocument",
    r."sourceDocumentId",
    r."sourceDocumentReadableId",
    r."externalDocumentId",
    r."supplierId",
    r.status,
    r."postingDate",
    r.invoiced,
    r.assignee,
    r."companyId",
    r."createdAt",
    r."createdBy",
    r."updatedAt",
    r."updatedBy",
    r."customFields",
    r.tags,
    r."internalNotes",
    r."supplierInteractionId",
    r."postedBy",
    l.name AS "locationName"
   FROM (receipt r
     LEFT JOIN location l ON ((l.id = r."locationId")));


create or replace view "public"."salesInvoiceLines" as  SELECT sl.id,
    sl."invoiceId",
    sl."invoiceLineType",
    sl.description,
    sl."itemId",
    sl."methodType",
    sl."assetId",
    sl.quantity,
    sl."unitOfMeasureCode",
    sl."locationId",
    sl."storageUnitId",
    sl."exchangeRate",
    sl."unitPrice",
    sl."setupPrice",
    sl."addOnCost",
    sl."shippingCost",
    sl."taxPercent",
    sl."convertedUnitPrice",
    sl."convertedAddOnCost",
    sl."convertedShippingCost",
    sl."convertedSetupPrice",
    sl."externalNotes",
    sl."internalNotes",
    sl."modelUploadId",
    sl."opportunityId",
    sl."salesOrderId",
    sl."salesOrderLineId",
    sl."customFields",
    sl."companyId",
    sl."createdAt",
    sl."createdBy",
    sl."updatedAt",
    sl."updatedBy",
    sl."accountId",
    sl."nonTaxableAddOnCost",
    sl."convertedNonTaxableAddOnCost",
    sl."deletedAt",
    sl."deletedBy",
    sl."sortOrder",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS "itemName",
    i.description AS "itemDescription",
    ic."unitCost",
    ( SELECT cp."customerPartId"
           FROM "customerPartToItem" cp
          WHERE ((cp."customerId" = si."customerId") AND (cp."itemId" = i.id))
         LIMIT 1) AS "customerPartId",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM (((((("salesInvoiceLine" sl
     JOIN "salesInvoice" si ON ((si.id = sl."invoiceId")))
     LEFT JOIN "modelUpload" mu ON ((sl."modelUploadId" = mu.id)))
     LEFT JOIN item i ON ((i.id = sl."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")))
     LEFT JOIN "fixedAsset" fa ON ((fa.id = sl."assetId")));


create or replace view "public"."salesInvoiceLocations" as  SELECT si.id,
    c.name AS "customerName",
    ca."addressLine1" AS "customerAddressLine1",
    ca."addressLine2" AS "customerAddressLine2",
    ca.city AS "customerCity",
    ca."stateProvince" AS "customerStateProvince",
    ca."postalCode" AS "customerPostalCode",
    ca."countryCode" AS "customerCountryCode",
    cc.name AS "customerCountryName",
    ctx."taxId" AS "customerTaxId",
    ctx."vatNumber" AS "customerVatNumber",
    ctx.eori AS "customerEori",
    ic.name AS "invoiceCustomerName",
    ica."addressLine1" AS "invoiceAddressLine1",
    ica."addressLine2" AS "invoiceAddressLine2",
    ica.city AS "invoiceCity",
    ica."stateProvince" AS "invoiceStateProvince",
    ica."postalCode" AS "invoicePostalCode",
    ica."countryCode" AS "invoiceCountryCode",
    icc.name AS "invoiceCountryName",
    sc.name AS "shipmentCustomerName",
    sa."addressLine1" AS "shipmentAddressLine1",
    sa."addressLine2" AS "shipmentAddressLine2",
    sa.city AS "shipmentCity",
    sa."stateProvince" AS "shipmentStateProvince",
    sa."postalCode" AS "shipmentPostalCode",
    sa."countryCode" AS "shipmentCountryCode",
    scc.name AS "shipmentCountryName"
   FROM (((((((((((((("salesInvoice" si
     JOIN customer c ON ((c.id = si."customerId")))
     LEFT JOIN "customerTax" ctx ON ((ctx."customerId" = c.id)))
     LEFT JOIN "customerLocation" cl ON ((cl.id = si."locationId")))
     LEFT JOIN address ca ON ((ca.id = cl."addressId")))
     LEFT JOIN country cc ON (((cc.alpha2)::text = ca."countryCode")))
     LEFT JOIN customer ic ON ((ic.id = si."invoiceCustomerId")))
     LEFT JOIN "customerLocation" icl ON ((icl.id = si."invoiceCustomerLocationId")))
     LEFT JOIN address ica ON ((ica.id = icl."addressId")))
     LEFT JOIN country icc ON (((icc.alpha2)::text = ica."countryCode")))
     LEFT JOIN "salesInvoiceShipment" sis ON ((sis.id = si.id)))
     LEFT JOIN "customerLocation" scl ON ((scl.id = sis."locationId")))
     LEFT JOIN address sa ON ((sa.id = scl."addressId")))
     LEFT JOIN country scc ON (((scc.alpha2)::text = sa."countryCode")))
     LEFT JOIN customer sc ON ((sc.id = scl."customerId")));


create or replace view "public"."salesInvoices" as  SELECT si.id,
    si."invoiceId",
    si.status,
    si."customerId",
    si."customerReference",
    si."invoiceCustomerId",
    si."invoiceCustomerLocationId",
    si."invoiceCustomerContactId",
    si."paymentTermId",
    si."postingDate",
    si."dateIssued",
    si."dateDue",
    si."datePaid",
    si."locationId",
    si."currencyCode",
    COALESCE(sil.subtotal, (0)::numeric) AS subtotal,
    si."totalDiscount",
    ((COALESCE(sil.subtotal, (0)::numeric) + COALESCE(sil."totalTax", (0)::numeric)) + COALESCE(ss."shippingCost", (0)::numeric)) AS "totalAmount",
    COALESCE(sil."totalTax", (0)::numeric) AS "totalTax",
    si.balance,
    si."exchangeRate",
    si."exchangeRateUpdatedAt",
    si."opportunityId",
    si."shipmentId",
    si.assignee,
    si."companyId",
    si."customFields",
    si."internalNotes",
    si."externalNotes",
    si.tags,
    si."createdAt",
    si."createdBy",
    si."updatedAt",
    si."updatedBy",
    sil."thumbnailPath",
    sil."itemType",
    ((COALESCE(sil.subtotal, (0)::numeric) + COALESCE(sil."totalTax", (0)::numeric)) + COALESCE(ss."shippingCost", (0)::numeric)) AS "invoiceTotal",
    sil.lines,
    pt.name AS "paymentTermName",
    loc.name AS "locationName"
   FROM (((("salesInvoice" si
     LEFT JOIN ( SELECT sil_1."invoiceId",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(((((COALESCE(sil_1.quantity, (0)::numeric) * COALESCE(sil_1."unitPrice", (0)::numeric)) + COALESCE(sil_1."addOnCost", (0)::numeric)) + COALESCE(sil_1."nonTaxableAddOnCost", (0)::numeric)) + COALESCE(sil_1."shippingCost", (0)::numeric))) AS subtotal,
            sum((COALESCE(sil_1."taxPercent", (0)::numeric) * (((COALESCE(sil_1.quantity, (0)::numeric) * COALESCE(sil_1."unitPrice", (0)::numeric)) + COALESCE(sil_1."addOnCost", (0)::numeric)) + COALESCE(sil_1."shippingCost", (0)::numeric)))) AS "totalTax",
            min(i.type) AS "itemType",
            array_agg(json_build_object('id', sil_1.id, 'invoiceLineType', sil_1."invoiceLineType", 'quantity', sil_1.quantity, 'unitPrice', sil_1."unitPrice", 'itemId', sil_1."itemId")) AS lines
           FROM (("salesInvoiceLine" sil_1
             LEFT JOIN item i ON ((i.id = sil_1."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY sil_1."invoiceId") sil ON ((sil."invoiceId" = si.id)))
     JOIN "salesInvoiceShipment" ss ON ((ss.id = si.id)))
     LEFT JOIN "paymentTerm" pt ON ((pt.id = si."paymentTermId")))
     LEFT JOIN location loc ON ((loc.id = si."locationId")));


create or replace view "public"."salesOrderCustomers" as  SELECT DISTINCT c.id,
    c.name,
    c."companyId"
   FROM (customer c
     JOIN "salesOrder" s ON ((s."customerId" = c.id)));


create or replace view "public"."salesOrderLines" as  SELECT sl.id,
    sl."salesOrderId",
    sl."salesOrderLineType",
    sl."itemId",
    sl."assetId",
    sl.description,
    sl."saleQuantity",
    sl."quantitySent",
    sl."quantityInvoiced",
    sl."unitPrice",
    sl."unitOfMeasureCode",
    sl."locationId",
    sl."storageUnitId",
    sl."setupPrice",
    sl."sentComplete",
    sl."invoicedComplete",
    sl."requiresInspection",
    sl."companyId",
    sl."createdAt",
    sl."createdBy",
    sl."updatedAt",
    sl."updatedBy",
    sl."customFields",
    sl.status,
    sl."modelUploadId",
    sl."promisedDate",
    sl."addOnCost",
    sl."methodType",
    sl."exchangeRate",
    sl."shippingCost",
    sl."taxPercent",
    sl."internalNotes",
    sl."externalNotes",
    sl."quantityToSend",
    sl."quantityToInvoice",
    sl."convertedAddOnCost",
    sl."convertedShippingCost",
    sl."convertedUnitPrice",
    sl."sentDate",
    sl."accountId",
    sl."nonTaxableAddOnCost",
    sl."convertedNonTaxableAddOnCost",
    sl."pricingRuleId",
    sl."priceTrace",
    sl."deletedAt",
    sl."deletedBy",
    sl."sortOrder",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            WHEN ((i."thumbnailPath" IS NULL) AND (imu."thumbnailPath" IS NOT NULL)) THEN imu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    COALESCE(mu.id, imu.id) AS "modelId",
    COALESCE(mu."autodeskUrn", imu."autodeskUrn") AS "autodeskUrn",
    COALESCE(mu."modelPath", imu."modelPath") AS "modelPath",
    COALESCE(mu.name, imu.name) AS "modelName",
    COALESCE(mu.size, imu.size) AS "modelSize",
    ic."unitCost",
    cp."customerPartId",
    cp."customerPartRevision",
    so."orderDate",
    so."customerId",
    so."salesOrderId" AS "salesOrderReadableId",
    fa."fixedAssetId" AS "assetReadableId",
    fa.name AS "assetName"
   FROM ((((((("salesOrderLine" sl
     JOIN "salesOrder" so ON ((so.id = sl."salesOrderId")))
     LEFT JOIN "modelUpload" mu ON ((sl."modelUploadId" = mu.id)))
     LEFT JOIN item i ON ((i.id = sl."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" imu ON ((imu.id = i."modelUploadId")))
     LEFT JOIN "customerPartToItem" cp ON (((cp."customerId" = so."customerId") AND (cp."itemId" = i.id))))
     LEFT JOIN "fixedAsset" fa ON ((fa.id = sl."assetId")));


create or replace view "public"."salesOrderLocations" as  SELECT so.id,
    c.name AS "customerName",
    ca."addressLine1" AS "customerAddressLine1",
    ca."addressLine2" AS "customerAddressLine2",
    ca.city AS "customerCity",
    ca."stateProvince" AS "customerStateProvince",
    ca."postalCode" AS "customerPostalCode",
    ca."countryCode" AS "customerCountryCode",
    cc.name AS "customerCountryName",
    ctx."taxId" AS "customerTaxId",
    ctx."vatNumber" AS "customerVatNumber",
    ctx.eori AS "customerEori",
    pc.name AS "paymentCustomerName",
    pa."addressLine1" AS "paymentAddressLine1",
    pa."addressLine2" AS "paymentAddressLine2",
    pa.city AS "paymentCity",
    pa."stateProvince" AS "paymentStateProvince",
    pa."postalCode" AS "paymentPostalCode",
    pa."countryCode" AS "paymentCountryCode",
    pn.name AS "paymentCountryName"
   FROM (((((((((("salesOrder" so
     JOIN customer c ON ((c.id = so."customerId")))
     LEFT JOIN "customerTax" ctx ON ((ctx."customerId" = c.id)))
     LEFT JOIN "customerLocation" cl ON ((cl.id = so."customerLocationId")))
     LEFT JOIN address ca ON ((ca.id = cl."addressId")))
     LEFT JOIN country cc ON (((cc.alpha2)::text = ca."countryCode")))
     LEFT JOIN "salesOrderPayment" sop ON ((sop.id = so.id)))
     LEFT JOIN customer pc ON ((pc.id = sop."invoiceCustomerId")))
     LEFT JOIN "customerLocation" pl ON ((pl.id = sop."invoiceCustomerLocationId")))
     LEFT JOIN address pa ON ((pa.id = pl."addressId")))
     LEFT JOIN country pn ON (((pn.alpha2)::text = pa."countryCode")));


create or replace view "public"."salesOrders" as  SELECT s.id,
    s."salesOrderId",
    s."revisionId",
    s.status,
    s."orderDate",
    s."currencyCode",
    s."customerId",
    s."customerLocationId",
    s."customerContactId",
    s."customerReference",
    s.assignee,
    s."companyId",
    s."closedAt",
    s."closedBy",
    s."customFields",
    s."createdAt",
    s."createdBy",
    s."updatedAt",
    s."updatedBy",
    s."locationId",
    s."exchangeRate",
    s."exchangeRateUpdatedAt",
    s."externalNotes",
    s."internalNotes",
    s."salesPersonId",
    s."sentCompleteDate",
    s."opportunityId",
    s."completedDate",
    s."customerEngineeringContactId",
    s."deletedAt",
    s."deletedBy",
        CASE
            WHEN ((s.status <> ALL (ARRAY['Closed'::"salesOrderStatus", 'Cancelled'::"salesOrderStatus"])) AND (EXISTS ( SELECT 1
               FROM "salesOrderLine" sol
              WHERE ((sol."salesOrderId" = s.id) AND (sol."methodType" = 'Make to Order'::"methodType") AND (COALESCE(( SELECT sum(j."quantityComplete") AS sum
                       FROM job j
                      WHERE ((j."salesOrderLineId" = sol.id) AND (j."salesOrderId" = sol."salesOrderId"))), (0)::numeric) < sol."saleQuantity"))))) THEN 'In Progress'::"salesOrderStatus"
            ELSE s.status
        END AS "displayStatus",
    sl."thumbnailPath",
    sl."itemType",
    (sl."orderTotal" + COALESCE(ss."shippingCost", (0)::numeric)) AS "orderTotal",
    sj.jobs,
    sl.lines,
    st.name AS "shippingTermName",
    sp."paymentTermId",
    ss."shippingMethodId",
    ss."receiptRequestedDate",
    ss."receiptPromisedDate",
    ss."dropShipment",
    ss."shippingCost",
    ss.incoterm,
    ss."incotermLocation",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'salesOrder'::text) AND (eim."entityId" = s.id))) AS "externalId",
    sm.name AS "shippingMethodName",
    loc.name AS "locationName",
    pt.name AS "paymentTermName"
   FROM (((((((("salesOrder" s
     LEFT JOIN ( SELECT sol."salesOrderId",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            sum(((((1)::numeric + COALESCE(sol."taxPercent", (0)::numeric)) * (((COALESCE(sol."saleQuantity", (0)::numeric) * COALESCE(sol."unitPrice", (0)::numeric)) + COALESCE(sol."shippingCost", (0)::numeric)) + COALESCE(sol."addOnCost", (0)::numeric))) + COALESCE(sol."nonTaxableAddOnCost", (0)::numeric))) AS "orderTotal",
            min(i.type) AS "itemType",
            array_agg(json_build_object('id', sol.id, 'methodType', sol."methodType", 'saleQuantity', sol."saleQuantity")) AS lines
           FROM (("salesOrderLine" sol
             LEFT JOIN item i ON ((i.id = sol."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY sol."salesOrderId") sl ON ((sl."salesOrderId" = s.id)))
     LEFT JOIN ( SELECT sol."salesOrderId",
            array_agg(json_build_object('id', j.id, 'jobId', j."jobId", 'status', j.status, 'dueDate', j."dueDate", 'productionQuantity', j."productionQuantity", 'quantityComplete', j."quantityComplete", 'quantityShipped', j."quantityShipped", 'quantity', j.quantity, 'scrapQuantity', j."scrapQuantity", 'salesOrderLineId', sol.id, 'assignee', j.assignee)) AS jobs
           FROM ("salesOrderLine" sol
             JOIN job j ON (((j."salesOrderId" = sol."salesOrderId") AND (j."salesOrderLineId" = sol.id))))
          GROUP BY sol."salesOrderId") sj ON ((sj."salesOrderId" = s.id)))
     LEFT JOIN "salesOrderShipment" ss ON ((ss.id = s.id)))
     LEFT JOIN "shippingTerm" st ON ((st.id = ss."shippingTermId")))
     LEFT JOIN "salesOrderPayment" sp ON ((sp.id = s.id)))
     LEFT JOIN "shippingMethod" sm ON ((sm.id = ss."shippingMethodId")))
     LEFT JOIN location loc ON ((loc.id = s."locationId")))
     LEFT JOIN "paymentTerm" pt ON ((pt.id = sp."paymentTermId")));


create or replace view "public"."salesRfqLines" as  SELECT srl.id,
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


create or replace view "public"."salesRfqs" as  SELECT rfq.id,
    rfq."rfqId",
    rfq."revisionId",
    rfq.status,
    rfq."employeeId",
    rfq."customerId",
    rfq."customerContactId",
    rfq."customerReference",
    rfq."rfqDate",
    rfq."expirationDate",
    rfq."locationId",
    rfq.assignee,
    rfq."companyId",
    rfq."customFields",
    rfq."createdAt",
    rfq."createdBy",
    rfq."updatedAt",
    rfq."updatedBy",
    rfq."customerLocationId",
    rfq."externalNotes",
    rfq."internalNotes",
    rfq."salesPersonId",
    rfq.tags,
    rfq."noQuoteReasonId",
    rfq."opportunityId",
    rfq."completedDate",
    rfq."customerEngineeringContactId",
    l.name AS "locationName"
   FROM ("salesRfq" rfq
     LEFT JOIN location l ON ((l.id = rfq."locationId")));


create or replace view "public"."services" as  WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."deletedAt",
            i."deletedBy"
           FROM item i
          WHERE ((i.type = 'Service'::"itemType") AND (i."deletedAt" IS NULL))
          ORDER BY i."readableId", i."companyId",
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i."readableId",
            i."companyId",
            json_agg(json_build_object('id', i.id, 'revision', i.revision, 'methodType', i."defaultMethodType", 'type', i.type) ORDER BY
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END, i."createdAt") AS revisions
           FROM item i
          WHERE ((i.type = 'Service'::"itemType") AND (i."deletedAt" IS NULL))
          GROUP BY i."readableId", i."companyId"
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
    li."thumbnailPath",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    ir.revisions,
    s."customFields",
    s.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'item'::text) AND (eim."entityId" = li.id))) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM (((((service s
     JOIN latest_items li ON (((li."readableId" = s.id) AND (li."companyId" = s."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = s.id) AND (ir."companyId" = li."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = li.id) AND (ps."companyId" = li."companyId"))))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = li."unitOfMeasureCode") AND (uom."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)));


create or replace view "public"."shifts" as  SELECT s.id,
    s.name,
    s."startTime",
    s."endTime",
    s."locationId",
    s.sunday,
    s.monday,
    s.tuesday,
    s.wednesday,
    s.thursday,
    s.friday,
    s.saturday,
    s.active,
    s."companyId",
    s."createdBy",
    s."createdAt",
    s."updatedBy",
    s."updatedAt",
    s."customFields",
    l.name AS "locationName"
   FROM (shift s
     LEFT JOIN location l ON ((s."locationId" = l.id)));


create or replace view "public"."shipmentLines" as  SELECT sl.id,
    sl."shipmentId",
    sl."lineId",
    sl."itemId",
    sl."orderQuantity",
    sl."outstandingQuantity",
    sl."shippedQuantity",
    sl."locationId",
    sl."storageUnitId",
    sl."unitOfMeasure",
    sl."unitPrice",
    sl."requiresSerialTracking",
    sl."requiresBatchTracking",
    sl."companyId",
    sl."createdAt",
    sl."createdBy",
    sl."updatedAt",
    sl."updatedBy",
    sl."fulfillmentId",
    sl."deletedAt",
    sl."deletedBy",
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS description,
    i."deletedAt" AS "itemDeletedAt"
   FROM (("shipmentLine" sl
     LEFT JOIN item i ON ((i.id = sl."itemId")))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")));


create or replace view "public"."stockTransferLines" as  SELECT stl.id,
    stl."stockTransferId",
    stl."jobId",
    stl."jobMaterialId",
    stl."itemId",
    stl."fromStorageUnitId",
    stl."toStorageUnitId",
    stl.quantity,
    stl."pickedQuantity",
    stl."outstandingQuantity",
    stl."trackedEntityId",
    stl."requiresBatchTracking",
    stl."requiresSerialTracking",
    stl."companyId",
    stl."createdAt",
    stl."createdBy",
    stl."updatedAt",
    stl."updatedBy",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i."readableIdWithRevision" AS "itemReadableId",
    i.name AS "itemDescription",
    uom.name AS "unitOfMeasure",
    sf.name AS "fromStorageUnitName",
    st.name AS "toStorageUnitName"
   FROM ((((("stockTransferLine" stl
     LEFT JOIN item i ON ((i.id = stl."itemId")))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = i."unitOfMeasureCode") AND (uom."companyId" = i."companyId"))))
     LEFT JOIN "storageUnit" sf ON ((sf.id = stl."fromStorageUnitId")))
     LEFT JOIN "storageUnit" st ON ((st.id = stl."toStorageUnitId")))
  ORDER BY i."readableIdWithRevision", st.name;


create or replace view "public"."storageUnits_recursive" as  WITH RECURSIVE t AS (
         SELECT "storageUnit".id,
            "storageUnit"."parentId",
            "storageUnit"."locationId",
            "storageUnit"."warehouseId",
            "storageUnit".name,
            "storageUnit".active,
            "storageUnit"."storageTypeIds",
            "storageUnit"."companyId",
            1 AS depth,
            ARRAY["storageUnit".id] AS "ancestorPath"
           FROM "storageUnit"
          WHERE ("storageUnit"."parentId" IS NULL)
        UNION ALL
         SELECT s.id,
            s."parentId",
            s."locationId",
            s."warehouseId",
            s.name,
            s.active,
            s."storageTypeIds",
            s."companyId",
            (t_1.depth + 1),
            (t_1."ancestorPath" || s.id)
           FROM ("storageUnit" s
             JOIN t t_1 ON ((s."parentId" = t_1.id)))
        )
 SELECT id,
    "parentId",
    "locationId",
    "warehouseId",
    name,
    active,
    "storageTypeIds",
    "companyId",
    depth,
    "ancestorPath"
   FROM t;


create or replace view "public"."styles" as  WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."deletedAt",
            i."deletedBy",
            i."sourcingType",
            i."attributeSetId"
           FROM item i
          WHERE ((i.type = 'Style'::"itemType") AND (NOT (EXISTS ( SELECT 1
                   FROM "itemVariant" iv
                  WHERE (iv."variantItemId" = i.id)))))
          ORDER BY i."readableId", i."companyId",
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i."readableId",
            i."companyId",
            json_agg(json_build_object('id', i.id, 'revision', i.revision, 'name', i.name, 'description', i.description, 'active', i.active, 'createdAt', i."createdAt") ORDER BY
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END, i."createdAt") AS revisions
           FROM item i
          WHERE ((i.type = 'Style'::"itemType") AND (NOT (EXISTS ( SELECT 1
                   FROM "itemVariant" iv
                  WHERE (iv."variantItemId" = i.id)))))
          GROUP BY i."readableId", i."companyId"
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li."sourcingType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
    li."thumbnailPath",
    li."attributeSetId",
    ( SELECT COALESCE(json_agg(attr_row.obj ORDER BY attr_row."sortOrder"), '[]'::json) AS "coalesce"
           FROM ( SELECT COALESCE(isa."sortOrder", 100) AS "sortOrder",
                    json_build_object('attributeId', ia.id, 'code', ia.code, 'name', ia.name, 'values', COALESCE(( SELECT json_agg(json_build_object('id', iav.id, 'code', iav.code, 'name', COALESCE(iav.name, iav.code)) ORDER BY iav."sortOrder", iav.code) AS json_agg
                           FROM ("itemAttributeSelection" ias
                             JOIN "itemAttributeValue" iav ON ((iav.id = ias."attributeValueId")))
                          WHERE ((ias."itemId" = li.id) AND (ias."companyId" = li."companyId") AND (ias."attributeId" = ia.id))), '[]'::json)) AS obj
                   FROM ("itemAttribute" ia
                     LEFT JOIN "itemAttributeSetAttribute" isa ON (((isa."attributeId" = ia.id) AND (isa."attributeSetId" = li."attributeSetId"))))
                  WHERE (EXISTS ( SELECT 1
                           FROM "itemAttributeSelection" ias
                          WHERE ((ias."itemId" = li.id) AND (ias."companyId" = li."companyId") AND (ias."attributeId" = ia.id))))) attr_row) AS attributes,
    ( SELECT string_agg(iav.code, ' '::text ORDER BY COALESCE(isa."sortOrder", 100), iav."sortOrder", iav.code) AS string_agg
           FROM (("itemAttributeSelection" ias
             JOIN "itemAttributeValue" iav ON ((iav.id = ias."attributeValueId")))
             LEFT JOIN "itemAttributeSetAttribute" isa ON (((isa."attributeId" = ias."attributeId") AND (isa."attributeSetId" = li."attributeSetId"))))
          WHERE ((ias."itemId" = li.id) AND (ias."companyId" = li."companyId"))) AS "attributeCodes",
    ir.revisions,
    s."customFields",
    s.tags,
    ic."itemPostingGroupId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM (((style s
     JOIN latest_items li ON (((li."readableId" = s.id) AND (li."companyId" = s."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = li."readableId") AND (ir."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)));


create or replace view "public"."supplierQuoteLines" as  SELECT ql.id,
    ql."supplierQuoteId",
    ql."supplierQuoteRevisionId",
    ql.quantity,
    ql."itemId",
    ql.description,
    ql."supplierPartId",
    ql."supplierPartRevision",
    ql."inventoryUnitOfMeasureCode",
    ql."purchaseUnitOfMeasureCode",
    ql."conversionFactor",
    ql."companyId",
    ql."createdBy",
    ql."updatedAt",
    ql."updatedBy",
    ql."customFields",
    ql.tags,
    ql."internalNotes",
    ql."externalNotes",
    ql."costCenterId",
    ql."accountId",
    ql."supplierQuoteLineType",
    ql."requiredDate",
    ql."ownerId",
    ql."deletedAt",
    ql."deletedBy",
    ql."sortOrder",
    i."readableIdWithRevision" AS "itemReadableId",
    i.type AS "itemType",
    COALESCE(i."thumbnailPath", mu."thumbnailPath") AS "thumbnailPath",
    ic."unitCost",
    a.name AS "accountName"
   FROM (((("supplierQuoteLine" ql
     LEFT JOIN item i ON ((i.id = ql."itemId")))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = i.id)))
     LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
     LEFT JOIN account a ON ((a.id = ql."accountId")));


create or replace view "public"."supplierQuotes" as  SELECT q.id,
    q."supplierQuoteId",
    q."revisionId",
    q."quotedDate",
    q."expirationDate",
    q.status,
    q."internalNotes",
    q."externalNotes",
    q."supplierId",
    q."supplierLocationId",
    q."supplierContactId",
    q."supplierReference",
    q.assignee,
    q."currencyCode",
    q."exchangeRate",
    q."exchangeRateUpdatedAt",
    q."companyId",
    q."customFields",
    q.tags,
    q."createdAt",
    q."createdBy",
    q."updatedAt",
    q."updatedBy",
    q."supplierInteractionId",
    q."supplierQuoteType",
    q."externalLinkId",
    q."deletedAt",
    q."deletedBy",
    ql."thumbnailPath",
    ql."itemType"
   FROM ("supplierQuote" q
     LEFT JOIN ( SELECT "supplierQuoteLine"."supplierQuoteId",
            min(
                CASE
                    WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
                    ELSE i."thumbnailPath"
                END) AS "thumbnailPath",
            min(i.type) AS "itemType"
           FROM (("supplierQuoteLine"
             LEFT JOIN item i ON ((i.id = "supplierQuoteLine"."itemId")))
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          GROUP BY "supplierQuoteLine"."supplierQuoteId") ql ON ((ql."supplierQuoteId" = q.id)));


create or replace view "public"."suppliers" as  SELECT s.id,
    s."readableId",
    s.name,
    s."supplierTypeId",
    s."supplierStatus" AS status,
    stx."taxId",
    s."accountManagerId",
    s.logo,
    s.assignee,
    s."companyId",
    s."createdAt",
    s."createdBy",
    s."updatedAt",
    s."updatedBy",
    s."customFields",
    s."currencyCode",
    stx."vatNumber",
    stx.eori,
    s.website,
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'supplier'::text) AND (eim."entityId" = s.id))) AS "externalId",
    s.tags,
    s."taxPercent",
    s."purchasingContactId",
    s.embedding,
    s."defaultCc",
    st.name AS type,
    po.count AS "orderCount",
    p.count AS "partCount",
    pc."workPhone" AS phone,
    pc.fax
   FROM (((((supplier s
     LEFT JOIN "supplierTax" stx ON ((stx."supplierId" = s.id)))
     LEFT JOIN "supplierType" st ON ((st.id = s."supplierTypeId")))
     LEFT JOIN ( SELECT "purchaseOrder"."supplierId",
            count(*) AS count
           FROM "purchaseOrder"
          GROUP BY "purchaseOrder"."supplierId") po ON ((po."supplierId" = s.id)))
     LEFT JOIN ( SELECT "supplierPart"."supplierId",
            count(*) AS count
           FROM "supplierPart"
          GROUP BY "supplierPart"."supplierId") p ON ((p."supplierId" = s.id)))
     LEFT JOIN ( SELECT DISTINCT ON (sc."supplierId") sc."supplierId" AS id,
            co."workPhone",
            co.fax
           FROM ("supplierContact" sc
             JOIN contact co ON ((co.id = sc."contactId")))
          ORDER BY sc."supplierId", sc.id) pc ON ((pc.id = s.id)));


create or replace view "public"."timeCardEntries" as  SELECT tce.id,
    tce."employeeId",
    tce."companyId",
    tce."clockIn",
    tce."clockOut",
    tce.note,
    tce."autoCloseShiftId",
    tce."createdBy",
    tce."createdAt",
    tce."updatedBy",
    tce."updatedAt",
    u."firstName",
    u."lastName",
    u."avatarUrl",
    ej.title AS "jobTitle",
    ej."shiftId",
    ej."locationId",
    s.name AS "shiftName",
    l.name AS "locationName",
        CASE
            WHEN (tce."clockOut" IS NULL) THEN 'Active'::text
            ELSE 'Complete'::text
        END AS status
   FROM (((("timeCardEntry" tce
     JOIN "user" u ON ((tce."employeeId" = u.id)))
     LEFT JOIN "employeeJob" ej ON (((ej.id = tce."employeeId") AND (ej."companyId" = tce."companyId"))))
     LEFT JOIN shift s ON ((ej."shiftId" = s.id)))
     LEFT JOIN location l ON ((ej."locationId" = l.id)));


create or replace view "public"."tools" as  WITH latest_items AS (
         SELECT DISTINCT ON (i."readableId", i."companyId") i.id,
            i."readableId",
            i.name,
            i.description,
            i.type,
            i."replenishmentSystem",
            i."defaultMethodType",
            i."itemTrackingType",
            i."unitOfMeasureCode",
            i.active,
            i."companyId",
            i."createdBy",
            i."createdAt",
            i."updatedBy",
            i."updatedAt",
            i.assignee,
            i."modelUploadId",
            i."thumbnailPath",
            i.notes,
            i."trackingMethod",
            i.embedding,
            i.revision,
            i."readableIdWithRevision",
            i."requiresInspection",
            i."deletedAt",
            i."deletedBy",
            i."sourcingType",
            mu.id AS "modelUploadId",
            mu."modelPath",
            mu."thumbnailPath" AS "modelThumbnailPath",
            mu.name AS "modelName",
            mu.size AS "modelSize"
           FROM (item i
             LEFT JOIN "modelUpload" mu ON ((mu.id = i."modelUploadId")))
          WHERE (i.type = 'Tool'::"itemType")
          ORDER BY i."readableId", i."companyId",
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END DESC, i."createdAt" DESC NULLS LAST
        ), item_revisions AS (
         SELECT i."readableId",
            i."companyId",
            json_agg(json_build_object('id', i.id, 'revision', i.revision, 'methodType', i."defaultMethodType", 'type', i.type) ORDER BY
                CASE
                    WHEN ((i.revision = '0'::text) OR (i.revision = ''::text) OR (i.revision IS NULL)) THEN 0
                    ELSE 1
                END, i."createdAt") AS revisions
           FROM item i
          WHERE (i.type = 'Tool'::"itemType")
          GROUP BY i."readableId", i."companyId"
        )
 SELECT li.active,
    li.assignee,
    li."defaultMethodType",
    li."sourcingType",
    li.description,
    li."itemTrackingType",
    li.name,
    li."replenishmentSystem",
    li."unitOfMeasureCode",
    li.notes,
    li.revision,
    li."readableId",
    li."readableIdWithRevision",
    li.id,
    li."companyId",
        CASE
            WHEN ((li."thumbnailPath" IS NULL) AND (li."modelThumbnailPath" IS NOT NULL)) THEN li."modelThumbnailPath"
            ELSE li."thumbnailPath"
        END AS "thumbnailPath",
    li."modelPath",
    li."modelName",
    li."modelSize",
    ps."supplierIds",
    uom.name AS "unitOfMeasure",
    ir.revisions,
    t."customFields",
    t.tags,
    ic."itemPostingGroupId",
    ( SELECT COALESCE(jsonb_object_agg(eim.integration,
                CASE
                    WHEN (eim.metadata IS NOT NULL) THEN eim.metadata
                    ELSE to_jsonb(eim."externalId")
                END) FILTER (WHERE ((eim."externalId" IS NOT NULL) OR (eim.metadata IS NOT NULL))), '{}'::jsonb) AS "coalesce"
           FROM "externalIntegrationMapping" eim
          WHERE ((eim."entityType" = 'item'::text) AND (eim."entityId" = li.id))) AS "externalId",
    li."createdBy",
    li."createdAt",
    li."updatedBy",
    li."updatedAt"
   FROM (((((tool t
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "deletedAt", "deletedBy", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON (((li."readableId" = t.id) AND (li."companyId" = t."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = t.id) AND (ir."companyId" = li."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = li.id) AND (ps."companyId" = li."companyId"))))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = li."unitOfMeasureCode") AND (uom."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)));


create or replace view "public"."userDefaults" as  SELECT u.id AS "userId",
    l."companyId",
    ej."locationId"
   FROM (("user" u
     LEFT JOIN "employeeJob" ej ON ((ej.id = u.id)))
     LEFT JOIN location l ON (((l.id = ej."locationId") AND (l."companyId" = ej."companyId"))));


create or replace view "public"."workCenters" as  SELECT wc.id,
    wc.name,
    wc.description,
    wc."laborRate",
    wc."defaultStandardFactor",
    wc."locationId",
    wc."requiredAbilityId",
    wc.active,
    wc."companyId",
    wc."customFields",
    wc."createdBy",
    wc."createdAt",
    wc."updatedBy",
    wc."updatedAt",
    wc."machineRate",
    wc."overheadRate",
    wc.tags,
    wc."departmentId",
    l.name AS "locationName",
    d.name AS "departmentName",
    wcp.processes
   FROM ((("workCenter" wc
     LEFT JOIN location l ON ((wc."locationId" = l.id)))
     LEFT JOIN department d ON ((wc."departmentId" = d.id)))
     LEFT JOIN ( SELECT wcp_1."workCenterId",
            array_agg(wcp_1."processId") AS processes
           FROM ("workCenterProcess" wcp_1
             JOIN process p ON ((wcp_1."processId" = p.id)))
          GROUP BY wcp_1."workCenterId") wcp ON ((wc.id = wcp."workCenterId")));


create or replace view "public"."workCentersWithBlockingStatus" as  SELECT wc.id,
    wc.name,
    wc.description,
    wc."laborRate",
    wc."defaultStandardFactor",
    wc."locationId",
    wc."requiredAbilityId",
    wc.active,
    wc."companyId",
    wc."customFields",
    wc."createdBy",
    wc."createdAt",
    wc."updatedBy",
    wc."updatedAt",
    wc."machineRate",
    wc."overheadRate",
    wc.tags,
    wc."departmentId",
    l.name AS "locationName",
    COALESCE(( SELECT (count(*) > 0)
           FROM "maintenanceDispatch" md
          WHERE ((md."workCenterId" = wc.id) AND (md.status = 'In Progress'::"maintenanceDispatchStatus") AND (md."oeeImpact" = ANY (ARRAY['Down'::"oeeImpact", 'Planned'::"oeeImpact"])))), false) AS "isBlocked",
    ( SELECT md.id
           FROM "maintenanceDispatch" md
          WHERE ((md."workCenterId" = wc.id) AND (md.status = 'In Progress'::"maintenanceDispatchStatus") AND (md."oeeImpact" = ANY (ARRAY['Down'::"oeeImpact", 'Planned'::"oeeImpact"])))
          ORDER BY md."createdAt" DESC
         LIMIT 1) AS "blockingDispatchId",
    ( SELECT md."maintenanceDispatchId"
           FROM "maintenanceDispatch" md
          WHERE ((md."workCenterId" = wc.id) AND (md.status = 'In Progress'::"maintenanceDispatchStatus") AND (md."oeeImpact" = ANY (ARRAY['Down'::"oeeImpact", 'Planned'::"oeeImpact"])))
          ORDER BY md."createdAt" DESC
         LIMIT 1) AS "blockingDispatchReadableId"
   FROM ("workCenter" wc
     LEFT JOIN location l ON ((wc."locationId" = l.id)));


create or replace view "public"."styleSamples" as  SELECT s.active,
    s.assignee,
    s."defaultMethodType",
    s."sourcingType",
    s.description,
    s."itemTrackingType",
    s.name,
    s."replenishmentSystem",
    s."unitOfMeasureCode",
    s.notes,
    s.revision,
    s."readableId",
    s."readableIdWithRevision",
    s.id,
    s."companyId",
    s."thumbnailPath",
    s."attributeSetId",
    s.attributes,
    s."attributeCodes",
    s.revisions,
    s."customFields",
    s.tags,
    s."itemPostingGroupId",
    s."createdBy",
    s."createdAt",
    s."updatedBy",
    s."updatedAt",
    ss."itemId" AS "sampleItemId",
    COALESCE(te."sampleCount", (0)::bigint) AS "sampleCount",
    COALESCE(te."sampledVariantCount", (0)::bigint) AS "sampledVariantCount",
    COALESCE(te.samples, '[]'::json) AS samples
   FROM ((styles s
     LEFT JOIN "styleSample" ss ON (((ss."styleId" = s."readableId") AND (ss."companyId" = s."companyId"))))
     LEFT JOIN LATERAL ( SELECT sum(g.qty) AS "sampleCount",
            count(*) AS "sampledVariantCount",
            json_agg(json_build_object('label', g.label, 'attributes', g.attributes, 'quantity', g.qty) ORDER BY g.label) AS samples
           FROM ( SELECT pa."productAttributes" AS attributes,
                    COALESCE(( SELECT string_agg(kv.value, ' · '::text ORDER BY kv.key) AS string_agg
                           FROM jsonb_each_text(pa."productAttributes") kv(key, value)), ''::text) AS label,
                    (count(*))::integer AS qty
                   FROM ("trackedEntity" t
                     CROSS JOIN LATERAL ( SELECT COALESCE(( SELECT jsonb_object_agg(kv.key, to_jsonb(kv.value)) AS jsonb_object_agg
                                   FROM jsonb_each_text(COALESCE(t.attributes, '{}'::jsonb)) kv(key, value)
                                  WHERE (EXISTS ( SELECT 1
   FROM "itemAttribute" ia
  WHERE ((ia.code = kv.key) AND ((ia."companyId" = t."companyId") OR (ia."companyId" IS NULL)))))), '{}'::jsonb) AS "productAttributes") pa)
                  WHERE ((t."sourceDocument" = 'Item'::text) AND (t."sourceDocumentId" = ss."itemId") AND (t."companyId" = s."companyId") AND (pa."productAttributes" <> '{}'::jsonb))
                  GROUP BY pa."productAttributes") g) te ON (true));


create policy "DELETE"
on "public"."bundle"
as permissive
for delete
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_delete'::text) AS get_companies_with_employee_permission)::text[])));


create policy "INSERT"
on "public"."bundle"
as permissive
for insert
to public
with check (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_create'::text) AS get_companies_with_employee_permission)::text[])));


create policy "SELECT"
on "public"."bundle"
as permissive
for select
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_role() AS get_companies_with_employee_role)::text[])));


create policy "UPDATE"
on "public"."bundle"
as permissive
for update
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_update'::text) AS get_companies_with_employee_permission)::text[])));


create policy "DELETE"
on "public"."bundleAllocation"
as permissive
for delete
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_delete'::text) AS get_companies_with_employee_permission)::text[])));


create policy "INSERT"
on "public"."bundleAllocation"
as permissive
for insert
to public
with check (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_create'::text) AS get_companies_with_employee_permission)::text[])));


create policy "SELECT"
on "public"."bundleAllocation"
as permissive
for select
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_role() AS get_companies_with_employee_role)::text[])));


create policy "UPDATE"
on "public"."bundleAllocation"
as permissive
for update
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_update'::text) AS get_companies_with_employee_permission)::text[])));


create policy "SELECT"
on "public"."notification"
as permissive
for select
to public
using (("userId" = (auth.uid())::text));


create policy "UPDATE"
on "public"."notification"
as permissive
for update
to public
using (("userId" = (auth.uid())::text));


create policy "DELETE"
on "public"."productionQuantitySplitRow"
as permissive
for delete
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_delete'::text) AS get_companies_with_employee_permission)::text[])));


create policy "INSERT"
on "public"."productionQuantitySplitRow"
as permissive
for insert
to public
with check (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_create'::text) AS get_companies_with_employee_permission)::text[])));


create policy "SELECT"
on "public"."productionQuantitySplitRow"
as permissive
for select
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_role() AS get_companies_with_employee_role)::text[])));


create policy "UPDATE"
on "public"."productionQuantitySplitRow"
as permissive
for update
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_update'::text) AS get_companies_with_employee_permission)::text[])));


create policy "DELETE"
on "public"."splitBatch"
as permissive
for delete
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_delete'::text) AS get_companies_with_employee_permission)::text[])));


create policy "INSERT"
on "public"."splitBatch"
as permissive
for insert
to public
with check (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_create'::text) AS get_companies_with_employee_permission)::text[])));


create policy "SELECT"
on "public"."splitBatch"
as permissive
for select
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_role() AS get_companies_with_employee_role)::text[])));


create policy "UPDATE"
on "public"."splitBatch"
as permissive
for update
to public
using (("companyId" = ANY (( SELECT get_companies_with_employee_permission('production_update'::text) AS get_companies_with_employee_permission)::text[])));



