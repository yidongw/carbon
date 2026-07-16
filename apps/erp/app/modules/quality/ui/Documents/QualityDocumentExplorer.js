"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.default = QualityDocumentExplorer;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function QualityDocumentExplorer() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var documentData = (0, hooks_1.useRouteData)(path_1.path.to.qualityDocument(id));
    var permissions = (0, hooks_1.usePermissions)();
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var stepDisclosure = (0, react_1.useDisclosure)();
    var deleteStepDisclosure = (0, react_1.useDisclosure)();
    var _l = (0, react_2.useState)(null), selectedStep = _l[0], setSelectedStep = _l[1];
    var steps = (0, react_2.useMemo)(function () { var _a; return (_a = documentData === null || documentData === void 0 ? void 0 : documentData.document.qualityDocumentStep) !== null && _a !== void 0 ? _a : []; }, [documentData]);
    var maxSortOrder = (_a = steps.reduce(function (acc, attr) { return Math.max(acc, attr.sortOrder); }, 0)) !== null && _a !== void 0 ? _a : 0;
    var qualityDocumentStepInitialValues = {
        id: selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.id,
        qualityDocumentId: id,
        name: (_b = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.name) !== null && _b !== void 0 ? _b : "",
        description: (_c = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.description) !== null && _c !== void 0 ? _c : {},
        type: (_d = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.type) !== null && _d !== void 0 ? _d : "Task",
        sortOrder: (_e = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.sortOrder) !== null && _e !== void 0 ? _e : maxSortOrder + 1,
        unitOfMeasureCode: (_f = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "",
        minValue: selectedStep ? ((_g = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.minValue) !== null && _g !== void 0 ? _g : undefined) : 0,
        maxValue: selectedStep ? ((_h = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.maxValue) !== null && _h !== void 0 ? _h : undefined) : 0,
        listValues: (_j = selectedStep === null || selectedStep === void 0 ? void 0 : selectedStep.listValues) !== null && _j !== void 0 ? _j : []
    };
    var isDisabled = ((_k = documentData === null || documentData === void 0 ? void 0 : documentData.document) === null || _k === void 0 ? void 0 : _k.status) !== "Draft";
    var _m = (0, react_2.useState)(Array.isArray(steps)
        ? steps.sort(function (a, b) { return a.sortOrder - b.sortOrder; }).map(function (attr) { return attr.id; })
        : []), sortOrder = _m[0], setSortOrder = _m[1];
    (0, react_2.useEffect)(function () {
        if (Array.isArray(steps)) {
            var sorted = __spreadArray([], steps, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                .map(function (attr) { return attr.id; });
            setSortOrder(sorted);
        }
    }, [steps]);
    var onReorder = function (newOrder) {
        if (isDisabled)
            return;
        var updates = {};
        newOrder.forEach(function (id, index) {
            updates[id] = index + 1;
        });
        setSortOrder(newOrder);
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.qualityDocumentStepOrder(id)
        });
    }, 2500, true);
    var onDeleteStep = function (step) {
        if (isDisabled)
            return;
        setSelectedStep(step);
        deleteStepDisclosure.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedStep(null);
        deleteStepDisclosure.onClose();
    };
    var onEditAttribute = function (attribute) {
        if (isDisabled)
            return;
        (0, react_dom_1.flushSync)(function () {
            setSelectedStep(attribute);
        });
        stepDisclosure.onOpen();
    };
    var newStepRef = (0, react_2.useRef)(null);
    (0, react_1.useKeyboardShortcuts)({
        "Command+Shift+a": function (event) {
            var _a;
            event.stopPropagation();
            if (!isDisabled) {
                (_a = newStepRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }
        }
    });
    var stepMap = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = steps.reduce(function (acc, attr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[attr.id] = attr, _a)));
        }, {})) !== null && _a !== void 0 ? _a : {};
    }, [steps]);
    return (<>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {steps && steps.length > 0 ? (<framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full" disabled={isDisabled}>
              {sortOrder.map(function (sortId) { return (<DraggableStepItem key={sortId} stepId={sortId} isDisabled={isDisabled}>
                  {function (dragControls) { return (<QualityDocumentStepItem isDisabled={isDisabled} attribute={stepMap[sortId]} onDelete={onDeleteStep} onEdit={onEditAttribute} dragControls={dragControls}/>); }}
                </DraggableStepItem>); })}
            </framer_motion_1.Reorder.Group>) : (<components_1.Empty>
              {permissions.can("update", "quality") && (<react_1.Button isDisabled={isDisabled} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={function () {
                    (0, react_dom_1.flushSync)(function () {
                        setSelectedStep(null);
                    });
                    stepDisclosure.onOpen();
                }}>
                  <macro_1.Trans>Add Step</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex-none border-t border-border p-4">
          <react_1.Tooltip>
            <react_1.TooltipTrigger className="w-full">
              <react_1.Button ref={newStepRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "quality")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedStep(null);
            });
            stepDisclosure.onOpen();
        }}>
                <macro_1.Trans>Add Step</macro_1.Trans>
              </react_1.Button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>
                <span>
                  <macro_1.Trans>Add Step</macro_1.Trans>
                </span>
                <react_1.Kbd>{prettifyShortcut("Command+Shift+a")}</react_1.Kbd>
              </react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </div>
      </react_1.VStack>
      {stepDisclosure.isOpen && (<QualityDocumentStepForm 
        // @ts-ignore
        initialValues={qualityDocumentStepInitialValues} isDisabled={isDisabled} onClose={stepDisclosure.onClose}/>)}
      {deleteStepDisclosure.isOpen && selectedStep && (<DeleteQualityDocumentStep attribute={selectedStep} onCancel={onDeleteCancel}/>)}
    </>);
}
function DraggableStepItem(_a) {
    var stepId = _a.stepId, isDisabled = _a.isDisabled, children = _a.children;
    var dragControls = (0, framer_motion_1.useDragControls)();
    return (<framer_motion_1.Reorder.Item key={stepId} value={stepId} dragListener={false} dragControls={dragControls}>
      {children(dragControls)}
    </framer_motion_1.Reorder.Item>);
}
function QualityDocumentStepItem(_a) {
    var attribute = _a.attribute, isDisabled = _a.isDisabled, onEdit = _a.onEdit, onDelete = _a.onDelete, dragControls = _a.dragControls;
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var permissions = (0, hooks_1.usePermissions)();
    if (!attribute || !attribute.id || !attribute.name)
        return null;
    return (<react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 relative border-b bg-card")}>
      <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" disabled={isDisabled} className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) {
            if (!isDisabled && dragControls)
                dragControls.start(e);
        }} style={{ touchAction: "none" }}/>
      <react_1.VStack spacing={0} className="flex-grow">
        <react_1.HStack>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <Icons_1.ProcedureStepTypeIcon type={attribute.type} className="flex-shrink-0"/>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent side="top">
              <p className="text-foreground text-sm">{attribute.type}</p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
          <react_1.VStack spacing={0} className="flex-grow">
            <react_1.HStack>
              <p className="text-foreground text-sm">{attribute.name}</p>
            </react_1.HStack>
            {(attribute.minValue !== null || attribute.maxValue !== null) && (<p className="text-muted-foreground text-xs">
                {attribute.minValue !== null && attribute.maxValue !== null
                ? "Must be between ".concat(attribute.minValue, " and ").concat(attribute.maxValue)
                : attribute.minValue !== null
                    ? "Must be > ".concat(attribute.minValue)
                    : attribute.maxValue !== null
                        ? "Must be < ".concat(attribute.maxValue)
                        : null}
              </p>)}
          </react_1.VStack>
        </react_1.HStack>
      </react_1.VStack>
      {!isDisabled && (<div className="absolute right-2">
          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent>
              <react_1.DropdownMenuItem onClick={function (e) {
                e.stopPropagation();
                onEdit(attribute);
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                <macro_1.Trans>Edit Step</macro_1.Trans>
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem destructive disabled={!permissions.can("update", "quality")} onClick={function (e) {
                e.stopPropagation();
                onDelete(attribute);
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                <macro_1.Trans>Delete Step</macro_1.Trans>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </div>)}
    </react_1.HStack>);
}
function DeleteQualityDocumentStep(_a) {
    var _b;
    var attribute = _a.attribute, onCancel = _a.onCancel;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    if (!attribute.id)
        return null;
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteQualityDocumentStep(id, attribute.id)} name={(_b = attribute.name) !== null && _b !== void 0 ? _b : "this attribute"} text={"Are you sure you want to delete the attribute: ".concat(attribute.name, "? This cannot be undone.")} onCancel={onCancel} onSubmit={onCancel}/>);
}
function QualityDocumentStepForm(_a) {
    var _this = this;
    var _b;
    var initialValues = _a.initialValues, isDisabled = _a.isDisabled, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var qualityDocumentId = (0, react_router_1.useParams)().id;
    if (!qualityDocumentId)
        throw new Error("id not found");
    var _c = (0, react_2.useState)(initialValues.type), type = _c[0], setType = _c[1];
    var _d = (0, react_2.useState)(function () {
        var controls = [];
        if (initialValues.type === "Measurement") {
            if (initialValues.minValue !== null) {
                controls.push("min");
            }
            if (initialValues.maxValue !== null) {
                controls.push("max");
            }
        }
        return controls;
    }), numericControls = _d[0], setNumericControls = _d[1];
    // Fix for JSON parsing error - safely parse description or use empty object
    var _e = (0, react_2.useState)(function () {
        try {
            // Handle both string and object cases
            if (typeof initialValues.description === "string") {
                return JSON.parse(initialValues.description || "{}");
            }
            else if (initialValues.description &&
                typeof initialValues.description === "object") {
                return initialValues.description;
            }
            return {};
        }
        catch (e) {
            console.error("Error parsing description:", e);
            return {};
        }
    }), description = _e[0], setDescription = _e[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onClose]);
    var typeOptions = (0, react_2.useMemo)(function () {
        return shared_1.procedureStepType.map(function (type) { return ({
            label: (<react_1.HStack>
            <Icons_1.ProcedureStepTypeIcon type={type} className="mr-2"/>
            {type}
          </react_1.HStack>),
            value: type
        }); });
    }, []);
    var isEditing = !!initialValues.id;
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
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
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.DrawerContent position="left">
        <form_1.ValidatedForm method="post" action={isEditing
            ? path_1.path.to.qualityDocumentStep(qualityDocumentId, initialValues.id)
            : path_1.path.to.newQualityDocumentStep(qualityDocumentId)} defaultValues={initialValues} validator={quality_models_1.qualityDocumentStepValidator} fetcher={fetcher} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{isEditing ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Edit Step"], ["Edit Step"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Add Step"], ["Add Step"])))}</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <form_1.Hidden name="qualityDocumentId"/>
            <form_1.Hidden name="sortOrder"/>
            <form_1.Hidden name="id"/>
            <form_1.Hidden name="description" value={JSON.stringify(description)}/>
            <react_1.VStack spacing={4}>
              <form_1.SelectControlled name="type" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} value={type} onChange={function (option) {
            if (option) {
                setType(option.value);
            }
        }}/>
              <form_1.Input name="name" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Name"], ["Name"])))}/>
              <react_1.VStack spacing={2} className="w-full">
                <react_1.Label>
                  <macro_1.Trans>Description</macro_1.Trans>
                </react_1.Label>
                <Editor_1.Editor initialValue={description} onUpload={onUploadImage} onChange={function (value) {
            setDescription(value);
        }} className="[&_.is-empty]:text-muted-foreground min-h-[120px] p-4 rounded-lg border w-full"/>
              </react_1.VStack>
              {type === "Measurement" && (<>
                  <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

                  <react_1.ToggleGroup type="multiple" value={numericControls} onValueChange={setNumericControls} className="justify-start">
                    <react_1.ToggleGroupItem value="min">
                      <lu_1.LuMinimize2 className="mr-2"/> Minimum
                    </react_1.ToggleGroupItem>
                    <react_1.ToggleGroupItem value="max">
                      <lu_1.LuMaximize2 className="mr-2"/> Maximum
                    </react_1.ToggleGroupItem>
                  </react_1.ToggleGroup>

                  {numericControls.includes("min") && (<form_1.Number name="minValue" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Minimum"], ["Minimum"])))} formatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 10
                }}/>)}
                  {numericControls.includes("max") && (<form_1.Number name="maxValue" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Maximum"], ["Maximum"])))} formatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 10
                }}/>)}
                </>)}
              {type === "List" && (<Form_1.Array name="listValues" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.Submit>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
