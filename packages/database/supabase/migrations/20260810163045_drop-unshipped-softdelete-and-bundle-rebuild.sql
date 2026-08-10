-- Drop unshipped dev-only drift so every environment matches the committed schema.
--
-- Two features were built on the dev database but never shipped or wired into the
-- app, and were never captured as migrations:
--   * a global soft-delete feature: deletedAt/deletedBy on ~110 tables, the
--     is_visible() helper, and WHERE-filters baked into ~two dozen views;
--   * an unfinished bundle rebuild: bundle / splitBatch / bundleAllocation /
--     productionQuantitySplitRow tables + bundleStatus / splitBatchStatus enums.
-- (The live bundle workflow uses bundleWorkOrder / masterWorkOrderSplitRow, which
-- are variant-keyed and untouched here.)
--
-- This migration removes both. It is idempotent (IF EXISTS / CASCADE) so it is a
-- clean no-op on databases that never received the drift (prod, fresh local), and
-- fully removes it from those that did (dev, staging). The affected views are
-- recreated to their committed, soft-delete-free definitions.





























































































drop function if exists "public"."is_visible"(deleted_at timestamp with time zone);

drop view if exists "public"."accounts";

drop view if exists "public"."activeMaintenanceDispatchesByLocation";

drop view if exists "public"."approvalRequests";

drop view if exists "public"."bundleWorkOrders";

drop view if exists "public"."companies";

drop view if exists "public"."consumables";

drop view if exists "public"."contractors";

drop view if exists "public"."customFieldTables";

drop view if exists "public"."customers";

drop view if exists "public"."documentExtensions";

drop view if exists "public"."documents";

drop view if exists "public"."employeeProcesses";

drop view if exists "public"."employeeSalaryRecords";

drop view if exists "public"."employeeSummary";

drop view if exists "public"."employees";

drop view if exists "public"."gaugeCalibrationRecords";

drop view if exists "public"."gauges";

drop view if exists "public"."groups";

drop view if exists "public"."groups_recursive";

drop view if exists "public"."holidayYears";

drop view if exists "public"."inspectionDocuments";

drop view if exists "public"."integrations";

drop view if exists "public"."issues";

drop view if exists "public"."jobAssignmentRules";

drop view if exists "public"."jobMaterialWithMakeMethodId";

drop view if exists "public"."jobOperationsWithDependencies";

drop view if exists "public"."jobOperationsWithMakeMethods";

drop view if exists "public"."jobs";

drop view if exists "public"."journalEntries";

drop view if exists "public"."kanbans";

drop view if exists "public"."locations";

drop view if exists "public"."maintenanceSchedules";

drop view if exists "public"."masterWorkOrders";

drop view if exists "public"."materialDimensions";

drop view if exists "public"."materialFinishes";

drop view if exists "public"."materialGrades";

drop view if exists "public"."materialTypes";

drop view if exists "public"."materials";

drop view if exists "public"."openJobMaterialLines";

drop view if exists "public"."openProductionOrders";

drop view if exists "public"."openPurchaseOrderLines";

drop view if exists "public"."openSalesOrderLines";

drop view if exists "public"."partners";

drop view if exists "public"."parts";

drop view if exists "public"."pickingLists";

drop view if exists "public"."procedures";

drop view if exists "public"."processes";

drop view if exists "public"."purchaseInvoiceLines";

drop view if exists "public"."purchaseInvoices";

drop view if exists "public"."purchaseOrderLines";

drop view if exists "public"."purchaseOrderLocations";

drop view if exists "public"."purchaseOrderSuppliers";

drop view if exists "public"."purchaseOrders";

drop view if exists "public"."purchasingRfqLines";

drop view if exists "public"."purchasingRfqs";

drop view if exists "public"."qualityActions";

drop view if exists "public"."qualityDocuments";

drop view if exists "public"."quoteCustomerDetails";

drop view if exists "public"."quoteLinePrices";

drop view if exists "public"."quoteLines";

drop view if exists "public"."quoteMaterialWithMakeMethodId";

drop view if exists "public"."quoteOperationsWithMakeMethods";

drop view if exists "public"."quotes";

drop view if exists "public"."receiptLines";

drop view if exists "public"."receipts";

drop view if exists "public"."riskRegisters";

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

drop view if exists "public"."suggestions";

drop view if exists "public"."supplierProcesses";

drop view if exists "public"."supplierQuoteLines";

drop view if exists "public"."supplierQuotes";

drop view if exists "public"."suppliers";

drop view if exists "public"."timeCardEntries";

drop view if exists "public"."tools";

drop view if exists "public"."trainings";

drop view if exists "public"."userDefaults";

drop view if exists "public"."workCenters";

drop view if exists "public"."workCentersWithBlockingStatus";

drop view if exists "public"."groupMembers";




















































drop index if exists "public"."ability_not_deleted_companyId_idx";

drop index if exists "public"."address_not_deleted_companyId_idx";

drop index if exists "public"."apiKey_not_deleted_companyId_idx";

drop index if exists "public"."batchProperty_not_deleted_companyId_idx";











drop index if exists "public"."configurationParameterGroup_not_deleted_companyId_idx";

drop index if exists "public"."configurationParameter_not_deleted_companyId_idx";

drop index if exists "public"."contractor_not_deleted_companyId_idx";

drop index if exists "public"."costCenter_not_deleted_companyId_idx";

drop index if exists "public"."customField_not_deleted_companyId_idx";

drop index if exists "public"."customerStatus_not_deleted_companyId_idx";

drop index if exists "public"."customerType_not_deleted_companyId_idx";

drop index if exists "public"."customer_not_deleted_companyId_idx";

drop index if exists "public"."department_not_deleted_companyId_idx";

drop index if exists "public"."document_not_deleted_companyId_idx";

drop index if exists "public"."externalLink_not_deleted_companyId_idx";

drop index if exists "public"."gaugeType_not_deleted_companyId_idx";

drop index if exists "public"."gauge_not_deleted_companyId_idx";

drop index if exists "public"."group_not_deleted_companyId_idx";

drop index if exists "public"."holiday_not_deleted_companyId_idx";

drop index if exists "public"."itemPostingGroup_not_deleted_companyId_idx";

drop index if exists "public"."itemRule_not_deleted_companyId_idx";

drop index if exists "public"."itemShelfLife_not_deleted_companyId_idx";

drop index if exists "public"."item_not_deleted_companyId_idx";

drop index if exists "public"."jobAssignmentRule_not_deleted_companyId_idx";

drop index if exists "public"."jobMaterial_not_deleted_companyId_idx";

drop index if exists "public"."jobOperationParameter_not_deleted_companyId_idx";

drop index if exists "public"."jobOperationPickup_not_deleted_companyId_idx";

drop index if exists "public"."jobOperationStep_not_deleted_companyId_idx";

drop index if exists "public"."jobOperationTool_not_deleted_companyId_idx";

drop index if exists "public"."jobOperation_not_deleted_companyId_idx";

drop index if exists "public"."job_not_deleted_companyId_idx";

drop index if exists "public"."journalLine_not_deleted_companyId_idx";

drop index if exists "public"."journal_not_deleted_companyId_idx";

drop index if exists "public"."kanban_not_deleted_companyId_idx";

drop index if exists "public"."location_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceDispatchComment_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceDispatchEvent_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceDispatchItem_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceDispatch_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceFailureMode_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceScheduleItem_not_deleted_companyId_idx";

drop index if exists "public"."maintenanceSchedule_not_deleted_companyId_idx";

drop index if exists "public"."materialDimension_not_deleted_companyId_idx";

drop index if exists "public"."materialFinish_not_deleted_companyId_idx";

drop index if exists "public"."materialForm_not_deleted_companyId_idx";

drop index if exists "public"."materialGrade_not_deleted_companyId_idx";

drop index if exists "public"."materialSubstance_not_deleted_companyId_idx";

drop index if exists "public"."materialType_not_deleted_companyId_idx";

drop index if exists "public"."methodMaterial_not_deleted_companyId_idx";

drop index if exists "public"."methodOperationParameter_not_deleted_companyId_idx";

drop index if exists "public"."methodOperationStep_not_deleted_companyId_idx";

drop index if exists "public"."methodOperationTool_not_deleted_companyId_idx";

drop index if exists "public"."methodOperation_not_deleted_companyId_idx";

drop index if exists "public"."noQuoteReason_not_deleted_companyId_idx";

drop index if exists "public"."nonConformance_not_deleted_companyId_idx";

drop index if exists "public"."partner_not_deleted_companyId_idx";

drop index if exists "public"."pricingRule_not_deleted_companyId_idx";

drop index if exists "public"."procedure_not_deleted_companyId_idx";

drop index if exists "public"."process_not_deleted_companyId_idx";

drop index if exists "public"."productionEvent_not_deleted_companyId_idx";









drop index if exists "public"."purchaseInvoice_not_deleted_companyId_idx";

drop index if exists "public"."purchaseOrder_not_deleted_companyId_idx";

drop index if exists "public"."purchasingRfq_not_deleted_companyId_idx";

drop index if exists "public"."qualityDocument_not_deleted_companyId_idx";

drop index if exists "public"."quoteLine_not_deleted_companyId_idx";

drop index if exists "public"."quoteMakeMethod_not_deleted_companyId_idx";

drop index if exists "public"."quoteMaterial_not_deleted_companyId_idx";

drop index if exists "public"."quoteOperationParameter_not_deleted_companyId_idx";

drop index if exists "public"."quoteOperationStep_not_deleted_companyId_idx";

drop index if exists "public"."quoteOperationTool_not_deleted_companyId_idx";

drop index if exists "public"."quoteOperation_not_deleted_companyId_idx";

drop index if exists "public"."quote_not_deleted_companyId_idx";

drop index if exists "public"."receiptLine_not_deleted_companyId_idx";

drop index if exists "public"."receipt_not_deleted_companyId_idx";

drop index if exists "public"."riskRegister_not_deleted_companyId_idx";

drop index if exists "public"."salesInvoiceLine_not_deleted_companyId_idx";

drop index if exists "public"."salesInvoice_not_deleted_companyId_idx";

drop index if exists "public"."salesOrderLine_not_deleted_companyId_idx";

drop index if exists "public"."salesOrder_not_deleted_companyId_idx";

drop index if exists "public"."salesRfqLine_not_deleted_companyId_idx";

drop index if exists "public"."salesRfq_not_deleted_companyId_idx";

drop index if exists "public"."scrapReason_not_deleted_companyId_idx";












































































































































































































































drop index if exists "public"."shipmentLine_not_deleted_companyId_idx";

drop index if exists "public"."shipment_not_deleted_companyId_idx";






drop index if exists "public"."stockTransfer_not_deleted_companyId_idx";

drop index if exists "public"."storageType_not_deleted_companyId_idx";

drop index if exists "public"."storageUnit_not_deleted_companyId_idx";

drop index if exists "public"."suggestion_not_deleted_companyId_idx";

drop index if exists "public"."supplierQuoteLine_not_deleted_companyId_idx";

drop index if exists "public"."supplierQuote_not_deleted_companyId_idx";

drop index if exists "public"."supplierType_not_deleted_companyId_idx";

drop index if exists "public"."supplier_not_deleted_companyId_idx";

drop index if exists "public"."tableView_not_deleted_companyId_idx";

drop index if exists "public"."templateConfigurationParameter_not_deleted_companyId_idx";

drop index if exists "public"."templateMethodMaterial_not_deleted_companyId_idx";

drop index if exists "public"."templateMethodOperationParameter_not_deleted_companyId_idx";

drop index if exists "public"."templateMethodOperationStep_not_deleted_companyId_idx";

drop index if exists "public"."templateMethodOperationTool_not_deleted_companyId_idx";

drop index if exists "public"."templateMethodOperation_not_deleted_companyId_idx";

drop index if exists "public"."timeCardEntry_not_deleted_companyId_idx";

drop index if exists "public"."trainingAssignment_not_deleted_companyId_idx";

drop index if exists "public"."training_not_deleted_companyId_idx";

drop index if exists "public"."unitOfMeasure_not_deleted_companyId_idx";

drop index if exists "public"."warehouseTransferLine_not_deleted_companyId_idx";

drop index if exists "public"."warehouseTransfer_not_deleted_companyId_idx";

drop index if exists "public"."webhook_not_deleted_companyId_idx";

drop table if exists "public"."bundle" cascade;

drop table if exists "public"."bundleAllocation" cascade;

drop table if exists "public"."productionQuantitySplitRow" cascade;
















































drop table if exists "public"."splitBatch" cascade;


































alter table "public"."ability" drop column if exists "deletedAt";

alter table "public"."ability" drop column if exists "deletedBy";

alter table "public"."account" drop column if exists "deletedAt";

alter table "public"."account" drop column if exists "deletedBy";

alter table "public"."address" drop column if exists "deletedAt";

alter table "public"."address" drop column if exists "deletedBy";

alter table "public"."apiKey" drop column if exists "deletedAt";

alter table "public"."apiKey" drop column if exists "deletedBy";

alter table "public"."batchProperty" drop column if exists "deletedAt";

alter table "public"."batchProperty" drop column if exists "deletedBy";

alter table "public"."company" drop column if exists "deletedAt";

alter table "public"."company" drop column if exists "deletedBy";

alter table "public"."configurationParameter" drop column if exists "deletedAt";

alter table "public"."configurationParameter" drop column if exists "deletedBy";

alter table "public"."configurationParameterGroup" drop column if exists "deletedAt";

alter table "public"."configurationParameterGroup" drop column if exists "deletedBy";

alter table "public"."contractor" drop column if exists "deletedAt";

alter table "public"."contractor" drop column if exists "deletedBy";

alter table "public"."costCenter" drop column if exists "deletedAt";

alter table "public"."costCenter" drop column if exists "deletedBy";

alter table "public"."customField" drop column if exists "deletedAt";

alter table "public"."customField" drop column if exists "deletedBy";

alter table "public"."customer" drop column if exists "deletedAt";

alter table "public"."customer" drop column if exists "deletedBy";

alter table "public"."customerStatus" drop column if exists "deletedAt";

alter table "public"."customerStatus" drop column if exists "deletedBy";

alter table "public"."customerType" drop column if exists "deletedAt";

alter table "public"."customerType" drop column if exists "deletedBy";

alter table "public"."department" drop column if exists "deletedAt";

alter table "public"."department" drop column if exists "deletedBy";

alter table "public"."document" drop column if exists "deletedAt";

alter table "public"."document" drop column if exists "deletedBy";

alter table "public"."externalLink" drop column if exists "deletedAt";

alter table "public"."externalLink" drop column if exists "deletedBy";

alter table "public"."gauge" drop column if exists "deletedAt";

alter table "public"."gauge" drop column if exists "deletedBy";

alter table "public"."gaugeType" drop column if exists "deletedAt";

alter table "public"."gaugeType" drop column if exists "deletedBy";

alter table "public"."group" drop column if exists "deletedAt";

alter table "public"."group" drop column if exists "deletedBy";

alter table "public"."holiday" drop column if exists "deletedAt";

alter table "public"."holiday" drop column if exists "deletedBy";

alter table "public"."inviteLink" drop column if exists "loginMethods";

alter table "public"."item" drop column if exists "deletedAt";

alter table "public"."item" drop column if exists "deletedBy";

alter table "public"."itemPostingGroup" drop column if exists "deletedAt";

alter table "public"."itemPostingGroup" drop column if exists "deletedBy";

alter table "public"."itemShelfLife" drop column if exists "deletedAt";

alter table "public"."itemShelfLife" drop column if exists "deletedBy";

alter table "public"."job" drop column if exists "deletedAt";

alter table "public"."job" drop column if exists "deletedBy";

alter table "public"."jobAssignmentRule" drop column if exists "deletedAt";

alter table "public"."jobAssignmentRule" drop column if exists "deletedBy";

alter table "public"."jobMaterial" drop column if exists "deletedAt";

alter table "public"."jobMaterial" drop column if exists "deletedBy";

alter table "public"."jobOperation" drop column if exists "deletedAt";

alter table "public"."jobOperation" drop column if exists "deletedBy";

alter table "public"."jobOperationParameter" drop column if exists "deletedAt";

alter table "public"."jobOperationParameter" drop column if exists "deletedBy";

alter table "public"."jobOperationPickup" drop column if exists "deletedAt";

alter table "public"."jobOperationPickup" drop column if exists "deletedBy";

alter table "public"."jobOperationStep" drop column if exists "deletedAt";

alter table "public"."jobOperationStep" drop column if exists "deletedBy";

alter table "public"."jobOperationTool" drop column if exists "deletedAt";

alter table "public"."jobOperationTool" drop column if exists "deletedBy";

alter table "public"."journal" drop column if exists "deletedAt";

alter table "public"."journal" drop column if exists "deletedBy";

alter table "public"."journalLine" drop column if exists "deletedAt";

alter table "public"."journalLine" drop column if exists "deletedBy";

alter table "public"."kanban" drop column if exists "deletedAt";

alter table "public"."kanban" drop column if exists "deletedBy";

alter table "public"."location" drop column if exists "deletedAt";

alter table "public"."location" drop column if exists "deletedBy";

alter table "public"."maintenanceDispatch" drop column if exists "deletedAt";

alter table "public"."maintenanceDispatch" drop column if exists "deletedBy";

alter table "public"."maintenanceDispatchComment" drop column if exists "deletedAt";

alter table "public"."maintenanceDispatchComment" drop column if exists "deletedBy";

alter table "public"."maintenanceDispatchEvent" drop column if exists "deletedAt";

alter table "public"."maintenanceDispatchEvent" drop column if exists "deletedBy";

alter table "public"."maintenanceDispatchItem" drop column if exists "deletedAt";

alter table "public"."maintenanceDispatchItem" drop column if exists "deletedBy";

alter table "public"."maintenanceFailureMode" drop column if exists "deletedAt";

alter table "public"."maintenanceFailureMode" drop column if exists "deletedBy";

alter table "public"."maintenanceSchedule" drop column if exists "deletedAt";

alter table "public"."maintenanceSchedule" drop column if exists "deletedBy";

alter table "public"."maintenanceScheduleItem" drop column if exists "deletedAt";

alter table "public"."maintenanceScheduleItem" drop column if exists "deletedBy";

alter table "public"."materialDimension" drop column if exists "deletedAt";

alter table "public"."materialDimension" drop column if exists "deletedBy";

alter table "public"."materialFinish" drop column if exists "deletedAt";

alter table "public"."materialFinish" drop column if exists "deletedBy";

alter table "public"."materialForm" drop column if exists "deletedAt";

alter table "public"."materialForm" drop column if exists "deletedBy";

alter table "public"."materialGrade" drop column if exists "deletedAt";

alter table "public"."materialGrade" drop column if exists "deletedBy";

alter table "public"."materialSubstance" drop column if exists "deletedAt";

alter table "public"."materialSubstance" drop column if exists "deletedBy";

alter table "public"."materialType" drop column if exists "deletedAt";

alter table "public"."materialType" drop column if exists "deletedBy";

alter table "public"."methodMaterial" drop column if exists "deletedAt";

alter table "public"."methodMaterial" drop column if exists "deletedBy";

alter table "public"."methodOperation" drop column if exists "deletedAt";

alter table "public"."methodOperation" drop column if exists "deletedBy";

alter table "public"."methodOperationParameter" drop column if exists "deletedAt";

alter table "public"."methodOperationParameter" drop column if exists "deletedBy";

alter table "public"."methodOperationStep" drop column if exists "deletedAt";

alter table "public"."methodOperationStep" drop column if exists "deletedBy";

alter table "public"."methodOperationTool" drop column if exists "deletedAt";

alter table "public"."methodOperationTool" drop column if exists "deletedBy";

alter table "public"."noQuoteReason" drop column if exists "deletedAt";

alter table "public"."noQuoteReason" drop column if exists "deletedBy";

alter table "public"."nonConformance" drop column if exists "deletedAt";

alter table "public"."nonConformance" drop column if exists "deletedBy";

alter table "public"."partner" drop column if exists "deletedAt";

alter table "public"."partner" drop column if exists "deletedBy";

alter table "public"."pricingRule" drop column if exists "deletedAt";

alter table "public"."pricingRule" drop column if exists "deletedBy";

alter table "public"."procedure" drop column if exists "deletedAt";

alter table "public"."procedure" drop column if exists "deletedBy";

alter table "public"."process" drop column if exists "deletedAt";

alter table "public"."process" drop column if exists "deletedBy";

alter table "public"."productionEvent" drop column if exists "deletedAt";

alter table "public"."productionEvent" drop column if exists "deletedBy";

alter table "public"."productionQuantity" alter column "reportId" set not null;

alter table "public"."purchaseInvoice" drop column if exists "deletedAt";

alter table "public"."purchaseInvoice" drop column if exists "deletedBy";

alter table "public"."purchaseOrder" drop column if exists "deletedAt";

alter table "public"."purchaseOrder" drop column if exists "deletedBy";

alter table "public"."purchasingRfq" drop column if exists "deletedAt";

alter table "public"."purchasingRfq" drop column if exists "deletedBy";

alter table "public"."qualityDocument" drop column if exists "deletedAt";

alter table "public"."qualityDocument" drop column if exists "deletedBy";

alter table "public"."quote" drop column if exists "deletedAt";

alter table "public"."quote" drop column if exists "deletedBy";

alter table "public"."quoteLine" drop column if exists "deletedAt";

alter table "public"."quoteLine" drop column if exists "deletedBy";

alter table "public"."quoteLinePrice" drop column if exists "deletedAt";

alter table "public"."quoteLinePrice" drop column if exists "deletedBy";

alter table "public"."quoteMakeMethod" drop column if exists "deletedAt";

alter table "public"."quoteMakeMethod" drop column if exists "deletedBy";

alter table "public"."quoteMaterial" drop column if exists "deletedAt";

alter table "public"."quoteMaterial" drop column if exists "deletedBy";

alter table "public"."quoteOperation" drop column if exists "deletedAt";

alter table "public"."quoteOperation" drop column if exists "deletedBy";

alter table "public"."quoteOperationParameter" drop column if exists "deletedAt";

alter table "public"."quoteOperationParameter" drop column if exists "deletedBy";

alter table "public"."quoteOperationStep" drop column if exists "deletedAt";

alter table "public"."quoteOperationStep" drop column if exists "deletedBy";

alter table "public"."quoteOperationTool" drop column if exists "deletedAt";

alter table "public"."quoteOperationTool" drop column if exists "deletedBy";

alter table "public"."receipt" drop column if exists "deletedAt";

alter table "public"."receipt" drop column if exists "deletedBy";

alter table "public"."receiptLine" drop column if exists "deletedAt";

alter table "public"."receiptLine" drop column if exists "deletedBy";

alter table "public"."riskRegister" drop column if exists "deletedAt";

alter table "public"."riskRegister" drop column if exists "deletedBy";

alter table "public"."salesInvoice" drop column if exists "deletedAt";

alter table "public"."salesInvoice" drop column if exists "deletedBy";

alter table "public"."salesInvoiceLine" drop column if exists "deletedAt";

alter table "public"."salesInvoiceLine" drop column if exists "deletedBy";

alter table "public"."salesOrder" drop column if exists "deletedAt";

alter table "public"."salesOrder" drop column if exists "deletedBy";

alter table "public"."salesOrderLine" drop column if exists "deletedAt";

alter table "public"."salesOrderLine" drop column if exists "deletedBy";

alter table "public"."salesRfq" drop column if exists "deletedAt";

alter table "public"."salesRfq" drop column if exists "deletedBy";

alter table "public"."salesRfqLine" drop column if exists "deletedAt";

alter table "public"."salesRfqLine" drop column if exists "deletedBy";

alter table "public"."scrapReason" drop column if exists "deletedAt";

alter table "public"."scrapReason" drop column if exists "deletedBy";

alter table "public"."shipment" drop column if exists "deletedAt";

alter table "public"."shipment" drop column if exists "deletedBy";

alter table "public"."shipmentLine" drop column if exists "deletedAt";

alter table "public"."shipmentLine" drop column if exists "deletedBy";

alter table "public"."stockTransfer" drop column if exists "deletedAt";

alter table "public"."stockTransfer" drop column if exists "deletedBy";

alter table "public"."storageRule" drop column if exists "deletedAt";

alter table "public"."storageRule" drop column if exists "deletedBy";

alter table "public"."storageType" drop column if exists "deletedAt";

alter table "public"."storageType" drop column if exists "deletedBy";

alter table "public"."storageUnit" drop column if exists "deletedAt";

alter table "public"."storageUnit" drop column if exists "deletedBy";

alter table "public"."suggestion" drop column if exists "deletedAt";

alter table "public"."suggestion" drop column if exists "deletedBy";

alter table "public"."supplier" drop column if exists "deletedAt";

alter table "public"."supplier" drop column if exists "deletedBy";

alter table "public"."supplierQuote" drop column if exists "deletedAt";

alter table "public"."supplierQuote" drop column if exists "deletedBy";

alter table "public"."supplierQuoteLine" drop column if exists "deletedAt";

alter table "public"."supplierQuoteLine" drop column if exists "deletedBy";

alter table "public"."supplierType" drop column if exists "deletedAt";

alter table "public"."supplierType" drop column if exists "deletedBy";

alter table "public"."tableView" drop column if exists "deletedAt";

alter table "public"."tableView" drop column if exists "deletedBy";

alter table "public"."templateConfigurationParameter" drop column if exists "deletedAt";

alter table "public"."templateConfigurationParameter" drop column if exists "deletedBy";

alter table "public"."templateMethodMaterial" drop column if exists "deletedAt";

alter table "public"."templateMethodMaterial" drop column if exists "deletedBy";

alter table "public"."templateMethodOperation" drop column if exists "deletedAt";

alter table "public"."templateMethodOperation" drop column if exists "deletedBy";

alter table "public"."templateMethodOperationParameter" drop column if exists "deletedAt";

alter table "public"."templateMethodOperationParameter" drop column if exists "deletedBy";

alter table "public"."templateMethodOperationStep" drop column if exists "deletedAt";

alter table "public"."templateMethodOperationStep" drop column if exists "deletedBy";

alter table "public"."templateMethodOperationTool" drop column if exists "deletedAt";

alter table "public"."templateMethodOperationTool" drop column if exists "deletedBy";

alter table "public"."timeCardEntry" drop column if exists "deletedAt";

alter table "public"."timeCardEntry" drop column if exists "deletedBy";

alter table "public"."training" drop column if exists "deletedAt";

alter table "public"."training" drop column if exists "deletedBy";

alter table "public"."trainingAssignment" drop column if exists "deletedAt";

alter table "public"."trainingAssignment" drop column if exists "deletedBy";

alter table "public"."unitOfMeasure" drop column if exists "deletedAt";

alter table "public"."unitOfMeasure" drop column if exists "deletedBy";

alter table "public"."warehouseTransfer" drop column if exists "deletedAt";

alter table "public"."warehouseTransfer" drop column if exists "deletedBy";

alter table "public"."warehouseTransferLine" drop column if exists "deletedAt";

alter table "public"."warehouseTransferLine" drop column if exists "deletedBy";

alter table "public"."webhook" drop column if exists "deletedAt";

alter table "public"."webhook" drop column if exists "deletedBy";

drop type if exists "public"."bundleStatus";

drop type if exists "public"."splitBatchStatus";














































































set check_function_bodies = off;

create or replace view "public"."accounts" as  SELECT id,
    number,
    name,
    class,
    "incomeBalance",
    "consolidatedRate",
    active,
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
    "customFields",
    tags,
    "companyGroupId",
    "parentId",
    "isGroup",
    "accountType",
    "isSystem"
   FROM account;


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


create or replace view "public"."documentExtensions" as  SELECT DISTINCT extension
   FROM document;


create or replace view "public"."documents" as  SELECT d.id,
    d.path,
    d.name,
    d.description,
    d.size,
    d.extension,
    d.type,
    d."readGroups",
    d."writeGroups",
    d.active,
    d."companyId",
    d."createdBy",
    d."createdAt",
    d."updatedBy",
    d."updatedAt",
    d."sourceDocument",
    d."sourceDocumentId",
    ARRAY( SELECT dl.label
           FROM "documentLabel" dl
          WHERE ((dl."documentId" = d.id) AND (dl."userId" = (auth.uid())::text))) AS labels,
    (EXISTS ( SELECT 1
           FROM "documentFavorite" df
          WHERE ((df."documentId" = d.id) AND (df."userId" = (auth.uid())::text)))) AS favorite,
    ( SELECT max(dt."createdAt") AS max
           FROM "documentTransaction" dt
          WHERE (dt."documentId" = d.id)) AS "lastActivityAt"
   FROM ((document d
     LEFT JOIN "user" u ON ((u.id = d."createdBy")))
     LEFT JOIN "user" u2 ON ((u2.id = d."updatedBy")));


create or replace view "public"."employeeProcesses" as  SELECT ep.id,
    ep."employeeId",
    ep."processId",
    ep."companyId",
    ep."createdBy",
    ep."createdAt",
    ep."updatedBy",
    ep."updatedAt",
    p.name AS "processName"
   FROM ("employeeProcess" ep
     JOIN process p ON ((ep."processId" = p.id)));


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


create or replace view "public"."gaugeCalibrationRecords" as  SELECT gcr.id,
    gcr."gaugeId",
    gcr."dateCalibrated",
    gcr."inspectionStatus",
    gcr."requiresAction",
    gcr."requiresAdjustment",
    gcr."requiresRepair",
    gcr.notes,
    gcr."customFields",
    gcr."companyId",
    gcr."createdAt",
    gcr."createdBy",
    gcr."updatedAt",
    gcr."updatedBy",
    gcr."supplierId",
    gcr.temperature,
    gcr.humidity,
    gcr."approvedBy",
    gcr."measurementStandard",
    gcr."calibrationAttempts",
    g."gaugeId" AS "gaugeReadableId",
    g."gaugeTypeId",
    g.description
   FROM ("gaugeCalibrationRecord" gcr
     JOIN gauge g ON ((gcr."gaugeId" = g.id)));


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
        CASE
            WHEN ("gaugeStatus" = 'Inactive'::"gaugeStatus") THEN 'Out-of-Calibration'::"gaugeCalibrationStatus"
            WHEN (("nextCalibrationDate" IS NOT NULL) AND ("nextCalibrationDate" < CURRENT_DATE)) THEN 'Out-of-Calibration'::"gaugeCalibrationStatus"
            ELSE "gaugeCalibrationStatus"
        END AS "gaugeCalibrationStatusWithDueDate"
   FROM gauge g;


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
INNER JOIN item ON material."itemId" = item.id
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
INNER JOIN item ON material."itemId" = item.id
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
INNER JOIN item ON material."itemId" = item.id
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
INNER JOIN item ON material."itemId" = item.id
ORDER BY "order"
$function$
;

create or replace view "public"."groupMembers" as  SELECT gm.id,
    g.name,
    g."companyId",
    g."isIdentityGroup",
    g."isEmployeeTypeGroup",
    g."isCustomerOrgGroup",
    g."isCustomerTypeGroup",
    g."isSupplierOrgGroup",
    g."isSupplierTypeGroup",
    gm."groupId",
    gm."memberGroupId",
    gm."memberUserId",
    to_jsonb(u.*) AS "user"
   FROM ((membership gm
     JOIN "group" g ON ((g.id = gm."groupId")))
     LEFT JOIN ( SELECT "user".id,
            "user".email,
            "user"."firstName",
            "user"."lastName",
            "user"."fullName",
            "user".about,
            "user"."avatarUrl",
            "user".active,
            "user"."createdAt",
            "user"."updatedAt"
           FROM "user"
          WHERE ("user".active = true)) u ON ((u.id = gm."memberUserId")));


create or replace view "public"."groups_recursive" as  WITH RECURSIVE groups_recursive("groupId", name, "companyId", "parentId", "isIdentityGroup", "isEmployeeTypeGroup", "isCustomerOrgGroup", "isCustomerTypeGroup", "isSupplierOrgGroup", "isSupplierTypeGroup", "user") AS (
         SELECT "groupMembers"."groupId",
            "groupMembers".name,
            "groupMembers"."companyId",
            NULL::text AS "parentId",
            "groupMembers"."isIdentityGroup",
            "groupMembers"."isEmployeeTypeGroup",
            "groupMembers"."isCustomerOrgGroup",
            "groupMembers"."isCustomerTypeGroup",
            "groupMembers"."isSupplierOrgGroup",
            "groupMembers"."isSupplierTypeGroup",
            "groupMembers"."user"
           FROM "groupMembers"
        UNION ALL
         SELECT g2."groupId",
            g2.name,
            g2."companyId",
            g1."groupId" AS "parentId",
            g1."isIdentityGroup",
            g2."isEmployeeTypeGroup",
            g2."isCustomerOrgGroup",
            g2."isCustomerTypeGroup",
            g2."isSupplierOrgGroup",
            g2."isSupplierTypeGroup",
            g2."user"
           FROM ("groupMembers" g1
             JOIN "groupMembers" g2 ON ((g1."memberGroupId" = g2."groupId")))
        )
 SELECT "groupId",
    name,
    "companyId",
    "parentId",
    "isIdentityGroup",
    "isEmployeeTypeGroup",
    "isCustomerOrgGroup",
    "isCustomerTypeGroup",
    "isSupplierOrgGroup",
    "isSupplierTypeGroup",
    "user"
   FROM groups_recursive;


create or replace view "public"."holidayYears" as  SELECT DISTINCT year,
    "companyId"
   FROM holiday;


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


create or replace view "public"."issues" as  SELECT ncr.id,
    ncr."nonConformanceId",
    ncr.name,
    ncr.description,
    ncr.source,
    ncr.status,
    ncr.priority,
    ncr."approvalRequirements",
    ncr."nonConformanceWorkflowId",
    ncr.content,
    ncr."locationId",
    ncr."nonConformanceTypeId",
    ncr."openDate",
    ncr."dueDate",
    ncr."closeDate",
    ncr.quantity,
    ncr.assignee,
    ncr."customFields",
    ncr.tags,
    ncr."companyId",
    ncr."createdAt",
    ncr."createdBy",
    ncr."updatedAt",
    ncr."updatedBy",
    ncr."requiredActionIds",
    nci.items,
        CASE
            WHEN (EXISTS ( SELECT 1
               FROM ("nonConformanceActionTask" ncat
                 JOIN "nonConformanceRequiredAction" ncra ON ((ncat."actionTypeId" = ncra.id)))
              WHERE ((ncat."nonConformanceId" = ncr.id) AND (ncra."systemType" = 'Containment'::"nonConformanceSystemActionType") AND (ncat.status = ANY (ARRAY['In Progress'::"nonConformanceTaskStatus", 'Completed'::"nonConformanceTaskStatus"]))))) THEN 'Contained'::text
            WHEN (EXISTS ( SELECT 1
               FROM ("nonConformanceActionTask" ncat
                 JOIN "nonConformanceRequiredAction" ncra ON ((ncat."actionTypeId" = ncra.id)))
              WHERE ((ncat."nonConformanceId" = ncr.id) AND (ncra."systemType" = 'Containment'::"nonConformanceSystemActionType")))) THEN 'Uncontained'::text
            ELSE 'N/A'::text
        END AS "containmentStatus"
   FROM ("nonConformance" ncr
     LEFT JOIN ( SELECT "nonConformanceItem"."nonConformanceId",
            array_agg("nonConformanceItem"."itemId") AS items
           FROM "nonConformanceItem"
          GROUP BY "nonConformanceItem"."nonConformanceId") nci ON ((nci."nonConformanceId" = ncr.id)));


create or replace view "public"."jobAssignmentRules" as  SELECT r.id,
    r."companyId",
    r.name,
    r.description,
    r.conditions,
    r."targetGroupId",
    r.priority,
    r.active,
    r."createdAt",
    r."createdBy",
    r."updatedAt",
    r."updatedBy",
    g.name AS "targetGroupName"
   FROM ("jobAssignmentRule" r
     LEFT JOIN "group" g ON ((g.id = r."targetGroupId")));


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
    s.name AS "storageUnitName",
    jmm.id AS "jobMaterialMakeMethodId",
    jmm.version,
    i."readableIdWithRevision" AS "itemReadableId",
    i."readableId" AS "itemReadableIdWithoutRevision"
   FROM ((("jobMaterial" jm
     LEFT JOIN "jobMakeMethod" jmm ON ((jmm."parentMaterialId" = jm.id)))
     LEFT JOIN "storageUnit" s ON ((s.id = jm."storageUnitId")))
     JOIN item i ON ((i.id = jm."itemId")));


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
    jmm.id AS "jobMakeMethodId",
    i.name,
    i."readableIdWithRevision" AS "itemReadableIdWithRevision",
    i.type AS "itemType",
    i.name AS description,
    i."itemTrackingType",
    i.active,
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
     LEFT JOIN location loc ON ((loc.id = j."locationId")));


create or replace view "public"."journalEntries" as  SELECT j.id,
    j.description,
    j."accountingPeriodId",
    j."companyId",
    j."postingDate",
    j."createdAt",
    j."customFields",
    j.tags,
    j."journalEntryId",
    j.status,
    j."sourceType",
    j."reversalOfId",
    j."reversedById",
    j."postedAt",
    j."postedBy",
    j."createdBy",
    j."updatedAt",
    j."updatedBy",
    COALESCE(sum(
        CASE
            WHEN ((a.class = ANY (ARRAY['Asset'::"glAccountClass", 'Expense'::"glAccountClass"])) AND (jl.amount > (0)::numeric)) THEN jl.amount
            WHEN ((a.class = ANY (ARRAY['Liability'::"glAccountClass", 'Equity'::"glAccountClass", 'Revenue'::"glAccountClass"])) AND (jl.amount < (0)::numeric)) THEN abs(jl.amount)
            ELSE (0)::numeric
        END), (0)::numeric) AS "totalDebits",
    COALESCE(sum(
        CASE
            WHEN ((a.class = ANY (ARRAY['Asset'::"glAccountClass", 'Expense'::"glAccountClass"])) AND (jl.amount < (0)::numeric)) THEN abs(jl.amount)
            WHEN ((a.class = ANY (ARRAY['Liability'::"glAccountClass", 'Equity'::"glAccountClass", 'Revenue'::"glAccountClass"])) AND (jl.amount > (0)::numeric)) THEN jl.amount
            ELSE (0)::numeric
        END), (0)::numeric) AS "totalCredits",
    (count(jl.id))::integer AS "lineCount"
   FROM ((journal j
     LEFT JOIN "journalLine" jl ON ((jl."journalId" = j.id)))
     LEFT JOIN account a ON ((a.id = jl."accountId")))
  GROUP BY j.id;


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


create or replace view "public"."materialDimensions" as  SELECT "materialDimension".id,
    "materialDimension"."materialFormId",
    "materialDimension".name,
    "materialDimension"."isMetric",
    "materialDimension"."companyId",
    "materialForm".name AS "formName"
   FROM ("materialDimension"
     LEFT JOIN "materialForm" ON (("materialDimension"."materialFormId" = "materialForm".id)));


create or replace view "public"."materialFinishes" as  SELECT "materialFinish".id,
    "materialFinish".name,
    "materialFinish"."materialSubstanceId",
    "materialFinish"."companyId",
    "materialSubstance".name AS "substanceName"
   FROM ("materialFinish"
     LEFT JOIN "materialSubstance" ON (("materialFinish"."materialSubstanceId" = "materialSubstance".id)));


create or replace view "public"."materialGrades" as  SELECT "materialGrade".id,
    "materialGrade"."materialSubstanceId",
    "materialGrade".name,
    "materialGrade"."companyId",
    "materialSubstance".name AS "substanceName"
   FROM ("materialGrade"
     LEFT JOIN "materialSubstance" ON (("materialGrade"."materialSubstanceId" = "materialSubstance".id)));


create or replace view "public"."materialTypes" as  SELECT "materialType".id,
    "materialType".name,
    "materialType"."materialSubstanceId",
    "materialType"."materialFormId",
    "materialType"."companyId",
    "materialSubstance".name AS "substanceName",
    "materialForm".name AS "formName"
   FROM (("materialType"
     LEFT JOIN "materialSubstance" ON (("materialType"."materialSubstanceId" = "materialSubstance".id)))
     LEFT JOIN "materialForm" ON (("materialType"."materialFormId" = "materialForm".id)));


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
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON (((li."readableId" = p.id) AND (li."companyId" = p."companyId"))))
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


create or replace view "public"."procedures" as  SELECT p1.id,
    p1.name,
    p1.version,
    p1.status,
    p1.assignee,
    p1."companyId",
    p1."processId",
    p1.tags,
    jsonb_agg(jsonb_build_object('id', p2.id, 'version', p2.version, 'status', p2.status)) AS versions
   FROM (procedure p1
     JOIN procedure p2 ON (((p1.name = p2.name) AND (p1."companyId" = p2."companyId"))))
  WHERE (p1.version = ( SELECT max(p3.version) AS max
           FROM procedure p3
          WHERE ((p3.name = p1.name) AND (p3."companyId" = p1."companyId"))))
  GROUP BY p1.id, p1.name, p1.version, p1.status, p1.assignee, p1."companyId", p1."processId", p1.tags;


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


create or replace view "public"."qualityActions" as  SELECT ncat.id,
    ncat."nonConformanceId",
    ncat.status,
    ncat."dueDate",
    ncat."completedDate",
    ncat.assignee,
    ncat.notes,
    ncat."sortOrder",
    ncat.tags,
    ncat."companyId",
    ncat."createdAt",
    ncat."createdBy",
    ncat."updatedAt",
    ncat."updatedBy",
    ncat."actionTypeId",
    ncra.name AS "actionType",
    ncr."nonConformanceId" AS "readableNonConformanceId",
    ncr.name AS "nonConformanceName",
    ncr.status AS "nonConformanceStatus",
    ncr."openDate" AS "nonConformanceOpenDate",
    ncr."dueDate" AS "nonConformanceDueDate",
    ncr."closeDate" AS "nonConformanceCloseDate",
    nct.name AS "nonConformanceTypeName",
    nci.items
   FROM (((("nonConformanceActionTask" ncat
     JOIN "nonConformance" ncr ON ((ncat."nonConformanceId" = ncr.id)))
     LEFT JOIN "nonConformanceRequiredAction" ncra ON ((ncra.id = ncat."actionTypeId")))
     LEFT JOIN "nonConformanceType" nct ON ((ncr."nonConformanceTypeId" = nct.id)))
     LEFT JOIN ( SELECT nci_1."nonConformanceId",
            array_agg(nci_1."itemId") AS items
           FROM "nonConformanceItem" nci_1
          GROUP BY nci_1."nonConformanceId") nci ON ((nci."nonConformanceId" = ncr.id)));


create or replace view "public"."qualityDocuments" as  SELECT p1.id,
    p1.name,
    p1.version,
    p1.status,
    p1.assignee,
    p1."companyId",
    jsonb_agg(jsonb_build_object('id', p2.id, 'version', p2.version, 'status', p2.status)) AS versions,
    p1.tags
   FROM ("qualityDocument" p1
     JOIN "qualityDocument" p2 ON (((p1.name = p2.name) AND (p1."companyId" = p2."companyId"))))
  WHERE (p1.version = ( SELECT max(p3.version) AS max
           FROM "qualityDocument" p3
          WHERE ((p3.name = p1.name) AND (p3."companyId" = p1."companyId"))))
  GROUP BY p1.id, p1.name, p1.version, p1.status, p1.assignee, p1."companyId";


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
    q."customerId"
   FROM (((((("quoteLine" ql
     JOIN quote q ON ((q.id = ql."quoteId")))
     LEFT JOIN "modelUpload" mu ON ((ql."modelUploadId" = mu.id)))
     JOIN item i ON ((i.id = ql."itemId")))
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


create or replace view "public"."quoteMaterialWithMakeMethodId" as  SELECT qm.id,
    qm."quoteId",
    qm."quoteLineId",
    qm."itemId",
    qm."itemType",
    qm."methodType",
    qm."order",
    qm.description,
    qm.quantity,
    qm."unitOfMeasureCode",
    qm."unitCost",
    qm."companyId",
    qm."createdAt",
    qm."createdBy",
    qm."updatedAt",
    qm."updatedBy",
    qm."customFields",
    qm."quoteMakeMethodId",
    qm."quoteOperationId",
    qm."scrapQuantity",
    qm.tags,
    qm."productionQuantity",
    qm.kit,
    qm."storageUnitId",
    qmm.id AS "quoteMaterialMakeMethodId",
    qmm.version
   FROM ("quoteMaterial" qm
     LEFT JOIN "quoteMakeMethod" qmm ON ((qmm."parentMaterialId" = qm.id)));


create or replace view "public"."quoteOperationsWithMakeMethods" as  SELECT mm.id AS "makeMethodId",
    qo.id,
    qo."quoteId",
    qo."quoteLineId",
    qo."quoteMakeMethodId",
    qo."order",
    qo.description,
    qo."operationOrder",
    qo."laborRate",
    qo."overheadRate",
    qo."companyId",
    qo."createdAt",
    qo."createdBy",
    qo."updatedAt",
    qo."updatedBy",
    qo."customFields",
    qo."processId",
    qo."workCenterId",
    qo."setupTime",
    qo."setupUnit",
    qo."laborTime",
    qo."laborUnit",
    qo."machineTime",
    qo."machineUnit",
    qo."machineRate",
    qo."operationType",
    qo."operationMinimumCost",
    qo."operationLeadTime",
    qo."operationUnitCost",
    qo."operationSupplierProcessId",
    qo."workInstruction",
    qo.tags,
    qo."procedureId"
   FROM (("quoteOperation" qo
     JOIN "quoteMakeMethod" qmm ON ((qo."quoteMakeMethodId" = qmm.id)))
     LEFT JOIN "makeMethod" mm ON (((qmm."itemId" = mm."itemId") AND (qmm.version = mm.version))));


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
             JOIN item i ON ((i.id = "quoteLine"."itemId")))
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
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS description
   FROM (("receiptLine" rl
     JOIN item i ON ((i.id = rl."itemId")))
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


create or replace view "public"."riskRegisters" as  SELECT r.id,
    r."companyId",
    r.title,
    r.description,
    r.source,
    r."sourceId",
    r.severity,
    r.likelihood,
    r."itemId",
    r.status,
    r.assignee,
    r."createdBy",
    r."createdAt",
    r."updatedAt",
    r.notes,
    r.type,
    wc.name AS "workCenterName",
    wc.id AS "workCenterId"
   FROM ("riskRegister" r
     LEFT JOIN "workCenter" wc ON ((r."sourceId" = wc.id)));


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
            i."requiresInspection"
           FROM item i
          WHERE (i.type = 'Service'::"itemType")
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
          WHERE (i.type = 'Service'::"itemType")
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
    i."readableIdWithRevision" AS "itemReadableId",
        CASE
            WHEN ((i."thumbnailPath" IS NULL) AND (mu."thumbnailPath" IS NOT NULL)) THEN mu."thumbnailPath"
            ELSE i."thumbnailPath"
        END AS "thumbnailPath",
    i.name AS description
   FROM (("shipmentLine" sl
     JOIN item i ON ((i.id = sl."itemId")))
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


create or replace view "public"."suggestions" as  SELECT s.id,
    s.suggestion,
    s.emoji,
    s.path,
    s."attachmentPath",
    s.tags,
    s."userId",
    s."companyId",
    s."createdAt",
    u."fullName" AS "employeeName",
    u."avatarUrl" AS "employeeAvatarUrl"
   FROM (suggestion s
     LEFT JOIN "user" u ON ((s."userId" = u.id)));


create or replace view "public"."supplierProcesses" as  SELECT sp.id,
    sp."supplierId",
    sp."processId",
    sp."minimumCost",
    sp."leadTime",
    sp."companyId",
    sp."customFields",
    sp."createdBy",
    sp."createdAt",
    sp."updatedBy",
    sp."updatedAt",
    sp.tags,
    sp."unitCost",
    p.name AS "processName"
   FROM ("supplierProcess" sp
     JOIN process p ON ((sp."processId" = p.id)));


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
             JOIN item i ON ((i.id = "supplierQuoteLine"."itemId")))
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
     JOIN latest_items li(id, "readableId", name, description, type, "replenishmentSystem", "defaultMethodType", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy", "createdAt", "updatedBy", "updatedAt", assignee, "modelUploadId", "thumbnailPath", notes, "trackingMethod", embedding, revision, "readableIdWithRevision", "requiresInspection", "sourcingType", "modelUploadId_1", "modelPath", "modelThumbnailPath", "modelName", "modelSize") ON (((li."readableId" = t.id) AND (li."companyId" = t."companyId"))))
     LEFT JOIN item_revisions ir ON (((ir."readableId" = t.id) AND (ir."companyId" = li."companyId"))))
     LEFT JOIN ( SELECT ps_1."itemId",
            ps_1."companyId",
            string_agg(ps_1."supplierPartId", ','::text) AS "supplierIds"
           FROM "supplierPart" ps_1
          GROUP BY ps_1."itemId", ps_1."companyId") ps ON (((ps."itemId" = li.id) AND (ps."companyId" = li."companyId"))))
     LEFT JOIN "unitOfMeasure" uom ON (((uom.code = li."unitOfMeasureCode") AND (uom."companyId" = li."companyId"))))
     LEFT JOIN "itemCost" ic ON ((ic."itemId" = li.id)));


create or replace view "public"."trainings" as  SELECT t1.id,
    t1.name,
    t1.description,
    t1.version,
    t1.status,
    t1.type,
    t1.frequency,
    t1.assignee,
    t1."estimatedDuration",
    t1.tags,
    t1."companyId",
    jsonb_agg(jsonb_build_object('id', t2.id, 'version', t2.version, 'status', t2.status)) AS versions
   FROM (training t1
     JOIN training t2 ON (((t1.name = t2.name) AND (t1."companyId" = t2."companyId"))))
  WHERE (t1.version = ( SELECT max(t3.version) AS max
           FROM training t3
          WHERE ((t3.name = t1.name) AND (t3."companyId" = t1."companyId"))))
  GROUP BY t1.id, t1.name, t1.description, t1.version, t1.status, t1.type, t1.frequency, t1.assignee, t1."estimatedDuration", t1.tags, t1."companyId";


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


create or replace view "public"."groups" as  SELECT "groupId" AS id,
    "isEmployeeTypeGroup",
    "isCustomerOrgGroup",
    "isCustomerTypeGroup",
    "isSupplierOrgGroup",
    "isSupplierTypeGroup",
    name,
    "companyId",
    "parentId",
    COALESCE(jsonb_agg("user") FILTER (WHERE ("user" IS NOT NULL)), '[]'::jsonb) AS users
   FROM groups_recursive
  WHERE ("isIdentityGroup" = false)
  GROUP BY "groupId", name, "companyId", "parentId", "isEmployeeTypeGroup", "isCustomerOrgGroup", "isCustomerTypeGroup", "isSupplierOrgGroup", "isSupplierTypeGroup"
  ORDER BY "isEmployeeTypeGroup" DESC, "isCustomerTypeGroup" DESC, "isSupplierTypeGroup" DESC, name;


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




NOTIFY pgrst, 'reload schema';
