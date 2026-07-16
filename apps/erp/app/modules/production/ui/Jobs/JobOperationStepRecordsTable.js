"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var shared_models_1 = require("~/modules/shared/shared.models");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var JobOperationStepRecordsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var jobId = (0, react_router_1.useParams)().jobId;
    var t = (0, macro_1.useLingui)().t;
    if (!jobId)
        throw new Error("Job ID is required");
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var employees = (0, stores_1.usePeople)()[0];
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "operationDescription",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operation"], ["Operation"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.operationDescription;
                },
                meta: {
                    icon: <lu_1.LuSettings />
                }
            },
            {
                accessorKey: "name",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Step"], ["Step"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.name;
                },
                meta: {
                    icon: <lu_1.LuClipboardList />
                }
            },
            {
                id: "value",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Value"], ["Value"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e, _f;
                    var row = _a.row;
                    var record = row.original;
                    switch (record.type) {
                        case "Task":
                        case "Checkbox":
                            return <react_1.Checkbox checked={(_b = record.booleanValue) !== null && _b !== void 0 ? _b : false}/>;
                        case "Value":
                            return <p className="text-sm">{record.value}</p>;
                        case "Measurement":
                            if (typeof record.numericValue === "number") {
                                return (<p className={(0, react_1.cn)("text-sm", record.minValue !== null &&
                                        record.minValue !== undefined &&
                                        record.numericValue < record.minValue &&
                                        "text-red-500", record.maxValue !== null &&
                                        record.maxValue !== undefined &&
                                        record.numericValue > record.maxValue &&
                                        "text-red-500")}>
                      {numberFormatter.format(record.numericValue)}{" "}
                      {(_c = unitOfMeasures.find(function (u) { return u.value === record.unitOfMeasureCode; })) === null || _c === void 0 ? void 0 : _c.label}
                    </p>);
                            }
                            return null;
                        case "Timestamp":
                            return (<p className="text-sm">
                    {formatDateTime((_d = record.value) !== null && _d !== void 0 ? _d : "")}
                  </p>);
                        case "List":
                            return <p className="text-sm">{record.value}</p>;
                        case "Person":
                            return (<p className="text-sm">
                    {(_e = employees.find(function (e) { return e.id === record.userValue; })) === null || _e === void 0 ? void 0 : _e.name}
                  </p>);
                        case "File":
                            if (record.value) {
                                return (<div className="flex gap-2 text-xs">
                      <lu_1.LuPaperclip className="size-4 text-muted-foreground"/>
                      <a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </div>);
                            }
                            return null;
                        case "Inspection":
                            return (<div className="flex gap-2 items-center text-sm">
                    {record.value && (<>
                        <lu_1.LuPaperclip className="size-4 text-muted-foreground"/>
                        <a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer" className="text-xs">
                          View File
                        </a>
                      </>)}
                    <react_1.Checkbox checked={(_f = record.booleanValue) !== null && _f !== void 0 ? _f : false}/>
                  </div>);
                        default:
                            return null;
                    }
                },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                id: "type",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex items-center gap-2">
              <Icons_1.ProcedureStepTypeIcon type={row.original.type}/>
              {row.original.type}
            </div>);
                },
                meta: {
                    icon: <lu_1.LuList />,
                    filter: {
                        type: "static",
                        options: shared_models_1.procedureStepType.map(function (type) { return ({
                            value: type,
                            label: (<div className="flex items-center gap-2">
                    <Icons_1.ProcedureStepTypeIcon type={type}/>
                    {type}
                  </div>)
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdBy",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy} withName={true}/>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return formatDateTime((_b = row.original.createdAt) !== null && _b !== void 0 ? _b : "");
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
    }, [numberFormatter, unitOfMeasures, employees, t, formatDateTime]);
    return (<components_1.Table compact count={count} columns={columns} data={data} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Step Records"], ["Step Records"])))}/>);
});
JobOperationStepRecordsTable.displayName = "JobOperationStepRecordsTable";
exports.default = JobOperationStepRecordsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
