"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var IssueIcons_1 = require("../Issue/IssueIcons");
function ReorderableActionItem(_a) {
    var action = _a.action, onRemove = _a.onRemove;
    var dragControls = (0, framer_motion_1.useDragControls)();
    return (<framer_motion_1.Reorder.Item value={action.id} dragListener={false} dragControls={dragControls} className="w-full">
      <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 w-full">
        <button className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1" onPointerDown={function (e) { return dragControls.start(e); }}>
          <lu_1.LuGripVertical size={16}/>
        </button>
        <span className="flex-1 text-sm">{action.name}</span>
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors p-1">
          <lu_1.LuX size={16}/>
        </button>
      </div>
    </framer_motion_1.Reorder.Item>);
}
var IssueWorkflowForm = function (_a) {
    var _b, _c, _d;
    var initialValues = _a.initialValues, requiredActions = _a.requiredActions, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _e = (0, react_2.useState)((_c = JSON.parse((_b = initialValues === null || initialValues === void 0 ? void 0 : initialValues.content) !== null && _b !== void 0 ? _b : {})) !== null && _c !== void 0 ? _c : {}), content = _e[0], setContent = _e[1];
    // State for managing selected required actions in order
    var _f = (0, react_2.useState)((_d = initialValues.requiredActionIds) !== null && _d !== void 0 ? _d : []), selectedActionIds = _f[0], setSelectedActionIds = _f[1];
    // Update selectedActionIds when initialValues changes
    (0, react_2.useEffect)(function () {
        var _a;
        setSelectedActionIds((_a = initialValues.requiredActionIds) !== null && _a !== void 0 ? _a : []);
    }, [initialValues.requiredActionIds]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "quality")
        : !permissions.can("create", "quality");
    // Get the ordered list of selected actions
    var orderedActions = selectedActionIds
        .map(function (id) { return requiredActions.find(function (action) { return action.id === id; }); })
        .filter(function (action) { return action !== undefined; });
    // Get available actions that haven't been selected yet
    var availableActions = requiredActions.filter(function (action) { return !selectedActionIds.includes(action.id); });
    var handleReorder = function (newOrder) {
        setSelectedActionIds(newOrder);
    };
    var handleAddAction = function (actionId) {
        if (!selectedActionIds.includes(actionId)) {
            setSelectedActionIds(__spreadArray(__spreadArray([], selectedActionIds, true), [actionId], false));
        }
    };
    var handleRemoveAction = function (actionId) {
        setSelectedActionIds(selectedActionIds.filter(function (id) { return id !== actionId; }));
    };
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    return (<form_1.ValidatedForm key={initialValues.id} validator={quality_models_1.issueWorkflowValidator} defaultValues={initialValues} method="post" action={isEditing
            ? path_1.path.to.issueWorkflow(initialValues.id)
            : path_1.path.to.newIssueWorkflow}>
      <Form_1.Hidden name="id" value={initialValues.id}/>
      <Form_1.Hidden name="content" value={JSON.stringify(content)}/>
      <Form_1.Hidden name="requiredActionIds" value={JSON.stringify(selectedActionIds)}/>
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[50rem] h-full mx-auto gap-2">
        <react_1.HStack className="w-full justify-between">
          <react_1.VStack spacing={0}>
            <react_1.Heading size="h3">
              {isEditing ? "Edit" : "New"}{" "}
              <span className="hidden md:inline">Issue</span> Workflow
            </react_1.Heading>
            <p className="text-sm text-muted-foreground">
              Issue workflows defined the preset values for an issue. For
              example, you can have an 8D workflow or a containment workflow.
            </p>
          </react_1.VStack>
        </react_1.HStack>
        <Form_1.Input name="name" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"])))}/>
        <react_1.VStack spacing={2}>
          <label htmlFor="content" className="text-xs text-muted-foreground font-medium">
            Issue Template
          </label>
          <react_1.Card className="p-0 bg-transparent dark:from-transparent  dark:via-transparent dark:to-transparent">
            <react_1.CardContent className="flex flex-col gap-0 p-6">
              {permissions.can("update", "quality") ? (<Editor_1.Editor initialValue={content} onUpload={onUploadImage} onChange={function (value) {
                setContent(value);
            }} className="[&_.is-empty]:text-muted-foreground min-h-[120px]"/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(content)
            }}/>)}
            </react_1.CardContent>
          </react_1.Card>
        </react_1.VStack>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <form_1.Select name="priority" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Priority"], ["Priority"])))} options={quality_models_1.nonConformancePriority.map(function (priority) { return ({
            label: (<div className="flex gap-1 items-center">
                  {(0, IssueIcons_1.getPriorityIcon)(priority, false)}
                  <span>{priority}</span>
                </div>),
            value: priority
        }); })}/>
          <form_1.Select name="source" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Source"], ["Source"])))} options={quality_models_1.nonConformanceSource.map(function (source) { return ({
            label: source,
            value: source
        }); })}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <react_1.VStack spacing={2}>
            <label htmlFor="requiredActions" className="text-xs text-muted-foreground font-medium">
              Required Actions (in order)
            </label>

            {orderedActions.length > 0 && (<framer_motion_1.Reorder.Group axis="y" values={selectedActionIds} onReorder={handleReorder} className="w-full space-y-2">
                {orderedActions.map(function (action) { return (<ReorderableActionItem key={action.id} action={action} onRemove={function () { return handleRemoveAction(action.id); }}/>); })}
              </framer_motion_1.Reorder.Group>)}

            {orderedActions.length === 0 && (<p className="text-sm text-muted-foreground italic">
                No actions selected
              </p>)}
          </react_1.VStack>

          <react_1.VStack spacing={2}>
            <p className="text-xs text-muted-foreground font-medium">
              Available Actions (click to add)
            </p>
            {availableActions.length > 0 ? (<div className="flex flex-col gap-2">
                {availableActions.map(function (action) { return (<button key={action.id} type="button" onClick={function () { return handleAddAction(action.id); }} className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left text-sm">
                    <react_1.Checkbox onClick={function (e) { return e.preventDefault(); }} isChecked={false} disabled/>
                    <span>{action.name}</span>
                  </button>); })}
              </div>) : (<p className="text-sm text-muted-foreground italic">
                All actions selected
              </p>)}
          </react_1.VStack>
        </div>

        <form_1.MultiSelect name="approvalRequirements" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Approval Requirements"], ["Approval Requirements"])))} options={quality_models_1.nonConformanceApprovalRequirement.map(function (requirement) { return ({
            label: requirement,
            value: requirement
        }); })}/>

        <react_1.HStack className="w-full justify-end">
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <Form_1.Submit isDisabled={isDisabled}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.HStack>
      </react_1.VStack>
    </form_1.ValidatedForm>);
};
exports.default = IssueWorkflowForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
