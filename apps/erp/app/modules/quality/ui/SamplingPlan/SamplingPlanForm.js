"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SamplingPlanForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var samplingStandards_1 = require("~/modules/quality/samplingStandards");
var typeOptions = [
    { value: "All", label: "Inspect All" },
    { value: "First", label: "Inspect First N" },
    { value: "Percentage", label: "Percentage" },
    { value: "AQL", label: "AQL (Z1.4 / ISO 2859-1)" }
];
var inspectionLevelOptions = [
    { value: "S1", label: "S-1 (coarsest special)" },
    { value: "S2", label: "S-2" },
    { value: "S3", label: "S-3" },
    { value: "S4", label: "S-4 (finest special)" },
    { value: "I", label: "I (reduced)" },
    { value: "II", label: "II (normal default)" },
    { value: "III", label: "III (tightened)" }
];
var severityOptions = [
    { value: "Normal", label: "Normal" },
    { value: "Tightened", label: "Tightened" },
    { value: "Reduced", label: "Reduced" }
];
// Canonical string form of an AQL value, so options match stored values.
// DB returns NUMERIC(5,3) as e.g. "1.500" — normalize everything to "1.5".
function normalizeAql(v) {
    if (v == null || v === "")
        return null;
    var n = typeof v === "number" ? v : parseFloat(v);
    if (Number.isNaN(n))
        return null;
    return String(n);
}
function toNumberOrUndefined(v) {
    if (v == null || v === "")
        return undefined;
    var n = typeof v === "number" ? v : parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
}
var aqlOptions = samplingStandards_1.standardAqlValues.map(function (v) { return ({
    value: String(v),
    label: v.toString()
}); });
var SAMPLE_LOT_SIZES = [10, 50, 100, 500, 1000];
function SamplingPlanForm(_a) {
    var _b, _c, _d, _e, _f, _g;
    var action = _a.action, itemId = _a.itemId, standard = _a.standard, initial = _a.initial;
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "quality");
    var initialType = (_b = initial === null || initial === void 0 ? void 0 : initial.type) !== null && _b !== void 0 ? _b : "All";
    var initialSampleSize = (_c = initial === null || initial === void 0 ? void 0 : initial.sampleSize) !== null && _c !== void 0 ? _c : null;
    var initialPercentage = (_d = toNumberOrUndefined(initial === null || initial === void 0 ? void 0 : initial.percentage)) !== null && _d !== void 0 ? _d : null;
    var initialAqlString = normalizeAql(initial === null || initial === void 0 ? void 0 : initial.aql);
    var initialAqlNumber = (_e = toNumberOrUndefined(initial === null || initial === void 0 ? void 0 : initial.aql)) !== null && _e !== void 0 ? _e : 1.0;
    var initialLevel = (_f = initial === null || initial === void 0 ? void 0 : initial.inspectionLevel) !== null && _f !== void 0 ? _f : "II";
    var initialSeverity = (_g = initial === null || initial === void 0 ? void 0 : initial.severity) !== null && _g !== void 0 ? _g : "Normal";
    var _h = (0, react_2.useState)(initialType), type = _h[0], setType = _h[1];
    var _j = (0, react_2.useState)(initialSampleSize !== null && initialSampleSize !== void 0 ? initialSampleSize : 1), sampleSize = _j[0], setSampleSize = _j[1];
    var _k = (0, react_2.useState)(initialPercentage !== null && initialPercentage !== void 0 ? initialPercentage : 10), percentage = _k[0], setPercentage = _k[1];
    var _l = (0, react_2.useState)(initialAqlNumber), aql = _l[0], setAql = _l[1];
    var _m = (0, react_2.useState)(initialLevel), inspectionLevel = _m[0], setInspectionLevel = _m[1];
    var _o = (0, react_2.useState)(initialSeverity), severity = _o[0], setSeverity = _o[1];
    // Re-seed local state when the loader returns a new plan (e.g. after save).
    (0, react_2.useEffect)(function () {
        setType(initialType);
        setSampleSize(initialSampleSize !== null && initialSampleSize !== void 0 ? initialSampleSize : 1);
        setPercentage(initialPercentage !== null && initialPercentage !== void 0 ? initialPercentage : 10);
        setAql(initialAqlNumber);
        setInspectionLevel(initialLevel);
        setSeverity(initialSeverity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        initialType,
        initialSampleSize,
        initialPercentage,
        initialAqlNumber,
        initialLevel,
        initialSeverity
    ]);
    var planForPreview = {
        type: type,
        sampleSize: sampleSize,
        percentage: percentage,
        aql: aql,
        inspectionLevel: inspectionLevel,
        severity: severity
    };
    // Remount key — forces ValidatedForm (and all its name-bound fields) to
    // re-initialize from defaultValues whenever the saved plan changes.
    var formKey = [
        initialType,
        initialSampleSize !== null && initialSampleSize !== void 0 ? initialSampleSize : "",
        initialPercentage !== null && initialPercentage !== void 0 ? initialPercentage : "",
        initialAqlString !== null && initialAqlString !== void 0 ? initialAqlString : "",
        initialLevel,
        initialSeverity
    ].join("|");
    return (<react_1.Card>
      <form_1.ValidatedForm key={formKey} method="post" action={action} validator={quality_models_1.itemSamplingPlanValidator} defaultValues={{
            itemId: itemId,
            type: initialType,
            sampleSize: initialSampleSize !== null && initialSampleSize !== void 0 ? initialSampleSize : undefined,
            percentage: initialPercentage !== null && initialPercentage !== void 0 ? initialPercentage : undefined,
            aql: (initialAqlString !== null && initialAqlString !== void 0 ? initialAqlString : "1"),
            inspectionLevel: initialLevel,
            severity: initialSeverity
        }}>
        <Form_1.Hidden name="itemId"/>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Sampling Plan</macro_1.Trans>
          </react_1.CardTitle>
          <react_1.CardDescription>
            <macro_1.Trans>
              Defines how many tracked entities are inspected per lot, and how
              many failures are tolerated before the lot is rejected.
            </macro_1.Trans>
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <react_1.VStack spacing={4} className="w-full">
            <div className="flex flex-col gap-2 w-full">
              <react_1.Label>
                <macro_1.Trans>Plan Type</macro_1.Trans>
              </react_1.Label>
              <Form_1.Select name="type" options={typeOptions} onChange={function (v) { return v && setType(v.value); }}/>
            </div>

            {type === "First" && (<div className="flex flex-col gap-2 w-full">
                <react_1.Label>
                  <macro_1.Trans>Sample Size</macro_1.Trans>
                </react_1.Label>
                <Form_1.Number name="sampleSize" minValue={1} onChange={function (n) { return typeof n === "number" && setSampleSize(n); }}/>
              </div>)}

            {type === "Percentage" && (<div className="flex flex-col gap-2 w-full">
                <react_1.Label>
                  <macro_1.Trans>Percentage of Lot</macro_1.Trans>
                </react_1.Label>
                <Form_1.Number name="percentage" minValue={1} maxValue={100} onChange={function (n) { return typeof n === "number" && setPercentage(n); }}/>
              </div>)}

            {type === "AQL" && (<div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_1.Trans>AQL</macro_1.Trans>
                  </react_1.Label>
                  <Form_1.Select name="aql" options={aqlOptions} onChange={function (v) { return v && setAql(parseFloat(v.value)); }}/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_1.Trans>Inspection Level</macro_1.Trans>
                  </react_1.Label>
                  <Form_1.Select name="inspectionLevel" options={inspectionLevelOptions} onChange={function (v) {
                return v && setInspectionLevel(v.value);
            }}/>
                </div>
                <div className="flex flex-col gap-2">
                  <react_1.Label>
                    <macro_1.Trans>Severity</macro_1.Trans>
                  </react_1.Label>
                  <Form_1.Select name="severity" options={severityOptions} onChange={function (v) {
                return v && setSeverity(v.value);
            }}/>
                </div>
              </div>)}

            <div className="flex flex-col gap-2 w-full border rounded-md p-4">
              <react_1.HStack className="justify-between">
                <span className="text-sm font-medium">
                  <macro_1.Trans>Preview</macro_1.Trans>
                </span>
                <span className="text-xs text-muted-foreground">
                  {standard === "ANSI_Z1_4" ? "ANSI/ASQ Z1.4" : "ISO 2859-1"}
                </span>
              </react_1.HStack>
              <table className="text-sm w-full">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium py-1">
                      <macro_1.Trans>Lot</macro_1.Trans>
                    </th>
                    <th className="text-left font-medium py-1">
                      <macro_1.Trans>Sample</macro_1.Trans>
                    </th>
                    <th className="text-left font-medium py-1">Ac</th>
                    <th className="text-left font-medium py-1">Re</th>
                    <th className="text-left font-medium py-1">
                      <macro_1.Trans>Letter</macro_1.Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_LOT_SIZES.map(function (n) {
            var _a;
            var res = (0, samplingStandards_1.resolveSamplingPlan)(planForPreview, n, standard);
            return (<tr key={n}>
                        <td className="py-1">{n}</td>
                        <td className="py-1">{res.sampleSize}</td>
                        <td className="py-1">{res.acceptance}</td>
                        <td className="py-1">{res.rejection}</td>
                        <td className="py-1">{(_a = res.codeLetter) !== null && _a !== void 0 ? _a : "—"}</td>
                      </tr>);
        })}
                </tbody>
              </table>
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!canUpdate}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
}
