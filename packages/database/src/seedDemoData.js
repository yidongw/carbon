"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemoData = seedDemoData;
var seedDemoData_strings_1 = require("./seedDemoData.strings");
var styleReference_1 = require("./styleReference");
function seedDemoData(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        // ─── Helpers ───────────────────────────────────────────────────────────────
        function nextSeq(table) {
            return __awaiter(this, void 0, void 0, function () {
                var r;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.query("SELECT get_next_sequence($1, $2) AS id", [table, companyId])];
                        case 1:
                            r = _a.sent();
                            return [2 /*return*/, r.rows[0].id];
                    }
                });
            });
        }
        function rowExists(table, nameCol, name) {
            return __awaiter(this, void 0, void 0, function () {
                var r;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, client.query("SELECT 1 FROM \"".concat(table, "\" WHERE \"").concat(nameCol, "\" = $1 AND \"companyId\" = $2 LIMIT 1"), [name, companyId])];
                        case 1:
                            r = _b.sent();
                            return [2 /*return*/, ((_a = r.rowCount) !== null && _a !== void 0 ? _a : 0) > 0];
                    }
                });
            });
        }
        // supplierInteraction is required by purchaseOrder FK
        function getOrCreateSupplierInteraction(suppId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, r;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.query("SELECT id FROM \"supplierInteraction\" WHERE \"supplierId\" = $1 AND \"companyId\" = $2 LIMIT 1", [suppId, companyId])];
                        case 1:
                            existing = _a.sent();
                            if (existing.rows.length > 0)
                                return [2 /*return*/, existing.rows[0].id];
                            return [4 /*yield*/, client.query("INSERT INTO \"supplierInteraction\" (\"supplierId\", \"companyId\") VALUES ($1, $2) RETURNING id", [suppId, companyId])];
                        case 2:
                            r = _a.sent();
                            return [2 /*return*/, r.rows[0].id];
                    }
                });
            });
        }
        var L, _c, colors, sizes, _i, colors_1, c, _d, sizes_1, s, supplierTypeNames, supplierTypeIds, _e, supplierTypeNames_1, typeName, existing, r, customerTypeNames, customerTypeIds, _f, customerTypeNames_1, typeName, existing, r, suppliersData, supplierIds, _g, suppliersData_1, s, existingSupplier, supplierRow, supplierId, addrRow, addressId, contactRow, contactId, activeCustomerStatusRow, activeCustomerStatusId, customersData, customerIds, _h, customersData_1, c, existingCustomer, customerRow, customerId, addrRow, addressId, contactRow, contactId, departmentNames, _j, departmentNames_1, deptName, costCenterNames, _k, costCenterNames_1, ccName, warehouseId, existingWH, whRow, shippingMethods, _l, shippingMethods_1, sm, shippingTerms, _m, shippingTerms_1, st, processesData, processIds, _o, processesData_1, p, existing, r, workCentersData, workCenterIds, _p, workCentersData_1, wc, existing, r, _q, _r, procName, procId, wcId, existsLink, itemsData, itemIds, _s, itemsData_1, item, existing, r, postingGroups, _t, postingGroups_1, pg, abilities, _u, abilities_1, abilityName, existing, poData, _v, poData_1, po, poReadableId, interactionId, poRow, poRowId, _w, _x, line, itemId, soData, _y, soData_1, so, soReadableId, soRow, soRowId, _z, _0, line, itemId, bracketItemId, _steelRodItemId, cncProcessId, cncWorkCenterId, existingJob, jobRowId, jobReadableId, jobRow, rootMakeMethod, rootMakeMethodId, existingOp, opRow, location2Id, existingLoc2, loc2Row, storageTypeNames, storageTypeIds, _1, storageTypeNames_1, stName, existing, r, storageUnits, storageUnitIds, _2, storageUnits_1, su, existing, r, shiftsData, shiftIds, _3, shiftsData_1, sh, existing, r, employeeRow, employeeId, dayShiftId, existingES, steelSubstanceId, aluminumSubstanceId, substances, substanceIds, _4, substances_1, sub, existing, r, barFormId, forms, formIds, _5, forms_1, form, existing, r, gradeId1020, gradePairs, _6, gradePairs_1, gp, existing, r, finishes, _7, finishes_1, f, existing, existing, _8, _9, readableId, fixtureItemInsert, fixtureItemId, r, serviceItemInsert, serviceItemId, r, acmeSupplierId, pacificSupplierId, existingSupplierPart, steelItemId, pcbItemId, sp, fastCNCSupplierId, cncProcId, existingSP, existingSupplierAccount, firstCustId, existingCustomerAccount, bracketItemId2, makeMethodId, methodOpId, existingMM, r, existingMO, r, existingMOS, steelItemId2, existingMM2, templateId, existingTemplate, r, tmMakeMethodId, existingTMM, r, existingTMO, tmoRow, tmoId, steelItemId3, procedureId, existingProc, r, existingPS, existingQD, allEmployeesGroupRow2, allEmployeesId, adminGroupRow, adminGroupId2, trainingId, trainingAssignmentId, existingTrain, r, existingTQ, existingTA, r, existingTC, _ncWorkflowId, existingNCW, r, _10, _11, typeName, ex, ncTypeRow, ncTypeId, existingNC, ncReadableId, ncRow, ncId, bracketId, cncWCId, maintenanceScheduleId, existingMS, r, existingMD, mdReadableId, mdRow, mdId, existingMSI, fastenerItemRow, fastenerItemId, _12, _13, typeName, ex, gaugeTypeRow, gaugeTypeId, gaugeRecordId, existingGauge, gReadableId, r, existingGCR, existingRR, documentId, existingDoc, r, existingNote, tagsData, _14, tagsData_1, tag, existing, existingOpp, custId, existingSugg, existingNQR, _15, _16, reason, existingPR, existingWH2, whTableRow, whTableId, adtExisting, textDataTypeId, adt1, _adt2, existingCF, cfTableRow, cfTableName, existingUAC, uacRow, uacId, existingAP, accountingPeriodId, r, existingJournal, jeId, journalRow, journalId, accountRow, accountId, existingHoliday, holidays, _17, holidays_1, h, steelItemId4, bracketItemId3, existingSP2, existingBP, existingISL, existingIR, itemRuleId, r, existingIRA, existingPM, existingKB, suppLocRow, suppContactRow, suppLocId2, suppContactId, abilityRow, cncAbilityId, existingPartner, existingContractor, existingEA, existingESR, salaryRecordId, now, curYear, curMonth, r, existingESP, allEmployeesGroupRow, allEmployeesGroupId, existingJAR, _jobRuleId, r, jobRow, existingJobId, existingJGA, jobOpRow, jobOpId, existingJOS, existingJOP, toolItemRow, toolItemIdForOp, existingJOT, purchasingRfqId, existingPRFQ, rfqReadableId, rfqRow, existingLine, pcbItemId, existingSupplier, supplierQuoteId, existingSQ, sqReadableId, sqInteractionId, sqRow, existingLine, pcbItemId, existingSRFQ, salesRfqId, precisionCustomerId, srfqReadableId, srfqRow, bracketItemId4, quoteId, quoteLineId, quoteMakeMethodId, existingQuote, qReadableId, qRow, bracketItemId5, existingQL, qlRow, existingQMM, qmmRow, existingQO, _qoRow, steelItemId5, existingQMat, existingReceipt, receiptId, recReadableId, firstPO, recRow, steelItemId6, existingShipment, shipmentId, shipReadableId, firstSO, shipRow, bracketItemId6, existingSI, salesInvoiceId, siReadableId, siRow, bracketItemId7, existingPI, purchaseInvoiceId, piReadableId, piInteractionId, piRow, steelItemId7, existingST, stockTransferId, stReadableId, stRow, steelItemId8, existingWT, wtReadableId, wtRow, warehouseTransferId, steelItemId9, soLineRow, soLineId, existingFul, existingTCE, existingPE, prodEventId, peRow, jobForOpRow, jobIdForOp, existingPQR, pqrId, pqrRow, existingPQ, firstPORow, firstPOId, existingPOP, firstSORow, firstSOId, existingSOP, existingSOShip, msubExists, msubId, r, mformExists, mformId, r, companyGroupId, dims, firstDimId, firstDimValueId, _18, _19, dim, existsDv, r, jlRow, custRow, contactRow, custId, contactId, existsCC, addrRow, addrId, existsCL, custRow, itemRow, custId, itemId, existsOvr, ovrId, r, existsBreak, custRow, itemRow, custId, itemId, docRow, docId, empRow, shiftRow, etRow, companyGroupId, existingCG, cgRow, existsPlan, uacRow, adtRow, uacId, adtId, existsUA, uaId, r, existsUAV, adtRow, scRow, scId, abilRow, abilId, slRow, slId, abilRow, abilId, poRow, poId, locRow, smRow, stRow, existsPOD, piRow, piId, poRow, polRow, itemRow, locRow, smRow, stRow, existsPIL, pilId, r, existsPID, supRow, piRow, supId, piId, existsPP, ppId, r, rfqRow, poRow, sqRow, rfqId, quoteRow, qlRow, qmmRow, qopRow, itemRow, toolRow, quoteId_1, qlId, qmmId, qopId, itemId, toolId, existsQM, quoteRow, quoteId_2, custRow, custLocRow, custContactRow, ptRow, locRow, smRow, stRow, existsQP, existsQS, soRow, soId, sqRow, sqlRow, sqId, sqlId, mopRow, mopId, toolRow, procRow, itemConfigs, _20, itemConfigs_1, cfg, targetItemId, existsCPG, cpgId, r, _21, _22, p, existsCP, tshirtId, jacketId, cuttingProcId, sewingProcId, finishingProcId, qiProcId2, cuttingWCId, sewingWCId, getOrCreateGarmentJob, getOrCreateGarmentOp, seedGarmentProdRecord, tshirt, cutOpId, sewOpId, blackColor, navyColor, tshirtBlackConfig, tshirtNavyConfig, tshirtNavyProdConfig, exSewPE, sewPeId, r, exSewPQR, sewPqrId, r, exSewPQ, jacket, qdRow, rlRow, supRow, teRow, rl, inboundSeq, iiSeqId, existsII, iiId, r, existsIIH, existsIIS, ncRow, ncId, procRow, custRow, supRow, itemRow, teRow, jopRow, polRow, rlRow, solRow, shlRow, existsNCAT, _ncatId, r, existsNCActT, ncActTId, r, existsNCR, nciId, existsNCI, r, iiRow, mdRow, msRow, empRow, wcRow, itemRow, uomRow, teRow, mdId, msId, empId, wcId, itemId, uomCode, mdiId, existsMDI, r, itemRow, locRow, poRow, jopRows, jmmRow, itemRow, jopStepRow, empRow, uomRow, scRow, polRow, sproc, jop1, jop2, jmmId, jmmJobId, itemId, empId, uomCode, sprocId, existsJM, wcRow, existsOp2, op2Id, jopJmmRow, jopProcRow, r, existsJOP, existsJOSS, jossId, r, josqrId, existsJOSQR, r, jobRow, _arRow, poRow, existsAR, wcRow, itemRow, uomRow, existsConfig, makeItemRows, buyItemRows, makeItemIdsSeed, allItemIdsSeed, periodRows2, periodIdsSeed, dfInserted, dpInserted, _23, allItemIdsSeed_1, itemId, isMakeItem, _24, periodIdsSeed_1, periodId, qty, dfCheck, dpCheck, pqrRows, _25, _26, pqr, existing, mesItemDefs, mesItemIds, _27, mesItemDefs_1, itm, ex, r, inspWCId, ex, r, qiProcId, cncWC, asmWC, wldWC, cncProc, asmProc, wldProc, qiProc, getOrCreateJob, addOp, jobA, jobB, jobC, jobD, jobE, _28, _29, name_1, ex, _30, _31, name_2, _32, _33, name_3, ex, kanbanItems, _34, kanbanItems_1, readableId, itmRow, itmId, supplierRow, supplierId, exKb, shaftJobRow, shaftJob, steelRodRow, steelRodId, shaftJobMaterialId, exJM, r, exPL, plReadableId, plRow, plId, shaftOpRow, housingJobRow, housingJobId, exRW, opsRow, pressOp, qcOp, cgRow, cgId, acctRow, acctMap, _35, _36, r, assetAcctId, accumDeprAcctId, deprExpAcctId, disposalAcctId, writeOffAcctId, exFac, facId, facRow, existing, locationRow, locationId_1, assets, _37, assets_1, a, exFa, exDr, receiptRow, receipt, trackedItems, _38, trackedItems_1, t, exTe, itemRow, itemId, bracketRow, bracketId, exId;
        var _this = this;
        var _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126, _127, _128, _129, _130, _131, _132, _133, _134, _135, _136, _137, _138, _139, _140, _141, _142, _143, _144, _145, _146, _147, _148, _149, _150, _151, _152, _153, _154, _155, _156, _157, _158, _159, _160, _161, _162, _163, _164, _165, _166, _167, _168, _169, _170, _171, _172, _173, _174, _175, _176, _177, _178, _179, _180, _181, _182, _183, _184, _185, _186, _187, _188, _189, _190, _191, _192, _193, _194, _195, _196, _197, _198, _199, _200, _201, _202, _203, _204, _205, _206, _207, _208, _209, _210, _211, _212, _213, _214, _215, _216, _217, _218, _219, _220, _221, _222, _223, _224, _225, _226, _227, _228, _229, _230, _231, _232, _233, _234, _235, _236, _237, _238, _239, _240, _241, _242, _243, _244, _245, _246, _247, _248, _249, _250, _251, _252, _253, _254, _255, _256, _257, _258, _259, _260, _261, _262, _263, _264, _265, _266, _267, _268, _269, _270, _271, _272, _273, _274, _275, _276, _277, _278, _279, _280, _281, _282, _283, _284, _285, _286, _287, _288, _289, _290, _291, _292, _293, _294, _295, _296, _297, _298, _299, _300, _301, _302, _303, _304, _305, _306, _307, _308, _309, _310, _311, _312, _313;
        var companyId = _b.companyId, userId = _b.userId, locationId = _b.locationId, language = _b.language;
        return __generator(this, function (_314) {
            switch (_314.label) {
                case 0:
                    L = (0, seedDemoData_strings_1.getSeedLocale)(language);
                    // ─── Style colors + sizes ─────────────────────────────────────────────────
                    // Per-company apparel reference data (color names localized to the seed
                    // language; sizes are seeded by code).
                    console.log("Seeding style colors + sizes...");
                    _c = (0, styleReference_1.styleReferenceRows)(language), colors = _c.colors, sizes = _c.sizes;
                    _i = 0, colors_1 = colors;
                    _314.label = 1;
                case 1:
                    if (!(_i < colors_1.length)) return [3 /*break*/, 4];
                    c = colors_1[_i];
                    return [4 /*yield*/, client.query("INSERT INTO \"styleColor\" (\"colorCode\", \"colorName\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4)\n         ON CONFLICT (\"colorCode\", \"companyId\") DO NOTHING", [c.colorCode, c.colorName, companyId, userId])];
                case 2:
                    _314.sent();
                    _314.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _d = 0, sizes_1 = sizes;
                    _314.label = 5;
                case 5:
                    if (!(_d < sizes_1.length)) return [3 /*break*/, 8];
                    s = sizes_1[_d];
                    return [4 /*yield*/, client.query("INSERT INTO \"styleSize\" (\"sizeCode\", \"sizeName\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4)\n         ON CONFLICT (\"sizeCode\", \"companyId\") DO NOTHING", [s.sizeCode, s.sizeName, companyId, userId])];
                case 6:
                    _314.sent();
                    _314.label = 7;
                case 7:
                    _d++;
                    return [3 /*break*/, 5];
                case 8:
                    // ─── Step 3: Supplier types ───────────────────────────────────────────────
                    console.log("3. Seeding supplier types...");
                    supplierTypeNames = [
                        "Raw Material",
                        "Electronics",
                        "Contract Manufacturing"
                    ];
                    supplierTypeIds = {};
                    _e = 0, supplierTypeNames_1 = supplierTypeNames;
                    _314.label = 9;
                case 9:
                    if (!(_e < supplierTypeNames_1.length)) return [3 /*break*/, 14];
                    typeName = supplierTypeNames_1[_e];
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierType\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [typeName, companyId])];
                case 10:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 11];
                    supplierTypeIds[typeName] = existing.rows[0].id;
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, client.query("INSERT INTO \"supplierType\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [typeName, companyId, userId])];
                case 12:
                    r = _314.sent();
                    supplierTypeIds[typeName] = r.rows[0].id;
                    console.log("   Created supplier type \"".concat(typeName, "\""));
                    _314.label = 13;
                case 13:
                    _e++;
                    return [3 /*break*/, 9];
                case 14:
                    // ─── Step 4: Customer types ───────────────────────────────────────────────
                    console.log("4. Seeding customer types...");
                    customerTypeNames = ["OEM", "Distributor", "End User"];
                    customerTypeIds = {};
                    _f = 0, customerTypeNames_1 = customerTypeNames;
                    _314.label = 15;
                case 15:
                    if (!(_f < customerTypeNames_1.length)) return [3 /*break*/, 20];
                    typeName = customerTypeNames_1[_f];
                    return [4 /*yield*/, client.query("SELECT id FROM \"customerType\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [typeName, companyId])];
                case 16:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 17];
                    customerTypeIds[typeName] = existing.rows[0].id;
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, client.query("INSERT INTO \"customerType\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [typeName, companyId, userId])];
                case 18:
                    r = _314.sent();
                    customerTypeIds[typeName] = r.rows[0].id;
                    console.log("   Created customer type \"".concat(typeName, "\""));
                    _314.label = 19;
                case 19:
                    _f++;
                    return [3 /*break*/, 15];
                case 20:
                    // ─── Step 5: Suppliers ────────────────────────────────────────────────────
                    console.log("5. Seeding suppliers...");
                    suppliersData = L.suppliers;
                    supplierIds = {};
                    _g = 0, suppliersData_1 = suppliersData;
                    _314.label = 21;
                case 21:
                    if (!(_g < suppliersData_1.length)) return [3 /*break*/, 29];
                    s = suppliersData_1[_g];
                    return [4 /*yield*/, client.query("SELECT id FROM supplier WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [s.name, companyId])];
                case 22:
                    existingSupplier = _314.sent();
                    if (existingSupplier.rows.length > 0) {
                        supplierIds[s.key] = existingSupplier.rows[0].id;
                        console.log("   Supplier \"".concat(s.name, "\" already exists, skipping."));
                        return [3 /*break*/, 28];
                    }
                    return [4 /*yield*/, client.query("INSERT INTO supplier (name, \"readableId\", \"supplierTypeId\", \"supplierStatus\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, 'Active'::\"supplierStatusType\", $4, $5) RETURNING id", [s.name, s.readableId, supplierTypeIds[s.typeKey], companyId, userId])];
                case 23:
                    supplierRow = _314.sent();
                    supplierId = supplierRow.rows[0].id;
                    supplierIds[s.key] = supplierId;
                    return [4 /*yield*/, client.query("INSERT INTO address (\"addressLine1\", city, \"stateProvince\", \"postalCode\", \"companyId\")\n         VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                            s.address.addressLine1,
                            s.address.city,
                            s.address.state,
                            s.address.postalCode,
                            companyId
                        ])];
                case 24:
                    addrRow = _314.sent();
                    addressId = addrRow.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierLocation\" (\"supplierId\", \"addressId\", name) VALUES ($1, $2, $3)", [supplierId, addressId, "Main Office"])];
                case 25:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO contact (\"firstName\", \"lastName\", email, \"workPhone\", \"companyId\")\n         VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                            s.contact.firstName,
                            s.contact.lastName,
                            s.contact.email,
                            s.contact.workPhone,
                            companyId
                        ])];
                case 26:
                    contactRow = _314.sent();
                    contactId = contactRow.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierContact\" (\"supplierId\", \"contactId\") VALUES ($1, $2)", [supplierId, contactId])];
                case 27:
                    _314.sent();
                    console.log("   Created supplier \"".concat(s.name, "\": ").concat(supplierId));
                    _314.label = 28;
                case 28:
                    _g++;
                    return [3 /*break*/, 21];
                case 29:
                    // ─── Step 6: Customers ────────────────────────────────────────────────────
                    console.log("6. Seeding customers...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"customerStatus\" WHERE name = 'Active' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 30:
                    activeCustomerStatusRow = _314.sent();
                    activeCustomerStatusId = (_39 = activeCustomerStatusRow.rows[0]) === null || _39 === void 0 ? void 0 : _39.id;
                    customersData = L.customers;
                    customerIds = {};
                    _h = 0, customersData_1 = customersData;
                    _314.label = 31;
                case 31:
                    if (!(_h < customersData_1.length)) return [3 /*break*/, 39];
                    c = customersData_1[_h];
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [c.name, companyId])];
                case 32:
                    existingCustomer = _314.sent();
                    if (existingCustomer.rows.length > 0) {
                        customerIds[c.key] = existingCustomer.rows[0].id;
                        console.log("   Customer \"".concat(c.name, "\" already exists, skipping."));
                        return [3 /*break*/, 38];
                    }
                    return [4 /*yield*/, client.query("INSERT INTO customer (name, \"readableId\", \"customerTypeId\", \"customerStatusId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [
                            c.name,
                            c.readableId,
                            customerTypeIds[c.typeKey],
                            activeCustomerStatusId,
                            companyId,
                            userId
                        ])];
                case 33:
                    customerRow = _314.sent();
                    customerId = customerRow.rows[0].id;
                    customerIds[c.key] = customerId;
                    return [4 /*yield*/, client.query("INSERT INTO address (\"addressLine1\", city, \"stateProvince\", \"postalCode\", \"companyId\")\n         VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                            c.address.addressLine1,
                            c.address.city,
                            c.address.state,
                            c.address.postalCode,
                            companyId
                        ])];
                case 34:
                    addrRow = _314.sent();
                    addressId = addrRow.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"customerLocation\" (\"customerId\", \"addressId\", name) VALUES ($1, $2, $3)", [customerId, addressId, "Main Office"])];
                case 35:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO contact (\"firstName\", \"lastName\", email, \"workPhone\", \"companyId\")\n         VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                            c.contact.firstName,
                            c.contact.lastName,
                            c.contact.email,
                            c.contact.workPhone,
                            companyId
                        ])];
                case 36:
                    contactRow = _314.sent();
                    contactId = contactRow.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"customerContact\" (\"customerId\", \"contactId\") VALUES ($1, $2)", [customerId, contactId])];
                case 37:
                    _314.sent();
                    console.log("   Created customer \"".concat(c.name, "\": ").concat(customerId));
                    _314.label = 38;
                case 38:
                    _h++;
                    return [3 /*break*/, 31];
                case 39:
                    // ─── Step 7: Departments ──────────────────────────────────────────────────
                    console.log("7. Seeding departments...");
                    departmentNames = [
                        "Engineering",
                        "Manufacturing",
                        "Operations",
                        "Quality"
                    ];
                    _j = 0, departmentNames_1 = departmentNames;
                    _314.label = 40;
                case 40:
                    if (!(_j < departmentNames_1.length)) return [3 /*break*/, 44];
                    deptName = departmentNames_1[_j];
                    return [4 /*yield*/, rowExists("department", "name", deptName)];
                case 41:
                    if (!!(_314.sent())) return [3 /*break*/, 43];
                    return [4 /*yield*/, client.query("INSERT INTO department (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [deptName, companyId, userId])];
                case 42:
                    _314.sent();
                    console.log("   Created department \"".concat(deptName, "\""));
                    _314.label = 43;
                case 43:
                    _j++;
                    return [3 /*break*/, 40];
                case 44:
                    // ─── Step 8: Cost centers ─────────────────────────────────────────────────
                    console.log("8. Seeding cost centers...");
                    costCenterNames = [
                        "Manufacturing Operations",
                        "Engineering R&D",
                        "General & Administrative"
                    ];
                    _k = 0, costCenterNames_1 = costCenterNames;
                    _314.label = 45;
                case 45:
                    if (!(_k < costCenterNames_1.length)) return [3 /*break*/, 49];
                    ccName = costCenterNames_1[_k];
                    return [4 /*yield*/, rowExists("costCenter", "name", ccName)];
                case 46:
                    if (!!(_314.sent())) return [3 /*break*/, 48];
                    return [4 /*yield*/, client.query("INSERT INTO \"costCenter\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [ccName, companyId, userId])];
                case 47:
                    _314.sent();
                    console.log("   Created cost center \"".concat(ccName, "\""));
                    _314.label = 48;
                case 48:
                    _k++;
                    return [3 /*break*/, 45];
                case 49:
                    // ─── Step 9: Warehouse ────────────────────────────────────────────────────
                    console.log("9. Seeding warehouse...");
                    warehouseId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM warehouse WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["Main Warehouse", companyId])];
                case 50:
                    existingWH = _314.sent();
                    if (!(existingWH.rows.length > 0)) return [3 /*break*/, 51];
                    warehouseId = existingWH.rows[0].id;
                    console.log("   Warehouse already exists.");
                    return [3 /*break*/, 53];
                case 51: return [4 /*yield*/, client.query("INSERT INTO warehouse (name, \"locationId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4) RETURNING id", ["Main Warehouse", locationId, companyId, userId])];
                case 52:
                    whRow = _314.sent();
                    warehouseId = whRow.rows[0].id;
                    console.log("   Created warehouse \"Main Warehouse\": ".concat(warehouseId));
                    _314.label = 53;
                case 53:
                    // ─── Step 10: Shipping methods ────────────────────────────────────────────
                    console.log("10. Seeding shipping methods...");
                    shippingMethods = L.shippingMethods;
                    _l = 0, shippingMethods_1 = shippingMethods;
                    _314.label = 54;
                case 54:
                    if (!(_l < shippingMethods_1.length)) return [3 /*break*/, 58];
                    sm = shippingMethods_1[_l];
                    return [4 /*yield*/, rowExists("shippingMethod", "name", sm.name)];
                case 55:
                    if (!!(_314.sent())) return [3 /*break*/, 57];
                    return [4 /*yield*/, client.query("INSERT INTO \"shippingMethod\" (name, carrier, \"companyId\", \"createdBy\")\n           VALUES ($1, $2::\"shippingCarrier\", $3, $4)", [sm.name, sm.carrier, companyId, userId])];
                case 56:
                    _314.sent();
                    console.log("   Created shipping method \"".concat(sm.name, "\""));
                    _314.label = 57;
                case 57:
                    _l++;
                    return [3 /*break*/, 54];
                case 58:
                    // ─── Step 11: Shipping terms ──────────────────────────────────────────────
                    console.log("11. Seeding shipping terms...");
                    shippingTerms = ["FOB Destination", "FOB Origin", "Prepaid & Add"];
                    _m = 0, shippingTerms_1 = shippingTerms;
                    _314.label = 59;
                case 59:
                    if (!(_m < shippingTerms_1.length)) return [3 /*break*/, 63];
                    st = shippingTerms_1[_m];
                    return [4 /*yield*/, rowExists("shippingTerm", "name", st)];
                case 60:
                    if (!!(_314.sent())) return [3 /*break*/, 62];
                    return [4 /*yield*/, client.query("INSERT INTO \"shippingTerm\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [st, companyId, userId])];
                case 61:
                    _314.sent();
                    console.log("   Created shipping term \"".concat(st, "\""));
                    _314.label = 62;
                case 62:
                    _m++;
                    return [3 /*break*/, 59];
                case 63:
                    // ─── Step 12: Processes ───────────────────────────────────────────────────
                    console.log("12. Seeding processes...");
                    processesData = L.processes;
                    processIds = {};
                    _o = 0, processesData_1 = processesData;
                    _314.label = 64;
                case 64:
                    if (!(_o < processesData_1.length)) return [3 /*break*/, 69];
                    p = processesData_1[_o];
                    return [4 /*yield*/, client.query("SELECT id FROM process WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [p.name, companyId])];
                case 65:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 66];
                    processIds[p.key] = existing.rows[0].id;
                    return [3 /*break*/, 68];
                case 66: return [4 /*yield*/, client.query("INSERT INTO process (name, \"defaultStandardFactor\", \"processType\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2::factor, $3::\"processType\", $4, $5) RETURNING id", [p.name, p.factor, p.type, companyId, userId])];
                case 67:
                    r = _314.sent();
                    processIds[p.key] = r.rows[0].id;
                    console.log("   Created process \"".concat(p.name, "\""));
                    _314.label = 68;
                case 68:
                    _o++;
                    return [3 /*break*/, 64];
                case 69:
                    // ─── Step 13: Work centers ────────────────────────────────────────────────
                    console.log("13. Seeding work centers...");
                    workCentersData = L.workCenters;
                    workCenterIds = {};
                    _p = 0, workCentersData_1 = workCentersData;
                    _314.label = 70;
                case 70:
                    if (!(_p < workCentersData_1.length)) return [3 /*break*/, 80];
                    wc = workCentersData_1[_p];
                    return [4 /*yield*/, client.query("SELECT id FROM \"workCenter\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [wc.name, companyId])];
                case 71:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 72];
                    workCenterIds[wc.key] = existing.rows[0].id;
                    return [3 /*break*/, 74];
                case 72: return [4 /*yield*/, client.query("INSERT INTO \"workCenter\" (name, description, \"laborRate\", \"machineRate\", \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [
                        wc.name,
                        wc.description,
                        wc.laborRate,
                        wc.machineRate,
                        locationId,
                        companyId,
                        userId
                    ])];
                case 73:
                    r = _314.sent();
                    workCenterIds[wc.key] = r.rows[0].id;
                    console.log("   Created work center \"".concat(wc.name, "\""));
                    _314.label = 74;
                case 74:
                    _q = 0, _r = wc.processes;
                    _314.label = 75;
                case 75:
                    if (!(_q < _r.length)) return [3 /*break*/, 79];
                    procName = _r[_q];
                    procId = processIds[procName];
                    if (!procId)
                        return [3 /*break*/, 78];
                    wcId = workCenterIds[wc.key];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"workCenterProcess\" WHERE \"workCenterId\" = $1 AND \"processId\" = $2 LIMIT 1", [wcId, procId])];
                case 76:
                    existsLink = _314.sent();
                    if (!(((_40 = existsLink.rowCount) !== null && _40 !== void 0 ? _40 : 0) === 0)) return [3 /*break*/, 78];
                    return [4 /*yield*/, client.query("INSERT INTO \"workCenterProcess\" (\"workCenterId\", \"processId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [wcId, procId, companyId, userId])];
                case 77:
                    _314.sent();
                    _314.label = 78;
                case 78:
                    _q++;
                    return [3 /*break*/, 75];
                case 79:
                    _p++;
                    return [3 /*break*/, 70];
                case 80:
                    // ─── Step 14: Items ───────────────────────────────────────────────────────
                    console.log("14. Seeding items...");
                    itemsData = L.items;
                    itemIds = {};
                    _s = 0, itemsData_1 = itemsData;
                    _314.label = 81;
                case 81:
                    if (!(_s < itemsData_1.length)) return [3 /*break*/, 85];
                    item = itemsData_1[_s];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = $1 AND \"companyId\" = $2 LIMIT 1", [item.readableId, companyId])];
                case 82:
                    existing = _314.sent();
                    if (existing.rows.length > 0) {
                        itemIds[item.readableId] = existing.rows[0].id;
                        console.log("   Item \"".concat(item.readableId, "\" already exists, skipping."));
                        return [3 /*break*/, 84];
                    }
                    return [4 /*yield*/, client.query("INSERT INTO item (\"readableId\", name, description, type, \"replenishmentSystem\", \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4::\"itemType\", $5::\"itemReplenishmentSystem\", $6::\"itemTrackingType\", $7, true, $8, $9)\n         RETURNING id", [
                            item.readableId,
                            item.name,
                            item.description,
                            item.type,
                            item.replenishmentSystem,
                            item.itemTrackingType,
                            item.uom,
                            companyId,
                            userId
                        ])];
                case 83:
                    r = _314.sent();
                    itemIds[item.readableId] = r.rows[0].id;
                    console.log("   Created item \"".concat(item.readableId, "\""));
                    _314.label = 84;
                case 84:
                    _s++;
                    return [3 /*break*/, 81];
                case 85:
                    // ─── Step 15: Item posting groups ─────────────────────────────────────────
                    console.log("15. Seeding item posting groups...");
                    postingGroups = L.postingGroups;
                    _t = 0, postingGroups_1 = postingGroups;
                    _314.label = 86;
                case 86:
                    if (!(_t < postingGroups_1.length)) return [3 /*break*/, 90];
                    pg = postingGroups_1[_t];
                    return [4 /*yield*/, rowExists("itemPostingGroup", "name", pg.name)];
                case 87:
                    if (!!(_314.sent())) return [3 /*break*/, 89];
                    return [4 /*yield*/, client.query("INSERT INTO \"itemPostingGroup\" (name, description, \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4)", [pg.name, pg.description, companyId, userId])];
                case 88:
                    _314.sent();
                    console.log("   Created item posting group \"".concat(pg.name, "\""));
                    _314.label = 89;
                case 89:
                    _t++;
                    return [3 /*break*/, 86];
                case 90:
                    // ─── Step 16: Abilities ───────────────────────────────────────────────────
                    console.log("16. Seeding abilities...");
                    abilities = L.abilities;
                    _u = 0, abilities_1 = abilities;
                    _314.label = 91;
                case 91:
                    if (!(_u < abilities_1.length)) return [3 /*break*/, 95];
                    abilityName = abilities_1[_u];
                    return [4 /*yield*/, client.query("SELECT 1 FROM ability WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [abilityName, companyId])];
                case 92:
                    existing = _314.sent();
                    if (!(((_41 = existing.rowCount) !== null && _41 !== void 0 ? _41 : 0) === 0)) return [3 /*break*/, 94];
                    return [4 /*yield*/, client.query("INSERT INTO ability (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [abilityName, companyId, userId])];
                case 93:
                    _314.sent();
                    console.log("   Created ability \"".concat(abilityName, "\""));
                    _314.label = 94;
                case 94:
                    _u++;
                    return [3 /*break*/, 91];
                case 95:
                    // ─── Step 17: Purchase orders ─────────────────────────────────────────────
                    console.log("17. Seeding purchase orders...");
                    poData = [
                        {
                            supplierId: supplierIds["Acme Steel Supply"],
                            status: "To Receive",
                            lines: [
                                { itemReadableId: "STEEL-ROD-01", qty: 100, unitPrice: 5.5, uom: "EA" }
                            ]
                        },
                        {
                            supplierId: supplierIds["Pacific Electronics"],
                            status: "Draft",
                            lines: [
                                { itemReadableId: "CTRL-PCB-001", qty: 50, unitPrice: 45.0, uom: "EA" }
                            ]
                        }
                    ];
                    _v = 0, poData_1 = poData;
                    _314.label = 96;
                case 96:
                    if (!(_v < poData_1.length)) return [3 /*break*/, 105];
                    po = poData_1[_v];
                    if (!po.supplierId)
                        return [3 /*break*/, 104];
                    return [4 /*yield*/, nextSeq("purchaseOrder")];
                case 97:
                    poReadableId = _314.sent();
                    return [4 /*yield*/, getOrCreateSupplierInteraction(po.supplierId)];
                case 98:
                    interactionId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrder\" (\"purchaseOrderId\", \"purchaseOrderType\", status, \"supplierId\", \"supplierInteractionId\", \"companyId\", \"createdBy\")\n         VALUES ($1, 'Purchase'::\"purchaseOrderType\", $2::\"purchaseOrderStatus\", $3, $4, $5, $6)\n         RETURNING id", [poReadableId, po.status, po.supplierId, interactionId, companyId, userId])];
                case 99:
                    poRow = _314.sent();
                    poRowId = poRow.rows[0].id;
                    _w = 0, _x = po.lines;
                    _314.label = 100;
                case 100:
                    if (!(_w < _x.length)) return [3 /*break*/, 103];
                    line = _x[_w];
                    itemId = itemIds[line.itemReadableId];
                    if (!itemId)
                        return [3 /*break*/, 102];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderLine\" (\"purchaseOrderId\", \"purchaseOrderLineType\", \"itemId\", description, \"purchaseQuantity\", \"supplierUnitPrice\", \"inventoryUnitOfMeasureCode\", \"purchaseUnitOfMeasureCode\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Part'::\"purchaseOrderLineType\", $2, $3, $4, $5, $6, $6, $7, $8)", [
                            poRowId,
                            itemId,
                            line.itemReadableId,
                            line.qty,
                            line.unitPrice,
                            line.uom,
                            companyId,
                            userId
                        ])];
                case 101:
                    _314.sent();
                    _314.label = 102;
                case 102:
                    _w++;
                    return [3 /*break*/, 100];
                case 103:
                    console.log("   Created purchase order \"".concat(poReadableId, "\""));
                    _314.label = 104;
                case 104:
                    _v++;
                    return [3 /*break*/, 96];
                case 105:
                    // ─── Step 18: Sales orders ────────────────────────────────────────────────
                    console.log("18. Seeding sales orders...");
                    soData = [
                        {
                            customerId: customerIds["Precision Motors LLC"],
                            status: "Confirmed",
                            lines: [
                                { itemReadableId: "BRACKET-001", qty: 25, unitPrice: 125.0, uom: "EA" },
                                { itemReadableId: "BEARING-6205", qty: 25, unitPrice: 18.5, uom: "EA" }
                            ]
                        },
                        {
                            customerId: customerIds["West Coast Robotics"],
                            status: "Draft",
                            lines: [
                                {
                                    itemReadableId: "SHAFT-ASM-001",
                                    qty: 10,
                                    unitPrice: 280.0,
                                    uom: "EA"
                                }
                            ]
                        },
                        {
                            customerId: customerIds["Northern Aerospace"],
                            status: "Draft",
                            lines: [
                                { itemReadableId: "CTRL-PCB-001", qty: 5, unitPrice: 195.0, uom: "EA" },
                                { itemReadableId: "BRACKET-001", qty: 10, unitPrice: 130.0, uom: "EA" }
                            ]
                        }
                    ];
                    _y = 0, soData_1 = soData;
                    _314.label = 106;
                case 106:
                    if (!(_y < soData_1.length)) return [3 /*break*/, 114];
                    so = soData_1[_y];
                    if (!so.customerId)
                        return [3 /*break*/, 113];
                    return [4 /*yield*/, nextSeq("salesOrder")];
                case 107:
                    soReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrder\" (\"salesOrderId\", status, \"currencyCode\", \"customerId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2::\"salesOrderStatus\", 'USD', $3, $4, $5)\n         RETURNING id", [soReadableId, so.status, so.customerId, companyId, userId])];
                case 108:
                    soRow = _314.sent();
                    soRowId = soRow.rows[0].id;
                    _z = 0, _0 = so.lines;
                    _314.label = 109;
                case 109:
                    if (!(_z < _0.length)) return [3 /*break*/, 112];
                    line = _0[_z];
                    itemId = itemIds[line.itemReadableId];
                    if (!itemId)
                        return [3 /*break*/, 111];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderLine\" (\"salesOrderId\", \"salesOrderLineType\", \"itemId\", description, \"saleQuantity\", \"unitPrice\", \"unitOfMeasureCode\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Part'::\"salesOrderLineType\", $2, $3, $4, $5, $6, $7, $8)", [
                            soRowId,
                            itemId,
                            line.itemReadableId,
                            line.qty,
                            line.unitPrice,
                            line.uom,
                            companyId,
                            userId
                        ])];
                case 110:
                    _314.sent();
                    _314.label = 111;
                case 111:
                    _z++;
                    return [3 /*break*/, 109];
                case 112:
                    console.log("   Created sales order \"".concat(soReadableId, "\""));
                    _314.label = 113;
                case 113:
                    _y++;
                    return [3 /*break*/, 106];
                case 114:
                    // ─── Step 19: Manufacturing job ───────────────────────────────────────────
                    console.log("19. Seeding manufacturing job...");
                    bracketItemId = itemIds["BRACKET-001"];
                    _steelRodItemId = itemIds["STEEL-ROD-01"];
                    cncProcessId = processIds["CNC Machining"];
                    cncWorkCenterId = workCenterIds["CNC Mill #1"];
                    if (!bracketItemId) return [3 /*break*/, 123];
                    return [4 /*yield*/, client.query("SELECT id FROM job WHERE \"itemId\" = $1 AND \"companyId\" = $2 ORDER BY \"createdAt\" LIMIT 1", [bracketItemId, companyId])];
                case 115:
                    existingJob = _314.sent();
                    jobRowId = void 0;
                    if (!(existingJob.rows.length > 0)) return [3 /*break*/, 116];
                    jobRowId = existingJob.rows[0].id;
                    console.log("   Job for BRACKET-001 already exists: ".concat(jobRowId));
                    return [3 /*break*/, 119];
                case 116: return [4 /*yield*/, nextSeq("job")];
                case 117:
                    jobReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO job (\"jobId\", \"itemId\", \"unitOfMeasureCode\", \"locationId\", status, quantity, \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 'EA', $3, 'Ready'::\"jobStatus\", 25, $4, $5)\n           RETURNING id", [jobReadableId, bracketItemId, locationId, companyId, userId])];
                case 118:
                    jobRow = _314.sent();
                    jobRowId = jobRow.rows[0].id;
                    console.log("   Created job \"".concat(jobReadableId, "\": ").concat(jobRowId));
                    _314.label = 119;
                case 119:
                    if (!cncProcessId) return [3 /*break*/, 123];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobMakeMethod\" WHERE \"jobId\" = $1 AND \"parentMaterialId\" IS NULL LIMIT 1", [jobRowId])];
                case 120:
                    rootMakeMethod = _314.sent();
                    rootMakeMethodId = (_43 = (_42 = rootMakeMethod.rows[0]) === null || _42 === void 0 ? void 0 : _42.id) !== null && _43 !== void 0 ? _43 : null;
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperation\" WHERE \"jobId\" = $1 AND description = 'Milling' LIMIT 1", [jobRowId])];
                case 121:
                    existingOp = _314.sent();
                    if (!(((_44 = existingOp.rowCount) !== null && _44 !== void 0 ? _44 : 0) === 0)) return [3 /*break*/, 123];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperation\" (\"jobId\", \"jobMakeMethodId\", \"order\", \"processId\", \"workCenterId\", description, \"laborTime\", \"laborUnit\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, 1, $3, $4, 'Milling', 30, 'Minutes/Piece'::factor, $5, $6)\n             RETURNING id", [
                            jobRowId,
                            rootMakeMethodId,
                            cncProcessId,
                            cncWorkCenterId !== null && cncWorkCenterId !== void 0 ? cncWorkCenterId : null,
                            companyId,
                            userId
                        ])];
                case 122:
                    opRow = _314.sent();
                    console.log("   Created job operation: ".concat(opRow.rows[0].id));
                    _314.label = 123;
                case 123:
                    // ─── Step 20: Second location ─────────────────────────────────────────────
                    console.log("20. Seeding second location...");
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE name = 'Remote Warehouse' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 124:
                    existingLoc2 = _314.sent();
                    if (!(existingLoc2.rows.length > 0)) return [3 /*break*/, 125];
                    location2Id = existingLoc2.rows[0].id;
                    return [3 /*break*/, 127];
                case 125: return [4 /*yield*/, client.query("INSERT INTO location (name, \"addressLine1\", city, \"stateProvince\", \"postalCode\", \"countryCode\", timezone, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id", [
                        "Remote Warehouse",
                        "500 Storage Ave",
                        "Detroit",
                        "MI",
                        "48201",
                        "US",
                        "America/Detroit",
                        companyId,
                        userId
                    ])];
                case 126:
                    loc2Row = _314.sent();
                    location2Id = loc2Row.rows[0].id;
                    console.log("   Created location \"Remote Warehouse\": ".concat(location2Id));
                    _314.label = 127;
                case 127:
                    // ─── Step 21: storageType + storageUnit ───────────────────────────────────
                    console.log("21. Seeding storage types and units...");
                    storageTypeNames = ["Pallet Rack", "Bin", "Shelf"];
                    storageTypeIds = {};
                    _1 = 0, storageTypeNames_1 = storageTypeNames;
                    _314.label = 128;
                case 128:
                    if (!(_1 < storageTypeNames_1.length)) return [3 /*break*/, 133];
                    stName = storageTypeNames_1[_1];
                    return [4 /*yield*/, client.query("SELECT id FROM \"storageType\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [stName, companyId])];
                case 129:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 130];
                    storageTypeIds[stName] = existing.rows[0].id;
                    return [3 /*break*/, 132];
                case 130: return [4 /*yield*/, client.query("INSERT INTO \"storageType\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [stName, companyId, userId])];
                case 131:
                    r = _314.sent();
                    storageTypeIds[stName] = r.rows[0].id;
                    console.log("   Created storage type \"".concat(stName, "\""));
                    _314.label = 132;
                case 132:
                    _1++;
                    return [3 /*break*/, 128];
                case 133:
                    storageUnits = [
                        { name: "Rack A-01", warehouseId: warehouseId },
                        { name: "Rack A-02", warehouseId: warehouseId },
                        { name: "Bin B-01", warehouseId: warehouseId }
                    ];
                    storageUnitIds = [];
                    _2 = 0, storageUnits_1 = storageUnits;
                    _314.label = 134;
                case 134:
                    if (!(_2 < storageUnits_1.length)) return [3 /*break*/, 139];
                    su = storageUnits_1[_2];
                    return [4 /*yield*/, client.query("SELECT id FROM \"storageUnit\" WHERE name = $1 AND \"locationId\" = $2 LIMIT 1", [su.name, locationId])];
                case 135:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 136];
                    storageUnitIds.push(existing.rows[0].id);
                    return [3 /*break*/, 138];
                case 136: return [4 /*yield*/, client.query("INSERT INTO \"storageUnit\" (name, \"locationId\", \"warehouseId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4, $5) RETURNING id", [su.name, locationId, su.warehouseId, companyId, userId])];
                case 137:
                    r = _314.sent();
                    storageUnitIds.push(r.rows[0].id);
                    console.log("   Created storage unit \"".concat(su.name, "\""));
                    _314.label = 138;
                case 138:
                    _2++;
                    return [3 /*break*/, 134];
                case 139:
                    // ─── Step 22: shift + employeeShift ──────────────────────────────────────
                    console.log("22. Seeding shifts...");
                    shiftsData = L.shifts;
                    shiftIds = {};
                    _3 = 0, shiftsData_1 = shiftsData;
                    _314.label = 140;
                case 140:
                    if (!(_3 < shiftsData_1.length)) return [3 /*break*/, 145];
                    sh = shiftsData_1[_3];
                    return [4 /*yield*/, client.query("SELECT id FROM shift WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [sh.name, companyId])];
                case 141:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 142];
                    shiftIds[sh.key] = existing.rows[0].id;
                    return [3 /*break*/, 144];
                case 142: return [4 /*yield*/, client.query("INSERT INTO shift (name, \"startTime\", \"endTime\", \"locationId\", monday, tuesday, wednesday, thursday, friday, \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id", [
                        sh.name,
                        sh.start,
                        sh.end,
                        locationId,
                        sh.mon,
                        sh.tue,
                        sh.wed,
                        sh.thu,
                        sh.fri,
                        companyId,
                        userId
                    ])];
                case 143:
                    r = _314.sent();
                    shiftIds[sh.key] = r.rows[0].id;
                    console.log("   Created shift \"".concat(sh.name, "\""));
                    _314.label = 144;
                case 144:
                    _3++;
                    return [3 /*break*/, 140];
                case 145: return [4 /*yield*/, client.query("SELECT id FROM employee WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 146:
                    employeeRow = _314.sent();
                    employeeId = (_46 = (_45 = employeeRow.rows[0]) === null || _45 === void 0 ? void 0 : _45.id) !== null && _46 !== void 0 ? _46 : userId;
                    dayShiftId = shiftIds["Day Shift"];
                    if (!dayShiftId) return [3 /*break*/, 149];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"employeeShift\" WHERE \"employeeId\" = $1 AND \"shiftId\" = $2 LIMIT 1", [employeeId, dayShiftId])];
                case 147:
                    existingES = _314.sent();
                    if (!(((_47 = existingES.rowCount) !== null && _47 !== void 0 ? _47 : 0) === 0)) return [3 /*break*/, 149];
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeShift\" (\"employeeId\", \"shiftId\") VALUES ($1, $2)", [employeeId, dayShiftId])];
                case 148:
                    _314.sent();
                    console.log("   Created employee shift assignment");
                    _314.label = 149;
                case 149:
                    // ─── Step 23: material reference tables ───────────────────────────────────
                    console.log("23. Seeding material reference data...");
                    steelSubstanceId = null;
                    aluminumSubstanceId = null;
                    substances = [
                        { code: "STL", name: "Steel" },
                        { code: "ALU", name: "Aluminum" }
                    ];
                    substanceIds = {};
                    _4 = 0, substances_1 = substances;
                    _314.label = 150;
                case 150:
                    if (!(_4 < substances_1.length)) return [3 /*break*/, 155];
                    sub = substances_1[_4];
                    return [4 /*yield*/, client.query("SELECT id FROM \"materialSubstance\" WHERE name = $1 LIMIT 1", [sub.name])];
                case 151:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 152];
                    substanceIds[sub.name] = existing.rows[0].id;
                    return [3 /*break*/, 154];
                case 152: return [4 /*yield*/, client.query("INSERT INTO \"materialSubstance\" (code, name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", [sub.code, sub.name, companyId, userId])];
                case 153:
                    r = _314.sent();
                    substanceIds[sub.name] = r.rows[0].id;
                    console.log("   Created material substance \"".concat(sub.name, "\""));
                    _314.label = 154;
                case 154:
                    _4++;
                    return [3 /*break*/, 150];
                case 155:
                    steelSubstanceId = (_48 = substanceIds["Steel"]) !== null && _48 !== void 0 ? _48 : null;
                    aluminumSubstanceId = (_49 = substanceIds["Aluminum"]) !== null && _49 !== void 0 ? _49 : null;
                    barFormId = null;
                    forms = [
                        { code: "BAR", name: "Bar" },
                        { code: "SHT", name: "Sheet" },
                        { code: "TUB", name: "Tube" }
                    ];
                    formIds = {};
                    _5 = 0, forms_1 = forms;
                    _314.label = 156;
                case 156:
                    if (!(_5 < forms_1.length)) return [3 /*break*/, 161];
                    form = forms_1[_5];
                    return [4 /*yield*/, client.query("SELECT id FROM \"materialForm\" WHERE name = $1 LIMIT 1", [form.name])];
                case 157:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 158];
                    formIds[form.name] = existing.rows[0].id;
                    return [3 /*break*/, 160];
                case 158: return [4 /*yield*/, client.query("INSERT INTO \"materialForm\" (code, name, \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [form.code, form.name, userId])];
                case 159:
                    r = _314.sent();
                    formIds[form.name] = r.rows[0].id;
                    console.log("   Created material form \"".concat(form.name, "\""));
                    _314.label = 160;
                case 160:
                    _5++;
                    return [3 /*break*/, 156];
                case 161:
                    barFormId = (_50 = formIds["Bar"]) !== null && _50 !== void 0 ? _50 : null;
                    gradeId1020 = null;
                    if (!steelSubstanceId) return [3 /*break*/, 167];
                    gradePairs = [
                        { substanceId: steelSubstanceId, name: "1020" },
                        { substanceId: steelSubstanceId, name: "4140" }
                    ];
                    if (aluminumSubstanceId)
                        gradePairs.push({ substanceId: aluminumSubstanceId, name: "6061-T6" });
                    _6 = 0, gradePairs_1 = gradePairs;
                    _314.label = 162;
                case 162:
                    if (!(_6 < gradePairs_1.length)) return [3 /*break*/, 167];
                    gp = gradePairs_1[_6];
                    return [4 /*yield*/, client.query("SELECT id FROM \"materialGrade\" WHERE name = $1 AND \"materialSubstanceId\" = $2 LIMIT 1", [gp.name, gp.substanceId])];
                case 163:
                    existing = _314.sent();
                    if (!(existing.rows.length > 0)) return [3 /*break*/, 164];
                    if (gp.name === "1020")
                        gradeId1020 = existing.rows[0].id;
                    return [3 /*break*/, 166];
                case 164: return [4 /*yield*/, client.query("INSERT INTO \"materialGrade\" (\"materialSubstanceId\", name) VALUES ($1, $2) RETURNING id", [gp.substanceId, gp.name])];
                case 165:
                    r = _314.sent();
                    if (gp.name === "1020")
                        gradeId1020 = r.rows[0].id;
                    console.log("   Created material grade \"".concat(gp.name, "\""));
                    _314.label = 166;
                case 166:
                    _6++;
                    return [3 /*break*/, 162];
                case 167:
                    if (!steelSubstanceId) return [3 /*break*/, 172];
                    finishes = [
                        { substanceId: steelSubstanceId, name: "Raw" },
                        { substanceId: steelSubstanceId, name: "Galvanized" }
                    ];
                    _7 = 0, finishes_1 = finishes;
                    _314.label = 168;
                case 168:
                    if (!(_7 < finishes_1.length)) return [3 /*break*/, 172];
                    f = finishes_1[_7];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"materialFinish\" WHERE name = $1 AND \"materialSubstanceId\" = $2 LIMIT 1", [f.name, f.substanceId])];
                case 169:
                    existing = _314.sent();
                    if (!(((_51 = existing.rowCount) !== null && _51 !== void 0 ? _51 : 0) === 0)) return [3 /*break*/, 171];
                    return [4 /*yield*/, client.query("INSERT INTO \"materialFinish\" (\"materialSubstanceId\", name) VALUES ($1, $2)", [f.substanceId, f.name])];
                case 170:
                    _314.sent();
                    console.log("   Created material finish \"".concat(f.name, "\""));
                    _314.label = 171;
                case 171:
                    _7++;
                    return [3 /*break*/, 168];
                case 172:
                    if (!(steelSubstanceId && barFormId)) return [3 /*break*/, 175];
                    return [4 /*yield*/, client.query("SELECT id FROM \"materialType\" WHERE name = $1 LIMIT 1", ["Carbon Steel Bar"])];
                case 173:
                    existing = _314.sent();
                    if (!(existing.rows.length === 0)) return [3 /*break*/, 175];
                    return [4 /*yield*/, client.query("INSERT INTO \"materialType\" (code, name, \"materialSubstanceId\", \"materialFormId\") VALUES ($1, $2, $3, $4)", ["CSB", "Carbon Steel Bar", steelSubstanceId, barFormId])];
                case 174:
                    _314.sent();
                    console.log("   Created material type \"Carbon Steel Bar\"");
                    _314.label = 175;
                case 175:
                    // ─── Step 24: material + part + consumable + fixture + tool + service ──────
                    // Each type-specific table (part, material, tool, consumable, fixture, service)
                    // is INNER JOINed to item.readableId in its view, so id must equal readableId.
                    console.log("24. Seeding item subtype records...");
                    if (!(steelSubstanceId && barFormId)) return [3 /*break*/, 177];
                    return [4 /*yield*/, client.query("INSERT INTO material (id, \"materialSubstanceId\", \"materialFormId\", \"gradeId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4, $5, $6)\n         ON CONFLICT (id, \"companyId\") DO NOTHING", [
                            "STEEL-ROD-01",
                            steelSubstanceId,
                            barFormId,
                            gradeId1020,
                            companyId,
                            userId
                        ])];
                case 176:
                    _314.sent();
                    console.log("   Upserted material record for STEEL-ROD-01");
                    _314.label = 177;
                case 177:
                    _8 = 0, _9 = [
                        "BEARING-6205",
                        "BRACKET-001",
                        "SHAFT-ASM-001",
                        "CTRL-PCB-001",
                        "TSHIRT-001",
                        "JACKET-001",
                        "FABRIC-CTN-01"
                    ];
                    _314.label = 178;
                case 178:
                    if (!(_8 < _9.length)) return [3 /*break*/, 181];
                    readableId = _9[_8];
                    return [4 /*yield*/, client.query("INSERT INTO part (id, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3)\n         ON CONFLICT (id, \"companyId\") DO NOTHING", [readableId, companyId, userId])];
                case 179:
                    _314.sent();
                    _314.label = 180;
                case 180:
                    _8++;
                    return [3 /*break*/, 178];
                case 181:
                    console.log("   Upserted 4 part records");
                    // Consumable: id must equal item.readableId ("FASTENER-KIT-01")
                    // Note: itemId was dropped from consumable in the revisions migration
                    return [4 /*yield*/, client.query("INSERT INTO consumable (id, \"companyId\", \"createdBy\")\n       VALUES ($1, $2, $3)\n       ON CONFLICT (id, \"companyId\") DO NOTHING", ["FASTENER-KIT-01", companyId, userId])];
                case 182:
                    // Consumable: id must equal item.readableId ("FASTENER-KIT-01")
                    // Note: itemId was dropped from consumable in the revisions migration
                    _314.sent();
                    console.log("   Upserted consumable record for FASTENER-KIT-01");
                    // Tool: create item first, then tool record with id=readableId
                    // Note: itemId was dropped from tool in the revisions migration
                    return [4 /*yield*/, client.query("INSERT INTO item (\"readableId\", name, description, type, \"replenishmentSystem\", \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\")\n       VALUES ('DRILL-JIG-01', 'Drill Jig Fixture', 'Custom drill jig for bracket machining', 'Tool'::\"itemType\", 'Buy'::\"itemReplenishmentSystem\", 'Inventory'::\"itemTrackingType\", 'EA', true, $1, $2)\n       ON CONFLICT DO NOTHING", [companyId, userId])];
                case 183:
                    // Tool: create item first, then tool record with id=readableId
                    // Note: itemId was dropped from tool in the revisions migration
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO tool (id, \"companyId\", \"createdBy\")\n       VALUES ($1, $2, $3)\n       ON CONFLICT (id, \"companyId\") DO NOTHING", ["DRILL-JIG-01", companyId, userId])];
                case 184:
                    _314.sent();
                    console.log("   Upserted tool record for DRILL-JIG-01");
                    return [4 /*yield*/, client.query("INSERT INTO item (\"readableId\", name, description, type, \"replenishmentSystem\", \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\")\n       VALUES ('CLAMP-FIXTURE-01', 'Workholding Clamp Fixture', 'CNC workholding clamp fixture for machining operations', 'Fixture'::\"itemType\", 'Buy'::\"itemReplenishmentSystem\", 'Inventory'::\"itemTrackingType\", 'EA', true, $1, $2)\n       ON CONFLICT DO NOTHING RETURNING id", [companyId, userId])];
                case 185:
                    fixtureItemInsert = _314.sent();
                    fixtureItemId = (_53 = (_52 = fixtureItemInsert.rows[0]) === null || _52 === void 0 ? void 0 : _52.id) !== null && _53 !== void 0 ? _53 : null;
                    if (!!fixtureItemId) return [3 /*break*/, 187];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = 'CLAMP-FIXTURE-01' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 186:
                    r = _314.sent();
                    fixtureItemId = (_55 = (_54 = r.rows[0]) === null || _54 === void 0 ? void 0 : _54.id) !== null && _55 !== void 0 ? _55 : null;
                    _314.label = 187;
                case 187: return [4 /*yield*/, client.query("INSERT INTO fixture (id, \"itemId\", \"companyId\", \"createdBy\")\n       VALUES ($1, $2, $3, $4)\n       ON CONFLICT (id, \"companyId\") DO NOTHING", ["CLAMP-FIXTURE-01", fixtureItemId, companyId, userId])];
                case 188:
                    _314.sent();
                    console.log("   Upserted fixture record for CLAMP-FIXTURE-01");
                    return [4 /*yield*/, client.query("INSERT INTO item (\"readableId\", name, description, type, \"replenishmentSystem\", \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\")\n       VALUES ('MAINT-SVC-01', 'Preventive Maintenance Service', 'Annual preventive maintenance and calibration service', 'Service'::\"itemType\", 'Buy'::\"itemReplenishmentSystem\", 'Non-Inventory'::\"itemTrackingType\", 'EA', true, $1, $2)\n       ON CONFLICT DO NOTHING RETURNING id", [companyId, userId])];
                case 189:
                    serviceItemInsert = _314.sent();
                    serviceItemId = (_57 = (_56 = serviceItemInsert.rows[0]) === null || _56 === void 0 ? void 0 : _56.id) !== null && _57 !== void 0 ? _57 : null;
                    if (!!serviceItemId) return [3 /*break*/, 191];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = 'MAINT-SVC-01' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 190:
                    r = _314.sent();
                    serviceItemId = (_59 = (_58 = r.rows[0]) === null || _58 === void 0 ? void 0 : _58.id) !== null && _59 !== void 0 ? _59 : null;
                    _314.label = 191;
                case 191: return [4 /*yield*/, client.query("INSERT INTO service (id, \"itemId\", \"serviceType\", \"companyId\", \"createdBy\")\n       VALUES ($1, $2, 'External'::\"serviceType\", $3, $4)\n       ON CONFLICT (id, \"companyId\") DO NOTHING", ["MAINT-SVC-01", serviceItemId, companyId, userId])];
                case 192:
                    _314.sent();
                    console.log("   Upserted service record for MAINT-SVC-01");
                    // ─── Step 25: supplier extensions ────────────────────────────────────────
                    console.log("25. Seeding supplier extensions...");
                    acmeSupplierId = supplierIds["Acme Steel Supply"];
                    pacificSupplierId = supplierIds["Pacific Electronics"];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"supplierPart\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 193:
                    existingSupplierPart = _314.sent();
                    if (!(((_60 = existingSupplierPart.rowCount) !== null && _60 !== void 0 ? _60 : 0) === 0)) return [3 /*break*/, 198];
                    steelItemId = itemIds["STEEL-ROD-01"];
                    pcbItemId = itemIds["CTRL-PCB-001"];
                    if (!(steelItemId && acmeSupplierId)) return [3 /*break*/, 195];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierPart\" (\"itemId\", \"supplierId\", \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 5.50, $3, $4)", [steelItemId, acmeSupplierId, companyId, userId])];
                case 194:
                    _314.sent();
                    console.log("   Created supplier part (steel rod / Acme)");
                    _314.label = 195;
                case 195:
                    if (!(pcbItemId && pacificSupplierId)) return [3 /*break*/, 198];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierPart\" (\"itemId\", \"supplierId\", \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 45.00, $3, $4) RETURNING id", [pcbItemId, pacificSupplierId, companyId, userId])];
                case 196:
                    sp = _314.sent();
                    // supplierPartPrice
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierPartPrice\" (\"supplierPartId\", quantity, \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, 1, 45.00, $2, $3)", [sp.rows[0].id, companyId, userId])];
                case 197:
                    // supplierPartPrice
                    _314.sent();
                    console.log("   Created supplier part + price (PCB / Pacific)");
                    _314.label = 198;
                case 198:
                    fastCNCSupplierId = supplierIds["FastCNC Services"];
                    cncProcId = processIds["CNC Machining"];
                    if (!(fastCNCSupplierId && cncProcId)) return [3 /*break*/, 201];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"supplierProcess\" WHERE \"supplierId\" = $1 AND \"companyId\" = $2 LIMIT 1", [fastCNCSupplierId, companyId])];
                case 199:
                    existingSP = _314.sent();
                    if (!(((_61 = existingSP.rowCount) !== null && _61 !== void 0 ? _61 : 0) === 0)) return [3 /*break*/, 201];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierProcess\" (\"supplierId\", \"processId\", \"minimumCost\", \"unitCost\", \"leadTime\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 50.00, 2.50, 5, $3, $4)", [fastCNCSupplierId, cncProcId, companyId, userId])];
                case 200:
                    _314.sent();
                    console.log("   Created supplier process");
                    _314.label = 201;
                case 201: return [4 /*yield*/, client.query("SELECT 1 FROM \"supplierAccount\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 202:
                    existingSupplierAccount = _314.sent();
                    if (!(((_62 = existingSupplierAccount.rowCount) !== null && _62 !== void 0 ? _62 : 0) === 0 && acmeSupplierId)) return [3 /*break*/, 204];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierAccount\" (id, \"supplierId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [userId, acmeSupplierId, companyId])];
                case 203:
                    _314.sent();
                    console.log("   Created supplier account");
                    _314.label = 204;
                case 204:
                    firstCustId = customerIds["Precision Motors LLC"];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"customerAccount\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 205:
                    existingCustomerAccount = _314.sent();
                    if (!(((_63 = existingCustomerAccount.rowCount) !== null && _63 !== void 0 ? _63 : 0) === 0 && firstCustId)) return [3 /*break*/, 207];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerAccount\" (id, \"customerId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [userId, firstCustId, companyId])];
                case 206:
                    _314.sent();
                    console.log("   Created customer account");
                    _314.label = 207;
                case 207:
                    // ─── Step 26: makeMethod + methodOperation + methodMaterial ──────────────
                    console.log("26. Seeding make methods...");
                    bracketItemId2 = itemIds["BRACKET-001"];
                    makeMethodId = null;
                    methodOpId = null;
                    if (!bracketItemId2) return [3 /*break*/, 221];
                    return [4 /*yield*/, client.query("SELECT id FROM \"makeMethod\" WHERE \"itemId\" = $1 AND \"companyId\" = $2 LIMIT 1", [bracketItemId2, companyId])];
                case 208:
                    existingMM = _314.sent();
                    if (!(existingMM.rows.length > 0)) return [3 /*break*/, 209];
                    makeMethodId = existingMM.rows[0].id;
                    return [3 /*break*/, 211];
                case 209: return [4 /*yield*/, client.query("INSERT INTO \"makeMethod\" (\"itemId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [bracketItemId2, companyId, userId])];
                case 210:
                    r = _314.sent();
                    makeMethodId = r.rows[0].id;
                    console.log("   Created make method for BRACKET-001");
                    _314.label = 211;
                case 211:
                    if (!(makeMethodId && cncProcId)) return [3 /*break*/, 221];
                    return [4 /*yield*/, client.query("SELECT id FROM \"methodOperation\" WHERE \"makeMethodId\" = $1 LIMIT 1", [makeMethodId])];
                case 212:
                    existingMO = _314.sent();
                    if (!(existingMO.rows.length > 0)) return [3 /*break*/, 213];
                    methodOpId = existingMO.rows[0].id;
                    return [3 /*break*/, 215];
                case 213: return [4 /*yield*/, client.query("INSERT INTO \"methodOperation\" (\"makeMethodId\", \"processId\", \"workCenterId\", description, \"laborTime\", \"laborUnit\", \"machineTime\", \"machineUnit\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, 'CNC mill profile', 30, 'Minutes/Piece'::factor, 30, 'Minutes/Piece'::factor, $4, $5) RETURNING id", [
                        makeMethodId,
                        cncProcId,
                        (_64 = workCenterIds["CNC Mill #1"]) !== null && _64 !== void 0 ? _64 : null,
                        companyId,
                        userId
                    ])];
                case 214:
                    r = _314.sent();
                    methodOpId = r.rows[0].id;
                    console.log("   Created method operation");
                    _314.label = 215;
                case 215:
                    if (!methodOpId) return [3 /*break*/, 218];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"methodOperationStep\" WHERE \"operationId\" = $1 LIMIT 1", [methodOpId])];
                case 216:
                    existingMOS = _314.sent();
                    if (!(((_65 = existingMOS.rowCount) !== null && _65 !== void 0 ? _65 : 0) === 0)) return [3 /*break*/, 218];
                    return [4 /*yield*/, client.query("INSERT INTO \"methodOperationStep\" (name, \"operationId\", \"type\", required, \"sortOrder\", \"companyId\", \"createdBy\")\n               VALUES ('Verify part dimensions', $1, 'Measurement'::\"procedureStepType\", true, 1, $2, $3)", [methodOpId, companyId, userId])];
                case 217:
                    _314.sent();
                    console.log("   Created method operation step");
                    _314.label = 218;
                case 218:
                    if (!(makeMethodId && methodOpId)) return [3 /*break*/, 221];
                    steelItemId2 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId2) return [3 /*break*/, 221];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"methodMaterial\" WHERE \"makeMethodId\" = $1 LIMIT 1", [makeMethodId])];
                case 219:
                    existingMM2 = _314.sent();
                    if (!(((_66 = existingMM2.rowCount) !== null && _66 !== void 0 ? _66 : 0) === 0)) return [3 /*break*/, 221];
                    return [4 /*yield*/, client.query("INSERT INTO \"methodMaterial\" (\"makeMethodId\", \"methodOperationId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"companyId\", \"createdBy\")\n                 VALUES ($1, $2, $3, 1.2, 'EA', $4, $5)", [makeMethodId, methodOpId, steelItemId2, companyId, userId])];
                case 220:
                    _314.sent();
                    console.log("   Created method material");
                    _314.label = 221;
                case 221:
                    // ─── Step 27: template + templateMakeMethod + templateMethodOperation ──────
                    console.log("27. Seeding templates...");
                    templateId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM template WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["Standard Manufacturing Template", companyId])];
                case 222:
                    existingTemplate = _314.sent();
                    if (!(existingTemplate.rows.length > 0)) return [3 /*break*/, 223];
                    templateId = existingTemplate.rows[0].id;
                    return [3 /*break*/, 225];
                case 223: return [4 /*yield*/, client.query("INSERT INTO template (name, description, \"companyId\") VALUES ($1, $2, $3) RETURNING id", [
                        "Standard Manufacturing Template",
                        "Reusable template for CNC machined parts",
                        companyId
                    ])];
                case 224:
                    r = _314.sent();
                    templateId = r.rows[0].id;
                    console.log("   Created template");
                    _314.label = 225;
                case 225:
                    tmMakeMethodId = null;
                    if (!(templateId && cncProcId)) return [3 /*break*/, 233];
                    return [4 /*yield*/, client.query("SELECT id FROM \"templateMakeMethod\" WHERE \"templateId\" = $1 LIMIT 1", [templateId])];
                case 226:
                    existingTMM = _314.sent();
                    if (!(existingTMM.rows.length > 0)) return [3 /*break*/, 227];
                    tmMakeMethodId = existingTMM.rows[0].id;
                    return [3 /*break*/, 229];
                case 227: return [4 /*yield*/, client.query("INSERT INTO \"templateMakeMethod\" (\"templateId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3) RETURNING id", [templateId, companyId, userId])];
                case 228:
                    r = _314.sent();
                    tmMakeMethodId = r.rows[0].id;
                    console.log("   Created template make method");
                    _314.label = 229;
                case 229:
                    if (!tmMakeMethodId) return [3 /*break*/, 233];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"templateMethodOperation\" WHERE \"templateMakeMethodId\" = $1 LIMIT 1", [tmMakeMethodId])];
                case 230:
                    existingTMO = _314.sent();
                    if (!(((_67 = existingTMO.rowCount) !== null && _67 !== void 0 ? _67 : 0) === 0)) return [3 /*break*/, 233];
                    return [4 /*yield*/, client.query("INSERT INTO \"templateMethodOperation\" (\"templateMakeMethodId\", \"processId\", description, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, 'Standard CNC operation', $3, $4) RETURNING id", [tmMakeMethodId, cncProcId, companyId, userId])];
                case 231:
                    tmoRow = _314.sent();
                    tmoId = tmoRow.rows[0].id;
                    console.log("   Created template method operation");
                    steelItemId3 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId3) return [3 /*break*/, 233];
                    return [4 /*yield*/, client.query("INSERT INTO \"templateMethodMaterial\" (\"templateMakeMethodId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"methodOperationId\", \"sourcingType\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, 1.0, 'EA', $3, 'Specified'::\"sourcingType\", $4, $5)", [tmMakeMethodId, steelItemId3, tmoId, companyId, userId])];
                case 232:
                    _314.sent();
                    console.log("   Created template method material");
                    _314.label = 233;
                case 233:
                    // ─── Step 28: procedure + procedureStep ───────────────────────────────────
                    console.log("28. Seeding procedures...");
                    procedureId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM procedure WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["CNC Setup Procedure", companyId])];
                case 234:
                    existingProc = _314.sent();
                    if (!(existingProc.rows.length > 0)) return [3 /*break*/, 235];
                    procedureId = existingProc.rows[0].id;
                    return [3 /*break*/, 237];
                case 235: return [4 /*yield*/, client.query("INSERT INTO procedure (name, \"processId\", description, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'Standard procedure for CNC machine setup and inspection', $3, $4) RETURNING id", ["CNC Setup Procedure", cncProcId !== null && cncProcId !== void 0 ? cncProcId : null, companyId, userId])];
                case 236:
                    r = _314.sent();
                    procedureId = r.rows[0].id;
                    console.log("   Created procedure \"CNC Setup Procedure\"");
                    _314.label = 237;
                case 237:
                    if (!procedureId) return [3 /*break*/, 241];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"procedureStep\" WHERE \"procedureId\" = $1 LIMIT 1", [procedureId])];
                case 238:
                    existingPS = _314.sent();
                    if (!(((_68 = existingPS.rowCount) !== null && _68 !== void 0 ? _68 : 0) === 0)) return [3 /*break*/, 241];
                    return [4 /*yield*/, client.query("INSERT INTO \"procedureStep\" (\"procedureId\", name, required, \"sortOrder\", type, \"companyId\", \"createdBy\")\n           VALUES ($1, 'Verify cutting tool condition', true, 1, 'Checkbox'::\"procedureStepType\", $2, $3)", [procedureId, companyId, userId])];
                case 239:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"procedureStep\" (\"procedureId\", name, required, \"sortOrder\", type, \"unitOfMeasureCode\", \"minValue\", \"maxValue\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Measure part thickness', true, 2, 'Measurement'::\"procedureStepType\", 'INCH', 9.8, 10.2, $2, $3)", [procedureId, companyId, userId])];
                case 240:
                    _314.sent();
                    console.log("   Created 2 procedure steps");
                    _314.label = 241;
                case 241:
                    // ─── Step 29: qualityDocument ─────────────────────────────────────────────
                    console.log("29. Seeding quality documents...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"qualityDocument\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 242:
                    existingQD = _314.sent();
                    if (!(((_69 = existingQD.rowCount) !== null && _69 !== void 0 ? _69 : 0) === 0)) return [3 /*break*/, 244];
                    return [4 /*yield*/, client.query("INSERT INTO \"qualityDocument\" (name, description, \"companyId\", \"createdBy\")\n         VALUES ('ISO 9001 Quality Manual', 'Company quality management system documentation', $1, $2)", [companyId, userId])];
                case 243:
                    _314.sent();
                    console.log("   Created quality document");
                    _314.label = 244;
                case 244: return [4 /*yield*/, client.query("SELECT id FROM \"group\" WHERE name = 'All Employees' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 245:
                    allEmployeesGroupRow2 = _314.sent();
                    allEmployeesId = (_71 = (_70 = allEmployeesGroupRow2.rows[0]) === null || _70 === void 0 ? void 0 : _70.id) !== null && _71 !== void 0 ? _71 : null;
                    return [4 /*yield*/, client.query("SELECT id FROM \"group\" WHERE name = 'Admin' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 246:
                    adminGroupRow = _314.sent();
                    adminGroupId2 = (_73 = (_72 = adminGroupRow.rows[0]) === null || _72 === void 0 ? void 0 : _72.id) !== null && _73 !== void 0 ? _73 : null;
                    // ─── Step 30: training + trainingQuestion + trainingAssignment ─────────────
                    console.log("30. Seeding training...");
                    trainingId = null;
                    trainingAssignmentId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM training WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["CNC Machine Safety Training", companyId])];
                case 247:
                    existingTrain = _314.sent();
                    if (!(existingTrain.rows.length > 0)) return [3 /*break*/, 248];
                    trainingId = existingTrain.rows[0].id;
                    return [3 /*break*/, 250];
                case 248: return [4 /*yield*/, client.query("INSERT INTO training (name, description, status, frequency, type, \"processId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'Active'::\"trainingStatus\", 'Annual'::\"trainingFrequency\", 'Mandatory'::\"trainingType\", $3, $4, $5) RETURNING id", [
                        "CNC Machine Safety Training",
                        "Annual safety training for CNC machine operators",
                        cncProcId !== null && cncProcId !== void 0 ? cncProcId : null,
                        companyId,
                        userId
                    ])];
                case 249:
                    r = _314.sent();
                    trainingId = r.rows[0].id;
                    console.log("   Created training \"CNC Machine Safety Training\"");
                    _314.label = 250;
                case 250:
                    if (!trainingId) return [3 /*break*/, 261];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"trainingQuestion\" WHERE \"trainingId\" = $1 LIMIT 1", [trainingId])];
                case 251:
                    existingTQ = _314.sent();
                    if (!(((_74 = existingTQ.rowCount) !== null && _74 !== void 0 ? _74 : 0) === 0)) return [3 /*break*/, 254];
                    return [4 /*yield*/, client.query("INSERT INTO \"trainingQuestion\" (\"trainingId\", question, type, \"sortOrder\", required, options, \"correctAnswers\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'What is the minimum safe distance from a running CNC machine?', 'MultipleChoice'::\"trainingQuestionType\", 1, true,\n                   ARRAY['1 foot', '3 feet', '6 feet', '10 feet'], ARRAY['3 feet'], $2, $3)", [trainingId, companyId, userId])];
                case 252:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"trainingQuestion\" (\"trainingId\", question, type, \"sortOrder\", required, \"correctBoolean\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'You must wear safety glasses when operating a CNC machine.', 'TrueFalse'::\"trainingQuestionType\", 2, true, true, $2, $3)", [trainingId, companyId, userId])];
                case 253:
                    _314.sent();
                    console.log("   Created 2 training questions");
                    _314.label = 254;
                case 254: return [4 /*yield*/, client.query("SELECT id FROM \"trainingAssignment\" WHERE \"trainingId\" = $1 LIMIT 1", [trainingId])];
                case 255:
                    existingTA = _314.sent();
                    if (!(existingTA.rows.length > 0)) return [3 /*break*/, 256];
                    trainingAssignmentId = existingTA.rows[0].id;
                    return [3 /*break*/, 258];
                case 256: return [4 /*yield*/, client.query("INSERT INTO \"trainingAssignment\" (\"trainingId\", \"groupIds\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", [
                        trainingId,
                        allEmployeesId ? [allEmployeesId] : null,
                        companyId,
                        userId
                    ])];
                case 257:
                    r = _314.sent();
                    trainingAssignmentId = r.rows[0].id;
                    console.log("   Created training assignment");
                    _314.label = 258;
                case 258:
                    if (!trainingAssignmentId) return [3 /*break*/, 261];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"trainingCompletion\" WHERE \"trainingAssignmentId\" = $1 LIMIT 1", [trainingAssignmentId])];
                case 259:
                    existingTC = _314.sent();
                    if (!(((_75 = existingTC.rowCount) !== null && _75 !== void 0 ? _75 : 0) === 0)) return [3 /*break*/, 261];
                    return [4 /*yield*/, client.query("INSERT INTO \"trainingCompletion\" (\"trainingAssignmentId\", \"employeeId\", \"companyId\", \"completedBy\", \"createdBy\")\n             VALUES ($1, $2, $3, $4, $5)", [trainingAssignmentId, employeeId, companyId, userId, userId])];
                case 260:
                    _314.sent();
                    console.log("   Created training completion");
                    _314.label = 261;
                case 261:
                    // ─── Step 31: nonConformanceWorkflow + nonConformance ─────────────────────
                    console.log("31. Seeding non-conformances...");
                    _ncWorkflowId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceWorkflow\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["Standard NC Workflow", companyId])];
                case 262:
                    existingNCW = _314.sent();
                    if (!(existingNCW.rows.length > 0)) return [3 /*break*/, 263];
                    _ncWorkflowId = existingNCW.rows[0].id;
                    return [3 /*break*/, 265];
                case 263: return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceWorkflow\" (name, description, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4) RETURNING id", [
                        "Standard NC Workflow",
                        "Default workflow for handling non-conformances",
                        companyId,
                        userId
                    ])];
                case 264:
                    r = _314.sent();
                    _ncWorkflowId = r.rows[0].id;
                    console.log("   Created non-conformance workflow");
                    _314.label = 265;
                case 265:
                    _10 = 0, _11 = ["Dimensional", "Visual", "Functional"];
                    _314.label = 266;
                case 266:
                    if (!(_10 < _11.length)) return [3 /*break*/, 270];
                    typeName = _11[_10];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"nonConformanceType\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [typeName, companyId])];
                case 267:
                    ex = _314.sent();
                    if (!(((_76 = ex.rowCount) !== null && _76 !== void 0 ? _76 : 0) === 0)) return [3 /*break*/, 269];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceType\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [typeName, companyId, userId])];
                case 268:
                    _314.sent();
                    _314.label = 269;
                case 269:
                    _10++;
                    return [3 /*break*/, 266];
                case 270: return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceType\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 271:
                    ncTypeRow = _314.sent();
                    ncTypeId = (_77 = ncTypeRow.rows[0]) === null || _77 === void 0 ? void 0 : _77.id;
                    if (!ncTypeId) return [3 /*break*/, 278];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"nonConformance\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 272:
                    existingNC = _314.sent();
                    if (!(((_78 = existingNC.rowCount) !== null && _78 !== void 0 ? _78 : 0) === 0)) return [3 /*break*/, 278];
                    return [4 /*yield*/, nextSeq("nonConformance")];
                case 273:
                    ncReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformance\" (\"nonConformanceId\", name, source, \"nonConformanceTypeId\", \"locationId\", \"openDate\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Dimension out of tolerance on bracket', 'Internal'::\"nonConformanceSource\", $2, $3, CURRENT_DATE, $4, $5) RETURNING id", [ncReadableId, ncTypeId, locationId, companyId, userId])];
                case 274:
                    ncRow = _314.sent();
                    ncId = ncRow.rows[0].id;
                    console.log("   Created non-conformance \"".concat(ncReadableId, "\""));
                    bracketId = itemIds["BRACKET-001"];
                    if (!bracketId) return [3 /*break*/, 276];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceItem\" (\"nonConformanceId\", \"itemId\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, bracketId, companyId, userId])];
                case 275:
                    _314.sent();
                    _314.label = 276;
                case 276:
                    if (!acmeSupplierId) return [3 /*break*/, 278];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceSupplier\" (\"nonConformanceId\", \"supplierId\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, acmeSupplierId, companyId, userId])];
                case 277:
                    _314.sent();
                    _314.label = 278;
                case 278:
                    // ─── Step 32: maintenanceSchedule + maintenanceDispatch ──────────────────
                    console.log("32. Seeding maintenance...");
                    cncWCId = workCenterIds["CNC Mill #1"];
                    maintenanceScheduleId = null;
                    if (!cncWCId) return [3 /*break*/, 292];
                    return [4 /*yield*/, client.query("SELECT id FROM \"maintenanceSchedule\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["CNC Mill Monthly PM", companyId])];
                case 279:
                    existingMS = _314.sent();
                    if (!(existingMS.rows.length > 0)) return [3 /*break*/, 280];
                    maintenanceScheduleId = existingMS.rows[0].id;
                    return [3 /*break*/, 282];
                case 280: return [4 /*yield*/, client.query("INSERT INTO \"maintenanceSchedule\" (name, description, \"workCenterId\", frequency, priority, \"estimatedDuration\", \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, 'Monthly'::\"maintenanceFrequency\", 'Medium'::\"maintenanceDispatchPriority\", 120, $4, $5, $6) RETURNING id", [
                        "CNC Mill Monthly PM",
                        "Monthly preventive maintenance for CNC Mill #1",
                        cncWCId,
                        locationId,
                        companyId,
                        userId
                    ])];
                case 281:
                    r = _314.sent();
                    maintenanceScheduleId = r.rows[0].id;
                    console.log("   Created maintenance schedule");
                    _314.label = 282;
                case 282: return [4 /*yield*/, client.query("SELECT 1 FROM \"maintenanceDispatch\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 283:
                    existingMD = _314.sent();
                    if (!(((_79 = existingMD.rowCount) !== null && _79 !== void 0 ? _79 : 0) === 0)) return [3 /*break*/, 292];
                    return [4 /*yield*/, nextSeq("maintenanceDispatch")];
                case 284:
                    mdReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatch\" (\"maintenanceDispatchId\", \"workCenterId\", \"maintenanceScheduleId\", status, priority, severity, \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, 'Open'::\"maintenanceDispatchStatus\", 'Medium'::\"maintenanceDispatchPriority\", 'Support Required'::\"maintenanceSeverity\", $4, $5, $6) RETURNING id", [
                            mdReadableId,
                            cncWCId,
                            maintenanceScheduleId,
                            locationId,
                            companyId,
                            userId
                        ])];
                case 285:
                    mdRow = _314.sent();
                    mdId = mdRow.rows[0].id;
                    console.log("   Created maintenance dispatch \"".concat(mdReadableId, "\""));
                    // maintenanceDispatchWorkCenter
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchWorkCenter\" (\"maintenanceDispatchId\", \"workCenterId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [mdId, cncWCId, companyId, userId])];
                case 286:
                    // maintenanceDispatchWorkCenter
                    _314.sent();
                    if (!maintenanceScheduleId) return [3 /*break*/, 290];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"maintenanceScheduleItem\" WHERE \"maintenanceScheduleId\" = $1 LIMIT 1", [maintenanceScheduleId])];
                case 287:
                    existingMSI = _314.sent();
                    if (!(((_80 = existingMSI.rowCount) !== null && _80 !== void 0 ? _80 : 0) === 0)) return [3 /*break*/, 290];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = 'FASTENER-KIT-01' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 288:
                    fastenerItemRow = _314.sent();
                    fastenerItemId = (_81 = fastenerItemRow.rows[0]) === null || _81 === void 0 ? void 0 : _81.id;
                    if (!fastenerItemId) return [3 /*break*/, 290];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceScheduleItem\" (\"maintenanceScheduleId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"companyId\", \"createdBy\")\n                 VALUES ($1, $2, 1, 'EA', $3, $4)", [maintenanceScheduleId, fastenerItemId, companyId, userId])];
                case 289:
                    _314.sent();
                    _314.label = 290;
                case 290: 
                // maintenanceDispatchComment
                return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchComment\" (\"maintenanceDispatchId\", \"companyId\", \"createdBy\", comment)\n           VALUES ($1, $2, $3, 'Scheduled monthly maintenance initiated') ON CONFLICT DO NOTHING", [mdId, companyId, userId])];
                case 291:
                    // maintenanceDispatchComment
                    _314.sent();
                    _314.label = 292;
                case 292:
                    // ─── Step 33: gauge + gaugeCalibrationRecord ──────────────────────────────
                    console.log("33. Seeding gauges...");
                    _12 = 0, _13 = ["Caliper", "Micrometer", "Gauge Block"];
                    _314.label = 293;
                case 293:
                    if (!(_12 < _13.length)) return [3 /*break*/, 297];
                    typeName = _13[_12];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"gaugeType\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [typeName, companyId])];
                case 294:
                    ex = _314.sent();
                    if (!(((_82 = ex.rowCount) !== null && _82 !== void 0 ? _82 : 0) === 0)) return [3 /*break*/, 296];
                    return [4 /*yield*/, client.query("INSERT INTO \"gaugeType\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [typeName, companyId, userId])];
                case 295:
                    _314.sent();
                    _314.label = 296;
                case 296:
                    _12++;
                    return [3 /*break*/, 293];
                case 297: return [4 /*yield*/, client.query("SELECT id FROM \"gaugeType\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 298:
                    gaugeTypeRow = _314.sent();
                    gaugeTypeId = (_83 = gaugeTypeRow.rows[0]) === null || _83 === void 0 ? void 0 : _83.id;
                    gaugeRecordId = null;
                    if (!gaugeTypeId) return [3 /*break*/, 306];
                    return [4 /*yield*/, client.query("SELECT id FROM gauge WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 299:
                    existingGauge = _314.sent();
                    if (!(existingGauge.rows.length > 0)) return [3 /*break*/, 300];
                    gaugeRecordId = existingGauge.rows[0].id;
                    return [3 /*break*/, 303];
                case 300: return [4 /*yield*/, nextSeq("gauge")];
                case 301:
                    gReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO gauge (\"gaugeId\", \"gaugeTypeId\", description, \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 'Digital caliper for part measurement', $3, $4, $5) RETURNING id", [gReadableId, gaugeTypeId, locationId, companyId, userId])];
                case 302:
                    r = _314.sent();
                    gaugeRecordId = r.rows[0].id;
                    console.log("   Created gauge \"".concat(gReadableId, "\""));
                    _314.label = 303;
                case 303:
                    if (!gaugeRecordId) return [3 /*break*/, 306];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"gaugeCalibrationRecord\" WHERE \"gaugeId\" = $1 LIMIT 1", [gaugeRecordId])];
                case 304:
                    existingGCR = _314.sent();
                    if (!(((_84 = existingGCR.rowCount) !== null && _84 !== void 0 ? _84 : 0) === 0)) return [3 /*break*/, 306];
                    return [4 /*yield*/, client.query("INSERT INTO \"gaugeCalibrationRecord\" (\"gaugeId\", \"dateCalibrated\", \"inspectionStatus\", \"companyId\", \"createdBy\")\n             VALUES ($1, CURRENT_DATE - INTERVAL '30 days', 'Pass'::\"inspectionStatus\", $2, $3)", [gaugeRecordId, companyId, userId])];
                case 305:
                    _314.sent();
                    console.log("   Created gauge calibration record");
                    _314.label = 306;
                case 306:
                    // ─── Step 34: riskRegister ────────────────────────────────────────────────
                    console.log("34. Seeding risk register...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"riskRegister\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 307:
                    existingRR = _314.sent();
                    if (!(((_85 = existingRR.rowCount) !== null && _85 !== void 0 ? _85 : 0) === 0)) return [3 /*break*/, 310];
                    return [4 /*yield*/, client.query("INSERT INTO \"riskRegister\" (\"companyId\", title, description, source, severity, likelihood, status, \"createdBy\")\n         VALUES ($1, 'Single-source supplier risk', 'Reliance on one supplier for critical PCB components', 'Supplier'::\"riskSource\", 4, 3, 'Open'::\"riskStatus\", $2)", [companyId, userId])];
                case 308:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"riskRegister\" (\"companyId\", title, description, source, severity, likelihood, status, \"createdBy\")\n         VALUES ($1, 'Machine downtime impact', 'CNC Mill #1 has no backup machine available', 'Work Center'::\"riskSource\", 3, 2, 'In Review'::\"riskStatus\", $2)", [companyId, userId])];
                case 309:
                    _314.sent();
                    console.log("   Created 2 risk register entries");
                    _314.label = 310;
                case 310:
                    // ─── Step 35: document + note ─────────────────────────────────────────────
                    console.log("35. Seeding documents and notes...");
                    documentId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM document WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 311:
                    existingDoc = _314.sent();
                    if (!(existingDoc.rows.length > 0)) return [3 /*break*/, 312];
                    documentId = existingDoc.rows[0].id;
                    return [3 /*break*/, 314];
                case 312: return [4 /*yield*/, client.query("INSERT INTO document (path, name, description, size, type, \"readGroups\", \"writeGroups\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, $4, 'PDF'::\"documentType\", $5, $6, $7, $8) RETURNING id", [
                        "/documents/bracket-drawing-rev2.pdf",
                        "Bracket Drawing Rev2",
                        "Engineering drawing for Mounting Bracket A",
                        245000,
                        allEmployeesId ? [allEmployeesId] : null,
                        adminGroupId2 ? [adminGroupId2] : null,
                        companyId,
                        userId
                    ])];
                case 313:
                    r = _314.sent();
                    documentId = r.rows[0].id;
                    console.log("   Created document");
                    _314.label = 314;
                case 314:
                    if (!documentId) return [3 /*break*/, 317];
                    return [4 /*yield*/, client.query("SELECT 1 FROM note WHERE \"documentId\" = $1 LIMIT 1", [documentId])];
                case 315:
                    existingNote = _314.sent();
                    if (!(((_86 = existingNote.rowCount) !== null && _86 !== void 0 ? _86 : 0) === 0)) return [3 /*break*/, 317];
                    return [4 /*yield*/, client.query("INSERT INTO note (\"documentId\", note, \"companyId\", \"createdBy\")\n           VALUES ($1, 'Updated dimension tolerances in section 3.2 per ECO-2024-001', $2, $3)", [documentId, companyId, userId])];
                case 316:
                    _314.sent();
                    console.log("   Created note");
                    _314.label = 317;
                case 317:
                    // ─── Step 36: tag ─────────────────────────────────────────────────────────
                    console.log("36. Seeding tags...");
                    tagsData = [
                        { name: "Critical", table: "item" },
                        { name: "Preferred", table: "supplier" },
                        { name: "Urgent", table: "purchaseOrder" },
                        { name: "Review", table: "nonConformance" }
                    ];
                    _14 = 0, tagsData_1 = tagsData;
                    _314.label = 318;
                case 318:
                    if (!(_14 < tagsData_1.length)) return [3 /*break*/, 322];
                    tag = tagsData_1[_14];
                    return [4 /*yield*/, client.query("SELECT 1 FROM tag WHERE name = $1 AND \"table\" = $2 AND \"companyId\" = $3 LIMIT 1", [tag.name, tag.table, companyId])];
                case 319:
                    existing = _314.sent();
                    if (!(((_87 = existing.rowCount) !== null && _87 !== void 0 ? _87 : 0) === 0)) return [3 /*break*/, 321];
                    return [4 /*yield*/, client.query("INSERT INTO tag (name, \"table\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [tag.name, tag.table, companyId, userId])];
                case 320:
                    _314.sent();
                    _314.label = 321;
                case 321:
                    _14++;
                    return [3 /*break*/, 318];
                case 322:
                    console.log("   Created 4 tags");
                    // ─── Step 37: opportunity ─────────────────────────────────────────────────
                    console.log("37. Seeding opportunities...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM opportunity WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 323:
                    existingOpp = _314.sent();
                    if (!(((_88 = existingOpp.rowCount) !== null && _88 !== void 0 ? _88 : 0) === 0)) return [3 /*break*/, 325];
                    custId = customerIds["Precision Motors LLC"];
                    return [4 /*yield*/, client.query("INSERT INTO opportunity (\"customerId\", \"companyId\") VALUES ($1, $2)", [custId !== null && custId !== void 0 ? custId : null, companyId])];
                case 324:
                    _314.sent();
                    console.log("   Created opportunity");
                    _314.label = 325;
                case 325:
                    // ─── Step 38: suggestion ──────────────────────────────────────────────────
                    console.log("38. Seeding suggestions...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM suggestion WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 326:
                    existingSugg = _314.sent();
                    if (!(((_89 = existingSugg.rowCount) !== null && _89 !== void 0 ? _89 : 0) === 0)) return [3 /*break*/, 328];
                    return [4 /*yield*/, client.query("INSERT INTO suggestion (suggestion, path, \"companyId\", \"userId\") VALUES ($1, $2, $3, $4)", [
                            "Add barcode scanning to the receipt posting flow for faster processing",
                            "/purchasing/receipts",
                            companyId,
                            userId
                        ])];
                case 327:
                    _314.sent();
                    console.log("   Created suggestion");
                    _314.label = 328;
                case 328:
                    // ─── Step 39: noQuoteReason + pricingRule + webhook ───────────────────────
                    console.log("39. Seeding no-quote reasons, pricing rules, and webhooks...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"noQuoteReason\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 329:
                    existingNQR = _314.sent();
                    if (!(((_90 = existingNQR.rowCount) !== null && _90 !== void 0 ? _90 : 0) === 0)) return [3 /*break*/, 334];
                    _15 = 0, _16 = [
                        "Capacity Constraints",
                        "Outside Capabilities",
                        "Price Too Low"
                    ];
                    _314.label = 330;
                case 330:
                    if (!(_15 < _16.length)) return [3 /*break*/, 333];
                    reason = _16[_15];
                    return [4 /*yield*/, client.query("INSERT INTO \"noQuoteReason\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [reason, companyId, userId])];
                case 331:
                    _314.sent();
                    _314.label = 332;
                case 332:
                    _15++;
                    return [3 /*break*/, 330];
                case 333:
                    console.log("   Created 3 no-quote reasons");
                    _314.label = 334;
                case 334: return [4 /*yield*/, client.query("SELECT 1 FROM \"pricingRule\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 335:
                    existingPR = _314.sent();
                    if (!(((_91 = existingPR.rowCount) !== null && _91 !== void 0 ? _91 : 0) === 0)) return [3 /*break*/, 337];
                    return [4 /*yield*/, client.query("INSERT INTO \"pricingRule\" (name, \"ruleType\", \"amountType\", amount, priority, \"companyId\", \"createdBy\")\n         VALUES ('OEM Volume Discount', 'Discount'::\"pricingRuleType\", 'Percentage'::\"pricingRuleAmountType\", 5.0, 1, $1, $2)", [companyId, userId])];
                case 336:
                    _314.sent();
                    console.log("   Created pricing rule");
                    _314.label = 337;
                case 337: return [4 /*yield*/, client.query("SELECT 1 FROM webhook WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 338:
                    existingWH2 = _314.sent();
                    if (!(((_92 = existingWH2.rowCount) !== null && _92 !== void 0 ? _92 : 0) === 0)) return [3 /*break*/, 341];
                    return [4 /*yield*/, client.query("SELECT \"table\" FROM \"webhookTable\" LIMIT 1")];
                case 339:
                    whTableRow = _314.sent();
                    whTableId = (_93 = whTableRow.rows[0]) === null || _93 === void 0 ? void 0 : _93.table;
                    if (!whTableId) return [3 /*break*/, 341];
                    return [4 /*yield*/, client.query("INSERT INTO webhook (name, \"table\", url, \"onInsert\", \"companyId\", \"createdBy\")\n           VALUES ('New Record Notification', $1, 'https://hooks.example.com/new-record', true, $2, $3)", [whTableId, companyId, userId])];
                case 340:
                    _314.sent();
                    console.log("   Created webhook");
                    _314.label = 341;
                case 341:
                    // ─── Step 40: attributeDataType + customField + userAttributeCategory ──────
                    console.log("40. Seeding attribute data types, custom fields, user attribute categories...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"attributeDataType\" LIMIT 1")];
                case 342:
                    adtExisting = _314.sent();
                    textDataTypeId = null;
                    if (!(adtExisting.rows.length === 0)) return [3 /*break*/, 348];
                    return [4 /*yield*/, client.query("INSERT INTO \"attributeDataType\" (label, \"isText\") VALUES ('Text', true) RETURNING id")];
                case 343:
                    adt1 = _314.sent();
                    textDataTypeId = adt1.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"attributeDataType\" (label, \"isNumeric\") VALUES ('Number', true) RETURNING id")];
                case 344:
                    _adt2 = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"attributeDataType\" (label, \"isBoolean\") VALUES ('Boolean', true)")];
                case 345:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"attributeDataType\" (label, \"isDate\") VALUES ('Date', true)")];
                case 346:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"attributeDataType\" (label, \"isList\") VALUES ('List', true)")];
                case 347:
                    _314.sent();
                    console.log("   Created 5 attribute data types");
                    return [3 /*break*/, 350];
                case 348: return [4 /*yield*/, client.query("SELECT id FROM \"attributeDataType\" LIMIT 1")];
                case 349:
                    textDataTypeId = (_314.sent()).rows[0].id;
                    _314.label = 350;
                case 350: return [4 /*yield*/, client.query("SELECT 1 FROM \"customField\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 351:
                    existingCF = _314.sent();
                    if (!(((_94 = existingCF.rowCount) !== null && _94 !== void 0 ? _94 : 0) === 0 && textDataTypeId !== null)) return [3 /*break*/, 354];
                    return [4 /*yield*/, client.query("SELECT \"table\" FROM \"customFieldTable\" LIMIT 1")];
                case 352:
                    cfTableRow = _314.sent();
                    cfTableName = (_95 = cfTableRow.rows[0]) === null || _95 === void 0 ? void 0 : _95.table;
                    if (!cfTableName) return [3 /*break*/, 354];
                    return [4 /*yield*/, client.query("INSERT INTO \"customField\" (name, \"table\", \"dataTypeId\", \"sortOrder\", \"companyId\", \"createdBy\")\n           VALUES ('Reference Number', $1, $2, 1, $3, $4)", [cfTableName, textDataTypeId, companyId, userId])];
                case 353:
                    _314.sent();
                    console.log("   Created 1 custom field");
                    _314.label = 354;
                case 354: return [4 /*yield*/, client.query("SELECT 1 FROM \"userAttributeCategory\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 355:
                    existingUAC = _314.sent();
                    if (!(((_96 = existingUAC.rowCount) !== null && _96 !== void 0 ? _96 : 0) === 0)) return [3 /*break*/, 360];
                    return [4 /*yield*/, client.query("INSERT INTO \"userAttributeCategory\" (name, \"companyId\", \"createdBy\") VALUES ('Employee Details', $1, $2) RETURNING id", [companyId, userId])];
                case 356:
                    uacRow = _314.sent();
                    uacId = uacRow.rows[0].id;
                    if (!(textDataTypeId !== null)) return [3 /*break*/, 359];
                    return [4 /*yield*/, client.query("INSERT INTO \"userAttribute\" (name, \"userAttributeCategoryId\", \"attributeDataTypeId\", \"sortOrder\", \"createdBy\")\n           VALUES ('Department', $1, $2, 1, $3)", [uacId, textDataTypeId, userId])];
                case 357:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"userAttribute\" (name, \"userAttributeCategoryId\", \"attributeDataTypeId\", \"sortOrder\", \"createdBy\")\n           VALUES ('Employee ID', $1, $2, 2, $3)", [uacId, textDataTypeId, userId])];
                case 358:
                    _314.sent();
                    _314.label = 359;
                case 359:
                    console.log("   Created user attribute category and attributes");
                    _314.label = 360;
                case 360:
                    // ─── Step 41: accountingPeriod + journal + journalLine ────────────────────
                    console.log("41. Seeding accounting periods and journals...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"accountingPeriod\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 361:
                    existingAP = _314.sent();
                    accountingPeriodId = null;
                    if (!(((_97 = existingAP.rowCount) !== null && _97 !== void 0 ? _97 : 0) === 0)) return [3 /*break*/, 364];
                    return [4 /*yield*/, client.query("INSERT INTO \"accountingPeriod\" (\"startDate\", \"endDate\", status, \"companyId\", \"createdBy\")\n         VALUES ('2026-01-01', '2026-03-31', 'Active'::\"accountingPeriodStatus\", $1, $2) RETURNING id", [companyId, userId])];
                case 362:
                    r = _314.sent();
                    accountingPeriodId = r.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO \"accountingPeriod\" (\"startDate\", \"endDate\", status, \"companyId\", \"createdBy\")\n         VALUES ('2026-04-01', '2026-06-30', 'Active'::\"accountingPeriodStatus\", $1, $2)", [companyId, userId])];
                case 363:
                    _314.sent();
                    console.log("   Created 2 accounting periods");
                    return [3 /*break*/, 366];
                case 364: return [4 /*yield*/, client.query("SELECT id FROM \"accountingPeriod\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 365:
                    accountingPeriodId = (_314.sent()).rows[0].id;
                    _314.label = 366;
                case 366: return [4 /*yield*/, client.query("SELECT 1 FROM journal WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 367:
                    existingJournal = _314.sent();
                    if (!(((_98 = existingJournal.rowCount) !== null && _98 !== void 0 ? _98 : 0) === 0)) return [3 /*break*/, 373];
                    return [4 /*yield*/, nextSeq("journalEntry")];
                case 368:
                    jeId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO journal (\"journalEntryId\", description, \"accountingPeriodId\", \"companyId\", \"createdBy\")\n         VALUES ($1, 'Opening balance entry', $2, $3, $4) RETURNING id", [jeId, accountingPeriodId, companyId, userId])];
                case 369:
                    journalRow = _314.sent();
                    journalId = journalRow.rows[0].id;
                    console.log("   Created journal entry \"".concat(jeId, "\""));
                    return [4 /*yield*/, client.query("SELECT id FROM account WHERE \"isGroup\" = false LIMIT 1")];
                case 370:
                    accountRow = _314.sent();
                    accountId = (_99 = accountRow.rows[0]) === null || _99 === void 0 ? void 0 : _99.id;
                    if (!accountId) return [3 /*break*/, 373];
                    return [4 /*yield*/, client.query("INSERT INTO \"journalLine\" (\"journalId\", \"journalLineReference\", amount, \"accountId\", \"companyId\")\n           VALUES ($1, $2, 10000.00, $3, $4)", [journalId, jeId + "-L1", accountId, companyId])];
                case 371:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"journalLine\" (\"journalId\", \"journalLineReference\", amount, \"accountId\", \"companyId\")\n           VALUES ($1, $2, -10000.00, $3, $4)", [journalId, jeId + "-L2", accountId, companyId])];
                case 372:
                    _314.sent();
                    console.log("   Created 2 journal lines");
                    _314.label = 373;
                case 373:
                    // ─── Step 42: holiday ─────────────────────────────────────────────────────
                    console.log("42. Seeding holidays...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM holiday WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 374:
                    existingHoliday = _314.sent();
                    if (!(((_100 = existingHoliday.rowCount) !== null && _100 !== void 0 ? _100 : 0) === 0)) return [3 /*break*/, 379];
                    holidays = L.holidays;
                    _17 = 0, holidays_1 = holidays;
                    _314.label = 375;
                case 375:
                    if (!(_17 < holidays_1.length)) return [3 /*break*/, 378];
                    h = holidays_1[_17];
                    return [4 /*yield*/, client.query("INSERT INTO holiday (name, date, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [h.name, h.date, companyId, userId])];
                case 376:
                    _314.sent();
                    _314.label = 377;
                case 377:
                    _17++;
                    return [3 /*break*/, 375];
                case 378:
                    console.log("   Created 4 holidays");
                    _314.label = 379;
                case 379:
                    // ─── Step 43: itemSamplingPlan + itemShelfLife + itemRule + batchProperty ─
                    console.log("43. Seeding item rules and properties...");
                    steelItemId4 = itemIds["STEEL-ROD-01"];
                    bracketItemId3 = itemIds["BRACKET-001"];
                    if (!steelItemId4) return [3 /*break*/, 385];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"itemSamplingPlan\" WHERE \"itemId\" = $1 LIMIT 1", [steelItemId4])];
                case 380:
                    existingSP2 = _314.sent();
                    if (!(((_101 = existingSP2.rowCount) !== null && _101 !== void 0 ? _101 : 0) === 0)) return [3 /*break*/, 382];
                    return [4 /*yield*/, client.query("INSERT INTO \"itemSamplingPlan\" (\"itemId\", type, \"sampleSize\", \"inspectionLevel\", severity, \"companyId\", \"createdBy\")\n           VALUES ($1, 'AQL'::\"samplingPlanType\", 5, 'II'::\"inspectionLevel\", 'Normal'::\"inspectionSeverity\", $2, $3)", [steelItemId4, companyId, userId])];
                case 381:
                    _314.sent();
                    console.log("   Created item sampling plan");
                    _314.label = 382;
                case 382: return [4 /*yield*/, client.query("SELECT 1 FROM \"batchProperty\" WHERE \"itemId\" = $1 LIMIT 1", [steelItemId4])];
                case 383:
                    existingBP = _314.sent();
                    if (!(((_102 = existingBP.rowCount) !== null && _102 !== void 0 ? _102 : 0) === 0)) return [3 /*break*/, 385];
                    return [4 /*yield*/, client.query("INSERT INTO \"batchProperty\" (\"itemId\", label, \"dataType\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Heat Number', 'text'::\"configurationParameterDataType\", $2, $3)", [steelItemId4, companyId, userId])];
                case 384:
                    _314.sent();
                    console.log("   Created batch property");
                    _314.label = 385;
                case 385:
                    if (!bracketItemId3) return [3 /*break*/, 388];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"itemShelfLife\" WHERE \"itemId\" = $1 LIMIT 1", [bracketItemId3])];
                case 386:
                    existingISL = _314.sent();
                    if (!(((_103 = existingISL.rowCount) !== null && _103 !== void 0 ? _103 : 0) === 0)) return [3 /*break*/, 388];
                    return [4 /*yield*/, client.query("INSERT INTO \"itemShelfLife\" (\"itemId\", mode, days, \"triggerTiming\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Fixed Duration'::\"shelfLifeMode\", 365, 'After'::\"shelfLifeTriggerTiming\", $2, $3)", [bracketItemId3, companyId, userId])];
                case 387:
                    _314.sent();
                    console.log("   Created item shelf life");
                    _314.label = 388;
                case 388: return [4 /*yield*/, client.query("SELECT 1 FROM \"storageRule\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 389:
                    existingIR = _314.sent();
                    itemRuleId = null;
                    if (!(((_104 = existingIR.rowCount) !== null && _104 !== void 0 ? _104 : 0) === 0)) return [3 /*break*/, 391];
                    return [4 /*yield*/, client.query("INSERT INTO \"storageRule\" (name, message, severity, \"conditionAst\", \"companyId\", \"createdBy\")\n         VALUES ('Low Stock Warning', 'Item quantity below safety stock', 'warn', '[]'::jsonb, $1, $2) RETURNING id", [companyId, userId])];
                case 390:
                    r = _314.sent();
                    itemRuleId = r.rows[0].id;
                    console.log("   Created item rule");
                    return [3 /*break*/, 393];
                case 391: return [4 /*yield*/, client.query("SELECT id FROM \"storageRule\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 392:
                    itemRuleId = (_314.sent()).rows[0].id;
                    _314.label = 393;
                case 393:
                    if (!(itemRuleId && steelItemId4)) return [3 /*break*/, 396];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"storageRuleItemAssignment\" WHERE \"itemId\" = $1 AND \"ruleId\" = $2 LIMIT 1", [steelItemId4, itemRuleId])];
                case 394:
                    existingIRA = _314.sent();
                    if (!(((_105 = existingIRA.rowCount) !== null && _105 !== void 0 ? _105 : 0) === 0)) return [3 /*break*/, 396];
                    return [4 /*yield*/, client.query("INSERT INTO \"storageRuleItemAssignment\" (\"itemId\", \"ruleId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [steelItemId4, itemRuleId, companyId, userId])];
                case 395:
                    _314.sent();
                    console.log("   Created item rule assignment");
                    _314.label = 396;
                case 396:
                    // ─── Step 44: pickMethod + kanban ─────────────────────────────────────────
                    console.log("44. Seeding pick methods and kanban...");
                    if (!bracketItemId3) return [3 /*break*/, 402];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"pickMethod\" WHERE \"itemId\" = $1 AND \"locationId\" = $2 LIMIT 1", [bracketItemId3, locationId])];
                case 397:
                    existingPM = _314.sent();
                    if (!(((_106 = existingPM.rowCount) !== null && _106 !== void 0 ? _106 : 0) === 0)) return [3 /*break*/, 399];
                    return [4 /*yield*/, client.query("INSERT INTO \"pickMethod\" (\"itemId\", \"locationId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [bracketItemId3, locationId, companyId, userId])];
                case 398:
                    _314.sent();
                    console.log("   Created pick method");
                    _314.label = 399;
                case 399: return [4 /*yield*/, client.query("SELECT 1 FROM kanban WHERE \"itemId\" = $1 AND \"locationId\" = $2 LIMIT 1", [bracketItemId3, locationId])];
                case 400:
                    existingKB = _314.sent();
                    if (!(((_107 = existingKB.rowCount) !== null && _107 !== void 0 ? _107 : 0) === 0)) return [3 /*break*/, 402];
                    return [4 /*yield*/, client.query("INSERT INTO kanban (\"itemId\", \"replenishmentSystem\", quantity, \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Make'::\"itemReplenishmentSystem\", 10, $2, $3, $4)", [bracketItemId3, locationId, companyId, userId])];
                case 401:
                    _314.sent();
                    console.log("   Created kanban");
                    _314.label = 402;
                case 402:
                    // ─── Step 45: partner + contractor + contractorAbility ────────────────────
                    console.log("45. Seeding partners and contractors...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierLocation\" WHERE \"supplierId\" = $1 LIMIT 1", [acmeSupplierId])];
                case 403:
                    suppLocRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierContact\" WHERE \"supplierId\" = $1 LIMIT 1", [acmeSupplierId])];
                case 404:
                    suppContactRow = _314.sent();
                    suppLocId2 = (_108 = suppLocRow.rows[0]) === null || _108 === void 0 ? void 0 : _108.id;
                    suppContactId = (_109 = suppContactRow.rows[0]) === null || _109 === void 0 ? void 0 : _109.id;
                    return [4 /*yield*/, client.query("SELECT id FROM ability WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", ["CNC Machining", companyId])];
                case 405:
                    abilityRow = _314.sent();
                    cncAbilityId = (_110 = abilityRow.rows[0]) === null || _110 === void 0 ? void 0 : _110.id;
                    if (!(suppLocId2 && cncAbilityId)) return [3 /*break*/, 408];
                    return [4 /*yield*/, client.query("SELECT 1 FROM partner WHERE id = $1 LIMIT 1", [suppLocId2])];
                case 406:
                    existingPartner = _314.sent();
                    if (!(((_111 = existingPartner.rowCount) !== null && _111 !== void 0 ? _111 : 0) === 0)) return [3 /*break*/, 408];
                    return [4 /*yield*/, client.query("INSERT INTO partner (id, \"abilityId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4)", [suppLocId2, cncAbilityId, companyId, userId])];
                case 407:
                    _314.sent();
                    console.log("   Created partner");
                    _314.label = 408;
                case 408:
                    if (!suppContactId) return [3 /*break*/, 412];
                    return [4 /*yield*/, client.query("SELECT 1 FROM contractor WHERE id = $1 LIMIT 1", [suppContactId])];
                case 409:
                    existingContractor = _314.sent();
                    if (!(((_112 = existingContractor.rowCount) !== null && _112 !== void 0 ? _112 : 0) === 0)) return [3 /*break*/, 412];
                    return [4 /*yield*/, client.query("INSERT INTO contractor (id, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [suppContactId, companyId, userId])];
                case 410:
                    _314.sent();
                    console.log("   Created contractor");
                    if (!cncAbilityId) return [3 /*break*/, 412];
                    return [4 /*yield*/, client.query("INSERT INTO \"contractorAbility\" (\"contractorId\", \"abilityId\", \"createdBy\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [suppContactId, cncAbilityId, userId])];
                case 411:
                    _314.sent();
                    console.log("   Created contractor ability");
                    _314.label = 412;
                case 412:
                    // ─── Step 46: employeeAbility + employeeSalaryRecord + employeeSalaryPayment
                    console.log("46. Seeding employee data...");
                    if (!cncAbilityId) return [3 /*break*/, 415];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"employeeAbility\" WHERE \"employeeId\" = $1 AND \"abilityId\" = $2 LIMIT 1", [employeeId, cncAbilityId])];
                case 413:
                    existingEA = _314.sent();
                    if (!(((_113 = existingEA.rowCount) !== null && _113 !== void 0 ? _113 : 0) === 0)) return [3 /*break*/, 415];
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeAbility\" (\"employeeId\", \"abilityId\", \"companyId\")\n           VALUES ($1, $2, $3)", [employeeId, cncAbilityId, companyId])];
                case 414:
                    _314.sent();
                    console.log("   Created employee ability");
                    _314.label = 415;
                case 415: return [4 /*yield*/, client.query("SELECT id FROM \"employeeSalaryRecord\" WHERE \"employeeId\" = $1 AND \"companyId\" = $2 LIMIT 1", [employeeId, companyId])];
                case 416:
                    existingESR = _314.sent();
                    salaryRecordId = null;
                    if (!(existingESR.rows.length === 0)) return [3 /*break*/, 418];
                    now = new Date();
                    curYear = now.getFullYear();
                    curMonth = now.getMonth() + 1;
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeSalaryRecord\" (\"employeeId\", year, month, \"totalEarned\", \"totalPaid\", status, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, 7500.00, 7500.00, 'Paid'::\"salaryRecordStatus\", $4, $5) RETURNING id", [employeeId, curYear, curMonth, companyId, userId])];
                case 417:
                    r = _314.sent();
                    salaryRecordId = r.rows[0].id;
                    console.log("   Created salary record");
                    return [3 /*break*/, 419];
                case 418:
                    salaryRecordId = existingESR.rows[0].id;
                    _314.label = 419;
                case 419:
                    if (!salaryRecordId) return [3 /*break*/, 422];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"employeeSalaryPayment\" WHERE \"salaryRecordId\" = $1 LIMIT 1", [salaryRecordId])];
                case 420:
                    existingESP = _314.sent();
                    if (!(((_114 = existingESP.rowCount) !== null && _114 !== void 0 ? _114 : 0) === 0)) return [3 /*break*/, 422];
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeSalaryPayment\" (\"salaryRecordId\", amount, \"paidBy\", \"companyId\")\n           VALUES ($1, 7500.00, $2, $3)", [salaryRecordId, userId, companyId])];
                case 421:
                    _314.sent();
                    console.log("   Created salary payment");
                    _314.label = 422;
                case 422:
                    // ─── Step 47: jobAssignmentRule + jobGroupAssignment + jobOperationStep ───
                    console.log("47. Seeding job rules and operation steps...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"group\" WHERE name = 'All Employees' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 423:
                    allEmployeesGroupRow = _314.sent();
                    allEmployeesGroupId = (_115 = allEmployeesGroupRow.rows[0]) === null || _115 === void 0 ? void 0 : _115.id;
                    if (!allEmployeesGroupId) return [3 /*break*/, 430];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobAssignmentRule\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 424:
                    existingJAR = _314.sent();
                    _jobRuleId = null;
                    if (!(((_116 = existingJAR.rowCount) !== null && _116 !== void 0 ? _116 : 0) === 0)) return [3 /*break*/, 426];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobAssignmentRule\" (name, \"targetGroupId\", \"companyId\", \"createdBy\")\n           VALUES ('Auto-assign all jobs', $1, $2, $3) RETURNING id", [allEmployeesGroupId, companyId, userId])];
                case 425:
                    r = _314.sent();
                    _jobRuleId = r.rows[0].id;
                    console.log("   Created job assignment rule");
                    _314.label = 426;
                case 426: return [4 /*yield*/, client.query("SELECT id FROM job WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 427:
                    jobRow = _314.sent();
                    existingJobId = (_117 = jobRow.rows[0]) === null || _117 === void 0 ? void 0 : _117.id;
                    if (!existingJobId) return [3 /*break*/, 430];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobGroupAssignment\" WHERE \"jobId\" = $1 LIMIT 1", [existingJobId])];
                case 428:
                    existingJGA = _314.sent();
                    if (!(((_118 = existingJGA.rowCount) !== null && _118 !== void 0 ? _118 : 0) === 0)) return [3 /*break*/, 430];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobGroupAssignment\" (\"jobId\", \"groupId\", \"companyId\", \"assignedBy\")\n             VALUES ($1, $2, $3, $4)", [existingJobId, allEmployeesGroupId, companyId, userId])];
                case 429:
                    _314.sent();
                    console.log("   Created job group assignment");
                    _314.label = 430;
                case 430: return [4 /*yield*/, client.query("SELECT jo.id FROM \"jobOperation\" jo\n       JOIN job j ON j.id = jo.\"jobId\"\n       JOIN item i ON i.id = j.\"itemId\"\n       WHERE jo.\"companyId\" = $1\n         AND i.\"readableId\" NOT IN ('TSHIRT-001','JACKET-001')\n       LIMIT 1", [companyId])];
                case 431:
                    jobOpRow = _314.sent();
                    jobOpId = (_119 = jobOpRow.rows[0]) === null || _119 === void 0 ? void 0 : _119.id;
                    if (!jobOpId) return [3 /*break*/, 441];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationStep\" WHERE \"operationId\" = $1 LIMIT 1", [jobOpId])];
                case 432:
                    existingJOS = _314.sent();
                    if (!(((_120 = existingJOS.rowCount) !== null && _120 !== void 0 ? _120 : 0) === 0)) return [3 /*break*/, 434];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationStep\" (name, \"operationId\", type, required, \"sortOrder\", \"companyId\", \"createdBy\")\n           VALUES ('Verify setup dimensions', $1, 'Measurement'::\"procedureStepType\", true, 1, $2, $3)", [jobOpId, companyId, userId])];
                case 433:
                    _314.sent();
                    console.log("   Created job operation step");
                    _314.label = 434;
                case 434: return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationParameter\" WHERE \"operationId\" = $1 LIMIT 1", [jobOpId])];
                case 435:
                    existingJOP = _314.sent();
                    if (!(((_121 = existingJOP.rowCount) !== null && _121 !== void 0 ? _121 : 0) === 0)) return [3 /*break*/, 437];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationParameter\" (key, value, \"operationId\", \"companyId\", \"createdBy\")\n           VALUES ('Feed Rate', '1200 mm/min', $1, $2, $3)", [jobOpId, companyId, userId])];
                case 436:
                    _314.sent();
                    console.log("   Created job operation parameter");
                    _314.label = 437;
                case 437: return [4 /*yield*/, client.query("SELECT id FROM item WHERE type = 'Tool'::\"itemType\" AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 438:
                    toolItemRow = _314.sent();
                    toolItemIdForOp = (_122 = toolItemRow.rows[0]) === null || _122 === void 0 ? void 0 : _122.id;
                    if (!toolItemIdForOp) return [3 /*break*/, 441];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationTool\" WHERE \"operationId\" = $1 LIMIT 1", [jobOpId])];
                case 439:
                    existingJOT = _314.sent();
                    if (!(((_123 = existingJOT.rowCount) !== null && _123 !== void 0 ? _123 : 0) === 0)) return [3 /*break*/, 441];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationTool\" (\"operationId\", \"toolId\", quantity, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, 1, $3, $4)", [jobOpId, toolItemIdForOp, companyId, userId])];
                case 440:
                    _314.sent();
                    console.log("   Created job operation tool");
                    _314.label = 441;
                case 441:
                    // ─── Step 48: purchasingRfq + lines + suppliers ───────────────────────────
                    console.log("48. Seeding purchasing RFQs...");
                    purchasingRfqId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchasingRfq\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 442:
                    existingPRFQ = _314.sent();
                    if (!(((_124 = existingPRFQ.rowCount) !== null && _124 !== void 0 ? _124 : 0) === 0)) return [3 /*break*/, 445];
                    return [4 /*yield*/, nextSeq("purchasingRfq")];
                case 443:
                    rfqReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasingRfq\" (\"rfqId\", \"rfqDate\", status, \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, CURRENT_DATE, 'Draft'::\"purchasingRfqStatus\", $2, $3, $4) RETURNING id", [rfqReadableId, locationId, companyId, userId])];
                case 444:
                    rfqRow = _314.sent();
                    purchasingRfqId = rfqRow.rows[0].id;
                    console.log("   Created purchasing RFQ \"".concat(rfqReadableId, "\""));
                    return [3 /*break*/, 446];
                case 445:
                    purchasingRfqId = existingPRFQ.rows[0].id;
                    _314.label = 446;
                case 446:
                    if (!purchasingRfqId) return [3 /*break*/, 452];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"purchasingRfqLine\" WHERE \"purchasingRfqId\" = $1 LIMIT 1", [purchasingRfqId])];
                case 447:
                    existingLine = _314.sent();
                    if (!(((_125 = existingLine.rowCount) !== null && _125 !== void 0 ? _125 : 0) === 0)) return [3 /*break*/, 449];
                    pcbItemId = itemIds["CTRL-PCB-001"];
                    if (!pcbItemId) return [3 /*break*/, 449];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasingRfqLine\" (\"purchasingRfqId\", \"itemId\", \"purchaseUnitOfMeasureCode\", \"inventoryUnitOfMeasureCode\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, 'EA', 'EA', $3, $4)", [purchasingRfqId, pcbItemId, companyId, userId])];
                case 448:
                    _314.sent();
                    console.log("   Created purchasing RFQ line");
                    _314.label = 449;
                case 449: return [4 /*yield*/, client.query("SELECT 1 FROM \"purchasingRfqSupplier\" WHERE \"purchasingRfqId\" = $1 LIMIT 1", [purchasingRfqId])];
                case 450:
                    existingSupplier = _314.sent();
                    if (!(((_126 = existingSupplier.rowCount) !== null && _126 !== void 0 ? _126 : 0) === 0 && pacificSupplierId)) return [3 /*break*/, 452];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasingRfqSupplier\" (\"purchasingRfqId\", \"supplierId\", \"companyId\")\n             VALUES ($1, $2, $3)", [purchasingRfqId, pacificSupplierId, companyId])];
                case 451:
                    _314.sent();
                    console.log("   Created purchasing RFQ supplier");
                    _314.label = 452;
                case 452:
                    // ─── Step 49: supplierQuote + lines ──────────────────────────────────────
                    console.log("49. Seeding supplier quotes...");
                    supplierQuoteId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierQuote\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 453:
                    existingSQ = _314.sent();
                    if (!(((_127 = existingSQ.rowCount) !== null && _127 !== void 0 ? _127 : 0) === 0 && pacificSupplierId)) return [3 /*break*/, 457];
                    return [4 /*yield*/, nextSeq("supplierQuote")];
                case 454:
                    sqReadableId = _314.sent();
                    return [4 /*yield*/, getOrCreateSupplierInteraction(pacificSupplierId)];
                case 455:
                    sqInteractionId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierQuote\" (\"supplierQuoteId\", \"supplierId\", \"supplierInteractionId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3, $4, $5) RETURNING id", [sqReadableId, pacificSupplierId, sqInteractionId, companyId, userId])];
                case 456:
                    sqRow = _314.sent();
                    supplierQuoteId = sqRow.rows[0].id;
                    console.log("   Created supplier quote \"".concat(sqReadableId, "\""));
                    return [3 /*break*/, 458];
                case 457:
                    supplierQuoteId = (_129 = (_128 = existingSQ.rows[0]) === null || _128 === void 0 ? void 0 : _128.id) !== null && _129 !== void 0 ? _129 : null;
                    _314.label = 458;
                case 458:
                    if (!supplierQuoteId) return [3 /*break*/, 461];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"supplierQuoteLine\" WHERE \"supplierQuoteId\" = $1 LIMIT 1", [supplierQuoteId])];
                case 459:
                    existingLine = _314.sent();
                    if (!(((_130 = existingLine.rowCount) !== null && _130 !== void 0 ? _130 : 0) === 0)) return [3 /*break*/, 461];
                    pcbItemId = itemIds["CTRL-PCB-001"];
                    if (!pcbItemId) return [3 /*break*/, 461];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierQuoteLine\" (\"supplierQuoteId\", \"itemId\", description, \"companyId\", \"createdBy\")\n               VALUES ($1, $2, 'Control PCB Rev2', $3, $4)", [supplierQuoteId, pcbItemId, companyId, userId])];
                case 460:
                    _314.sent();
                    console.log("   Created supplier quote line");
                    _314.label = 461;
                case 461:
                    // ─── Step 50: salesRfq + lines ───────────────────────────────────────────
                    console.log("50. Seeding sales RFQs...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"salesRfq\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 462:
                    existingSRFQ = _314.sent();
                    salesRfqId = null;
                    precisionCustomerId = customerIds["Precision Motors LLC"];
                    if (!(((_131 = existingSRFQ.rowCount) !== null && _131 !== void 0 ? _131 : 0) === 0 && precisionCustomerId)) return [3 /*break*/, 466];
                    return [4 /*yield*/, nextSeq("salesRfq")];
                case 463:
                    srfqReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"salesRfq\" (\"rfqId\", \"customerId\", \"rfqDate\", \"locationId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, CURRENT_DATE, $3, $4, $5) RETURNING id", [srfqReadableId, precisionCustomerId, locationId, companyId, userId])];
                case 464:
                    srfqRow = _314.sent();
                    salesRfqId = srfqRow.rows[0].id;
                    console.log("   Created sales RFQ \"".concat(srfqReadableId, "\""));
                    bracketItemId4 = itemIds["BRACKET-001"];
                    if (!bracketItemId4) return [3 /*break*/, 466];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesRfqLine\" (\"salesRfqId\", \"itemId\", \"unitOfMeasureCode\", \"customerPartId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 'EA', 'PM-BRACKET-A', $3, $4)", [salesRfqId, bracketItemId4, companyId, userId])];
                case 465:
                    _314.sent();
                    console.log("   Created sales RFQ line");
                    _314.label = 466;
                case 466:
                    // ─── Step 51: quote + quoteLine + quoteMakeMethod + quoteOperation + quoteMaterial
                    console.log("51. Seeding quotes...");
                    quoteId = null;
                    quoteLineId = null;
                    quoteMakeMethodId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM quote WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 467:
                    existingQuote = _314.sent();
                    if (!(((_132 = existingQuote.rowCount) !== null && _132 !== void 0 ? _132 : 0) === 0 && precisionCustomerId)) return [3 /*break*/, 470];
                    return [4 /*yield*/, nextSeq("quote")];
                case 468:
                    qReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO quote (\"quoteId\", \"customerId\", status, \"locationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 'Draft'::\"quoteStatus\", $3, $4, $5) RETURNING id", [qReadableId, precisionCustomerId, locationId, companyId, userId])];
                case 469:
                    qRow = _314.sent();
                    quoteId = qRow.rows[0].id;
                    console.log("   Created quote \"".concat(qReadableId, "\""));
                    return [3 /*break*/, 471];
                case 470:
                    quoteId = (_134 = (_133 = existingQuote.rows[0]) === null || _133 === void 0 ? void 0 : _133.id) !== null && _134 !== void 0 ? _134 : null;
                    _314.label = 471;
                case 471:
                    bracketItemId5 = itemIds["BRACKET-001"];
                    if (!(bracketItemId5 && quoteId)) return [3 /*break*/, 488];
                    return [4 /*yield*/, client.query("SELECT id FROM \"quoteLine\" WHERE \"quoteId\" = $1 LIMIT 1", [quoteId])];
                case 472:
                    existingQL = _314.sent();
                    if (!(((_135 = existingQL.rowCount) !== null && _135 !== void 0 ? _135 : 0) === 0)) return [3 /*break*/, 474];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteLine\" (\"quoteId\", \"itemId\", \"itemType\", description, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, 'Part', 'Mounting Bracket A', $3, $4) RETURNING id", [quoteId, bracketItemId5, companyId, userId])];
                case 473:
                    qlRow = _314.sent();
                    quoteLineId = qlRow.rows[0].id;
                    console.log("   Created quote line");
                    return [3 /*break*/, 475];
                case 474:
                    quoteLineId = existingQL.rows[0].id;
                    _314.label = 475;
                case 475: return [4 /*yield*/, client.query("SELECT id FROM \"quoteMakeMethod\" WHERE \"quoteLineId\" = $1 AND \"parentMaterialId\" IS NULL LIMIT 1", [quoteLineId])];
                case 476:
                    existingQMM = _314.sent();
                    if (!(((_136 = existingQMM.rowCount) !== null && _136 !== void 0 ? _136 : 0) === 0)) return [3 /*break*/, 478];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteMakeMethod\" (\"quoteId\", \"quoteLineId\", \"itemId\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, $4, $5) RETURNING id", [quoteId, quoteLineId, bracketItemId5, companyId, userId])];
                case 477:
                    qmmRow = _314.sent();
                    quoteMakeMethodId = qmmRow.rows[0].id;
                    console.log("   Created quote make method");
                    return [3 /*break*/, 479];
                case 478:
                    quoteMakeMethodId = existingQMM.rows[0].id;
                    _314.label = 479;
                case 479:
                    if (!cncProcId) return [3 /*break*/, 485];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"quoteOperation\" WHERE \"quoteMakeMethodId\" = $1 LIMIT 1", [quoteMakeMethodId])];
                case 480:
                    existingQO = _314.sent();
                    if (!(((_137 = existingQO.rowCount) !== null && _137 !== void 0 ? _137 : 0) === 0)) return [3 /*break*/, 482];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteOperation\" (\"quoteId\", \"quoteLineId\", \"quoteMakeMethodId\", \"processId\", \"laborTime\", \"laborUnit\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, $3, $4, 30, 'Minutes/Piece'::factor, $5, $6) RETURNING id", [
                            quoteId,
                            quoteLineId,
                            quoteMakeMethodId,
                            cncProcId,
                            companyId,
                            userId
                        ])];
                case 481:
                    _qoRow = _314.sent();
                    console.log("   Created quote operation");
                    _314.label = 482;
                case 482:
                    steelItemId5 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId5) return [3 /*break*/, 485];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"quoteMaterial\" WHERE \"quoteId\" = $1 AND \"itemId\" = $2 LIMIT 1", [quoteId, steelItemId5])];
                case 483:
                    existingQMat = _314.sent();
                    if (!(((_138 = existingQMat.rowCount) !== null && _138 !== void 0 ? _138 : 0) === 0)) return [3 /*break*/, 485];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteMaterial\" (\"quoteId\", \"quoteLineId\", \"quoteMakeMethodId\", \"itemId\", \"itemType\", \"methodType\", \"order\", description, quantity, \"unitOfMeasureCode\", \"unitCost\", \"companyId\", \"createdBy\")\n                 VALUES ($1, $2, $3, $4, 'Part', 'Purchase to Order'::\"methodType\", 1, '1020 Steel Rod', 1.2, 'EA', 5.50, $5, $6)", [
                            quoteId,
                            quoteLineId,
                            quoteMakeMethodId,
                            steelItemId5,
                            companyId,
                            userId
                        ])];
                case 484:
                    _314.sent();
                    console.log("   Created quote material");
                    _314.label = 485;
                case 485: 
                // quotePayment (1:1 with quote)
                return [4 /*yield*/, client.query("INSERT INTO \"quotePayment\" (id, \"companyId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [quoteId, companyId])];
                case 486:
                    // quotePayment (1:1 with quote)
                    _314.sent();
                    // quoteShipment (1:1 with quote)
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteShipment\" (id, \"companyId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [quoteId, companyId])];
                case 487:
                    // quoteShipment (1:1 with quote)
                    _314.sent();
                    _314.label = 488;
                case 488:
                    // ─── Step 52: receipt + receiptLine ──────────────────────────────────────
                    console.log("52. Seeding receipts...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM receipt WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 489:
                    existingReceipt = _314.sent();
                    receiptId = null;
                    if (!(((_139 = existingReceipt.rowCount) !== null && _139 !== void 0 ? _139 : 0) === 0 && acmeSupplierId)) return [3 /*break*/, 494];
                    return [4 /*yield*/, nextSeq("receipt")];
                case 490:
                    recReadableId = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"purchaseOrderId\" FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 491:
                    firstPO = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO receipt (\"receiptId\", \"supplierId\", status, \"locationId\", \"sourceDocument\", \"sourceDocumentId\", \"sourceDocumentReadableId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'Draft'::\"receiptStatus\", $3, 'Purchase Order'::\"receiptSourceDocument\", $4, $5, $6, $7) RETURNING id", [
                            recReadableId,
                            acmeSupplierId,
                            locationId,
                            (_141 = (_140 = firstPO.rows[0]) === null || _140 === void 0 ? void 0 : _140.id) !== null && _141 !== void 0 ? _141 : null,
                            (_143 = (_142 = firstPO.rows[0]) === null || _142 === void 0 ? void 0 : _142.purchaseOrderId) !== null && _143 !== void 0 ? _143 : null,
                            companyId,
                            userId
                        ])];
                case 492:
                    recRow = _314.sent();
                    receiptId = recRow.rows[0].id;
                    console.log("   Created receipt \"".concat(recReadableId, "\""));
                    steelItemId6 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId6) return [3 /*break*/, 494];
                    return [4 /*yield*/, client.query("INSERT INTO \"receiptLine\" (\"receiptId\", \"itemId\", \"orderQuantity\", \"receivedQuantity\", \"unitOfMeasure\", \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 100, 100, 'EA', 5.50, $3, $4)", [receiptId, steelItemId6, companyId, userId])];
                case 493:
                    _314.sent();
                    console.log("   Created receipt line");
                    _314.label = 494;
                case 494:
                    // ─── Step 53: shipment + shipmentLine ────────────────────────────────────
                    console.log("53. Seeding shipments...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM shipment WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 495:
                    existingShipment = _314.sent();
                    shipmentId = null;
                    if (!(((_144 = existingShipment.rowCount) !== null && _144 !== void 0 ? _144 : 0) === 0 && precisionCustomerId)) return [3 /*break*/, 500];
                    return [4 /*yield*/, nextSeq("shipment")];
                case 496:
                    shipReadableId = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"salesOrderId\" FROM \"salesOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 497:
                    firstSO = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO shipment (\"shipmentId\", \"customerId\", status, \"locationId\", \"sourceDocument\", \"sourceDocumentId\", \"sourceDocumentReadableId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'Draft'::\"shipmentStatus\", $3, 'Sales Order'::\"shipmentSourceDocument\", $4, $5, $6, $7) RETURNING id", [
                            shipReadableId,
                            precisionCustomerId,
                            locationId,
                            (_146 = (_145 = firstSO.rows[0]) === null || _145 === void 0 ? void 0 : _145.id) !== null && _146 !== void 0 ? _146 : null,
                            (_148 = (_147 = firstSO.rows[0]) === null || _147 === void 0 ? void 0 : _147.salesOrderId) !== null && _148 !== void 0 ? _148 : null,
                            companyId,
                            userId
                        ])];
                case 498:
                    shipRow = _314.sent();
                    shipmentId = shipRow.rows[0].id;
                    console.log("   Created shipment \"".concat(shipReadableId, "\""));
                    bracketItemId6 = itemIds["BRACKET-001"];
                    if (!bracketItemId6) return [3 /*break*/, 500];
                    return [4 /*yield*/, client.query("INSERT INTO \"shipmentLine\" (\"shipmentId\", \"itemId\", \"orderQuantity\", \"shippedQuantity\", \"unitOfMeasure\", \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 25, 0, 'EA', 125.00, $3, $4)", [shipmentId, bracketItemId6, companyId, userId])];
                case 499:
                    _314.sent();
                    console.log("   Created shipment line");
                    _314.label = 500;
                case 500:
                    // ─── Step 54: salesInvoice + salesInvoiceLine ─────────────────────────────
                    console.log("54. Seeding sales invoices...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"salesInvoice\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 501:
                    existingSI = _314.sent();
                    salesInvoiceId = null;
                    if (!(((_149 = existingSI.rowCount) !== null && _149 !== void 0 ? _149 : 0) === 0 && precisionCustomerId)) return [3 /*break*/, 507];
                    return [4 /*yield*/, nextSeq("salesInvoice")];
                case 502:
                    siReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"salesInvoice\" (\"invoiceId\", \"customerId\", \"currencyCode\", status, \"locationId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'USD', 'Draft'::\"salesInvoiceStatus\", $3, $4, $5) RETURNING id", [siReadableId, precisionCustomerId, locationId, companyId, userId])];
                case 503:
                    siRow = _314.sent();
                    salesInvoiceId = siRow.rows[0].id;
                    console.log("   Created sales invoice \"".concat(siReadableId, "\""));
                    bracketItemId7 = itemIds["BRACKET-001"];
                    if (!bracketItemId7) return [3 /*break*/, 505];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesInvoiceLine\" (\"invoiceId\", \"invoiceLineType\", \"itemId\", description, quantity, \"unitOfMeasureCode\", \"unitPrice\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Part'::\"salesInvoiceLineType\", $2, 'Mounting Bracket A', 25, 'EA', 125.00, $3, $4)", [salesInvoiceId, bracketItemId7, companyId, userId])];
                case 504:
                    _314.sent();
                    console.log("   Created sales invoice line");
                    _314.label = 505;
                case 505:
                    if (!salesInvoiceId) return [3 /*break*/, 507];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesInvoiceShipment\" (id, \"companyId\", \"createdBy\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [salesInvoiceId, companyId, userId])];
                case 506:
                    _314.sent();
                    _314.label = 507;
                case 507:
                    // ─── Step 55: purchaseInvoice + purchaseInvoiceLine ───────────────────────
                    console.log("55. Seeding purchase invoices...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"purchaseInvoice\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 508:
                    existingPI = _314.sent();
                    purchaseInvoiceId = null;
                    if (!(((_150 = existingPI.rowCount) !== null && _150 !== void 0 ? _150 : 0) === 0 && acmeSupplierId)) return [3 /*break*/, 513];
                    return [4 /*yield*/, nextSeq("purchaseInvoice")];
                case 509:
                    piReadableId = _314.sent();
                    return [4 /*yield*/, getOrCreateSupplierInteraction(acmeSupplierId)];
                case 510:
                    piInteractionId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoice\" (\"invoiceId\", \"supplierId\", \"supplierInteractionId\", \"currencyCode\", status, \"locationId\", \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, 'USD', 'Draft'::\"purchaseInvoiceStatus\", $4, $5, $6) RETURNING id", [
                            piReadableId,
                            acmeSupplierId,
                            piInteractionId,
                            locationId,
                            companyId,
                            userId
                        ])];
                case 511:
                    piRow = _314.sent();
                    purchaseInvoiceId = piRow.rows[0].id;
                    console.log("   Created purchase invoice \"".concat(piReadableId, "\""));
                    steelItemId7 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId7) return [3 /*break*/, 513];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoiceLine\" (\"invoiceId\", \"invoiceLineType\", \"itemId\", description, quantity, \"supplierUnitPrice\", \"inventoryUnitOfMeasureCode\", \"purchaseUnitOfMeasureCode\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Part'::\"payableLineType\", $2, '1020 Steel Rod', 100, 5.50, 'EA', 'EA', $3, $4)", [purchaseInvoiceId, steelItemId7, companyId, userId])];
                case 512:
                    _314.sent();
                    console.log("   Created purchase invoice line");
                    _314.label = 513;
                case 513:
                    // ─── Step 56: stockTransfer + stockTransferLine ───────────────────────────
                    console.log("56. Seeding stock transfers...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"stockTransfer\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 514:
                    existingST = _314.sent();
                    stockTransferId = null;
                    if (!(((_151 = existingST.rowCount) !== null && _151 !== void 0 ? _151 : 0) === 0)) return [3 /*break*/, 518];
                    return [4 /*yield*/, nextSeq("stockTransfer")];
                case 515:
                    stReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"stockTransfer\" (\"stockTransferId\", \"locationId\", status, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, 'Draft'::\"stockTransferStatus\", $3, $4) RETURNING id", [stReadableId, locationId, companyId, userId])];
                case 516:
                    stRow = _314.sent();
                    stockTransferId = stRow.rows[0].id;
                    console.log("   Created stock transfer \"".concat(stReadableId, "\""));
                    steelItemId8 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId8) return [3 /*break*/, 518];
                    return [4 /*yield*/, client.query("INSERT INTO \"stockTransferLine\" (\"stockTransferId\", \"itemId\", quantity, \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 20, $3, $4)", [stockTransferId, steelItemId8, companyId, userId])];
                case 517:
                    _314.sent();
                    console.log("   Created stock transfer line");
                    _314.label = 518;
                case 518:
                    // ─── Step 57: warehouseTransfer + warehouseTransferLine ──────────────────
                    console.log("57. Seeding warehouse transfers...");
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"warehouseTransfer\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 519:
                    existingWT = _314.sent();
                    if (!(((_152 = existingWT.rowCount) !== null && _152 !== void 0 ? _152 : 0) === 0)) return [3 /*break*/, 523];
                    return [4 /*yield*/, nextSeq("warehouseTransfer")];
                case 520:
                    wtReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"warehouseTransfer\" (\"transferId\", \"fromLocationId\", \"toLocationId\", status, \"companyId\", \"createdBy\")\n         VALUES ($1, $2, $3, 'Draft'::\"warehouseTransferStatus\", $4, $5) RETURNING id", [wtReadableId, locationId, location2Id, companyId, userId])];
                case 521:
                    wtRow = _314.sent();
                    warehouseTransferId = wtRow.rows[0].id;
                    console.log("   Created warehouse transfer \"".concat(wtReadableId, "\""));
                    steelItemId9 = itemIds["STEEL-ROD-01"];
                    if (!steelItemId9) return [3 /*break*/, 523];
                    return [4 /*yield*/, client.query("INSERT INTO \"warehouseTransferLine\" (\"transferId\", \"itemId\", quantity, \"fromLocationId\", \"toLocationId\", \"companyId\", \"createdBy\")\n           VALUES ($1, $2, 50, $3, $4, $5, $6)", [
                            warehouseTransferId,
                            steelItemId9,
                            locationId,
                            location2Id,
                            companyId,
                            userId
                        ])];
                case 522:
                    _314.sent();
                    console.log("   Created warehouse transfer line");
                    _314.label = 523;
                case 523:
                    // ─── Step 58: fulfillment + timeCardEntry ─────────────────────────────────
                    console.log("58. Seeding fulfillment and time cards...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"salesOrderLine\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 524:
                    soLineRow = _314.sent();
                    soLineId = (_153 = soLineRow.rows[0]) === null || _153 === void 0 ? void 0 : _153.id;
                    if (!soLineId) return [3 /*break*/, 527];
                    return [4 /*yield*/, client.query("SELECT 1 FROM fulfillment WHERE \"salesOrderLineId\" = $1 LIMIT 1", [soLineId])];
                case 525:
                    existingFul = _314.sent();
                    if (!(((_154 = existingFul.rowCount) !== null && _154 !== void 0 ? _154 : 0) === 0)) return [3 /*break*/, 527];
                    return [4 /*yield*/, client.query("INSERT INTO fulfillment (\"salesOrderLineId\", type, quantity, \"companyId\", \"createdBy\")\n           VALUES ($1, 'Inventory'::\"fulfillmentType\", 10, $2, $3)", [soLineId, companyId, userId])];
                case 526:
                    _314.sent();
                    console.log("   Created fulfillment");
                    _314.label = 527;
                case 527: return [4 /*yield*/, client.query("SELECT 1 FROM \"timeCardEntry\" WHERE \"employeeId\" = $1 AND \"companyId\" = $2 LIMIT 1", [employeeId, companyId])];
                case 528:
                    existingTCE = _314.sent();
                    if (!(((_155 = existingTCE.rowCount) !== null && _155 !== void 0 ? _155 : 0) === 0)) return [3 /*break*/, 530];
                    return [4 /*yield*/, client.query("INSERT INTO \"timeCardEntry\" (\"employeeId\", \"clockIn\", \"clockOut\", note, \"companyId\", \"createdBy\")\n         VALUES ($1, NOW() - INTERVAL '8 hours', NOW(), 'Regular shift', $2, $3)", [employeeId, companyId, userId])];
                case 529:
                    _314.sent();
                    console.log("   Created time card entry");
                    _314.label = 530;
                case 530:
                    // ─── Step 59: productionEvent + productionQuantityReport + productionQuantity
                    console.log("59. Seeding production events...");
                    if (!jobOpId) return [3 /*break*/, 544];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"productionEvent\" WHERE \"jobOperationId\" = $1 LIMIT 1", [jobOpId])];
                case 531:
                    existingPE = _314.sent();
                    prodEventId = null;
                    if (!(((_156 = existingPE.rowCount) !== null && _156 !== void 0 ? _156 : 0) === 0)) return [3 /*break*/, 533];
                    return [4 /*yield*/, client.query("INSERT INTO \"productionEvent\" (\"jobOperationId\", type, \"startTime\", \"endTime\", \"employeeId\", \"workCenterId\", \"companyId\", \"createdBy\")\n           VALUES ($1, 'Labor'::\"productionEventType\", NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', $2, $3, $4, $5) RETURNING id", [jobOpId, employeeId, cncWCId !== null && cncWCId !== void 0 ? cncWCId : null, companyId, userId])];
                case 532:
                    peRow = _314.sent();
                    prodEventId = peRow.rows[0].id;
                    console.log("   Created production event");
                    return [3 /*break*/, 535];
                case 533: return [4 /*yield*/, client.query("SELECT id FROM \"productionEvent\" WHERE \"jobOperationId\" = $1 LIMIT 1", [jobOpId])];
                case 534:
                    prodEventId = (_314.sent()).rows[0].id;
                    _314.label = 535;
                case 535: return [4 /*yield*/, client.query("SELECT \"jobId\" FROM \"jobOperation\" WHERE id = $1 LIMIT 1", [jobOpId])];
                case 536:
                    jobForOpRow = _314.sent();
                    jobIdForOp = (_157 = jobForOpRow.rows[0]) === null || _157 === void 0 ? void 0 : _157.jobId;
                    if (!jobIdForOp) return [3 /*break*/, 544];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"productionQuantityReport\" WHERE \"jobOperationId\" = $1 LIMIT 1", [jobOpId])];
                case 537:
                    existingPQR = _314.sent();
                    pqrId = null;
                    if (!(((_158 = existingPQR.rowCount) !== null && _158 !== void 0 ? _158 : 0) === 0)) return [3 /*break*/, 539];
                    return [4 /*yield*/, client.query("INSERT INTO \"productionQuantityReport\" (\"jobId\", \"jobOperationId\", \"employeeId\", \"originalQuantity\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, 25, $4, $5) RETURNING id", [jobIdForOp, jobOpId, employeeId, companyId, userId])];
                case 538:
                    pqrRow = _314.sent();
                    pqrId = pqrRow.rows[0].id;
                    console.log("   Created production quantity report");
                    return [3 /*break*/, 541];
                case 539: return [4 /*yield*/, client.query("SELECT id FROM \"productionQuantityReport\" WHERE \"jobOperationId\" = $1 LIMIT 1", [jobOpId])];
                case 540:
                    pqrId = (_314.sent()).rows[0].id;
                    _314.label = 541;
                case 541:
                    if (!pqrId) return [3 /*break*/, 544];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"productionQuantity\" WHERE \"jobOperationId\" = $1 LIMIT 1", [jobOpId])];
                case 542:
                    existingPQ = _314.sent();
                    if (!(((_159 = existingPQ.rowCount) !== null && _159 !== void 0 ? _159 : 0) === 0)) return [3 /*break*/, 544];
                    return [4 /*yield*/, client.query("INSERT INTO \"productionQuantity\" (\"reportId\", \"jobOperationId\", type, quantity, \"laborProductionEventId\", \"employeeId\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, 'Production'::\"productionQuantityType\", 25, $3, $4, $5, $6)", [pqrId, jobOpId, prodEventId, employeeId, companyId, userId])];
                case 543:
                    _314.sent();
                    console.log("   Created production quantity");
                    _314.label = 544;
                case 544:
                    // ─── Step 60: purchaseOrderPayment + salesOrderPayment + salesOrderShipment
                    console.log("60. Seeding PO/SO payment and shipment settings...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 545:
                    firstPORow = _314.sent();
                    firstPOId = (_160 = firstPORow.rows[0]) === null || _160 === void 0 ? void 0 : _160.id;
                    if (!firstPOId) return [3 /*break*/, 548];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"purchaseOrderPayment\" WHERE id = $1 LIMIT 1", [firstPOId])];
                case 546:
                    existingPOP = _314.sent();
                    if (!(((_161 = existingPOP.rowCount) !== null && _161 !== void 0 ? _161 : 0) === 0)) return [3 /*break*/, 548];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderPayment\" (id, \"companyId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [firstPOId, companyId])];
                case 547:
                    _314.sent();
                    _314.label = 548;
                case 548: return [4 /*yield*/, client.query("SELECT id FROM \"salesOrder\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 549:
                    firstSORow = _314.sent();
                    firstSOId = (_162 = firstSORow.rows[0]) === null || _162 === void 0 ? void 0 : _162.id;
                    if (!firstSOId) return [3 /*break*/, 555];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"salesOrderPayment\" WHERE id = $1 LIMIT 1", [firstSOId])];
                case 550:
                    existingSOP = _314.sent();
                    if (!(((_163 = existingSOP.rowCount) !== null && _163 !== void 0 ? _163 : 0) === 0)) return [3 /*break*/, 552];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderPayment\" (id, \"companyId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [firstSOId, companyId])];
                case 551:
                    _314.sent();
                    _314.label = 552;
                case 552: return [4 /*yield*/, client.query("SELECT 1 FROM \"salesOrderShipment\" WHERE id = $1 LIMIT 1", [firstSOId])];
                case 553:
                    existingSOShip = _314.sent();
                    if (!(((_164 = existingSOShip.rowCount) !== null && _164 !== void 0 ? _164 : 0) === 0)) return [3 /*break*/, 555];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderShipment\" (id, \"companyId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [firstSOId, companyId])];
                case 554:
                    _314.sent();
                    _314.label = 555;
                case 555:
                    console.log("   Created PO/SO payment and shipment settings");
                    // ─── Step 61: material reference tables ───────────────────────────────────
                    console.log("61. Seeding material reference tables...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"materialSubstance\" WHERE name='Steel (Dev)' AND \"companyId\"=$1 LIMIT 1", [companyId])];
                case 556:
                    msubExists = _314.sent();
                    msubId = void 0;
                    if (!(((_165 = msubExists.rowCount) !== null && _165 !== void 0 ? _165 : 0) === 0)) return [3 /*break*/, 558];
                    return [4 /*yield*/, client.query("INSERT INTO \"materialSubstance\" (name, code, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", ["Steel (Dev)", "STEEL-DEV", companyId, userId])];
                case 557:
                    r = _314.sent();
                    msubId = r.rows[0].id;
                    return [3 /*break*/, 559];
                case 558:
                    msubId = msubExists.rows[0].id;
                    _314.label = 559;
                case 559: return [4 /*yield*/, client.query("SELECT id FROM \"materialForm\" WHERE name='Sheet (Dev)' AND \"companyId\"=$1 LIMIT 1", [companyId])];
                case 560:
                    mformExists = _314.sent();
                    mformId = void 0;
                    if (!(((_166 = mformExists.rowCount) !== null && _166 !== void 0 ? _166 : 0) === 0)) return [3 /*break*/, 562];
                    return [4 /*yield*/, client.query("INSERT INTO \"materialForm\" (name, code, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", ["Sheet (Dev)", "SHEET-DEV", companyId, userId])];
                case 561:
                    r = _314.sent();
                    mformId = r.rows[0].id;
                    return [3 /*break*/, 563];
                case 562:
                    mformId = mformExists.rows[0].id;
                    _314.label = 563;
                case 563: 
                // materialGrade (depends on materialSubstance)
                return [4 /*yield*/, client.query("INSERT INTO \"materialGrade\" (name, \"materialSubstanceId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", ["A36", msubId, companyId])];
                case 564:
                    // materialGrade (depends on materialSubstance)
                    _314.sent();
                    // materialFinish
                    return [4 /*yield*/, client.query("INSERT INTO \"materialFinish\" (name, \"materialSubstanceId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", ["Hot Rolled", msubId, companyId])];
                case 565:
                    // materialFinish
                    _314.sent();
                    // materialType
                    return [4 /*yield*/, client.query("INSERT INTO \"materialType\" (name, code, \"materialSubstanceId\", \"materialFormId\", \"companyId\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", ["Steel Sheet", "STL-SHT", msubId, mformId, companyId])];
                case 566:
                    // materialType
                    _314.sent();
                    // materialDimension
                    return [4 /*yield*/, client.query("INSERT INTO \"materialDimension\" (name, \"materialFormId\", \"isMetric\", \"companyId\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", ["Thickness", mformId, true, companyId])];
                case 567:
                    // materialDimension
                    _314.sent();
                    console.log("   Created material reference data");
                    // ─── Step 62: dimensionValue ───────────────────────────────────────────────
                    console.log("62. Seeding dimension values...");
                    companyGroupId = "cg_5Cg8dbXfjYm2Rshat5W22m";
                    return [4 /*yield*/, client.query("SELECT id, name FROM dimension WHERE \"companyGroupId\"=$1", [companyGroupId])];
                case 568:
                    dims = _314.sent();
                    firstDimId = void 0;
                    firstDimValueId = void 0;
                    _18 = 0, _19 = dims.rows;
                    _314.label = 569;
                case 569:
                    if (!(_18 < _19.length)) return [3 /*break*/, 574];
                    dim = _19[_18];
                    if (!firstDimId)
                        firstDimId = dim.id;
                    return [4 /*yield*/, client.query("SELECT id FROM \"dimensionValue\" WHERE \"dimensionId\"=$1 AND name=$2 AND \"companyGroupId\"=$3 LIMIT 1", [dim.id, "".concat(dim.name, " - Dev"), companyGroupId])];
                case 570:
                    existsDv = _314.sent();
                    if (!(((_167 = existsDv.rowCount) !== null && _167 !== void 0 ? _167 : 0) === 0)) return [3 /*break*/, 572];
                    return [4 /*yield*/, client.query("INSERT INTO \"dimensionValue\" (\"dimensionId\", name, \"companyGroupId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", [dim.id, "".concat(dim.name, " - Dev"), companyGroupId, userId])];
                case 571:
                    r = _314.sent();
                    if (!firstDimValueId)
                        firstDimValueId = r.rows[0].id;
                    return [3 /*break*/, 573];
                case 572:
                    if (!firstDimValueId)
                        firstDimValueId = existsDv.rows[0].id;
                    _314.label = 573;
                case 573:
                    _18++;
                    return [3 /*break*/, 569];
                case 574:
                    console.log("   Created dimension values");
                    // ─── Step 63: journalLineDimension ──────────────────────────────────────
                    console.log("63. Seeding journal line dimensions...");
                    if (!(firstDimId && firstDimValueId)) return [3 /*break*/, 577];
                    return [4 /*yield*/, client.query("SELECT id FROM \"journalLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 575:
                    jlRow = _314.sent();
                    if (!jlRow.rows[0]) return [3 /*break*/, 577];
                    return [4 /*yield*/, client.query("INSERT INTO \"journalLineDimension\" (\"journalLineId\", \"dimensionId\", \"valueId\", \"companyId\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [jlRow.rows[0].id, firstDimId, firstDimValueId, companyId])];
                case 576:
                    _314.sent();
                    console.log("   Created journal line dimension");
                    _314.label = 577;
                case 577:
                    // ─── Step 64: customerContact, customerLocation ────────────────────────────
                    console.log("64. Seeding customer contact and location...");
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 578:
                    custRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM contact WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 579:
                    contactRow = _314.sent();
                    custId = (_168 = custRow.rows[0]) === null || _168 === void 0 ? void 0 : _168.id;
                    contactId = (_169 = contactRow.rows[0]) === null || _169 === void 0 ? void 0 : _169.id;
                    if (!(custId && contactId)) return [3 /*break*/, 582];
                    return [4 /*yield*/, client.query("SELECT id FROM \"customerContact\" WHERE \"customerId\"=$1 AND \"contactId\"=$2 LIMIT 1", [custId, contactId])];
                case 580:
                    existsCC = _314.sent();
                    if (!(((_170 = existsCC.rowCount) !== null && _170 !== void 0 ? _170 : 0) === 0)) return [3 /*break*/, 582];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerContact\" (\"customerId\", \"contactId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [custId, contactId])];
                case 581:
                    _314.sent();
                    _314.label = 582;
                case 582:
                    if (!custId) return [3 /*break*/, 586];
                    return [4 /*yield*/, client.query("SELECT id FROM address LIMIT 1")];
                case 583:
                    addrRow = _314.sent();
                    addrId = (_171 = addrRow.rows[0]) === null || _171 === void 0 ? void 0 : _171.id;
                    if (!addrId) return [3 /*break*/, 586];
                    return [4 /*yield*/, client.query("SELECT id FROM \"customerLocation\" WHERE \"customerId\"=$1 LIMIT 1", [custId])];
                case 584:
                    existsCL = _314.sent();
                    if (!(((_172 = existsCL.rowCount) !== null && _172 !== void 0 ? _172 : 0) === 0)) return [3 /*break*/, 586];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerLocation\" (\"customerId\", \"addressId\", name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [custId, addrId, "Main Location"])];
                case 585:
                    _314.sent();
                    _314.label = 586;
                case 586:
                    console.log("   Created customer contact and location");
                    // ─── Step 65: customerItemPriceOverride + Break ────────────────────────────
                    console.log("65. Seeding customer item price overrides...");
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 587:
                    custRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 588:
                    itemRow = _314.sent();
                    custId = (_173 = custRow.rows[0]) === null || _173 === void 0 ? void 0 : _173.id;
                    itemId = (_174 = itemRow.rows[0]) === null || _174 === void 0 ? void 0 : _174.id;
                    if (!(custId && itemId)) return [3 /*break*/, 595];
                    return [4 /*yield*/, client.query("SELECT id FROM \"customerItemPriceOverride\" WHERE \"customerId\"=$1 AND \"itemId\"=$2 AND \"companyId\"=$3 LIMIT 1", [custId, itemId, companyId])];
                case 589:
                    existsOvr = _314.sent();
                    ovrId = void 0;
                    if (!(((_175 = existsOvr.rowCount) !== null && _175 !== void 0 ? _175 : 0) === 0)) return [3 /*break*/, 591];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerItemPriceOverride\" (\"customerId\", \"itemId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) RETURNING id", [custId, itemId, companyId, userId])];
                case 590:
                    r = _314.sent();
                    ovrId = r.rows[0].id;
                    return [3 /*break*/, 592];
                case 591:
                    ovrId = existsOvr.rows[0].id;
                    _314.label = 592;
                case 592: return [4 /*yield*/, client.query("SELECT id FROM \"customerItemPriceOverrideBreak\" WHERE \"customerItemPriceOverrideId\"=$1 AND \"companyId\"=$2 LIMIT 1", [ovrId, companyId])];
                case 593:
                    existsBreak = _314.sent();
                    if (!(((_176 = existsBreak.rowCount) !== null && _176 !== void 0 ? _176 : 0) === 0)) return [3 /*break*/, 595];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerItemPriceOverrideBreak\" (\"customerItemPriceOverrideId\", quantity, \"overridePrice\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [ovrId, 10, 9.99, companyId, userId])];
                case 594:
                    _314.sent();
                    _314.label = 595;
                case 595:
                    console.log("   Created customer item price overrides");
                    // ─── Step 66: customerPartToItem ──────────────────────────────────────────
                    console.log("66. Seeding customer part to item...");
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 596:
                    custRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 597:
                    itemRow = _314.sent();
                    custId = (_177 = custRow.rows[0]) === null || _177 === void 0 ? void 0 : _177.id;
                    itemId = (_178 = itemRow.rows[0]) === null || _178 === void 0 ? void 0 : _178.id;
                    if (!(custId && itemId)) return [3 /*break*/, 599];
                    return [4 /*yield*/, client.query("INSERT INTO \"customerPartToItem\" (\"customerId\", \"customerPartId\", \"customerPartRevision\", \"itemId\", \"companyId\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [custId, "CUST-PART-001", "A", itemId, companyId])];
                case 598:
                    _314.sent();
                    _314.label = 599;
                case 599:
                    console.log("   Created customer part to item");
                    // ─── Step 67: document favorites, labels, transactions ────────────────────
                    console.log("67. Seeding document favorites, labels, transactions...");
                    return [4 /*yield*/, client.query("SELECT id FROM document WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 600:
                    docRow = _314.sent();
                    docId = (_179 = docRow.rows[0]) === null || _179 === void 0 ? void 0 : _179.id;
                    if (!docId) return [3 /*break*/, 604];
                    return [4 /*yield*/, client.query("INSERT INTO \"documentFavorite\" (\"documentId\", \"userId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [docId, userId])];
                case 601:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"documentLabel\" (\"documentId\", \"userId\", label) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [docId, userId, "Important"])];
                case 602:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"documentTransaction\" (\"documentId\", type, \"userId\") VALUES ($1, $2::\"documentTransactionType\", $3) ON CONFLICT DO NOTHING", [docId, "Download", userId])];
                case 603:
                    _314.sent();
                    _314.label = 604;
                case 604:
                    console.log("   Created document favorites, labels, transactions");
                    // ─── Step 68: employeeShift, employeeTypePermission ───────────────────────
                    console.log("68. Seeding employee shift and type permissions...");
                    return [4 /*yield*/, client.query("SELECT id FROM employee WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 605:
                    empRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM shift WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 606:
                    shiftRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"employeeType\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 607:
                    etRow = _314.sent();
                    if (!(empRow.rows[0] && shiftRow.rows[0])) return [3 /*break*/, 609];
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeShift\" (\"employeeId\", \"shiftId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [empRow.rows[0].id, shiftRow.rows[0].id])];
                case 608:
                    _314.sent();
                    _314.label = 609;
                case 609:
                    if (!etRow.rows[0]) return [3 /*break*/, 611];
                    return [4 /*yield*/, client.query("INSERT INTO \"employeeTypePermission\" (\"employeeTypeId\", module) VALUES ($1, $2::module) ON CONFLICT DO NOTHING", [etRow.rows[0].id, "Accounting"])];
                case 610:
                    _314.sent();
                    _314.label = 611;
                case 611:
                    console.log("   Created employee shift and type permissions");
                    // ─── Step 69: exchangeRateHistory ─────────────────────────────────────────
                    console.log("69. Seeding exchange rate history...");
                    companyGroupId = void 0;
                    return [4 /*yield*/, client.query("SELECT id FROM \"companyGroup\" WHERE name = 'Default Group' LIMIT 1")];
                case 612:
                    existingCG = _314.sent();
                    if (!(existingCG.rows.length > 0)) return [3 /*break*/, 613];
                    companyGroupId = existingCG.rows[0].id;
                    return [3 /*break*/, 615];
                case 613: return [4 /*yield*/, client.query("INSERT INTO \"companyGroup\" (name, \"createdBy\") VALUES ('Default Group', $1) RETURNING id", [userId])];
                case 614:
                    cgRow = _314.sent();
                    companyGroupId = cgRow.rows[0].id;
                    console.log("   Created company group: ".concat(companyGroupId));
                    _314.label = 615;
                case 615: return [4 /*yield*/, client.query("INSERT INTO \"exchangeRateHistory\" (\"currencyCode\", rate, \"effectiveDate\", \"companyGroupId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", ["USD", 1.0, "2024-01-01", companyGroupId, userId])];
                case 616:
                    _314.sent();
                    console.log("   Created exchange rate history");
                    // ─── Step 70: period ──────────────────────────────────────────────────────
                    console.log("70. Seeding period...");
                    return [4 /*yield*/, client.query("INSERT INTO period (\"startDate\", \"endDate\", \"periodType\") VALUES ($1, $2, $3::\"periodType\") ON CONFLICT DO NOTHING", ["2024-01-01", "2024-01-07", "Week"])];
                case 617:
                    _314.sent();
                    console.log("   Created period");
                    // ─── Step 71: plan ────────────────────────────────────────────────────────
                    console.log("71. Seeding plan...");
                    return [4 /*yield*/, client.query("SELECT id FROM plan WHERE name='Development' LIMIT 1")];
                case 618:
                    existsPlan = _314.sent();
                    if (!(((_180 = existsPlan.rowCount) !== null && _180 !== void 0 ? _180 : 0) === 0)) return [3 /*break*/, 620];
                    return [4 /*yield*/, client.query("INSERT INTO plan (name, \"stripePriceId\", \"tasksLimit\", \"aiTokensLimit\", \"stripeTrialPeriodDays\", public) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", ["Development", "price_dev", 999999, 999999, 30, true])];
                case 619:
                    _314.sent();
                    _314.label = 620;
                case 620:
                    console.log("   Created plan");
                    // ─── Step 72: userAttribute, userAttributeValue ───────────────────────────
                    console.log("72. Seeding user attributes and values...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"userAttributeCategory\" LIMIT 1")];
                case 621:
                    uacRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"attributeDataType\" WHERE \"isText\"=true LIMIT 1")];
                case 622:
                    adtRow = _314.sent();
                    uacId = (_181 = uacRow.rows[0]) === null || _181 === void 0 ? void 0 : _181.id;
                    adtId = (_182 = adtRow.rows[0]) === null || _182 === void 0 ? void 0 : _182.id;
                    if (!(uacId && adtId)) return [3 /*break*/, 629];
                    return [4 /*yield*/, client.query("SELECT id FROM \"userAttribute\" WHERE name='Department' AND \"userAttributeCategoryId\"=$1 LIMIT 1", [uacId])];
                case 623:
                    existsUA = _314.sent();
                    uaId = void 0;
                    if (!(((_183 = existsUA.rowCount) !== null && _183 !== void 0 ? _183 : 0) === 0)) return [3 /*break*/, 625];
                    return [4 /*yield*/, client.query("INSERT INTO \"userAttribute\" (name, \"sortOrder\", \"userAttributeCategoryId\", \"attributeDataTypeId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) RETURNING id", ["Department", 1, uacId, adtId, userId])];
                case 624:
                    r = _314.sent();
                    uaId = r.rows[0].id;
                    return [3 /*break*/, 626];
                case 625:
                    uaId = existsUA.rows[0].id;
                    _314.label = 626;
                case 626: return [4 /*yield*/, client.query("SELECT id FROM \"userAttributeValue\" WHERE \"userAttributeId\"=$1 AND \"userId\"=$2 LIMIT 1", [uaId, userId])];
                case 627:
                    existsUAV = _314.sent();
                    if (!(((_184 = existsUAV.rowCount) !== null && _184 !== void 0 ? _184 : 0) === 0)) return [3 /*break*/, 629];
                    return [4 /*yield*/, client.query("INSERT INTO \"userAttributeValue\" (\"userAttributeId\", \"userId\", \"valueText\", \"createdBy\") VALUES ($1, $2, $3, $4)", [uaId, userId, "Engineering", userId])];
                case 628:
                    _314.sent();
                    _314.label = 629;
                case 629:
                    console.log("   Created user attribute and value");
                    // ─── Step 73: integration ─────────────────────────────────────────────────
                    console.log("73. Seeding integration...");
                    return [4 /*yield*/, client.query("INSERT INTO integration (id, jsonschema) VALUES ($1, $2) ON CONFLICT DO NOTHING", [
                            "dev-integration",
                            JSON.stringify({
                                type: "object",
                                properties: { apiKey: { type: "string" } }
                            })
                        ])];
                case 630:
                    _314.sent();
                    console.log("   Created integration");
                    // ─── Step 74: webhookTable + webhook, customFieldTable + customField ───────
                    console.log("74. Seeding webhook/custom field tables and entries...");
                    // Seed reference tables first
                    return [4 /*yield*/, client.query("INSERT INTO \"webhookTable\" (\"table\", module, name) VALUES ($1, $2::module, $3) ON CONFLICT DO NOTHING", ["item", "Parts", "Item"])];
                case 631:
                    // Seed reference tables first
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"customFieldTable\" (\"table\", module, name) VALUES ($1, $2::module, $3) ON CONFLICT DO NOTHING", ["item", "Parts", "Item"])];
                case 632:
                    _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"attributeDataType\" WHERE \"isText\"=true LIMIT 1")];
                case 633:
                    adtRow = _314.sent();
                    if (!adtRow.rows[0]) return [3 /*break*/, 635];
                    return [4 /*yield*/, client.query("INSERT INTO \"customField\" (name, \"sortOrder\", \"table\", \"dataTypeId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", ["Custom Field 1", 1, "item", adtRow.rows[0].id, companyId, userId])];
                case 634:
                    _314.sent();
                    _314.label = 635;
                case 635: return [4 /*yield*/, client.query("INSERT INTO webhook (name, \"table\", url, \"onInsert\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [
                        "Item Webhook",
                        "item",
                        "https://example.com/webhook",
                        true,
                        companyId,
                        userId
                    ])];
                case 636:
                    _314.sent();
                    console.log("   Created webhook and custom field tables/entries");
                    // ─── Step 75: contractor, contractorAbility ───────────────────────────────
                    console.log("75. Seeding contractor and contractor ability...");
                    return [4 /*yield*/, client.query("SELECT sc.id FROM \"supplierContact\" sc JOIN supplier s ON sc.\"supplierId\"=s.id WHERE s.\"companyId\"=$1 LIMIT 1", [companyId])];
                case 637:
                    scRow = _314.sent();
                    scId = (_185 = scRow.rows[0]) === null || _185 === void 0 ? void 0 : _185.id;
                    return [4 /*yield*/, client.query("SELECT id FROM ability WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 638:
                    abilRow = _314.sent();
                    abilId = (_186 = abilRow.rows[0]) === null || _186 === void 0 ? void 0 : _186.id;
                    if (!scId) return [3 /*break*/, 641];
                    return [4 /*yield*/, client.query("INSERT INTO contractor (id, \"hoursPerWeek\", active, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [scId, 40, true, companyId, userId])];
                case 639:
                    _314.sent();
                    if (!abilId) return [3 /*break*/, 641];
                    return [4 /*yield*/, client.query("INSERT INTO \"contractorAbility\" (\"contractorId\", \"abilityId\", \"createdBy\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [scId, abilId, userId])];
                case 640:
                    _314.sent();
                    _314.label = 641;
                case 641:
                    console.log("   Created contractor and ability");
                    // ─── Step 76: partner ─────────────────────────────────────────────────────
                    console.log("76. Seeding partner...");
                    return [4 /*yield*/, client.query("SELECT sl.id FROM \"supplierLocation\" sl JOIN supplier s ON sl.\"supplierId\"=s.id WHERE s.\"companyId\"=$1 LIMIT 1", [companyId])];
                case 642:
                    slRow = _314.sent();
                    slId = (_187 = slRow.rows[0]) === null || _187 === void 0 ? void 0 : _187.id;
                    return [4 /*yield*/, client.query("SELECT id FROM ability WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 643:
                    abilRow = _314.sent();
                    abilId = (_188 = abilRow.rows[0]) === null || _188 === void 0 ? void 0 : _188.id;
                    if (!(slId && abilId)) return [3 /*break*/, 645];
                    return [4 /*yield*/, client.query("INSERT INTO partner (id, \"hoursPerWeek\", \"abilityId\", active, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [slId, 40, abilId, true, companyId, userId])];
                case 644:
                    _314.sent();
                    _314.label = 645;
                case 645:
                    console.log("   Created partner");
                    // ─── Step 77: purchaseOrder sub-records ───────────────────────────────────
                    console.log("77. Seeding purchase order sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 646:
                    poRow = _314.sent();
                    poId = (_189 = poRow.rows[0]) === null || _189 === void 0 ? void 0 : _189.id;
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 647:
                    locRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingMethod\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 648:
                    smRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingTerm\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 649:
                    stRow = _314.sent();
                    if (!poId) return [3 /*break*/, 656];
                    // purchaseOrderFavorite
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderFavorite\" (\"purchaseOrderId\", \"userId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [poId, userId])];
                case 650:
                    // purchaseOrderFavorite
                    _314.sent();
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"purchaseOrderDelivery\" WHERE id=$1 LIMIT 1", [poId])];
                case 651:
                    existsPOD = _314.sent();
                    if (!(((_190 = existsPOD.rowCount) !== null && _190 !== void 0 ? _190 : 0) === 0)) return [3 /*break*/, 653];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderDelivery\" (id, \"locationId\", \"shippingMethodId\", \"shippingTermId\", \"companyId\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            poId,
                            (_191 = locRow.rows[0]) === null || _191 === void 0 ? void 0 : _191.id,
                            (_192 = smRow.rows[0]) === null || _192 === void 0 ? void 0 : _192.id,
                            (_193 = stRow.rows[0]) === null || _193 === void 0 ? void 0 : _193.id,
                            companyId
                        ])];
                case 652:
                    _314.sent();
                    _314.label = 653;
                case 653: 
                // purchaseOrderStatusHistory
                return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderStatusHistory\" (\"purchaseOrderId\", status, \"createdBy\") VALUES ($1, $2::\"purchaseOrderStatus\", $3) ON CONFLICT DO NOTHING", [poId, "Draft", userId])];
                case 654:
                    // purchaseOrderStatusHistory
                    _314.sent();
                    // purchaseOrderTransaction
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseOrderTransaction\" (\"purchaseOrderId\", type, \"userId\") VALUES ($1, $2::\"purchaseOrderTransactionType\", $3) ON CONFLICT DO NOTHING", [poId, "Edit", userId])];
                case 655:
                    // purchaseOrderTransaction
                    _314.sent();
                    _314.label = 656;
                case 656:
                    console.log("   Created purchase order sub-records");
                    // ─── Step 78: purchaseInvoice sub-records ─────────────────────────────────
                    console.log("78. Seeding purchase invoice sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseInvoice\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 657:
                    piRow = _314.sent();
                    piId = (_194 = piRow.rows[0]) === null || _194 === void 0 ? void 0 : _194.id;
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 658:
                    poRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"purchaseOrderId\" FROM \"purchaseOrderLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 659:
                    polRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 660:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 661:
                    locRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingMethod\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 662:
                    smRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingTerm\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 663:
                    stRow = _314.sent();
                    if (!piId) return [3 /*break*/, 673];
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseInvoiceLine\" WHERE \"invoiceId\"=$1 AND \"companyId\"=$2 LIMIT 1", [piId, companyId])];
                case 664:
                    existsPIL = _314.sent();
                    pilId = void 0;
                    if (!(((_195 = existsPIL.rowCount) !== null && _195 !== void 0 ? _195 : 0) === 0)) return [3 /*break*/, 666];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoiceLine\" (\"invoiceId\", \"invoiceLineType\", \"purchaseOrderId\", \"purchaseOrderLineId\", \"itemId\", quantity, \"supplierUnitPrice\", \"companyId\", \"createdBy\") VALUES ($1, $2::\"payableLineType\", $3, $4, $5, $6, $7, $8, $9) RETURNING id", [
                            piId,
                            "Part",
                            (_196 = poRow.rows[0]) === null || _196 === void 0 ? void 0 : _196.id,
                            (_197 = polRow.rows[0]) === null || _197 === void 0 ? void 0 : _197.id,
                            (_198 = itemRow.rows[0]) === null || _198 === void 0 ? void 0 : _198.id,
                            1,
                            10.0,
                            companyId,
                            userId
                        ])];
                case 665:
                    r = _314.sent();
                    pilId = r.rows[0].id;
                    return [3 /*break*/, 667];
                case 666:
                    pilId = existsPIL.rows[0].id;
                    _314.label = 667;
                case 667: return [4 /*yield*/, client.query("SELECT 1 FROM \"purchaseInvoiceDelivery\" WHERE id=$1 LIMIT 1", [piId])];
                case 668:
                    existsPID = _314.sent();
                    if (!(((_199 = existsPID.rowCount) !== null && _199 !== void 0 ? _199 : 0) === 0)) return [3 /*break*/, 670];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoiceDelivery\" (id, \"locationId\", \"shippingMethodId\", \"shippingTermId\", \"companyId\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            piId,
                            (_200 = locRow.rows[0]) === null || _200 === void 0 ? void 0 : _200.id,
                            (_201 = smRow.rows[0]) === null || _201 === void 0 ? void 0 : _201.id,
                            (_202 = stRow.rows[0]) === null || _202 === void 0 ? void 0 : _202.id,
                            companyId
                        ])];
                case 669:
                    _314.sent();
                    _314.label = 670;
                case 670: 
                // purchaseInvoiceStatusHistory
                return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoiceStatusHistory\" (\"invoiceId\", status) VALUES ($1, $2::\"purchaseInvoiceStatus\") ON CONFLICT DO NOTHING", [piId, "Draft"])];
                case 671:
                    // purchaseInvoiceStatusHistory
                    _314.sent();
                    if (!pilId) return [3 /*break*/, 673];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoicePriceChange\" (\"invoiceId\", \"invoiceLineId\", \"previousPrice\", \"newPrice\", \"previousQuantity\", \"newQuantity\", \"updatedBy\") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING", [piId, pilId, 9.0, 10.0, 1, 1, userId])];
                case 672:
                    _314.sent();
                    _314.label = 673;
                case 673:
                    console.log("   Created purchase invoice sub-records");
                    // ─── Step 79: purchasePayment + purchaseInvoicePaymentRelation ────────────
                    console.log("79. Seeding purchase payment...");
                    return [4 /*yield*/, client.query("SELECT id FROM supplier WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 674:
                    supRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseInvoice\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 675:
                    piRow = _314.sent();
                    supId = (_203 = supRow.rows[0]) === null || _203 === void 0 ? void 0 : _203.id;
                    piId = (_204 = piRow.rows[0]) === null || _204 === void 0 ? void 0 : _204.id;
                    if (!supId) return [3 /*break*/, 681];
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchasePayment\" WHERE \"supplierId\"=$1 AND \"companyId\"=$2 LIMIT 1", [supId, companyId])];
                case 676:
                    existsPP = _314.sent();
                    ppId = void 0;
                    if (!(((_205 = existsPP.rowCount) !== null && _205 !== void 0 ? _205 : 0) === 0)) return [3 /*break*/, 678];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasePayment\" (\"paymentId\", \"supplierId\", \"paymentDate\", \"currencyCode\", \"exchangeRate\", \"totalAmount\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [
                            "PAY-DEV-001",
                            supId,
                            "2024-01-15",
                            "USD",
                            1.0,
                            500.0,
                            companyId,
                            userId
                        ])];
                case 677:
                    r = _314.sent();
                    ppId = r.rows[0].id;
                    return [3 /*break*/, 679];
                case 678:
                    ppId = existsPP.rows[0].id;
                    _314.label = 679;
                case 679:
                    if (!piId) return [3 /*break*/, 681];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchaseInvoicePaymentRelation\" (\"invoiceId\", \"paymentId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [piId, ppId])];
                case 680:
                    _314.sent();
                    _314.label = 681;
                case 681:
                    console.log("   Created purchase payment");
                    // ─── Step 80: purchasingRfq link records ──────────────────────────────────
                    console.log("80. Seeding purchasingRfq link records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchasingRfq\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 682:
                    rfqRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 683:
                    poRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierQuote\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 684:
                    sqRow = _314.sent();
                    rfqId = (_206 = rfqRow.rows[0]) === null || _206 === void 0 ? void 0 : _206.id;
                    if (!(rfqId && poRow.rows[0])) return [3 /*break*/, 686];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasingRfqToPurchaseOrder\" (\"purchasingRfqId\", \"purchaseOrderId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [rfqId, poRow.rows[0].id, companyId])];
                case 685:
                    _314.sent();
                    _314.label = 686;
                case 686:
                    if (!(rfqId && sqRow.rows[0])) return [3 /*break*/, 688];
                    return [4 /*yield*/, client.query("INSERT INTO \"purchasingRfqToSupplierQuote\" (\"purchasingRfqId\", \"supplierQuoteId\", \"companyId\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [rfqId, sqRow.rows[0].id, companyId])];
                case 687:
                    _314.sent();
                    _314.label = 688;
                case 688:
                    console.log("   Created purchasingRfq link records");
                    // ─── Step 81: quote sub-records ───────────────────────────────────────────
                    console.log("81. Seeding quote sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM quote WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 689:
                    quoteRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"quoteId\" FROM \"quoteLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 690:
                    qlRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"quoteMakeMethod\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 691:
                    qmmRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"quoteOperation\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 692:
                    qopRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 693:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 AND type='Tool' LIMIT 1", [companyId])];
                case 694:
                    toolRow = _314.sent();
                    quoteId_1 = (_207 = quoteRow.rows[0]) === null || _207 === void 0 ? void 0 : _207.id;
                    qlId = (_208 = qlRow.rows[0]) === null || _208 === void 0 ? void 0 : _208.id;
                    qmmId = (_209 = qmmRow.rows[0]) === null || _209 === void 0 ? void 0 : _209.id;
                    qopId = (_210 = qopRow.rows[0]) === null || _210 === void 0 ? void 0 : _210.id;
                    itemId = (_211 = itemRow.rows[0]) === null || _211 === void 0 ? void 0 : _211.id;
                    toolId = (_212 = toolRow.rows[0]) === null || _212 === void 0 ? void 0 : _212.id;
                    if (!(quoteId_1 && qlId && qmmId && itemId)) return [3 /*break*/, 697];
                    return [4 /*yield*/, client.query("SELECT id FROM \"quoteMaterial\" WHERE \"quoteId\"=$1 AND \"itemId\"=$2 AND \"companyId\"=$3 LIMIT 1", [quoteId_1, itemId, companyId])];
                case 695:
                    existsQM = _314.sent();
                    if (!(((_213 = existsQM.rowCount) !== null && _213 !== void 0 ? _213 : 0) === 0)) return [3 /*break*/, 697];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteMaterial\" (\"quoteId\", \"quoteLineId\", \"itemId\", \"itemType\", \"methodType\", \"order\", description, quantity, \"unitCost\", \"companyId\", \"createdBy\", \"quoteMakeMethodId\") VALUES ($1, $2, $3, $4, $5::\"methodType\", $6, $7, $8, $9, $10, $11, $12) ON CONFLICT DO NOTHING", [
                            quoteId_1,
                            qlId,
                            itemId,
                            "Part",
                            "Pull from Inventory",
                            1,
                            "Dev Material",
                            1,
                            5.0,
                            companyId,
                            userId,
                            qmmId
                        ])];
                case 696:
                    _314.sent();
                    _314.label = 697;
                case 697:
                    if (!qopId) return [3 /*break*/, 701];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteOperationParameter\" (key, value, \"operationId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", ["speed", "100rpm", qopId, companyId, userId])];
                case 698:
                    _314.sent();
                    // quoteOperationStep
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteOperationStep\" (name, type, \"sortOrder\", \"operationId\", \"companyId\", \"createdBy\") VALUES ($1, $2::\"procedureStepType\", $3, $4, $5, $6) ON CONFLICT DO NOTHING", ["Inspect", "Checkbox", 1, qopId, companyId, userId])];
                case 699:
                    // quoteOperationStep
                    _314.sent();
                    if (!toolId) return [3 /*break*/, 701];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteOperationTool\" (\"operationId\", \"toolId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [qopId, toolId, 1, companyId, userId])];
                case 700:
                    _314.sent();
                    _314.label = 701;
                case 701:
                    if (!(quoteId_1 && qlId)) return [3 /*break*/, 703];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteLinePrice\" (\"quoteId\", \"quoteLineId\", quantity, \"unitPrice\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [quoteId_1, qlId, 1, 99.99, userId])];
                case 702:
                    _314.sent();
                    _314.label = 703;
                case 703:
                    console.log("   Created quote sub-records");
                    // ─── Step 82: quotePayment, quoteShipment ─────────────────────────────────
                    console.log("82. Seeding quote payment and shipment...");
                    return [4 /*yield*/, client.query("SELECT id FROM quote WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 704:
                    quoteRow = _314.sent();
                    quoteId_2 = (_214 = quoteRow.rows[0]) === null || _214 === void 0 ? void 0 : _214.id;
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 705:
                    custRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT cl.id, cl.\"customerId\" FROM \"customerLocation\" cl JOIN customer c ON cl.\"customerId\"=c.id WHERE c.\"companyId\"=$1 LIMIT 1", [companyId])];
                case 706:
                    custLocRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT cc.id FROM \"customerContact\" cc JOIN customer c ON cc.\"customerId\"=c.id WHERE c.\"companyId\"=$1 LIMIT 1", [companyId])];
                case 707:
                    custContactRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"paymentTerm\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 708:
                    ptRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 709:
                    locRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingMethod\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 710:
                    smRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"shippingTerm\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 711:
                    stRow = _314.sent();
                    if (!quoteId_2) return [3 /*break*/, 717];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"quotePayment\" WHERE id=$1 LIMIT 1", [quoteId_2])];
                case 712:
                    existsQP = _314.sent();
                    if (!(((_215 = existsQP.rowCount) !== null && _215 !== void 0 ? _215 : 0) === 0)) return [3 /*break*/, 714];
                    return [4 /*yield*/, client.query("INSERT INTO \"quotePayment\" (id, \"invoiceCustomerId\", \"invoiceCustomerLocationId\", \"invoiceCustomerContactId\", \"paymentTermId\", \"companyId\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [
                            quoteId_2,
                            (_216 = custRow.rows[0]) === null || _216 === void 0 ? void 0 : _216.id,
                            (_217 = custLocRow.rows[0]) === null || _217 === void 0 ? void 0 : _217.id,
                            (_218 = custContactRow.rows[0]) === null || _218 === void 0 ? void 0 : _218.id,
                            (_219 = ptRow.rows[0]) === null || _219 === void 0 ? void 0 : _219.id,
                            companyId
                        ])];
                case 713:
                    _314.sent();
                    _314.label = 714;
                case 714: return [4 /*yield*/, client.query("SELECT 1 FROM \"quoteShipment\" WHERE id=$1 LIMIT 1", [quoteId_2])];
                case 715:
                    existsQS = _314.sent();
                    if (!(((_220 = existsQS.rowCount) !== null && _220 !== void 0 ? _220 : 0) === 0)) return [3 /*break*/, 717];
                    return [4 /*yield*/, client.query("INSERT INTO \"quoteShipment\" (id, \"locationId\", \"shippingMethodId\", \"shippingTermId\", \"companyId\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            quoteId_2,
                            (_221 = locRow.rows[0]) === null || _221 === void 0 ? void 0 : _221.id,
                            (_222 = smRow.rows[0]) === null || _222 === void 0 ? void 0 : _222.id,
                            (_223 = stRow.rows[0]) === null || _223 === void 0 ? void 0 : _223.id,
                            companyId
                        ])];
                case 716:
                    _314.sent();
                    _314.label = 717;
                case 717:
                    console.log("   Created quote payment and shipment");
                    // ─── Step 83: salesOrder sub-records ──────────────────────────────────────
                    console.log("83. Seeding sales order sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"salesOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 718:
                    soRow = _314.sent();
                    soId = (_224 = soRow.rows[0]) === null || _224 === void 0 ? void 0 : _224.id;
                    if (!soId) return [3 /*break*/, 721];
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderStatusHistory\" (\"salesOrderId\", status, \"createdBy\") VALUES ($1, $2::\"salesOrderStatus\", $3) ON CONFLICT DO NOTHING", [soId, "Draft", userId])];
                case 719:
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"salesOrderTransaction\" (\"salesOrderId\", type, \"userId\") VALUES ($1, $2::\"salesOrderTransactionType\", $3) ON CONFLICT DO NOTHING", [soId, "Edit", userId])];
                case 720:
                    _314.sent();
                    _314.label = 721;
                case 721:
                    console.log("   Created sales order sub-records");
                    // ─── Step 84: supplierQuoteLinePrice ──────────────────────────────────────
                    console.log("84. Seeding supplier quote line price...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierQuote\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 722:
                    sqRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"supplierQuoteId\" FROM \"supplierQuoteLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 723:
                    sqlRow = _314.sent();
                    sqId = (_225 = sqRow.rows[0]) === null || _225 === void 0 ? void 0 : _225.id;
                    sqlId = (_226 = sqlRow.rows[0]) === null || _226 === void 0 ? void 0 : _226.id;
                    if (!(sqId && sqlId)) return [3 /*break*/, 725];
                    return [4 /*yield*/, client.query("INSERT INTO \"supplierQuoteLinePrice\" (\"supplierQuoteId\", \"supplierQuoteLineId\", quantity, \"supplierUnitPrice\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [sqId, sqlId, 1, 50.0, userId])];
                case 724:
                    _314.sent();
                    _314.label = 725;
                case 725:
                    console.log("   Created supplier quote line price");
                    // ─── Step 85: methodOperation sub-records ─────────────────────────────────
                    console.log("85. Seeding method operation sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"methodOperation\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 726:
                    mopRow = _314.sent();
                    mopId = (_227 = mopRow.rows[0]) === null || _227 === void 0 ? void 0 : _227.id;
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 AND type='Tool' LIMIT 1", [companyId])];
                case 727:
                    toolRow = _314.sent();
                    if (!mopId) return [3 /*break*/, 730];
                    return [4 /*yield*/, client.query("INSERT INTO \"methodOperationParameter\" (key, value, \"operationId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", ["feedRate", "200mm/min", mopId, companyId, userId])];
                case 728:
                    _314.sent();
                    if (!toolRow.rows[0]) return [3 /*break*/, 730];
                    return [4 /*yield*/, client.query("INSERT INTO \"methodOperationTool\" (\"operationId\", \"toolId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [mopId, toolRow.rows[0].id, 1, companyId, userId])];
                case 729:
                    _314.sent();
                    _314.label = 730;
                case 730:
                    console.log("   Created method operation sub-records");
                    // ─── Step 86: procedureParameter ─────────────────────────────────────────
                    console.log("86. Seeding procedure parameter...");
                    return [4 /*yield*/, client.query("SELECT id FROM procedure WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 731:
                    procRow = _314.sent();
                    if (!procRow.rows[0]) return [3 /*break*/, 733];
                    return [4 /*yield*/, client.query("INSERT INTO \"procedureParameter\" (\"procedureId\", key, value, \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [procRow.rows[0].id, "temperature", "25°C", userId])];
                case 732:
                    _314.sent();
                    _314.label = 733;
                case 733:
                    console.log("   Created procedure parameter");
                    // ─── Step 87: configurationParameterGroup + configurationParameter ───────
                    // TSHIRT-001 (Size + Color) and JACKET-001 (Size) are configurable; others are not.
                    console.log("87. Seeding configuration parameters...");
                    itemConfigs = [
                        {
                            itemKey: "TSHIRT-001",
                            groupName: "".concat(L.configParams.sizeLabel, " & ").concat(L.configParams.colorLabel),
                            params: [
                                {
                                    paramLabel: L.configParams.sizeLabel,
                                    paramKey: "size",
                                    dataType: "list",
                                    listOptions: L.configParams.sizeOptions,
                                    sortOrder: 1
                                },
                                {
                                    paramLabel: L.configParams.colorLabel,
                                    paramKey: "color",
                                    dataType: "list",
                                    listOptions: L.configParams.colorOptions,
                                    sortOrder: 2
                                }
                            ]
                        },
                        {
                            itemKey: "JACKET-001",
                            groupName: L.configParams.sizeLabel,
                            params: [
                                {
                                    paramLabel: L.configParams.sizeLabel,
                                    paramKey: "size",
                                    dataType: "list",
                                    listOptions: L.configParams.sizeOptions,
                                    sortOrder: 1
                                }
                            ]
                        }
                    ];
                    _20 = 0, itemConfigs_1 = itemConfigs;
                    _314.label = 734;
                case 734:
                    if (!(_20 < itemConfigs_1.length)) return [3 /*break*/, 744];
                    cfg = itemConfigs_1[_20];
                    targetItemId = itemIds[cfg.itemKey];
                    if (!targetItemId)
                        return [3 /*break*/, 743];
                    return [4 /*yield*/, client.query("SELECT id FROM \"configurationParameterGroup\" WHERE \"itemId\"=$1 AND \"companyId\"=$2 LIMIT 1", [targetItemId, companyId])];
                case 735:
                    existsCPG = _314.sent();
                    cpgId = void 0;
                    if (!(((_228 = existsCPG.rowCount) !== null && _228 !== void 0 ? _228 : 0) === 0)) return [3 /*break*/, 737];
                    return [4 /*yield*/, client.query("INSERT INTO \"configurationParameterGroup\" (\"itemId\", name, \"sortOrder\", \"companyId\") VALUES ($1, $2, $3, $4) RETURNING id", [targetItemId, cfg.groupName, 1, companyId])];
                case 736:
                    r = _314.sent();
                    cpgId = r.rows[0].id;
                    return [3 /*break*/, 738];
                case 737:
                    cpgId = existsCPG.rows[0].id;
                    _314.label = 738;
                case 738:
                    _21 = 0, _22 = cfg.params;
                    _314.label = 739;
                case 739:
                    if (!(_21 < _22.length)) return [3 /*break*/, 743];
                    p = _22[_21];
                    return [4 /*yield*/, client.query("SELECT id FROM \"configurationParameter\" WHERE \"itemId\"=$1 AND key=$2 AND \"companyId\"=$3 LIMIT 1", [targetItemId, p.paramKey, companyId])];
                case 740:
                    existsCP = _314.sent();
                    if (!(((_229 = existsCP.rowCount) !== null && _229 !== void 0 ? _229 : 0) === 0)) return [3 /*break*/, 742];
                    return [4 /*yield*/, client.query("INSERT INTO \"configurationParameter\" (\"itemId\", label, key, \"dataType\", \"listOptions\", \"configurationParameterGroupId\", \"sortOrder\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, $3, $4::\"configurationParameterDataType\", $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING", [
                            targetItemId,
                            p.paramLabel,
                            p.paramKey,
                            p.dataType,
                            p.listOptions,
                            cpgId,
                            p.sortOrder,
                            companyId,
                            userId
                        ])];
                case 741:
                    _314.sent();
                    _314.label = 742;
                case 742:
                    _21++;
                    return [3 /*break*/, 739];
                case 743:
                    _20++;
                    return [3 /*break*/, 734];
                case 744:
                    console.log("   Created configuration parameters for TSHIRT-001 (Size, Color) and JACKET-001 (Size)");
                    // ─── Step 87b: Clothing manufacturing jobs with configuration instances ───
                    // configTable format mirrors real prod data: size labels ARE the keys, values are per-size quantities.
                    // e.g. {"configTable":[{"S":5,"M":10,"L":12,"XL":8,"2XL":5,"color":"Black"}],"configTablePrimaryKeys":["S","M","L","XL","2XL"]}
                    console.log("87b. Seeding clothing manufacturing jobs...");
                    tshirtId = itemIds["TSHIRT-001"];
                    jacketId = itemIds["JACKET-001"];
                    cuttingProcId = (_230 = processIds["Cutting"]) !== null && _230 !== void 0 ? _230 : null;
                    sewingProcId = (_231 = processIds["Sewing"]) !== null && _231 !== void 0 ? _231 : null;
                    finishingProcId = (_232 = processIds["Finishing"]) !== null && _232 !== void 0 ? _232 : null;
                    qiProcId2 = (_233 = processIds["Quality Inspection"]) !== null && _233 !== void 0 ? _233 : null;
                    cuttingWCId = (_234 = workCenterIds["Cutting Table 1"]) !== null && _234 !== void 0 ? _234 : null;
                    sewingWCId = (_235 = workCenterIds["Sewing Line A"]) !== null && _235 !== void 0 ? _235 : null;
                    getOrCreateGarmentJob = function (itemId, status, qty) { return __awaiter(_this, void 0, void 0, function () {
                        var ex, jobId, jrid, r, mmRow;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, client.query("SELECT id FROM job WHERE \"itemId\"=$1 AND \"companyId\"=$2 LIMIT 1", [itemId, companyId])];
                                case 1:
                                    ex = _c.sent();
                                    if (!(ex.rows.length > 0)) return [3 /*break*/, 2];
                                    jobId = ex.rows[0].id;
                                    return [3 /*break*/, 5];
                                case 2: return [4 /*yield*/, nextSeq("job")];
                                case 3:
                                    jrid = _c.sent();
                                    return [4 /*yield*/, client.query("INSERT INTO job (\"jobId\",\"itemId\",\"unitOfMeasureCode\",\"locationId\",status,quantity,\"companyId\",\"createdBy\")\n             VALUES ($1,$2,'EA',$3,$4::\"jobStatus\",$5,$6,$7) RETURNING id", [jrid, itemId, locationId, status, qty, companyId, userId])];
                                case 4:
                                    r = _c.sent();
                                    jobId = r.rows[0].id;
                                    _c.label = 5;
                                case 5: return [4 /*yield*/, client.query("SELECT id FROM \"jobMakeMethod\" WHERE \"jobId\"=$1 AND \"parentMaterialId\" IS NULL LIMIT 1", [jobId])];
                                case 6:
                                    mmRow = _c.sent();
                                    return [2 /*return*/, { jobId: jobId, mmId: (_b = (_a = mmRow.rows[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null }];
                            }
                        });
                    }); };
                    getOrCreateGarmentOp = function (jobId, mmId, order, procId, wcId, description, laborTime, status) { return __awaiter(_this, void 0, void 0, function () {
                        var ex, r;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.query("SELECT id FROM \"jobOperation\" WHERE \"jobId\"=$1 AND description=$2 AND \"companyId\"=$3 LIMIT 1", [jobId, description, companyId])];
                                case 1:
                                    ex = _a.sent();
                                    if (ex.rows.length > 0)
                                        return [2 /*return*/, ex.rows[0].id];
                                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperation\" (\"jobId\",\"jobMakeMethodId\",\"order\",\"processId\",\"workCenterId\",description,\"laborTime\",\"laborUnit\",status,\"companyId\",\"createdBy\")\n           VALUES ($1,$2,$3,$4,$5,$6,$7,'Minutes/Piece'::factor,$8::\"jobOperationStatus\",$9,$10) RETURNING id", [
                                            jobId,
                                            mmId,
                                            order,
                                            procId,
                                            wcId,
                                            description,
                                            laborTime,
                                            status,
                                            companyId,
                                            userId
                                        ])];
                                case 2:
                                    r = _a.sent();
                                    return [2 /*return*/, r.rows[0].id];
                            }
                        });
                    }); };
                    seedGarmentProdRecord = function (jobId, opId, wcId, qty, startHoursAgo, endHoursAgo, configJson) { return __awaiter(_this, void 0, void 0, function () {
                        var exPE, peId, r, exPQR, pqrId, r, exPQ, exJOP, stillMissing;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, client.query("SELECT id FROM \"productionEvent\" WHERE \"jobOperationId\"=$1 LIMIT 1", [opId])];
                                case 1:
                                    exPE = _d.sent();
                                    if (!(exPE.rows.length > 0)) return [3 /*break*/, 2];
                                    peId = exPE.rows[0].id;
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, client.query("INSERT INTO \"productionEvent\" (\"jobOperationId\",type,\"startTime\",\"endTime\",\"employeeId\",\"workCenterId\",\"companyId\",\"createdBy\")\n             VALUES ($1,'Labor'::\"productionEventType\",NOW()-($2*interval'1 hour'),NOW()-($3*interval'1 hour'),$4,$5,$6,$7) RETURNING id", [
                                        opId,
                                        startHoursAgo,
                                        endHoursAgo,
                                        employeeId,
                                        wcId,
                                        companyId,
                                        userId
                                    ])];
                                case 3:
                                    r = _d.sent();
                                    peId = r.rows[0].id;
                                    _d.label = 4;
                                case 4: return [4 /*yield*/, client.query("SELECT id FROM \"productionQuantityReport\" WHERE \"jobOperationId\"=$1 LIMIT 1", [opId])];
                                case 5:
                                    exPQR = _d.sent();
                                    if (!(exPQR.rows.length > 0)) return [3 /*break*/, 6];
                                    pqrId = exPQR.rows[0].id;
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, client.query("INSERT INTO \"productionQuantityReport\" (\"jobId\",\"jobOperationId\",\"employeeId\",\"originalQuantity\",\"companyId\",\"createdBy\")\n             VALUES ($1,$2,$3,$4,$5,$6) RETURNING id", [jobId, opId, employeeId, qty, companyId, userId])];
                                case 7:
                                    r = _d.sent();
                                    pqrId = r.rows[0].id;
                                    _d.label = 8;
                                case 8: return [4 /*yield*/, client.query("SELECT 1 FROM \"productionQuantity\" WHERE \"jobOperationId\"=$1 LIMIT 1", [opId])];
                                case 9:
                                    exPQ = _d.sent();
                                    if (!(((_a = exPQ.rowCount) !== null && _a !== void 0 ? _a : 0) === 0)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, client.query("INSERT INTO \"productionQuantity\" (\"reportId\",\"jobOperationId\",type,quantity,\"laborProductionEventId\",\"employeeId\",configuration,\"companyId\",\"createdBy\")\n             VALUES ($1,$2,'Production'::\"productionQuantityType\",$3,$4,$5,$6::jsonb,$7,$8)", [pqrId, opId, qty, peId, employeeId, configJson, companyId, userId])];
                                case 10:
                                    _d.sent();
                                    return [3 /*break*/, 13];
                                case 11: 
                                // Ensure configuration is set on any existing record
                                return [4 /*yield*/, client.query("UPDATE \"productionQuantity\" SET configuration=$1::jsonb WHERE \"jobOperationId\"=$2 AND configuration IS NULL", [configJson, opId])];
                                case 12:
                                    // Ensure configuration is set on any existing record
                                    _d.sent();
                                    _d.label = 13;
                                case 13: return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationPickup\" WHERE \"jobOperationId\"=$1 AND configuration IS NOT NULL LIMIT 1", [opId])];
                                case 14:
                                    exJOP = _d.sent();
                                    if (!(((_b = exJOP.rowCount) !== null && _b !== void 0 ? _b : 0) === 0)) return [3 /*break*/, 18];
                                    // Insert new pickup with config, or update existing null-config pickups
                                    return [4 /*yield*/, client.query("UPDATE \"jobOperationPickup\" SET configuration=$1::jsonb WHERE \"jobOperationId\"=$2 AND configuration IS NULL", [configJson, opId])];
                                case 15:
                                    // Insert new pickup with config, or update existing null-config pickups
                                    _d.sent();
                                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationPickup\" WHERE \"jobOperationId\"=$1 LIMIT 1", [opId])];
                                case 16:
                                    stillMissing = _d.sent();
                                    if (!(((_c = stillMissing.rowCount) !== null && _c !== void 0 ? _c : 0) === 0)) return [3 /*break*/, 18];
                                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationPickup\" (\"jobOperationId\",\"employeeId\",quantity,configuration,\"companyId\",\"createdBy\")\n               VALUES ($1,$2,$3,$4::jsonb,$5,$6)", [opId, employeeId, qty, configJson, companyId, userId])];
                                case 17:
                                    _d.sent();
                                    _d.label = 18;
                                case 18: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!tshirtId) return [3 /*break*/, 765];
                    return [4 /*yield*/, getOrCreateGarmentJob(tshirtId, "In Progress", 40)];
                case 745:
                    tshirt = _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(tshirt.jobId, tshirt.mmId, 1, cuttingProcId, cuttingWCId, L.garmentOps.tshirtCutDesc, 15, "Done")];
                case 746:
                    cutOpId = _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(tshirt.jobId, tshirt.mmId, 2, sewingProcId, sewingWCId, L.garmentOps.tshirtSewDesc, 25, "In Progress")];
                case 747:
                    sewOpId = _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(tshirt.jobId, tshirt.mmId, 3, finishingProcId, sewingWCId, L.garmentOps.tshirtPressDesc, 10, "Todo")];
                case 748:
                    _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(tshirt.jobId, tshirt.mmId, 4, qiProcId2, cuttingWCId, L.garmentOps.tshirtQiDesc, 8, "Todo")];
                case 749:
                    _314.sent();
                    blackColor = L.configParams.colorOptions[0];
                    navyColor = L.configParams.colorOptions[2];
                    tshirtBlackConfig = JSON.stringify({
                        configTable: [{ S: 5, M: 10, L: 12, XL: 8, "2XL": 5, color: blackColor }],
                        configTablePrimaryKeys: L.configParams.sizeOptions
                    });
                    return [4 /*yield*/, seedGarmentProdRecord(tshirt.jobId, cutOpId, cuttingWCId, 40, 48, 46, tshirtBlackConfig)];
                case 750:
                    _314.sent();
                    tshirtNavyConfig = JSON.stringify({
                        configTable: [{ S: 5, M: 7, L: 10, XL: 5, "2XL": 3, color: navyColor }],
                        configTablePrimaryKeys: L.configParams.sizeOptions
                    });
                    tshirtNavyProdConfig = JSON.stringify({
                        configTable: [{ S: 2, M: 4, L: 8, XL: 4, "2XL": 2, color: navyColor }],
                        configTablePrimaryKeys: L.configParams.sizeOptions
                    });
                    // Pickup: 30 pieces taken to sewing station.
                    // DELETE all existing pickups first so re-runs always produce exactly one record.
                    return [4 /*yield*/, client.query("DELETE FROM \"jobOperationPickup\" WHERE \"jobOperationId\"=$1", [sewOpId])];
                case 751:
                    // Pickup: 30 pieces taken to sewing station.
                    // DELETE all existing pickups first so re-runs always produce exactly one record.
                    _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationPickup\" (\"jobOperationId\",\"employeeId\",quantity,configuration,\"companyId\",\"createdBy\")\n           VALUES ($1,$2,30,$3::jsonb,$4,$5)", [sewOpId, employeeId, tshirtNavyConfig, companyId, userId])];
                case 752:
                    _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"productionEvent\" WHERE \"jobOperationId\"=$1 LIMIT 1", [sewOpId])];
                case 753:
                    exSewPE = _314.sent();
                    sewPeId = void 0;
                    if (!(exSewPE.rows.length > 0)) return [3 /*break*/, 754];
                    sewPeId = exSewPE.rows[0].id;
                    return [3 /*break*/, 756];
                case 754: return [4 /*yield*/, client.query("INSERT INTO \"productionEvent\" (\"jobOperationId\",type,\"startTime\",\"employeeId\",\"workCenterId\",\"companyId\",\"createdBy\")\n             VALUES ($1,'Labor'::\"productionEventType\",NOW()-interval'4 hours',$2,$3,$4,$5) RETURNING id", [sewOpId, employeeId, sewingWCId, companyId, userId])];
                case 755:
                    r = _314.sent();
                    sewPeId = r.rows[0].id;
                    _314.label = 756;
                case 756: return [4 /*yield*/, client.query("SELECT id FROM \"productionQuantityReport\" WHERE \"jobOperationId\"=$1 LIMIT 1", [sewOpId])];
                case 757:
                    exSewPQR = _314.sent();
                    sewPqrId = void 0;
                    if (!(exSewPQR.rows.length > 0)) return [3 /*break*/, 758];
                    sewPqrId = exSewPQR.rows[0].id;
                    return [3 /*break*/, 760];
                case 758: return [4 /*yield*/, client.query("INSERT INTO \"productionQuantityReport\" (\"jobId\",\"jobOperationId\",\"employeeId\",\"originalQuantity\",\"companyId\",\"createdBy\")\n             VALUES ($1,$2,$3,20,$4,$5) RETURNING id", [tshirt.jobId, sewOpId, employeeId, companyId, userId])];
                case 759:
                    r = _314.sent();
                    sewPqrId = r.rows[0].id;
                    _314.label = 760;
                case 760: return [4 /*yield*/, client.query("SELECT 1 FROM \"productionQuantity\" WHERE \"jobOperationId\"=$1 LIMIT 1", [sewOpId])];
                case 761:
                    exSewPQ = _314.sent();
                    if (!(((_236 = exSewPQ.rowCount) !== null && _236 !== void 0 ? _236 : 0) === 0)) return [3 /*break*/, 763];
                    return [4 /*yield*/, client.query("INSERT INTO \"productionQuantity\" (\"reportId\",\"jobOperationId\",type,quantity,\"laborProductionEventId\",\"employeeId\",configuration,\"companyId\",\"createdBy\")\n             VALUES ($1,$2,'Production'::\"productionQuantityType\",20,$3,$4,$5::jsonb,$6,$7)", [
                            sewPqrId,
                            sewOpId,
                            sewPeId,
                            employeeId,
                            tshirtNavyProdConfig,
                            companyId,
                            userId
                        ])];
                case 762:
                    _314.sent();
                    return [3 /*break*/, 765];
                case 763: return [4 /*yield*/, client.query("UPDATE \"productionQuantity\" SET configuration=$1::jsonb WHERE \"jobOperationId\"=$2 AND configuration IS NULL", [tshirtNavyProdConfig, sewOpId])];
                case 764:
                    _314.sent();
                    _314.label = 765;
                case 765:
                    if (!jacketId) return [3 /*break*/, 771];
                    return [4 /*yield*/, getOrCreateGarmentJob(jacketId, "Ready", 20)];
                case 766:
                    jacket = _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(jacket.jobId, jacket.mmId, 1, cuttingProcId, cuttingWCId, L.garmentOps.jacketCutDesc, 20, "Todo")];
                case 767:
                    _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(jacket.jobId, jacket.mmId, 2, sewingProcId, sewingWCId, L.garmentOps.jacketSewDesc, 40, "Todo")];
                case 768:
                    _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(jacket.jobId, jacket.mmId, 3, sewingProcId, sewingWCId, L.garmentOps.jacketHardwareDesc, 20, "Todo")];
                case 769:
                    _314.sent();
                    return [4 /*yield*/, getOrCreateGarmentOp(jacket.jobId, jacket.mmId, 4, qiProcId2, cuttingWCId, L.garmentOps.jacketQiDesc, 10, "Todo")];
                case 770:
                    _314.sent();
                    _314.label = 771;
                case 771:
                    console.log("   Created clothing jobs for TSHIRT-001 and JACKET-001");
                    // ─── Step 88: qualityDocumentStep ─────────────────────────────────────────
                    console.log("88. Seeding quality document step...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"qualityDocument\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 772:
                    qdRow = _314.sent();
                    if (!qdRow.rows[0]) return [3 /*break*/, 774];
                    return [4 /*yield*/, client.query("INSERT INTO \"qualityDocumentStep\" (\"qualityDocumentId\", name, required, \"sortOrder\", type, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5::\"procedureStepType\", $6, $7) ON CONFLICT DO NOTHING", [
                            qdRow.rows[0].id,
                            "Visual Inspection",
                            true,
                            1,
                            "Checkbox",
                            companyId,
                            userId
                        ])];
                case 773:
                    _314.sent();
                    _314.label = 774;
                case 774:
                    console.log("   Created quality document step");
                    // ─── Step 89: inboundInspection + history + sample ────────────────────────
                    console.log("89. Seeding inbound inspection...");
                    return [4 /*yield*/, client.query("SELECT id, \"receiptId\", \"itemId\" FROM \"receiptLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 775:
                    rlRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM supplier WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 776:
                    supRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"trackedEntity\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 777:
                    teRow = _314.sent();
                    rl = rlRow.rows[0];
                    if (!rl) return [3 /*break*/, 789];
                    return [4 /*yield*/, client.query("SELECT get_next_sequence($1, $2) AS id", ["inboundInspection", companyId])];
                case 778:
                    inboundSeq = _314.sent();
                    iiSeqId = inboundSeq.rows[0].id;
                    return [4 /*yield*/, client.query("SELECT id FROM \"inboundInspection\" WHERE \"receiptLineId\"=$1 AND \"companyId\"=$2 LIMIT 1", [rl.id, companyId])];
                case 779:
                    existsII = _314.sent();
                    iiId = void 0;
                    if (!(((_237 = existsII.rowCount) !== null && _237 !== void 0 ? _237 : 0) === 0)) return [3 /*break*/, 781];
                    return [4 /*yield*/, client.query("INSERT INTO \"inboundInspection\" (\"inboundInspectionId\", \"receiptLineId\", \"receiptId\", \"itemId\", \"supplierId\", \"lotSize\", \"samplingStandard\", \"samplingPlanType\", \"sampleSize\", \"acceptanceNumber\", \"rejectionNumber\", \"aql\", \"inspectionLevel\", severity, status, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6, $7::\"samplingStandard\", $8::\"samplingPlanType\", $9, $10, $11, $12, $13::\"inspectionLevel\", $14::\"inspectionSeverity\", $15::\"inboundInspectionStatus\", $16, $17) RETURNING id", [
                            iiSeqId,
                            rl.id,
                            rl.receiptId,
                            rl.itemId,
                            (_238 = supRow.rows[0]) === null || _238 === void 0 ? void 0 : _238.id,
                            100,
                            "ANSI_Z1_4",
                            "AQL",
                            13,
                            1,
                            2,
                            1.0,
                            "II",
                            "Normal",
                            "Pending",
                            companyId,
                            userId
                        ])];
                case 780:
                    r = _314.sent();
                    iiId = r.rows[0].id;
                    return [3 /*break*/, 782];
                case 781:
                    iiId = existsII.rows[0].id;
                    _314.label = 782;
                case 782: return [4 /*yield*/, client.query("SELECT id FROM \"inboundInspectionHistory\" WHERE \"inboundInspectionId\"=$1 AND \"companyId\"=$2 LIMIT 1", [iiId, companyId])];
                case 783:
                    existsIIH = _314.sent();
                    if (!(((_239 = existsIIH.rowCount) !== null && _239 !== void 0 ? _239 : 0) === 0)) return [3 /*break*/, 785];
                    return [4 /*yield*/, client.query("INSERT INTO \"inboundInspectionHistory\" (\"inboundInspectionId\", \"itemId\", \"supplierId\", \"samplingStandard\", severity, \"inspectionLevel\", \"aql\", \"lotSize\", \"sampleSize\", \"defectsFound\", outcome, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4::\"samplingStandard\", $5::\"inspectionSeverity\", $6::\"inspectionLevel\", $7, $8, $9, $10, $11, $12, $13)", [
                            iiId,
                            rl.itemId,
                            (_240 = supRow.rows[0]) === null || _240 === void 0 ? void 0 : _240.id,
                            "ANSI_Z1_4",
                            "Normal",
                            "II",
                            1.0,
                            100,
                            13,
                            0,
                            "Passed",
                            companyId,
                            userId
                        ])];
                case 784:
                    _314.sent();
                    _314.label = 785;
                case 785:
                    if (!teRow.rows[0]) return [3 /*break*/, 788];
                    return [4 /*yield*/, client.query("SELECT id FROM \"inboundInspectionSample\" WHERE \"inboundInspectionId\"=$1 AND \"companyId\"=$2 LIMIT 1", [iiId, companyId])];
                case 786:
                    existsIIS = _314.sent();
                    if (!(((_241 = existsIIS.rowCount) !== null && _241 !== void 0 ? _241 : 0) === 0)) return [3 /*break*/, 788];
                    return [4 /*yield*/, client.query("INSERT INTO \"inboundInspectionSample\" (\"inboundInspectionId\", \"trackedEntityId\", status, \"companyId\", \"createdBy\") VALUES ($1, $2, $3::\"inboundInspectionSampleStatus\", $4, $5)", [iiId, teRow.rows[0].id, "Passed", companyId, userId])];
                case 787:
                    _314.sent();
                    _314.label = 788;
                case 788:
                    console.log("   Created inbound inspection records");
                    _314.label = 789;
                case 789:
                    // ─── Step 90: nonConformance sub-records ──────────────────────────────────
                    console.log("90. Seeding non-conformance sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"nonConformance\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 790:
                    ncRow = _314.sent();
                    ncId = (_242 = ncRow.rows[0]) === null || _242 === void 0 ? void 0 : _242.id;
                    return [4 /*yield*/, client.query("SELECT id FROM process WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 791:
                    procRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM customer WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 792:
                    custRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM supplier WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 793:
                    supRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 794:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"trackedEntity\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 795:
                    teRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"jobId\" FROM \"jobOperation\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 796:
                    jopRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"purchaseOrderId\" FROM \"purchaseOrderLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 797:
                    polRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"receiptId\" FROM \"receiptLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 798:
                    rlRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"salesOrderId\" FROM \"salesOrderLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 799:
                    solRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id, \"shipmentId\" FROM \"shipmentLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 800:
                    shlRow = _314.sent();
                    if (!ncId) return [3 /*break*/, 838];
                    return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceApprovalTask\" WHERE \"nonConformanceId\"=$1 AND \"companyId\"=$2 LIMIT 1", [ncId, companyId])];
                case 801:
                    existsNCAT = _314.sent();
                    _ncatId = void 0;
                    if (!(((_243 = existsNCAT.rowCount) !== null && _243 !== void 0 ? _243 : 0) === 0)) return [3 /*break*/, 803];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceApprovalTask\" (\"nonConformanceId\", \"approvalType\", status, notes, \"companyId\", \"createdBy\") VALUES ($1, $2::\"nonConformanceApproval\", $3::\"nonConformanceTaskStatus\", $4, $5, $6) RETURNING id", [ncId, "MRB", "Pending", "{}", companyId, userId])];
                case 802:
                    r = _314.sent();
                    _ncatId = r.rows[0].id;
                    return [3 /*break*/, 804];
                case 803:
                    _ncatId = existsNCAT.rows[0].id;
                    _314.label = 804;
                case 804: return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceActionTask\" WHERE \"nonConformanceId\"=$1 AND \"companyId\"=$2 LIMIT 1", [ncId, companyId])];
                case 805:
                    existsNCActT = _314.sent();
                    ncActTId = void 0;
                    if (!(((_244 = existsNCActT.rowCount) !== null && _244 !== void 0 ? _244 : 0) === 0)) return [3 /*break*/, 807];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceActionTask\" (\"nonConformanceId\", status, notes, \"companyId\", \"createdBy\") VALUES ($1, $2::\"nonConformanceTaskStatus\", $3, $4, $5) RETURNING id", [ncId, "Pending", "{}", companyId, userId])];
                case 806:
                    r = _314.sent();
                    ncActTId = r.rows[0].id;
                    return [3 /*break*/, 808];
                case 807:
                    ncActTId = existsNCActT.rows[0].id;
                    _314.label = 808;
                case 808:
                    if (!(ncActTId && procRow.rows[0])) return [3 /*break*/, 810];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceActionProcess\" (\"actionTaskId\", \"processId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncActTId, procRow.rows[0].id, companyId, userId])];
                case 809:
                    _314.sent();
                    _314.label = 810;
                case 810: return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceReviewer\" WHERE \"nonConformanceId\"=$1 AND \"companyId\"=$2 LIMIT 1", [ncId, companyId])];
                case 811:
                    existsNCR = _314.sent();
                    if (!(((_245 = existsNCR.rowCount) !== null && _245 !== void 0 ? _245 : 0) === 0)) return [3 /*break*/, 813];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceReviewer\" (title, status, \"nonConformanceId\", notes, assignee, \"companyId\", \"createdBy\") VALUES ($1, $2::\"nonConformanceTaskStatus\", $3, $4, $5, $6, $7)", ["Quality Review", "Pending", ncId, "{}", userId, companyId, userId])];
                case 812:
                    _314.sent();
                    _314.label = 813;
                case 813:
                    if (!custRow.rows[0]) return [3 /*break*/, 815];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceCustomer\" (\"nonConformanceId\", \"customerId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, custRow.rows[0].id, companyId, userId])];
                case 814:
                    _314.sent();
                    _314.label = 815;
                case 815:
                    if (!supRow.rows[0]) return [3 /*break*/, 817];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceSupplier\" (\"nonConformanceId\", \"supplierId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, supRow.rows[0].id, companyId, userId])];
                case 816:
                    _314.sent();
                    _314.label = 817;
                case 817:
                    nciId = void 0;
                    if (!itemRow.rows[0]) return [3 /*break*/, 821];
                    return [4 /*yield*/, client.query("SELECT id FROM \"nonConformanceItem\" WHERE \"nonConformanceId\"=$1 AND \"itemId\"=$2 AND \"companyId\"=$3 LIMIT 1", [ncId, itemRow.rows[0].id, companyId])];
                case 818:
                    existsNCI = _314.sent();
                    if (!(((_246 = existsNCI.rowCount) !== null && _246 !== void 0 ? _246 : 0) === 0)) return [3 /*break*/, 820];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceItem\" (\"nonConformanceId\", \"itemId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) RETURNING id", [ncId, itemRow.rows[0].id, 1, companyId, userId])];
                case 819:
                    r = _314.sent();
                    nciId = r.rows[0].id;
                    return [3 /*break*/, 821];
                case 820:
                    nciId = existsNCI.rows[0].id;
                    _314.label = 821;
                case 821:
                    if (!(nciId && teRow.rows[0])) return [3 /*break*/, 823];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceItemTrackedEntity\" (\"nonConformanceItemId\", \"nonConformanceId\", \"trackedEntityId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [nciId, ncId, teRow.rows[0].id, 1, companyId, userId])];
                case 822:
                    _314.sent();
                    _314.label = 823;
                case 823:
                    if (!teRow.rows[0]) return [3 /*break*/, 825];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceTrackedEntity\" (\"nonConformanceId\", \"trackedEntityId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, teRow.rows[0].id, companyId, userId])];
                case 824:
                    _314.sent();
                    _314.label = 825;
                case 825:
                    if (!jopRow.rows[0]) return [3 /*break*/, 827];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceJobOperation\" (\"nonConformanceId\", \"jobOperationId\", \"jobId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [ncId, jopRow.rows[0].id, jopRow.rows[0].jobId, companyId, userId])];
                case 826:
                    _314.sent();
                    _314.label = 827;
                case 827:
                    if (!polRow.rows[0]) return [3 /*break*/, 829];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformancePurchaseOrderLine\" (\"nonConformanceId\", \"purchaseOrderLineId\", \"purchaseOrderId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            ncId,
                            polRow.rows[0].id,
                            polRow.rows[0].purchaseOrderId,
                            companyId,
                            userId
                        ])];
                case 828:
                    _314.sent();
                    _314.label = 829;
                case 829:
                    if (!rlRow.rows[0]) return [3 /*break*/, 831];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceReceiptLine\" (\"nonConformanceId\", \"receiptLineId\", \"receiptId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [ncId, rlRow.rows[0].id, rlRow.rows[0].receiptId, companyId, userId])];
                case 830:
                    _314.sent();
                    _314.label = 831;
                case 831:
                    if (!solRow.rows[0]) return [3 /*break*/, 833];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceSalesOrderLine\" (\"nonConformanceId\", \"salesOrderLineId\", \"salesOrderId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            ncId,
                            solRow.rows[0].id,
                            solRow.rows[0].salesOrderId,
                            companyId,
                            userId
                        ])];
                case 832:
                    _314.sent();
                    _314.label = 833;
                case 833:
                    if (!shlRow.rows[0]) return [3 /*break*/, 835];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceShipmentLine\" (\"nonConformanceId\", \"shipmentLineId\", \"shipmentId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [
                            ncId,
                            shlRow.rows[0].id,
                            shlRow.rows[0].shipmentId,
                            companyId,
                            userId
                        ])];
                case 834:
                    _314.sent();
                    _314.label = 835;
                case 835: return [4 /*yield*/, client.query("SELECT id FROM \"inboundInspection\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 836:
                    iiRow = _314.sent();
                    if (!iiRow.rows[0]) return [3 /*break*/, 838];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceInboundInspection\" (\"nonConformanceId\", \"inboundInspectionId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [ncId, iiRow.rows[0].id, companyId, userId])];
                case 837:
                    _314.sent();
                    _314.label = 838;
                case 838:
                    console.log("   Created non-conformance sub-records");
                    // ─── Step 91: maintenance sub-records ─────────────────────────────────────
                    console.log("91. Seeding maintenance sub-records...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"maintenanceDispatch\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 839:
                    mdRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"maintenanceSchedule\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 840:
                    msRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM employee WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 841:
                    empRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"workCenter\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 842:
                    wcRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 843:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT code FROM \"unitOfMeasure\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 844:
                    uomRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"trackedEntity\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 845:
                    teRow = _314.sent();
                    mdId = (_247 = mdRow.rows[0]) === null || _247 === void 0 ? void 0 : _247.id;
                    msId = (_248 = msRow.rows[0]) === null || _248 === void 0 ? void 0 : _248.id;
                    empId = (_249 = empRow.rows[0]) === null || _249 === void 0 ? void 0 : _249.id;
                    wcId = (_250 = wcRow.rows[0]) === null || _250 === void 0 ? void 0 : _250.id;
                    itemId = (_251 = itemRow.rows[0]) === null || _251 === void 0 ? void 0 : _251.id;
                    uomCode = (_253 = (_252 = uomRow.rows[0]) === null || _252 === void 0 ? void 0 : _252.code) !== null && _253 !== void 0 ? _253 : "EA";
                    if (!mdId) return [3 /*break*/, 856];
                    // maintenanceDispatchComment
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchComment\" (\"maintenanceDispatchId\", comment, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [mdId, "Dispatch comment for dev", companyId, userId])];
                case 846:
                    // maintenanceDispatchComment
                    _314.sent();
                    if (!(empId && wcId)) return [3 /*break*/, 848];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchEvent\" (\"maintenanceDispatchId\", \"employeeId\", \"workCenterId\", \"startTime\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [mdId, empId, wcId, "2024-01-15T09:00:00Z", companyId, userId])];
                case 847:
                    _314.sent();
                    _314.label = 848;
                case 848:
                    mdiId = void 0;
                    if (!itemId) return [3 /*break*/, 852];
                    return [4 /*yield*/, client.query("SELECT id FROM \"maintenanceDispatchItem\" WHERE \"maintenanceDispatchId\"=$1 AND \"itemId\"=$2 AND \"companyId\"=$3 LIMIT 1", [mdId, itemId, companyId])];
                case 849:
                    existsMDI = _314.sent();
                    if (!(((_254 = existsMDI.rowCount) !== null && _254 !== void 0 ? _254 : 0) === 0)) return [3 /*break*/, 851];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchItem\" (\"maintenanceDispatchId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [mdId, itemId, 1, uomCode, companyId, userId])];
                case 850:
                    r = _314.sent();
                    mdiId = r.rows[0].id;
                    return [3 /*break*/, 852];
                case 851:
                    mdiId = existsMDI.rows[0].id;
                    _314.label = 852;
                case 852:
                    if (!(mdiId && teRow.rows[0])) return [3 /*break*/, 854];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchItemTrackedEntity\" (\"maintenanceDispatchItemId\", \"trackedEntityId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING", [mdiId, teRow.rows[0].id, 1, companyId, userId])];
                case 853:
                    _314.sent();
                    _314.label = 854;
                case 854:
                    if (!wcId) return [3 /*break*/, 856];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceDispatchWorkCenter\" (\"maintenanceDispatchId\", \"workCenterId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [mdId, wcId, companyId, userId])];
                case 855:
                    _314.sent();
                    _314.label = 856;
                case 856:
                    if (!(msId && itemId)) return [3 /*break*/, 858];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceScheduleItem\" (\"maintenanceScheduleId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [msId, itemId, 2, uomCode, companyId, userId])];
                case 857:
                    _314.sent();
                    _314.label = 858;
                case 858:
                    console.log("   Created maintenance sub-records");
                    // ─── Step 92: itemLedger ──────────────────────────────────────────────────
                    console.log("92. Seeding item ledger...");
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 859:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 860:
                    locRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 861:
                    poRow = _314.sent();
                    if (!itemRow.rows[0]) return [3 /*break*/, 863];
                    return [4 /*yield*/, client.query("INSERT INTO \"itemLedger\" (\"entryType\", \"documentType\", \"documentId\", \"itemId\", \"locationId\", quantity, \"companyId\", \"createdBy\") VALUES ($1::\"itemLedgerType\", $2::\"itemLedgerDocumentType\", $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING", [
                            "Purchase",
                            "Purchase Receipt",
                            (_255 = poRow.rows[0]) === null || _255 === void 0 ? void 0 : _255.id,
                            itemRow.rows[0].id,
                            (_256 = locRow.rows[0]) === null || _256 === void 0 ? void 0 : _256.id,
                            10,
                            companyId,
                            userId
                        ])];
                case 862:
                    _314.sent();
                    _314.label = 863;
                case 863:
                    console.log("   Created item ledger entry");
                    // ─── Step 93: job sub-records ─────────────────────────────────────────────
                    console.log("93. Seeding job sub-records...");
                    return [4 /*yield*/, client.query("SELECT jo.id, jo.\"jobId\" FROM \"jobOperation\" jo\n         JOIN job j ON j.id = jo.\"jobId\"\n         JOIN item i ON i.id = j.\"itemId\"\n         WHERE jo.\"companyId\"=$1\n           AND i.\"readableId\" NOT IN ('TSHIRT-001','JACKET-001')\n         LIMIT 2", [companyId])];
                case 864:
                    jopRows = _314.sent();
                    return [4 /*yield*/, client.query("SELECT jmm.id, jmm.\"jobId\" FROM \"jobMakeMethod\" jmm\n         JOIN job j ON j.id = jmm.\"jobId\"\n         JOIN item i ON i.id = j.\"itemId\"\n         WHERE jmm.\"companyId\"=$1\n           AND i.\"readableId\" NOT IN ('TSHIRT-001','JACKET-001')\n         LIMIT 1", [companyId])];
                case 865:
                    jmmRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1\n         AND \"readableId\" NOT IN ('TSHIRT-001','JACKET-001','FABRIC-CTN-01','THREAD-PLY-01')\n         LIMIT 1", [companyId])];
                case 866:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobOperationStep\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 867:
                    jopStepRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM employee WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 868:
                    empRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT code FROM \"unitOfMeasure\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 869:
                    uomRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"scrapReason\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 870:
                    scRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrderLine\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 871:
                    polRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"supplierProcess\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 872:
                    sproc = _314.sent();
                    jop1 = jopRows.rows[0];
                    jop2 = jopRows.rows[1];
                    jmmId = (_257 = jmmRow.rows[0]) === null || _257 === void 0 ? void 0 : _257.id;
                    jmmJobId = (_258 = jmmRow.rows[0]) === null || _258 === void 0 ? void 0 : _258.jobId;
                    itemId = (_259 = itemRow.rows[0]) === null || _259 === void 0 ? void 0 : _259.id;
                    empId = (_260 = empRow.rows[0]) === null || _260 === void 0 ? void 0 : _260.id;
                    uomCode = (_262 = (_261 = uomRow.rows[0]) === null || _261 === void 0 ? void 0 : _261.code) !== null && _262 !== void 0 ? _262 : "EA";
                    sprocId = (_263 = sproc.rows[0]) === null || _263 === void 0 ? void 0 : _263.id;
                    if (!(jmmJobId && itemId && jmmId)) return [3 /*break*/, 875];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobMaterial\" WHERE \"jobId\"=$1 AND \"itemId\"=$2 AND \"companyId\"=$3 LIMIT 1", [jmmJobId, itemId, companyId])];
                case 873:
                    existsJM = _314.sent();
                    if (!(((_264 = existsJM.rowCount) !== null && _264 !== void 0 ? _264 : 0) === 0)) return [3 /*break*/, 875];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobMaterial\" (\"jobId\", \"itemId\", \"itemType\", \"methodType\", \"order\", description, quantity, \"unitOfMeasureCode\", \"unitCost\", \"companyId\", \"createdBy\", \"jobMakeMethodId\") VALUES ($1, $2, $3, $4::\"methodType\", $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT DO NOTHING", [
                            jmmJobId,
                            itemId,
                            "Part",
                            "Pull from Inventory",
                            1,
                            "Dev Material",
                            1,
                            uomCode,
                            5.0,
                            companyId,
                            userId,
                            jmmId
                        ])];
                case 874:
                    _314.sent();
                    _314.label = 875;
                case 875:
                    if (!(jop1 && jop2 && jop1.jobId === jop2.jobId)) return [3 /*break*/, 877];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationDependency\" (\"operationId\", \"dependsOnId\", \"jobId\", \"companyId\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [jop2.id, jop1.id, jop1.jobId, companyId])];
                case 876:
                    _314.sent();
                    return [3 /*break*/, 886];
                case 877:
                    if (!jop1) return [3 /*break*/, 886];
                    return [4 /*yield*/, client.query("SELECT id FROM \"workCenter\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 878:
                    wcRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobOperation\" WHERE \"jobId\"=$1 AND \"companyId\"=$2 AND id != $3 LIMIT 1", [jop1.jobId, companyId, jop1.id])];
                case 879:
                    existsOp2 = _314.sent();
                    op2Id = void 0;
                    if (!(((_265 = existsOp2.rowCount) !== null && _265 !== void 0 ? _265 : 0) === 0)) return [3 /*break*/, 883];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobMakeMethod\" WHERE \"jobId\"=$1 AND \"companyId\"=$2 LIMIT 1", [jop1.jobId, companyId])];
                case 880:
                    jopJmmRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM process WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 881:
                    jopProcRow = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperation\" (\"jobId\", \"jobMakeMethodId\", \"processId\", \"workCenterId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [
                            jop1.jobId,
                            (_266 = jopJmmRow.rows[0]) === null || _266 === void 0 ? void 0 : _266.id,
                            (_267 = jopProcRow.rows[0]) === null || _267 === void 0 ? void 0 : _267.id,
                            (_268 = wcRow.rows[0]) === null || _268 === void 0 ? void 0 : _268.id,
                            companyId,
                            userId
                        ])];
                case 882:
                    r = _314.sent();
                    op2Id = r.rows[0].id;
                    return [3 /*break*/, 884];
                case 883:
                    op2Id = existsOp2.rows[0].id;
                    _314.label = 884;
                case 884: return [4 /*yield*/, client.query("INSERT INTO \"jobOperationDependency\" (\"operationId\", \"dependsOnId\", \"jobId\", \"companyId\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [op2Id, jop1.id, jop1.jobId, companyId])];
                case 885:
                    _314.sent();
                    _314.label = 886;
                case 886:
                    if (!jop1) return [3 /*break*/, 890];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationNote\" (\"jobOperationId\", note, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [jop1.id, "Dev note for job operation", companyId, userId])];
                case 887:
                    _314.sent();
                    if (!empId) return [3 /*break*/, 890];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationPickup\" WHERE \"jobOperationId\"=$1 LIMIT 1", [jop1.id])];
                case 888:
                    existsJOP = _314.sent();
                    if (!(((_269 = existsJOP.rowCount) !== null && _269 !== void 0 ? _269 : 0) === 0)) return [3 /*break*/, 890];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationPickup\" (\"jobOperationId\", \"employeeId\", quantity, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5)", [jop1.id, empId, 1, companyId, userId])];
                case 889:
                    _314.sent();
                    _314.label = 890;
                case 890:
                    if (!jopStepRow.rows[0]) return [3 /*break*/, 892];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationStepRecord\" (\"jobOperationStepId\", value, \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [jopStepRow.rows[0].id, "Pass", companyId, userId])];
                case 891:
                    _314.sent();
                    _314.label = 892;
                case 892:
                    if (!(jop1 && sprocId)) return [3 /*break*/, 904];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobOperationSubcontractSnapshot\" WHERE \"jobOperationId\"=$1 AND \"companyId\"=$2 LIMIT 1", [jop1.id, companyId])];
                case 893:
                    existsJOSS = _314.sent();
                    jossId = void 0;
                    if (!(((_270 = existsJOSS.rowCount) !== null && _270 !== void 0 ? _270 : 0) === 0)) return [3 /*break*/, 895];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationSubcontractSnapshot\" (\"jobOperationId\", \"supplierProcessId\", \"operationMinimumCost\", \"operationUnitCost\", \"operationLeadTime\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [jop1.id, sprocId, 50, 10, 5, companyId, userId])];
                case 894:
                    r = _314.sent();
                    jossId = r.rows[0].id;
                    return [3 /*break*/, 896];
                case 895:
                    jossId = existsJOSS.rows[0].id;
                    _314.label = 896;
                case 896:
                    if (!polRow.rows[0]) return [3 /*break*/, 898];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationSupplierPickup\" (\"jobOperationId\", \"supplierProcessId\", quantity, \"purchaseOrderLineId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [jop1.id, sprocId, 1, polRow.rows[0].id, companyId, userId])];
                case 897:
                    _314.sent();
                    _314.label = 898;
                case 898:
                    josqrId = void 0;
                    if (!(jossId && polRow.rows[0])) return [3 /*break*/, 902];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobOperationSupplierQuantityReport\" WHERE \"jobOperationId\"=$1 AND \"companyId\"=$2 LIMIT 1", [jop1.id, companyId])];
                case 899:
                    existsJOSQR = _314.sent();
                    if (!(((_271 = existsJOSQR.rowCount) !== null && _271 !== void 0 ? _271 : 0) === 0)) return [3 /*break*/, 901];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationSupplierQuantityReport\" (\"jobId\", \"jobOperationId\", \"supplierProcessId\", \"subcontractSnapshotId\", \"originalQuantity\", \"purchaseOrderLineId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [
                            jop1.jobId,
                            jop1.id,
                            sprocId,
                            jossId,
                            10,
                            polRow.rows[0].id,
                            companyId,
                            userId
                        ])];
                case 900:
                    r = _314.sent();
                    josqrId = r.rows[0].id;
                    return [3 /*break*/, 902];
                case 901:
                    josqrId = existsJOSQR.rows[0].id;
                    _314.label = 902;
                case 902:
                    if (!josqrId) return [3 /*break*/, 904];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationSupplierQuantity\" (\"jobOperationId\", \"reportId\", \"supplierProcessId\", type, quantity, \"scrapReasonId\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4::\"productionQuantityType\", $5, $6, $7, $8) ON CONFLICT DO NOTHING", [
                            jop1.id,
                            josqrId,
                            sprocId,
                            "Production",
                            10,
                            (_272 = scRow.rows[0]) === null || _272 === void 0 ? void 0 : _272.id,
                            companyId,
                            userId
                        ])];
                case 903:
                    _314.sent();
                    _314.label = 904;
                case 904:
                    console.log("   Created job sub-records");
                    // ─── Step 94: jobFavorite ─────────────────────────────────────────────────
                    console.log("94. Seeding job favorite...");
                    return [4 /*yield*/, client.query("SELECT id FROM job WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 905:
                    jobRow = _314.sent();
                    if (!jobRow.rows[0]) return [3 /*break*/, 907];
                    return [4 /*yield*/, client.query("INSERT INTO \"jobFavorite\" (\"jobId\", \"userId\") VALUES ($1, $2) ON CONFLICT DO NOTHING", [jobRow.rows[0].id, userId])];
                case 906:
                    _314.sent();
                    _314.label = 907;
                case 907:
                    console.log("   Created job favorite");
                    // ─── Step 95: approvalRequest ─────────────────────────────────────────────
                    console.log("95. Seeding approval request...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"approvalRule\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 908:
                    _arRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM \"purchaseOrder\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 909:
                    poRow = _314.sent();
                    if (!poRow.rows[0]) return [3 /*break*/, 912];
                    return [4 /*yield*/, client.query("SELECT id FROM \"approvalRequest\" WHERE \"documentId\"=$1 AND \"companyId\"=$2 LIMIT 1", [poRow.rows[0].id, companyId])];
                case 910:
                    existsAR = _314.sent();
                    if (!(((_273 = existsAR.rowCount) !== null && _273 !== void 0 ? _273 : 0) === 0)) return [3 /*break*/, 912];
                    return [4 /*yield*/, client.query("INSERT INTO \"approvalRequest\" (\"documentType\", \"documentId\", status, \"requestedBy\", \"companyId\", \"createdBy\") VALUES ($1::\"approvalDocumentType\", $2, $3::\"approvalStatus\", $4, $5, $6) ON CONFLICT DO NOTHING", [
                            "purchaseOrder",
                            poRow.rows[0].id,
                            "Pending",
                            userId,
                            companyId,
                            userId
                        ])];
                case 911:
                    _314.sent();
                    _314.label = 912;
                case 912:
                    console.log("   Created approval request");
                    // ─── Step 96: workCenterReplacementPart ───────────────────────────────────
                    console.log("96. Seeding work center replacement part...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"workCenter\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 913:
                    wcRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 914:
                    itemRow = _314.sent();
                    return [4 /*yield*/, client.query("SELECT code FROM \"unitOfMeasure\" WHERE \"companyId\"=$1 LIMIT 1", [companyId])];
                case 915:
                    uomRow = _314.sent();
                    if (!(wcRow.rows[0] && itemRow.rows[0])) return [3 /*break*/, 917];
                    return [4 /*yield*/, client.query("INSERT INTO \"workCenterReplacementPart\" (\"workCenterId\", \"itemId\", quantity, \"unitOfMeasureCode\", \"companyId\", \"createdBy\") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING", [
                            wcRow.rows[0].id,
                            itemRow.rows[0].id,
                            2,
                            (_275 = (_274 = uomRow.rows[0]) === null || _274 === void 0 ? void 0 : _274.code) !== null && _275 !== void 0 ? _275 : "EA",
                            companyId,
                            userId
                        ])];
                case 916:
                    _314.sent();
                    _314.label = 917;
                case 917:
                    console.log("   Created work center replacement part");
                    // ─── Step 97: feedback, config ────────────────────────────────────────────
                    console.log("97. Seeding feedback and config...");
                    return [4 /*yield*/, client.query("INSERT INTO feedback (location, \"userId\", feedback) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", ["/dashboard", userId, "Great app!"])];
                case 918:
                    _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM config LIMIT 1")];
                case 919:
                    existsConfig = _314.sent();
                    if (!(((_276 = existsConfig.rowCount) !== null && _276 !== void 0 ? _276 : 0) === 0)) return [3 /*break*/, 921];
                    return [4 /*yield*/, client.query("INSERT INTO config (id, \"apiUrl\", \"anonKey\") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [true, "https://dev.example.com", "dev-anon-key"])];
                case 920:
                    _314.sent();
                    _314.label = 921;
                case 921:
                    console.log("   Created feedback and config");
                    // ─── Step 98: demandForecast + demandProjection (Planning / Projections pages)
                    console.log("98. Seeding demand forecast and projections...");
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 AND \"replenishmentSystem\"='Make' AND active=true", [companyId])];
                case 922:
                    makeItemRows = _314.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"companyId\"=$1 AND \"replenishmentSystem\"='Buy' AND \"itemTrackingType\"!='Non-Inventory' AND active=true", [companyId])];
                case 923:
                    buyItemRows = _314.sent();
                    makeItemIdsSeed = makeItemRows.rows.map(function (r) { return r.id; });
                    allItemIdsSeed = __spreadArray(__spreadArray([], makeItemIdsSeed, true), buyItemRows.rows.map(function (r) { return r.id; }), true);
                    return [4 /*yield*/, client.query("SELECT DISTINCT ON (\"startDate\"::date) id FROM period\n         WHERE \"periodType\"='Week' AND \"startDate\" >= NOW() - interval '1 week'\n         ORDER BY \"startDate\"::date, id LIMIT 12")];
                case 924:
                    periodRows2 = _314.sent();
                    periodIdsSeed = periodRows2.rows.map(function (r) { return r.id; });
                    dfInserted = 0;
                    dpInserted = 0;
                    _23 = 0, allItemIdsSeed_1 = allItemIdsSeed;
                    _314.label = 925;
                case 925:
                    if (!(_23 < allItemIdsSeed_1.length)) return [3 /*break*/, 934];
                    itemId = allItemIdsSeed_1[_23];
                    isMakeItem = makeItemIdsSeed.includes(itemId);
                    _24 = 0, periodIdsSeed_1 = periodIdsSeed;
                    _314.label = 926;
                case 926:
                    if (!(_24 < periodIdsSeed_1.length)) return [3 /*break*/, 933];
                    periodId = periodIdsSeed_1[_24];
                    qty = Math.floor(Math.random() * 20) + 5;
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"demandForecast\" WHERE \"itemId\"=$1 AND \"locationId\"=$2 AND \"periodId\"=$3 LIMIT 1", [itemId, locationId, periodId])];
                case 927:
                    dfCheck = _314.sent();
                    if (!(((_277 = dfCheck.rowCount) !== null && _277 !== void 0 ? _277 : 0) === 0)) return [3 /*break*/, 929];
                    return [4 /*yield*/, client.query("INSERT INTO \"demandForecast\" (\"itemId\",\"locationId\",\"periodId\",\"forecastQuantity\",\"forecastMethod\",\"companyId\",\"createdBy\",\"updatedBy\")\n               VALUES ($1,$2,$3,$4,'Manual',$5,$6,$6)", [itemId, locationId, periodId, qty, companyId, userId])];
                case 928:
                    _314.sent();
                    dfInserted++;
                    _314.label = 929;
                case 929:
                    if (!isMakeItem) return [3 /*break*/, 932];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"demandProjection\" WHERE \"itemId\"=$1 AND \"locationId\"=$2 AND \"periodId\"=$3 LIMIT 1", [itemId, locationId, periodId])];
                case 930:
                    dpCheck = _314.sent();
                    if (!(((_278 = dpCheck.rowCount) !== null && _278 !== void 0 ? _278 : 0) === 0)) return [3 /*break*/, 932];
                    return [4 /*yield*/, client.query("INSERT INTO \"demandProjection\" (\"itemId\",\"locationId\",\"periodId\",\"forecastQuantity\",\"forecastMethod\",\"companyId\",\"createdBy\",\"updatedBy\")\n                 VALUES ($1,$2,$3,$4,'Manual',$5,$6,$6)", [itemId, locationId, periodId, qty, companyId, userId])];
                case 931:
                    _314.sent();
                    dpInserted++;
                    _314.label = 932;
                case 932:
                    _24++;
                    return [3 /*break*/, 926];
                case 933:
                    _23++;
                    return [3 /*break*/, 925];
                case 934:
                    if (dfInserted > 0)
                        console.log("   Created ".concat(dfInserted, " demandForecast rows"));
                    if (dpInserted > 0)
                        console.log("   Created ".concat(dpInserted, " demandProjection rows"));
                    // ─── Step 99: approvalRequest for productionQuantityReport (Quantity Review page)
                    console.log("99. Seeding production quantity report approval requests...");
                    return [4 /*yield*/, client.query("SELECT id FROM \"productionQuantityReport\" WHERE \"companyId\"=$1", [companyId])];
                case 935:
                    pqrRows = _314.sent();
                    _25 = 0, _26 = pqrRows.rows;
                    _314.label = 936;
                case 936:
                    if (!(_25 < _26.length)) return [3 /*break*/, 940];
                    pqr = _26[_25];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"approvalRequest\" WHERE \"documentId\"=$1 AND \"documentType\"='productionQuantityReport' LIMIT 1", [pqr.id])];
                case 937:
                    existing = _314.sent();
                    if (!(((_279 = existing.rowCount) !== null && _279 !== void 0 ? _279 : 0) === 0)) return [3 /*break*/, 939];
                    return [4 /*yield*/, client.query("INSERT INTO \"approvalRequest\" (\"documentType\",\"documentId\",status,\"requestedBy\",\"requestedAt\",\"companyId\",\"createdBy\")\n             VALUES ('productionQuantityReport',$1,'Pending',$2,NOW(),$3,$2)", [pqr.id, userId, companyId])];
                case 938:
                    _314.sent();
                    console.log("   Created approvalRequest for productionQuantityReport");
                    _314.label = 939;
                case 939:
                    _25++;
                    return [3 /*break*/, 936];
                case 940:
                    // ─── Step 100: Additional MES jobs and production floor data ────────────
                    console.log("100. Seeding additional MES jobs and production floor data...");
                    mesItemDefs = L.mesItems;
                    mesItemIds = {};
                    _27 = 0, mesItemDefs_1 = mesItemDefs;
                    _314.label = 941;
                case 941:
                    if (!(_27 < mesItemDefs_1.length)) return [3 /*break*/, 948];
                    itm = mesItemDefs_1[_27];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = $1 AND \"companyId\" = $2 LIMIT 1", [itm.readableId, companyId])];
                case 942:
                    ex = _314.sent();
                    if (!(ex.rows.length > 0)) return [3 /*break*/, 943];
                    mesItemIds[itm.readableId] = ex.rows[0].id;
                    return [3 /*break*/, 945];
                case 943: return [4 /*yield*/, client.query("INSERT INTO item (\"readableId\", name, description, type, \"replenishmentSystem\", \"itemTrackingType\", \"unitOfMeasureCode\", active, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, 'Part'::\"itemType\", 'Make'::\"itemReplenishmentSystem\", 'Inventory'::\"itemTrackingType\", 'EA', true, $4, $5)\n             RETURNING id", [itm.readableId, itm.name, itm.description, companyId, userId])];
                case 944:
                    r = _314.sent();
                    mesItemIds[itm.readableId] = r.rows[0].id;
                    _314.label = 945;
                case 945: 
                // Each MES item is type 'Part' — ensure a part record exists
                return [4 /*yield*/, client.query("INSERT INTO part (id, \"companyId\", \"createdBy\")\n           VALUES ($1, $2, $3)\n           ON CONFLICT (id, \"companyId\") DO NOTHING", [itm.readableId, companyId, userId])];
                case 946:
                    // Each MES item is type 'Part' — ensure a part record exists
                    _314.sent();
                    _314.label = 947;
                case 947:
                    _27++;
                    return [3 /*break*/, 941];
                case 948:
                    inspWCId = null;
                    return [4 /*yield*/, client.query("SELECT id FROM \"workCenter\" WHERE name = 'Inspection Station 1' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 949:
                    ex = _314.sent();
                    if (!(ex.rows.length > 0)) return [3 /*break*/, 950];
                    inspWCId = ex.rows[0].id;
                    return [3 /*break*/, 953];
                case 950: return [4 /*yield*/, client.query("INSERT INTO \"workCenter\" (name, description, \"laborRate\", \"machineRate\", \"locationId\", \"companyId\", \"createdBy\")\n             VALUES ('Inspection Station 1', 'Dimensional and quality inspection station', 35, 0, $1, $2, $3) RETURNING id", [locationId, companyId, userId])];
                case 951:
                    r = _314.sent();
                    inspWCId = r.rows[0].id;
                    qiProcId = processIds["Quality Inspection"];
                    if (!qiProcId) return [3 /*break*/, 953];
                    return [4 /*yield*/, client.query("INSERT INTO \"workCenterProcess\" (\"workCenterId\", \"processId\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING", [inspWCId, qiProcId, companyId, userId])];
                case 952:
                    _314.sent();
                    _314.label = 953;
                case 953:
                    cncWC = (_280 = workCenterIds["CNC Mill #1"]) !== null && _280 !== void 0 ? _280 : null;
                    asmWC = (_281 = workCenterIds["Assembly Station 1"]) !== null && _281 !== void 0 ? _281 : null;
                    wldWC = (_282 = workCenterIds["Welding Cell A"]) !== null && _282 !== void 0 ? _282 : null;
                    cncProc = (_283 = processIds["CNC Machining"]) !== null && _283 !== void 0 ? _283 : null;
                    asmProc = (_284 = processIds["Assembly"]) !== null && _284 !== void 0 ? _284 : null;
                    wldProc = (_285 = processIds["Welding"]) !== null && _285 !== void 0 ? _285 : null;
                    qiProc = (_286 = processIds["Quality Inspection"]) !== null && _286 !== void 0 ? _286 : null;
                    getOrCreateJob = function (itemId, status, qty) { return __awaiter(_this, void 0, void 0, function () {
                        var exJob, jobId, jrid, r, mmRow;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!itemId)
                                        return [2 /*return*/, null];
                                    return [4 /*yield*/, client.query("SELECT id FROM job WHERE \"itemId\" = $1 AND \"companyId\" = $2 LIMIT 1", [itemId, companyId])];
                                case 1:
                                    exJob = _c.sent();
                                    if (!(exJob.rows.length > 0)) return [3 /*break*/, 2];
                                    jobId = exJob.rows[0].id;
                                    return [3 /*break*/, 5];
                                case 2: return [4 /*yield*/, nextSeq("job")];
                                case 3:
                                    jrid = _c.sent();
                                    return [4 /*yield*/, client.query("INSERT INTO job (\"jobId\", \"itemId\", \"unitOfMeasureCode\", \"locationId\", status, quantity, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, 'EA', $3, $4::\"jobStatus\", $5, $6, $7) RETURNING id", [jrid, itemId, locationId, status, qty, companyId, userId])];
                                case 4:
                                    r = _c.sent();
                                    jobId = r.rows[0].id;
                                    _c.label = 5;
                                case 5: return [4 /*yield*/, client.query("SELECT id FROM \"jobMakeMethod\" WHERE \"jobId\" = $1 AND \"parentMaterialId\" IS NULL LIMIT 1", [jobId])];
                                case 6:
                                    mmRow = _c.sent();
                                    return [2 /*return*/, { jobId: jobId, mmId: (_b = (_a = mmRow.rows[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null }];
                            }
                        });
                    }); };
                    addOp = function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var exOp, opId, r, exStep, exPE, peId, r, r, exPQR, pqrId, r, exPQ;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, client.query("SELECT id FROM \"jobOperation\" WHERE \"jobId\" = $1 AND description = $2 AND \"companyId\" = $3 LIMIT 1", [params.jobId, params.description, companyId])];
                                case 1:
                                    exOp = _c.sent();
                                    if (!(exOp.rows.length > 0)) return [3 /*break*/, 2];
                                    opId = exOp.rows[0].id;
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, client.query("INSERT INTO \"jobOperation\" (\"jobId\", \"jobMakeMethodId\", \"order\", \"processId\", \"workCenterId\", description, \"laborTime\", \"laborUnit\", status, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, $4, $5, $6, $7, 'Minutes/Piece'::factor, $8::\"jobOperationStatus\", $9, $10) RETURNING id", [
                                        params.jobId,
                                        params.mmId,
                                        params.order,
                                        params.procId,
                                        params.wcId,
                                        params.description,
                                        params.laborTime,
                                        params.opStatus,
                                        companyId,
                                        userId
                                    ])];
                                case 3:
                                    r = _c.sent();
                                    opId = r.rows[0].id;
                                    _c.label = 4;
                                case 4: return [4 /*yield*/, client.query("SELECT 1 FROM \"jobOperationStep\" WHERE \"operationId\" = $1 LIMIT 1", [opId])];
                                case 5:
                                    exStep = _c.sent();
                                    if (!(((_a = exStep.rowCount) !== null && _a !== void 0 ? _a : 0) === 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, client.query("INSERT INTO \"jobOperationStep\" (name, \"operationId\", type, required, \"sortOrder\", \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3::\"procedureStepType\", true, 1, $4, $5)", [params.stepName, opId, params.stepType, companyId, userId])];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7:
                                    if (!params.prod)
                                        return [2 /*return*/, opId];
                                    return [4 /*yield*/, client.query("SELECT id FROM \"productionEvent\" WHERE \"jobOperationId\" = $1 LIMIT 1", [opId])];
                                case 8:
                                    exPE = _c.sent();
                                    if (!(exPE.rows.length > 0)) return [3 /*break*/, 9];
                                    peId = exPE.rows[0].id;
                                    return [3 /*break*/, 13];
                                case 9:
                                    if (!(params.prod.endHoursAgo !== undefined)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, client.query("INSERT INTO \"productionEvent\" (\"jobOperationId\", type, \"startTime\", \"endTime\", \"employeeId\", \"workCenterId\", \"companyId\", \"createdBy\")\n             VALUES ($1, 'Labor'::\"productionEventType\",\n               NOW() - ($2 * interval '1 hour'),\n               NOW() - ($3 * interval '1 hour'),\n               $4, $5, $6, $7) RETURNING id", [
                                            opId,
                                            params.prod.startHoursAgo,
                                            params.prod.endHoursAgo,
                                            employeeId,
                                            params.wcId,
                                            companyId,
                                            userId
                                        ])];
                                case 10:
                                    r = _c.sent();
                                    peId = r.rows[0].id;
                                    return [3 /*break*/, 13];
                                case 11: return [4 /*yield*/, client.query("INSERT INTO \"productionEvent\" (\"jobOperationId\", type, \"startTime\", \"employeeId\", \"workCenterId\", \"companyId\", \"createdBy\")\n             VALUES ($1, 'Labor'::\"productionEventType\",\n               NOW() - ($2 * interval '1 hour'),\n               $3, $4, $5, $6) RETURNING id", [
                                        opId,
                                        params.prod.startHoursAgo,
                                        employeeId,
                                        params.wcId,
                                        companyId,
                                        userId
                                    ])];
                                case 12:
                                    r = _c.sent();
                                    peId = r.rows[0].id;
                                    _c.label = 13;
                                case 13:
                                    if (!(params.prod.qty !== undefined &&
                                        params.prod.endHoursAgo !== undefined)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, client.query("SELECT id FROM \"productionQuantityReport\" WHERE \"jobOperationId\" = $1 LIMIT 1", [opId])];
                                case 14:
                                    exPQR = _c.sent();
                                    pqrId = void 0;
                                    if (!(exPQR.rows.length > 0)) return [3 /*break*/, 15];
                                    pqrId = exPQR.rows[0].id;
                                    return [3 /*break*/, 17];
                                case 15: return [4 /*yield*/, client.query("INSERT INTO \"productionQuantityReport\" (\"jobId\", \"jobOperationId\", \"employeeId\", \"originalQuantity\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [params.jobId, opId, employeeId, params.prod.qty, companyId, userId])];
                                case 16:
                                    r = _c.sent();
                                    pqrId = r.rows[0].id;
                                    _c.label = 17;
                                case 17: return [4 /*yield*/, client.query("SELECT 1 FROM \"productionQuantity\" WHERE \"jobOperationId\" = $1 LIMIT 1", [opId])];
                                case 18:
                                    exPQ = _c.sent();
                                    if (!(((_b = exPQ.rowCount) !== null && _b !== void 0 ? _b : 0) === 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, client.query("INSERT INTO \"productionQuantity\" (\"reportId\", \"jobOperationId\", type, quantity, \"laborProductionEventId\", \"employeeId\", \"companyId\", \"createdBy\")\n               VALUES ($1, $2, 'Production'::\"productionQuantityType\", $3, $4, $5, $6, $7)", [pqrId, opId, params.prod.qty, peId, employeeId, companyId, userId])];
                                case 19:
                                    _c.sent();
                                    _c.label = 20;
                                case 20: return [2 /*return*/, opId];
                            }
                        });
                    }); };
                    return [4 /*yield*/, getOrCreateJob((_287 = itemIds["SHAFT-ASM-001"]) !== null && _287 !== void 0 ? _287 : null, "In Progress", 10)];
                case 954:
                    jobA = _314.sent();
                    if (!jobA) return [3 /*break*/, 958];
                    return [4 /*yield*/, addOp({
                            jobId: jobA.jobId,
                            mmId: jobA.mmId,
                            order: 1,
                            procId: cncProc,
                            wcId: cncWC,
                            description: "Turning",
                            laborTime: 20,
                            opStatus: "Done",
                            stepName: "Check diameter to spec",
                            stepType: "Measurement",
                            prod: { startHoursAgo: 4, endHoursAgo: 2, qty: 10 }
                        })];
                case 955:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobA.jobId,
                            mmId: jobA.mmId,
                            order: 2,
                            procId: asmProc,
                            wcId: asmWC,
                            description: "Assembly",
                            laborTime: 45,
                            opStatus: "In Progress",
                            stepName: "Torque bearing retainer bolts",
                            stepType: "Checkbox",
                            prod: { startHoursAgo: 1 }
                        })];
                case 956:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobA.jobId,
                            mmId: jobA.mmId,
                            order: 3,
                            procId: qiProc,
                            wcId: inspWCId,
                            description: "Inspection",
                            laborTime: 15,
                            opStatus: "Todo",
                            stepName: "Pass/fail dimensional check",
                            stepType: "Checkbox"
                        })];
                case 957:
                    _314.sent();
                    _314.label = 958;
                case 958: return [4 /*yield*/, getOrCreateJob((_288 = mesItemIds["VALVE-BODY-001"]) !== null && _288 !== void 0 ? _288 : null, "Completed", 50)];
                case 959:
                    jobB = _314.sent();
                    if (!jobB) return [3 /*break*/, 962];
                    return [4 /*yield*/, addOp({
                            jobId: jobB.jobId,
                            mmId: jobB.mmId,
                            order: 1,
                            procId: cncProc,
                            wcId: cncWC,
                            description: "Machining",
                            laborTime: 35,
                            opStatus: "Done",
                            stepName: "Verify port dimensions",
                            stepType: "Measurement",
                            prod: { startHoursAgo: 72, endHoursAgo: 70, qty: 50 }
                        })];
                case 960:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobB.jobId,
                            mmId: jobB.mmId,
                            order: 2,
                            procId: qiProc,
                            wcId: inspWCId,
                            description: "Pressure Test",
                            laborTime: 20,
                            opStatus: "Done",
                            stepName: "Record test pressure reading",
                            stepType: "Value",
                            prod: { startHoursAgo: 70, endHoursAgo: 69, qty: 50 }
                        })];
                case 961:
                    _314.sent();
                    _314.label = 962;
                case 962: return [4 /*yield*/, getOrCreateJob((_289 = mesItemIds["GEAR-A-001"]) !== null && _289 !== void 0 ? _289 : null, "Paused", 15)];
                case 963:
                    jobC = _314.sent();
                    if (!jobC) return [3 /*break*/, 966];
                    return [4 /*yield*/, addOp({
                            jobId: jobC.jobId,
                            mmId: jobC.mmId,
                            order: 1,
                            procId: cncProc,
                            wcId: cncWC,
                            description: "Gear Cutting",
                            laborTime: 60,
                            opStatus: "Paused",
                            stepName: "Verify gear tooth profile",
                            stepType: "Measurement"
                        })];
                case 964:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobC.jobId,
                            mmId: jobC.mmId,
                            order: 2,
                            procId: qiProc,
                            wcId: inspWCId,
                            description: "Inspection",
                            laborTime: 20,
                            opStatus: "Todo",
                            stepName: "Measure runout within tolerance",
                            stepType: "Measurement"
                        })];
                case 965:
                    _314.sent();
                    _314.label = 966;
                case 966: return [4 /*yield*/, getOrCreateJob((_290 = mesItemIds["FRAME-001"]) !== null && _290 !== void 0 ? _290 : null, "In Progress", 8)];
                case 967:
                    jobD = _314.sent();
                    if (!jobD) return [3 /*break*/, 971];
                    return [4 /*yield*/, addOp({
                            jobId: jobD.jobId,
                            mmId: jobD.mmId,
                            order: 1,
                            procId: cncProc,
                            wcId: cncWC,
                            description: "Cutting",
                            laborTime: 30,
                            opStatus: "Done",
                            stepName: "Check cut lengths to drawing",
                            stepType: "Measurement",
                            prod: { startHoursAgo: 24, endHoursAgo: 22, qty: 8 }
                        })];
                case 968:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobD.jobId,
                            mmId: jobD.mmId,
                            order: 2,
                            procId: wldProc,
                            wcId: wldWC,
                            description: "Welding",
                            laborTime: 90,
                            opStatus: "In Progress",
                            stepName: "Inspect weld bead quality",
                            stepType: "Checkbox",
                            prod: { startHoursAgo: 2 }
                        })];
                case 969:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobD.jobId,
                            mmId: jobD.mmId,
                            order: 3,
                            procId: asmProc,
                            wcId: asmWC,
                            description: "Grinding",
                            laborTime: 30,
                            opStatus: "Todo",
                            stepName: "Surface finish within spec",
                            stepType: "Checkbox"
                        })];
                case 970:
                    _314.sent();
                    _314.label = 971;
                case 971: return [4 /*yield*/, getOrCreateJob((_291 = mesItemIds["HOUSING-001"]) !== null && _291 !== void 0 ? _291 : null, "Completed", 20)];
                case 972:
                    jobE = _314.sent();
                    if (!jobE) return [3 /*break*/, 977];
                    return [4 /*yield*/, addOp({
                            jobId: jobE.jobId,
                            mmId: jobE.mmId,
                            order: 1,
                            procId: cncProc,
                            wcId: cncWC,
                            description: "Boring",
                            laborTime: 25,
                            opStatus: "Done",
                            stepName: "Verify bore diameter",
                            stepType: "Measurement",
                            prod: { startHoursAgo: 120, endHoursAgo: 118, qty: 20 }
                        })];
                case 973:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobE.jobId,
                            mmId: jobE.mmId,
                            order: 2,
                            procId: wldProc,
                            wcId: wldWC,
                            description: "Welding",
                            laborTime: 40,
                            opStatus: "Done",
                            stepName: "Inspect weld integrity",
                            stepType: "Checkbox",
                            prod: { startHoursAgo: 118, endHoursAgo: 116, qty: 20 }
                        })];
                case 974:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobE.jobId,
                            mmId: jobE.mmId,
                            order: 3,
                            procId: asmProc,
                            wcId: asmWC,
                            description: "Press Fit",
                            laborTime: 15,
                            opStatus: "Done",
                            stepName: "Check bearing seating force",
                            stepType: "Value",
                            prod: { startHoursAgo: 116, endHoursAgo: 115, qty: 20 }
                        })];
                case 975:
                    _314.sent();
                    return [4 /*yield*/, addOp({
                            jobId: jobE.jobId,
                            mmId: jobE.mmId,
                            order: 4,
                            procId: qiProc,
                            wcId: inspWCId,
                            description: "QC",
                            laborTime: 10,
                            opStatus: "Done",
                            stepName: "Sign off final inspection",
                            stepType: "Checkbox",
                            prod: { startHoursAgo: 115, endHoursAgo: 114, qty: 20 }
                        })];
                case 976:
                    _314.sent();
                    _314.label = 977;
                case 977:
                    console.log("   Created additional MES jobs and production floor data");
                    // ─── Step 101: Remaining MES tables ──────────────────────────────────────
                    console.log("101. Seeding remaining MES tables...");
                    _28 = 0, _29 = ["Scrap", "Rework", "Use As-Is", "Return to Supplier"];
                    _314.label = 978;
                case 978:
                    if (!(_28 < _29.length)) return [3 /*break*/, 982];
                    name_1 = _29[_28];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"nonConformanceRequiredAction\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [name_1, companyId])];
                case 979:
                    ex = _314.sent();
                    if (!(((_292 = ex.rowCount) !== null && _292 !== void 0 ? _292 : 0) === 0)) return [3 /*break*/, 981];
                    return [4 /*yield*/, client.query("INSERT INTO \"nonConformanceRequiredAction\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [name_1, companyId, userId])];
                case 980:
                    _314.sent();
                    _314.label = 981;
                case 981:
                    _28++;
                    return [3 /*break*/, 978];
                case 982:
                    _30 = 0, _31 = ["Defective", "Damaged", "Quality"];
                    _314.label = 983;
                case 983:
                    if (!(_30 < _31.length)) return [3 /*break*/, 986];
                    name_2 = _31[_30];
                    return [4 /*yield*/, client.query("INSERT INTO \"scrapReason\" (\"companyId\", name, \"createdBy\")\n           VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT \"scrapReason_name_unique\" DO NOTHING", [companyId, name_2, userId])];
                case 984:
                    _314.sent();
                    _314.label = 985;
                case 985:
                    _30++;
                    return [3 /*break*/, 983];
                case 986:
                    _32 = 0, _33 = [
                        "Worn Components",
                        "Electrical Fault",
                        "Operator Error"
                    ];
                    _314.label = 987;
                case 987:
                    if (!(_32 < _33.length)) return [3 /*break*/, 991];
                    name_3 = _33[_32];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"maintenanceFailureMode\" WHERE name = $1 AND \"companyId\" = $2 LIMIT 1", [name_3, companyId])];
                case 988:
                    ex = _314.sent();
                    if (!(((_293 = ex.rowCount) !== null && _293 !== void 0 ? _293 : 0) === 0)) return [3 /*break*/, 990];
                    return [4 /*yield*/, client.query("INSERT INTO \"maintenanceFailureMode\" (name, \"companyId\", \"createdBy\") VALUES ($1, $2, $3)", [name_3, companyId, userId])];
                case 989:
                    _314.sent();
                    _314.label = 990;
                case 990:
                    _32++;
                    return [3 /*break*/, 987];
                case 991:
                    kanbanItems = ["STEEL-ROD-01", "BEARING-6205", "FASTENER-KIT-01"];
                    _34 = 0, kanbanItems_1 = kanbanItems;
                    _314.label = 992;
                case 992:
                    if (!(_34 < kanbanItems_1.length)) return [3 /*break*/, 998];
                    readableId = kanbanItems_1[_34];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = $1 AND \"companyId\" = $2 LIMIT 1", [readableId, companyId])];
                case 993:
                    itmRow = _314.sent();
                    if (!itmRow.rows[0])
                        return [3 /*break*/, 997];
                    itmId = itmRow.rows[0].id;
                    return [4 /*yield*/, client.query("SELECT id FROM supplier WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 994:
                    supplierRow = _314.sent();
                    supplierId = (_295 = (_294 = supplierRow.rows[0]) === null || _294 === void 0 ? void 0 : _294.id) !== null && _295 !== void 0 ? _295 : null;
                    return [4 /*yield*/, client.query("SELECT 1 FROM kanban WHERE \"itemId\" = $1 AND \"companyId\" = $2 LIMIT 1", [itmId, companyId])];
                case 995:
                    exKb = _314.sent();
                    if (!(((_296 = exKb.rowCount) !== null && _296 !== void 0 ? _296 : 0) === 0)) return [3 /*break*/, 997];
                    return [4 /*yield*/, client.query("INSERT INTO kanban (\"itemId\", \"replenishmentSystem\", quantity, \"locationId\", \"supplierId\", \"companyId\", \"createdBy\")\n             VALUES ($1, 'Buy'::\"itemReplenishmentSystem\", 50, $2, $3, $4, $5)", [itmId, locationId, supplierId, companyId, userId])];
                case 996:
                    _314.sent();
                    _314.label = 997;
                case 997:
                    _34++;
                    return [3 /*break*/, 992];
                case 998: return [4 /*yield*/, client.query("SELECT j.id, jop.\"jobMakeMethodId\"\n         FROM job j\n         JOIN \"jobOperation\" jop ON jop.\"jobId\" = j.id\n         JOIN item i ON j.\"itemId\" = i.id\n         WHERE i.\"readableId\" = 'SHAFT-ASM-001' AND j.\"companyId\" = $1 LIMIT 1", [companyId])];
                case 999:
                    shaftJobRow = _314.sent();
                    shaftJob = shaftJobRow.rows[0];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = 'STEEL-ROD-01' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1000:
                    steelRodRow = _314.sent();
                    steelRodId = (_297 = steelRodRow.rows[0]) === null || _297 === void 0 ? void 0 : _297.id;
                    shaftJobMaterialId = null;
                    if (!(shaftJob && steelRodId)) return [3 /*break*/, 1004];
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobMaterial\" WHERE \"jobId\" = $1 AND \"itemId\" = $2 AND \"companyId\" = $3 LIMIT 1", [shaftJob.id, steelRodId, companyId])];
                case 1001:
                    exJM = _314.sent();
                    if (!(exJM.rows.length > 0)) return [3 /*break*/, 1002];
                    shaftJobMaterialId = exJM.rows[0].id;
                    return [3 /*break*/, 1004];
                case 1002: return [4 /*yield*/, client.query("INSERT INTO \"jobMaterial\" (\"jobId\", \"itemId\", \"itemType\", \"methodType\", \"order\", description, quantity, \"unitOfMeasureCode\", \"unitCost\", \"companyId\", \"createdBy\", \"jobMakeMethodId\")\n             VALUES ($1, $2, 'Material', 'Pull from Inventory'::\"methodType\", 1, '1020 Steel Rod stock', 2, 'EA', 4.50, $3, $4, $5)\n             RETURNING id", [
                        shaftJob.id,
                        steelRodId,
                        companyId,
                        userId,
                        (_298 = shaftJob.jobMakeMethodId) !== null && _298 !== void 0 ? _298 : null
                    ])];
                case 1003:
                    r = _314.sent();
                    shaftJobMaterialId = r.rows[0].id;
                    _314.label = 1004;
                case 1004:
                    if (!(shaftJob && shaftJobMaterialId)) return [3 /*break*/, 1010];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"pickingList\" WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1005:
                    exPL = _314.sent();
                    if (!(((_299 = exPL.rowCount) !== null && _299 !== void 0 ? _299 : 0) === 0)) return [3 /*break*/, 1010];
                    return [4 /*yield*/, nextSeq("pickingList")];
                case 1006:
                    plReadableId = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"pickingList\" (\"pickingListId\", status, \"locationId\", \"assignee\", \"companyId\", \"createdBy\")\n             VALUES ($1, 'Draft'::\"pickingListStatus\", $2, $3, $4, $5) RETURNING id", [plReadableId, locationId, userId, companyId, userId])];
                case 1007:
                    plRow = _314.sent();
                    plId = plRow.rows[0].id;
                    return [4 /*yield*/, client.query("SELECT id FROM \"jobOperation\" WHERE \"jobId\" = $1 AND \"companyId\" = $2 ORDER BY \"order\" LIMIT 1", [shaftJob.id, companyId])];
                case 1008:
                    shaftOpRow = _314.sent();
                    return [4 /*yield*/, client.query("INSERT INTO \"pickingListLine\" (\"pickingListId\", \"jobId\", \"jobMaterialId\", \"jobOperationId\", \"itemId\", \"quantityToPick\", status, \"companyId\", \"createdBy\")\n             VALUES ($1, $2, $3, $4, $5, 2, 'Pending'::\"pickingListLineStatus\", $6, $7)", [
                            plId,
                            shaftJob.id,
                            shaftJobMaterialId,
                            (_301 = (_300 = shaftOpRow.rows[0]) === null || _300 === void 0 ? void 0 : _300.id) !== null && _301 !== void 0 ? _301 : null,
                            steelRodId,
                            companyId,
                            userId
                        ])];
                case 1009:
                    _314.sent();
                    _314.label = 1010;
                case 1010: return [4 /*yield*/, client.query("SELECT j.id FROM job j\n         JOIN item i ON j.\"itemId\" = i.id\n         WHERE i.\"readableId\" = 'HOUSING-001' AND j.\"companyId\" = $1 LIMIT 1", [companyId])];
                case 1011:
                    housingJobRow = _314.sent();
                    if (!housingJobRow.rows[0]) return [3 /*break*/, 1015];
                    housingJobId = housingJobRow.rows[0].id;
                    return [4 /*yield*/, client.query("SELECT 1 FROM rework WHERE \"jobId\" = $1 AND \"companyId\" = $2 LIMIT 1", [housingJobId, companyId])];
                case 1012:
                    exRW = _314.sent();
                    if (!(((_302 = exRW.rowCount) !== null && _302 !== void 0 ? _302 : 0) === 0)) return [3 /*break*/, 1015];
                    return [4 /*yield*/, client.query("SELECT id, \"order\" FROM \"jobOperation\"\n             WHERE \"jobId\" = $1 AND \"companyId\" = $2 AND \"order\" IN (3, 4)\n             ORDER BY \"order\"", [housingJobId, companyId])];
                case 1013:
                    opsRow = _314.sent();
                    pressOp = opsRow.rows.find(function (r) { return r.order === 3; });
                    qcOp = opsRow.rows.find(function (r) { return r.order === 4; });
                    if (!(pressOp && qcOp)) return [3 /*break*/, 1015];
                    return [4 /*yield*/, client.query("INSERT INTO rework (\"jobId\", \"triggeredAtJobOperationId\", \"targetJobOperationId\", reason, quantity, \"requestedById\", \"completedAt\", \"companyId\")\n               VALUES ($1, $2, $3, 'Bearing not seated to correct depth during press-fit', 3, $4, NOW() - INTERVAL '110 hours', $5)", [housingJobId, qcOp.id, pressOp.id, userId, companyId])];
                case 1014:
                    _314.sent();
                    _314.label = 1015;
                case 1015:
                    console.log("   Seeded scrapReason, failureMode, kanban, pickingList, rework");
                    // ─── Step 102: fixedAssetClass, fixedAsset, depreciationRun, trackedEntity, inspectionDocument ──
                    console.log("102. Seeding fixed assets, tracked entities, inspection documents...");
                    return [4 /*yield*/, client.query("SELECT \"companyGroupId\" FROM company WHERE id = $1", [companyId])];
                case 1016:
                    cgRow = _314.sent();
                    cgId = (_303 = cgRow.rows[0]) === null || _303 === void 0 ? void 0 : _303.companyGroupId;
                    if (!cgId) return [3 /*break*/, 1031];
                    return [4 /*yield*/, client.query("SELECT number, id FROM account WHERE \"companyGroupId\" = $1 AND \"isGroup\" = false AND number IN ('1310','1330','1350','1320','6310','6320')", [cgId])];
                case 1017:
                    acctRow = _314.sent();
                    acctMap = {};
                    for (_35 = 0, _36 = acctRow.rows; _35 < _36.length; _35++) {
                        r = _36[_35];
                        acctMap[r.number] = r.id;
                    }
                    assetAcctId = acctMap["1350"];
                    accumDeprAcctId = acctMap["1330"];
                    deprExpAcctId = acctMap["6310"];
                    disposalAcctId = acctMap["1320"];
                    writeOffAcctId = acctMap["6320"];
                    if (!(assetAcctId &&
                        accumDeprAcctId &&
                        deprExpAcctId &&
                        disposalAcctId &&
                        writeOffAcctId)) return [3 /*break*/, 1031];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"fixedAssetClass\" WHERE name = 'Machinery & Equipment' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1018:
                    exFac = _314.sent();
                    facId = void 0;
                    if (!(((_304 = exFac.rowCount) !== null && _304 !== void 0 ? _304 : 0) === 0)) return [3 /*break*/, 1020];
                    return [4 /*yield*/, client.query("INSERT INTO \"fixedAssetClass\" (name, \"depreciationMethod\", \"usefulLifeMonths\", \"residualValuePercent\",\n               \"assetAccountId\", \"accumulatedDepreciationAccountId\", \"depreciationExpenseAccountId\",\n               \"writeOffAccountId\", \"writeDownAccountId\", \"disposalAccountId\", \"companyId\", \"createdBy\")\n             VALUES ('Machinery & Equipment', 'Straight Line', 84, 10,\n               $1, $2, $3, $4, $4, $5, $6, $7) RETURNING id", [
                            assetAcctId,
                            accumDeprAcctId,
                            deprExpAcctId,
                            writeOffAcctId,
                            disposalAcctId,
                            companyId,
                            userId
                        ])];
                case 1019:
                    facRow = _314.sent();
                    facId = (_305 = facRow.rows[0]) === null || _305 === void 0 ? void 0 : _305.id;
                    return [3 /*break*/, 1022];
                case 1020: return [4 /*yield*/, client.query("SELECT id FROM \"fixedAssetClass\" WHERE name = 'Machinery & Equipment' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1021:
                    existing = _314.sent();
                    facId = (_306 = existing.rows[0]) === null || _306 === void 0 ? void 0 : _306.id;
                    _314.label = 1022;
                case 1022:
                    if (!facId) return [3 /*break*/, 1031];
                    return [4 /*yield*/, client.query("SELECT id FROM location WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1023:
                    locationRow = _314.sent();
                    locationId_1 = (_307 = locationRow.rows[0]) === null || _307 === void 0 ? void 0 : _307.id;
                    assets = [
                        {
                            faId: "FA-001",
                            name: "CNC Lathe Machine",
                            serial: "CNC-2022-001",
                            cost: 85000,
                            acquiredDate: "2022-03-15"
                        },
                        {
                            faId: "FA-002",
                            name: "Conveyor Belt Assembly",
                            serial: "CVB-2023-007",
                            cost: 24500,
                            acquiredDate: "2023-06-01"
                        }
                    ];
                    _37 = 0, assets_1 = assets;
                    _314.label = 1024;
                case 1024:
                    if (!(_37 < assets_1.length)) return [3 /*break*/, 1028];
                    a = assets_1[_37];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"fixedAsset\" WHERE \"fixedAssetId\" = $1 AND \"companyId\" = $2 LIMIT 1", [a.faId, companyId])];
                case 1025:
                    exFa = _314.sent();
                    if (!(((_308 = exFa.rowCount) !== null && _308 !== void 0 ? _308 : 0) === 0)) return [3 /*break*/, 1027];
                    return [4 /*yield*/, client.query("INSERT INTO \"fixedAsset\" (\"fixedAssetId\", \"fixedAssetClassId\", name, description, \"serialNumber\",\n                   status, \"depreciationMethod\", \"usefulLifeMonths\", \"residualValuePercent\",\n                   \"acquisitionCost\", \"acquisitionDate\", \"depreciationStartDate\",\n                   \"accumulatedDepreciation\", \"locationId\", \"companyId\", \"createdBy\")\n                 VALUES ($1, $2, $3, $4, $5,\n                   'Active', 'Straight Line', 84, 10,\n                   $6, $7, $7,\n                   0, $8, $9, $10)", [
                            a.faId,
                            facId,
                            a.name,
                            a.name,
                            a.serial,
                            a.cost,
                            a.acquiredDate,
                            locationId_1 !== null && locationId_1 !== void 0 ? locationId_1 : null,
                            companyId,
                            userId
                        ])];
                case 1026:
                    _314.sent();
                    _314.label = 1027;
                case 1027:
                    _37++;
                    return [3 /*break*/, 1024];
                case 1028: return [4 /*yield*/, client.query("SELECT 1 FROM \"depreciationRun\" WHERE \"depreciationRunId\" = 'DR-2025-12' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1029:
                    exDr = _314.sent();
                    if (!(((_309 = exDr.rowCount) !== null && _309 !== void 0 ? _309 : 0) === 0)) return [3 /*break*/, 1031];
                    return [4 /*yield*/, client.query("INSERT INTO \"depreciationRun\" (\"depreciationRunId\", \"periodEnd\", status, \"companyId\", \"createdBy\")\n               VALUES ('DR-2025-12', '2025-12-31', 'Draft', $1, $2)", [companyId, userId])];
                case 1030:
                    _314.sent();
                    _314.label = 1031;
                case 1031: return [4 /*yield*/, client.query("SELECT id, \"receiptId\" AS \"readableId\" FROM receipt WHERE \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1032:
                    receiptRow = _314.sent();
                    receipt = receiptRow.rows[0];
                    if (!receipt) return [3 /*break*/, 1038];
                    trackedItems = [
                        { itemKey: "STEEL-ROD-01", lotId: "LOT-SR-001", qty: 50 },
                        { itemKey: "CTRL-PCB-001", lotId: "LOT-PCB-001", qty: 25 }
                    ];
                    _38 = 0, trackedItems_1 = trackedItems;
                    _314.label = 1033;
                case 1033:
                    if (!(_38 < trackedItems_1.length)) return [3 /*break*/, 1038];
                    t = trackedItems_1[_38];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"trackedEntity\" WHERE \"readableId\" = $1 AND \"companyId\" = $2 LIMIT 1", [t.lotId, companyId])];
                case 1034:
                    exTe = _314.sent();
                    if (!(((_310 = exTe.rowCount) !== null && _310 !== void 0 ? _310 : 0) === 0)) return [3 /*break*/, 1037];
                    return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = $1 AND \"companyId\" = $2 LIMIT 1", [t.itemKey, companyId])];
                case 1035:
                    itemRow = _314.sent();
                    itemId = (_311 = itemRow.rows[0]) === null || _311 === void 0 ? void 0 : _311.id;
                    return [4 /*yield*/, client.query("INSERT INTO \"trackedEntity\" (quantity, status, \"sourceDocument\", \"sourceDocumentId\", \"sourceDocumentReadableId\",\n               attributes, \"readableId\", \"itemId\", \"companyId\", \"createdBy\")\n             VALUES ($1, 'Available', 'Receipt', $2, $3,\n               '{}', $4, $5, $6, $7)", [
                            t.qty,
                            receipt.id,
                            receipt.readableId,
                            t.lotId,
                            itemId !== null && itemId !== void 0 ? itemId : null,
                            companyId,
                            userId
                        ])];
                case 1036:
                    _314.sent();
                    _314.label = 1037;
                case 1037:
                    _38++;
                    return [3 /*break*/, 1033];
                case 1038: return [4 /*yield*/, client.query("SELECT id FROM item WHERE \"readableId\" = 'BRACKET-001' AND \"companyId\" = $1 LIMIT 1", [companyId])];
                case 1039:
                    bracketRow = _314.sent();
                    bracketId = (_312 = bracketRow.rows[0]) === null || _312 === void 0 ? void 0 : _312.id;
                    if (!bracketId) return [3 /*break*/, 1042];
                    return [4 /*yield*/, client.query("SELECT 1 FROM \"inspectionDocument\" WHERE \"partId\" = $1 AND \"companyId\" = $2 LIMIT 1", [bracketId, companyId])];
                case 1040:
                    exId = _314.sent();
                    if (!(((_313 = exId.rowCount) !== null && _313 !== void 0 ? _313 : 0) === 0)) return [3 /*break*/, 1042];
                    return [4 /*yield*/, client.query("INSERT INTO \"inspectionDocument\" (\"companyId\", \"partId\", \"drawingNumber\", version, \"uploadedBy\", \"createdBy\")\n           VALUES ($1, $2, 'DRW-BRACKET-001', 2, $3, $3)", [companyId, bracketId, userId])];
                case 1041:
                    _314.sent();
                    _314.label = 1042;
                case 1042:
                    console.log("   Seeded fixedAssetClass, fixedAsset, depreciationRun, trackedEntity, inspectionDocument");
                    // ─── Pickup gap fill: ensure every op with production has pickup >= production ─
                    // Two cases:
                    //   1. No pickup at all → insert one with qty = total production qty.
                    //   2. Pickup exists but total pickup qty < total production qty → insert a
                    //      top-up record to close the gap.
                    // Configurable items (TSHIRT-001, JACKET-001) are excluded — their pickups
                    // are seeded explicitly with correct per-config-param quantities.
                    return [4 /*yield*/, client.query("\n    INSERT INTO \"jobOperationPickup\" (\"jobOperationId\", \"employeeId\", quantity, \"companyId\", \"createdBy\")\n    SELECT\n      agg.\"jobOperationId\",\n      agg.\"employeeId\",\n      agg.\"prodTotal\" - COALESCE(agg.\"pickupTotal\", 0),\n      agg.\"companyId\",\n      agg.\"createdBy\"\n    FROM (\n      SELECT\n        pq.\"jobOperationId\",\n        MAX(pq.\"employeeId\")      AS \"employeeId\",\n        SUM(pq.quantity)          AS \"prodTotal\",\n        MAX(pq.\"companyId\")       AS \"companyId\",\n        MAX(pq.\"createdBy\")       AS \"createdBy\",\n        (\n          SELECT COALESCE(SUM(jop.quantity), 0)\n          FROM \"jobOperationPickup\" jop\n          WHERE jop.\"jobOperationId\" = pq.\"jobOperationId\"\n        )                         AS \"pickupTotal\"\n      FROM \"productionQuantity\" pq\n      JOIN \"jobOperation\" jo ON jo.id = pq.\"jobOperationId\"\n      JOIN job j ON j.id = jo.\"jobId\"\n      JOIN item i ON i.id = j.\"itemId\"\n      WHERE pq.\"companyId\" = $1\n        AND i.\"readableId\" NOT IN ('TSHIRT-001', 'JACKET-001')\n      GROUP BY pq.\"jobOperationId\"\n    ) agg\n    WHERE agg.\"prodTotal\" > COALESCE(agg.\"pickupTotal\", 0)\n    ", [companyId])];
                case 1043:
                    // ─── Pickup gap fill: ensure every op with production has pickup >= production ─
                    // Two cases:
                    //   1. No pickup at all → insert one with qty = total production qty.
                    //   2. Pickup exists but total pickup qty < total production qty → insert a
                    //      top-up record to close the gap.
                    // Configurable items (TSHIRT-001, JACKET-001) are excluded — their pickups
                    // are seeded explicitly with correct per-config-param quantities.
                    _314.sent();
                    console.log("   Pickup gap fill: added missing pickup records.");
                    // ─── Final cleanup: remove any null-config records on configurable items ───
                    // Generic seeding steps use LIMIT N queries that can accidentally pick up
                    // clothing operations and create records without configuration JSON.
                    // This sweep ensures every productionQuantity and jobOperationPickup for
                    // configurable items (TSHIRT-001, JACKET-001) has a configuration value.
                    console.log("Final cleanup: removing null-config records for configurable items...");
                    return [4 /*yield*/, client.query("\n    DELETE FROM \"productionQuantity\"\n    WHERE id IN (\n      SELECT pq.id FROM \"productionQuantity\" pq\n      JOIN \"jobOperation\" jo ON jo.id = pq.\"jobOperationId\"\n      JOIN job j ON j.id = jo.\"jobId\"\n      JOIN item i ON i.id = j.\"itemId\"\n      WHERE i.\"readableId\" IN ('TSHIRT-001','JACKET-001')\n        AND pq.configuration IS NULL\n        AND pq.\"companyId\" = $1\n    )\n  ", [companyId])];
                case 1044:
                    _314.sent();
                    return [4 /*yield*/, client.query("\n    DELETE FROM \"jobOperationPickup\"\n    WHERE id IN (\n      SELECT jop.id FROM \"jobOperationPickup\" jop\n      JOIN \"jobOperation\" jo ON jo.id = jop.\"jobOperationId\"\n      JOIN job j ON j.id = jo.\"jobId\"\n      JOIN item i ON i.id = j.\"itemId\"\n      WHERE i.\"readableId\" IN ('TSHIRT-001','JACKET-001')\n        AND jop.configuration IS NULL\n        AND jop.\"companyId\" = $1\n    )\n  ", [companyId])];
                case 1045:
                    _314.sent();
                    console.log("   Null-config cleanup complete.");
                    return [2 /*return*/];
            }
        });
    });
}
