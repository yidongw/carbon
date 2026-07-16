"use strict";
/** Layout tokens for BOP operation detail forms inside expandable cards. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationDetailMetricFieldClass = exports.operationDetailHintFieldClass = exports.operationDetailSectionGridClass = exports.operationFormWorkCenterFieldClass = exports.operationFormDescriptionFieldClass = exports.operationFormTypeFieldClass = exports.operationFormPairFieldClass = exports.operationFormGridClass = exports.operationFormContainerClass = void 0;
exports.operationFormContainerClass = "@container/operation-form w-full min-w-0";
/**
 * <448px card (@md): 1 column (stacked).
 * 448–767px card (@md–@3xl): 2 columns (paired fields).
 * ≥768px card (@3xl): 3 columns (desktop BOP layout).
 */
exports.operationFormGridClass = "grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-4 @md/operation-form:grid-cols-2 @3xl/operation-form:grid-cols-3 @3xl/operation-form:gap-x-8";
/** Keep optional badges beside labels so they don't bleed into the next column. */
exports.operationFormPairFieldClass = "col-span-1 min-w-0 [&_label]:justify-start [&_label]:gap-x-2";
exports.operationFormTypeFieldClass = "col-span-1 min-w-0 [&_label]:justify-start [&_label]:gap-x-2 @md/operation-form:col-span-2 @3xl/operation-form:col-span-1";
exports.operationFormDescriptionFieldClass = "col-span-1 min-w-0 [&_label]:justify-start [&_label]:gap-x-2 @3xl/operation-form:col-span-2";
exports.operationFormWorkCenterFieldClass = "col-span-1 min-w-0 [&_label]:justify-start [&_label]:gap-x-2";
exports.operationDetailSectionGridClass = "grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-4 px-4 pb-4 pt-4 @md/operation-form:grid-cols-2 @3xl/operation-form:grid-cols-3 @3xl/operation-form:gap-x-8";
exports.operationDetailHintFieldClass = "col-span-1 min-w-0 @md/operation-form:col-span-2 @3xl/operation-form:col-span-1";
exports.operationDetailMetricFieldClass = "col-span-1 min-w-0";
