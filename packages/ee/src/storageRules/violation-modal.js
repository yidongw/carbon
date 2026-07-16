"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageRuleViolationModal;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
function StorageRuleViolationModal(_a) {
    var violations = _a.violations, ruleNames = _a.ruleNames, onCancel = _a.onCancel, onAcknowledge = _a.onAcknowledge, isSubmitting = _a.isSubmitting;
    var _b = (0, react_2.useMemo)(function () {
        var errs = [];
        var wrns = [];
        for (var _i = 0, violations_1 = violations; _i < violations_1.length; _i++) {
            var v = violations_1[_i];
            (v.severity === "error" ? errs : wrns).push(v);
        }
        return {
            errors: errs,
            warns: wrns,
            hasError: errs.length > 0,
            onlyWarns: errs.length === 0 && wrns.length > 0
        };
    }, [violations]), errors = _b.errors, warns = _b.warns, hasError = _b.hasError, onlyWarns = _b.onlyWarns;
    if (violations.length === 0)
        return null;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <span className="flex items-center gap-2">
              {hasError ? (<lu_1.LuOctagonAlert className="text-destructive h-5 w-5"/>) : (<lu_1.LuTriangleAlert className="text-amber-500 h-5 w-5"/>)}
              Rule Violation
            </span>
          </react_1.ModalTitle>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          <div className="flex flex-col gap-4 text-sm">
            {errors.length > 0 && (<ViolationGroup title="Errors" violations={errors} ruleNames={ruleNames} tone="error"/>)}
            {warns.length > 0 && (<ViolationGroup title="Warnings" violations={warns} ruleNames={ruleNames} tone="warn"/>)}
          </div>
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            Cancel
          </react_1.Button>
          <react_1.Button variant={hasError ? "destructive" : "solid"} onClick={onAcknowledge} isDisabled={hasError || isSubmitting} isLoading={isSubmitting}>
            {onlyWarns ? "Acknowledge & continue" : "Confirm"}
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ViolationGroup(_a) {
    var title = _a.title, violations = _a.violations, ruleNames = _a.ruleNames, tone = _a.tone;
    var Icon = tone === "error" ? lu_1.LuOctagonAlert : lu_1.LuTriangleAlert;
    var colorClass = tone === "error" ? "text-destructive" : "text-amber-500";
    return (<div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
        {title} · {violations.length}
      </p>
      <ul className="flex flex-col gap-2">
        {violations.map(function (v, i) {
            var _a;
            return (<li key={"".concat(v.ruleId, "-").concat(i)} className="flex items-start gap-2 border border-border rounded-md px-3 py-2">
            <Icon className={"h-4 w-4 mt-0.5 shrink-0 ".concat(colorClass)}/>
            <div className="flex flex-col">
              <span className="font-medium">
                {(_a = ruleNames === null || ruleNames === void 0 ? void 0 : ruleNames[v.ruleId]) !== null && _a !== void 0 ? _a : v.ruleId}
              </span>
              <span className="text-muted-foreground text-xs">{v.message}</span>
            </div>
          </li>);
        })}
      </ul>
    </div>);
}
