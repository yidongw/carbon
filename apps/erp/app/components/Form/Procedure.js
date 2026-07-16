"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProcedures = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ProcedureStatus_1 = require("~/modules/production/ui/Procedures/ProcedureStatus");
var path_1 = require("~/utils/path");
var Procedure = function (props) {
    var _a, _b;
    var _c = (0, exports.useProcedures)({
        processId: props === null || props === void 0 ? void 0 : props.processId
    }), options = _c.options, loading = _c.loading;
    return (<>
      <form_1.Combobox options={options} isOptional={(_a = props === null || props === void 0 ? void 0 : props.isOptional) !== null && _a !== void 0 ? _a : true} isLoading={loading} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Procedure"}/>
    </>);
};
Procedure.displayName = "Procedure";
exports.default = Procedure;
var useProcedures = function (args) {
    var _a, _b;
    var processId = args.processId;
    var procedureFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        procedureFetcher.load(path_1.path.to.api.procedures);
    });
    var loading = procedureFetcher.state !== "idle";
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = procedureFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = procedureFetcher.data) === null || _b === void 0 ? void 0 : _b.data.filter(function (f) {
                if (processId) {
                    return f.processId === processId;
                }
                return true;
            }).map(function (c) { return ({
                value: c.id,
                label: (<div className="flex justify-between items-center gap-1 w-full">
                  <react_1.HStack className="items-end">
                    <span className="text-sm truncate">{c.name} </span>
                    <span className="text-xs text-muted-foreground">
                      v{c.version}
                    </span>
                  </react_1.HStack>
                  <ProcedureStatus_1.default status={c.status}/>
                </div>)
            }); })
            : [];
    }, [procedureFetcher.data, processId]);
    return {
        options: options,
        loading: loading,
        procedures: (_b = (_a = procedureFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []
    };
};
exports.useProcedures = useProcedures;
