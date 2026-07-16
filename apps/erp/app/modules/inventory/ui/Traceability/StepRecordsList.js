"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepRecordsList = StepRecordsList;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var i18n_1 = require("@react-aria/i18n");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var Icons_1 = require("~/components/Icons");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function StepRecordsList(_a) {
    var records = _a.records, jobId = _a.jobId;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var employees = (0, stores_1.usePeople)()[0];
    if (records.length === 0)
        return null;
    var href = jobId ? path_1.path.to.jobOperationStepRecords(jobId) : null;
    return (<ul className="divide-y divide-border/30">
      {records.map(function (r) {
            var employee = employees.find(function (e) { return e.id === r.createdBy; });
            var initials = (employee === null || employee === void 0 ? void 0 : employee.name)
                ? employee.name
                    .split(" ")
                    .map(function (p) { return p[0]; })
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : null;
            var body = (<>
            <div className="flex items-center gap-2 min-w-0">
              <Icons_1.ProcedureStepTypeIcon type={r.type}/>
              <span className="text-sm truncate flex-1">{r.name}</span>
              <span className="text-sm tabular-nums shrink-0">
                <StepValue record={r} numberFormatter={numberFormatter} unitOfMeasures={unitOfMeasures} employees={employees}/>
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground/70 mt-0.5 truncate flex items-center gap-1.5">
              {r.operationDescription && (<span className="truncate">{r.operationDescription}</span>)}
              {initials && (<>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="font-medium tracking-wide">{initials}</span>
                </>)}
              <span className="text-muted-foreground/40">·</span>
              <span className="tabular-nums">
                {(0, utils_1.formatDateTime)(r.createdAt)}
              </span>
            </div>
          </>);
            return (<li key={r.id}>
            {href ? (<react_router_1.Link to={href} prefetch="intent" className="block px-2 py-1.5 -mx-2 rounded-md hover:bg-accent/50 transition-colors" onClick={function (e) { return e.stopPropagation(); }}>
                {body}
              </react_router_1.Link>) : (<div className="py-1.5 first:pt-0 last:pb-0">{body}</div>)}
          </li>);
        })}
    </ul>);
}
function StepValue(_a) {
    var _b, _c, _d, _e, _f, _g;
    var record = _a.record, numberFormatter = _a.numberFormatter, unitOfMeasures = _a.unitOfMeasures, employees = _a.employees;
    switch (record.type) {
        case "Task":
        case "Checkbox":
            return <react_1.Checkbox checked={(_b = record.booleanValue) !== null && _b !== void 0 ? _b : false} disabled/>;
        case "Value":
        case "List":
            return <span className="font-medium">{(_c = record.value) !== null && _c !== void 0 ? _c : "—"}</span>;
        case "Measurement": {
            if (typeof record.numericValue !== "number")
                return null;
            var unit = (_d = unitOfMeasures.find(function (u) { return u.value === record.unitOfMeasureCode; })) === null || _d === void 0 ? void 0 : _d.label;
            var outOfRange = (record.minValue !== null &&
                record.minValue !== undefined &&
                record.numericValue < record.minValue) ||
                (record.maxValue !== null &&
                    record.maxValue !== undefined &&
                    record.numericValue > record.maxValue);
            return (<span className={(0, react_1.cn)("font-medium", outOfRange && "text-red-500")}>
          {numberFormatter.format(record.numericValue)}
          {unit ? (<span className="text-muted-foreground ml-1">{unit}</span>) : null}
        </span>);
        }
        case "Timestamp":
            return (<span className="text-muted-foreground">
          {(0, utils_1.formatDateTime)((_e = record.value) !== null && _e !== void 0 ? _e : "")}
        </span>);
        case "Person": {
            var name_1 = (_f = employees.find(function (e) { return e.id === record.userValue; })) === null || _f === void 0 ? void 0 : _f.name;
            return <span className="font-medium">{name_1 !== null && name_1 !== void 0 ? name_1 : "—"}</span>;
        }
        case "File":
            return record.value ? (<a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline" onClick={function (e) { return e.stopPropagation(); }}>
          <lu_1.LuPaperclip className="size-3"/>
          File
        </a>) : null;
        case "Inspection":
            return (<span className="inline-flex items-center gap-1.5">
          {record.value && (<a href={(0, path_1.getPrivateUrl)(record.value)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline" onClick={function (e) { return e.stopPropagation(); }}>
              <lu_1.LuPaperclip className="size-3"/>
            </a>)}
          <react_1.Checkbox checked={(_g = record.booleanValue) !== null && _g !== void 0 ? _g : false} disabled/>
        </span>);
        default:
            return null;
    }
}
