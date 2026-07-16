"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionFormModal = SectionFormModal;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var react_2 = require("react");
var react_router_1 = require("react-router");
var PLACEMENT_LABELS = {
    body: "Body section",
    header: "Page header",
    footer: "Page footer"
};
/**
 * Create/edit a shared document section. Reused by the section library and the
 * template editor — pass `action` to post to the sections route when rendered
 * outside it.
 */
function SectionFormModal(_a) {
    var _b, _c, _d, _e;
    var section = _a.section, onClose = _a.onClose, action = _a.action;
    var fetcher = (0, react_router_1.useFetcher)();
    var _f = (0, react_2.useState)((_b = section === null || section === void 0 ? void 0 : section.content) !== null && _b !== void 0 ? _b : { type: "doc", content: [] }), content = _f[0], setContent = _f[1];
    var _g = (0, react_2.useState)((_c = section === null || section === void 0 ? void 0 : section.placement) !== null && _c !== void 0 ? _c : "body"), placement = _g[0], setPlacement = _g[1];
    var _h = (0, react_2.useState)(__assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), ((_d = section === null || section === void 0 ? void 0 : section.config) !== null && _d !== void 0 ? _d : {}))), config = _h[0], setConfig = _h[1];
    // Placement is intrinsic once a section exists — don't let it change.
    var lockPlacement = Boolean(section);
    var isHeader = placement === "header";
    var isSaving = fetcher.state !== "idle";
    var submittedRef = (0, react_2.useRef)(false);
    var setConfigKey = function (key, value) { return setConfig(function (prev) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
    }); };
    var submit = function (form) {
        var data = new FormData(form);
        data.set("placement", placement);
        data.set("content", JSON.stringify(content));
        if (isHeader)
            data.set("config", JSON.stringify(config));
        submittedRef.current = true;
        fetcher.submit(data, __assign({ method: "post" }, (action ? { action: action } : {})));
    };
    // Close once our save resolves successfully.
    (0, react_2.useEffect)(function () {
        var _a;
        if (submittedRef.current &&
            fetcher.state === "idle" &&
            ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success)) {
            submittedRef.current = false;
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose]);
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <fetcher.Form method="post" onSubmit={function (e) {
            e.preventDefault();
            submit(e.currentTarget);
        }}>
          {section && <input type="hidden" name="id" value={section.id}/>}
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              {section ? "Edit section" : "New shared section"}
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <div className="flex w-full flex-col gap-1.5">
                <react_1.Label htmlFor="name">Name</react_1.Label>
                <react_1.Input id="name" name="name" defaultValue={(_e = section === null || section === void 0 ? void 0 : section.name) !== null && _e !== void 0 ? _e : ""} autoFocus required/>
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <react_1.Label>Placement</react_1.Label>
                {lockPlacement ? (<div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                    {PLACEMENT_LABELS[placement]}
                  </div>) : (<react_1.Select value={placement} onValueChange={function (v) {
                return setPlacement(v);
            }}>
                    <react_1.SelectTrigger>
                      <react_1.SelectValue />
                    </react_1.SelectTrigger>
                    <react_1.SelectContent>
                      <react_1.SelectItem value="body">Body section</react_1.SelectItem>
                      <react_1.SelectItem value="header">Page header</react_1.SelectItem>
                      <react_1.SelectItem value="footer">Page footer</react_1.SelectItem>
                    </react_1.SelectContent>
                  </react_1.Select>)}
              </div>

              {isHeader && (<div className="flex w-full flex-col gap-3 rounded-md border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Header layout
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Set the logo from the Logo item under Header.
                  </p>
                  <ConfigSwitch label="Show company address" checked={config.showCompanyDetails} onChange={function (v) { return setConfigKey("showCompanyDetails", v); }}/>
                  <ConfigSwitch label="Show document title" checked={config.showDocumentTitle} onChange={function (v) { return setConfigKey("showDocumentTitle", v); }}/>
                  <ConfigSwitch label="Show document number" checked={config.showDocumentId} onChange={function (v) { return setConfigKey("showDocumentId", v); }}/>
                </div>)}

              <div className="flex w-full flex-col gap-1.5">
                <react_1.Label>
                  {isHeader ? "Banner content (optional)" : "Content"}
                </react_1.Label>
                <Editor_1.Editor className="min-h-[160px] w-full rounded-md border bg-background p-3" initialValue={content} onChange={setContent} disableFileUpload/>
              </div>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </react_1.Button>
            <react_1.Button type="submit" isLoading={isSaving} isDisabled={isSaving}>
              Save
            </react_1.Button>
          </react_1.ModalFooter>
        </fetcher.Form>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ConfigSwitch(_a) {
    var label = _a.label, checked = _a.checked, onChange = _a.onChange;
    return (<div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <react_1.Switch variant="small" checked={checked} onCheckedChange={function (v) { return onChange(Boolean(v)); }}/>
    </div>);
}
