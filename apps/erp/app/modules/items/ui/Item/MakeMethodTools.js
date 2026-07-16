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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var utils_1 = require("../Methods/utils");
var ItemForm_1 = require("./ItemForm");
var MakeMethodVersionStatus_1 = require("./MakeMethodVersionStatus");
var MakeMethodTools = function (_a) {
    var _b, _c, _d;
    var itemId = _a.itemId, makeMethods = _a.makeMethods, type = _a.type, currentMethodId = _a.currentMethodId;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var params = (0, react_router_1.useParams)();
    var methodId = params.methodId, makeMethodId = params.makeMethodId;
    var activeMethodId = (_b = currentMethodId !== null && currentMethodId !== void 0 ? currentMethodId : makeMethodId) !== null && _b !== void 0 ? _b : methodId;
    var isGetMethodLoading = fetcher.state !== "idle" && fetcher.formAction === path_1.path.to.makeMethodGet;
    var isSaveMethodLoading = fetcher.state !== "idle" && fetcher.formAction === path_1.path.to.makeMethodSave;
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error);
        }
    }, [(_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.error]);
    var _e = (0, react_2.useState)(true), includeInactive = _e[0], setIncludeInactive = _e[1];
    var configurableItemIds = (0, Form_1.useConfigurableItems)();
    var getMethodModal = (0, react_1.useDisclosure)();
    var saveMethodModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(true), hasMethodParts = _f[0], setHasMethodParts = _f[1];
    var newVersionModal = (0, react_1.useDisclosure)();
    var activeMethodModal = (0, react_1.useDisclosure)();
    var itemLink = type && itemId ? (0, ItemForm_1.getLinkToItemDetails)(type, itemId) : null;
    var activeMethod = (_d = makeMethods.find(function (m) { return m.id === activeMethodId; })) !== null && _d !== void 0 ? _d : makeMethods[0];
    var maxVersion = Math.max.apply(Math, makeMethods.map(function (m) { return m.version; }));
    var _g = (0, react_2.useState)(activeMethod), selectedVersion = _g[0], setSelectedVersion = _g[1];
    // Reset selectedVersion when itemId or activeMethod changes
    (0, react_2.useEffect)(function () {
        setSelectedVersion(activeMethod);
    }, [activeMethod]);
    // State for Get and Save Method modals
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    // State for Get Method modal - source versions
    var _h = (0, react_2.useState)([]), sourceMakeMethods = _h[0], setSourceMakeMethods = _h[1];
    var _j = (0, react_2.useState)(null), selectedSourceMethod = _j[0], setSelectedSourceMethod = _j[1];
    // State for Save Method modal - target versions
    var _k = (0, react_2.useState)([]), targetMakeMethods = _k[0], setTargetMakeMethods = _k[1];
    var _l = (0, react_2.useState)(null), selectedTargetMethod = _l[0], setSelectedTargetMethod = _l[1];
    var getSourceMakeMethods = function (sourceItemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setSourceMakeMethods([]);
                    setSelectedSourceMethod(null);
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("makeMethod")
                            .select("id, version, status")
                            .eq("itemId", sourceItemId)
                            .eq("companyId", companyId)
                            .order("version", { ascending: false })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                    }
                    // For source, we can select any version (Draft, Active, or Archived)
                    setSourceMakeMethods((_b = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                        var id = _a.id, version = _a.version, status = _a.status;
                        return ({
                            label: (<div className="flex items-center gap-2">
            <react_1.Badge variant="outline">V{version}</react_1.Badge>{" "}
            <MakeMethodVersionStatus_1.default status={status}/>
          </div>),
                            value: id
                        });
                    })) !== null && _b !== void 0 ? _b : []);
                    if ((data === null || data === void 0 ? void 0 : data.length) === 1) {
                        setSelectedSourceMethod(data[0].id);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var getTargetMakeMethods = function (targetItemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, availableVersions;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setTargetMakeMethods([]);
                    setSelectedTargetMethod(null);
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("makeMethod")
                            .select("id, version, status")
                            .eq("itemId", targetItemId)
                            .eq("companyId", companyId)
                            .order("version", { ascending: false })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                    }
                    availableVersions = (_b = data === null || data === void 0 ? void 0 : data.filter(function (_a) {
                        var status = _a.status;
                        return status === "Draft";
                    })) !== null && _b !== void 0 ? _b : [];
                    setTargetMakeMethods(availableVersions.map(function (_a) {
                        var id = _a.id, version = _a.version, status = _a.status;
                        return ({
                            label: (<div className="flex items-center gap-2">
            <react_1.Badge variant="outline">V{version}</react_1.Badge>{" "}
            <MakeMethodVersionStatus_1.default status={status}/>
          </div>),
                            value: id
                        });
                    }));
                    if (availableVersions.length === 1) {
                        setSelectedTargetMethod(availableVersions[0].id);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (<react_2.Fragment key={itemId}>
      <react_1.Menubar>
        <react_1.HStack className="w-full justify-between">
          <react_1.HStack spacing={0}>
            <react_1.MenubarItem isLoading={isGetMethodLoading} isDisabled={!permissions.can("update", "parts") ||
            isGetMethodLoading ||
            activeMethod.status !== "Draft" // Can only overwrite Draft versions
        } leftIcon={<lu_1.LuGitBranch />} onClick={getMethodModal.onOpen}>
              <macro_1.Trans>Get Method</macro_1.Trans>
            </react_1.MenubarItem>
            <react_1.MenubarItem isDisabled={!permissions.can("update", "parts") || isSaveMethodLoading} isLoading={isSaveMethodLoading} leftIcon={<lu_1.LuGitMerge />} onClick={saveMethodModal.onOpen}>
              <macro_1.Trans>Save Method</macro_1.Trans>
            </react_1.MenubarItem>
            {itemLink && (<react_1.MenubarItem leftIcon={<lu_1.LuGitFork />} asChild>
                <react_router_1.Link prefetch="intent" to={itemLink}>
                  <macro_1.Trans>Item Master</macro_1.Trans>
                </react_router_1.Link>
              </react_1.MenubarItem>)}
          </react_1.HStack>

          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.Button variant="ghost" rightIcon={<lu_1.LuChevronDown />}>
                <div className="flex items-center gap-2">
                  <react_1.Badge variant="outline">V{activeMethod.version}</react_1.Badge>
                  <MakeMethodVersionStatus_1.default status={activeMethod.status}/>
                </div>
              </react_1.Button>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent align="end">
              {makeMethods && makeMethods.length > 0 && (<>
                  {makeMethods
                .sort(function (a, b) { return b.version - a.version; })
                .map(function (makeMethod) {
                var isCurrent = makeMethod.id === activeMethodId;
                return (<react_1.DropdownMenuSub key={makeMethod.id}>
                          <react_1.DropdownMenuSubTrigger>
                            <react_router_1.Link to={(0, utils_1.getPathToMakeMethod)(type, itemId, makeMethod.id)} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <lu_1.LuCheck className={(0, react_1.cn)(!isCurrent && "opacity-0")}/>
                                <span>Version {makeMethod.version}</span>
                              </div>
                              <MakeMethodVersionStatus_1.default status={makeMethod.status} isActive={makeMethod.status === "Active" ||
                        makeMethods.length === 1}/>
                            </react_router_1.Link>
                          </react_1.DropdownMenuSubTrigger>
                          <react_1.DropdownMenuPortal>
                            <react_1.DropdownMenuSubContent>
                              <react_1.DropdownMenuItem onClick={function () {
                        (0, react_dom_1.flushSync)(function () {
                            setSelectedVersion(makeMethod);
                        });
                        newVersionModal.onOpen();
                    }}>
                                <react_1.DropdownMenuIcon icon={<lu_1.LuCopy />}/>
                                Copy Version
                              </react_1.DropdownMenuItem>

                              {/* <DropdownMenuItem
                      destructive
                      disabled={
                        makeMethod.status === "Active" ||
                        !permissions.can("delete", "parts")
                      }
                    >
                      <DropdownMenuIcon icon={<LuTrash />} />
                      Delete Version
                    </DropdownMenuItem> */}
                              <react_1.DropdownMenuSeparator />
                              <react_1.DropdownMenuItem disabled={makeMethod.status === "Active"} onClick={function () {
                        (0, react_dom_1.flushSync)(function () {
                            setSelectedVersion(makeMethod);
                        });
                        activeMethodModal.onOpen();
                    }}>
                                <react_1.DropdownMenuIcon icon={<lu_1.LuStar />}/>
                                Set as Active Version
                              </react_1.DropdownMenuItem>
                            </react_1.DropdownMenuSubContent>
                          </react_1.DropdownMenuPortal>
                        </react_1.DropdownMenuSub>);
            })}
                  <react_1.DropdownMenuSeparator />
                  {permissions.can("create", "production") && (<react_1.DropdownMenuItem onClick={newVersionModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                      New Version
                    </react_1.DropdownMenuItem>)}
                </>)}
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </react_1.HStack>
      </react_1.Menubar>

      {getMethodModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    getMethodModal.onClose();
                    setSourceMakeMethods([]);
                    setSelectedSourceMethod(null);
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" fetcher={fetcher} action={path_1.path.to.makeMethodGet} validator={items_models_1.getMethodValidator} onSuccess={getMethodModal.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>Get Method</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Overwrite the current version with the source method
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <Form_1.Hidden name="targetId" value={activeMethodId}/>
                <react_1.VStack spacing={4}>
                  <react_1.Alert variant="destructive" className="mt-4">
                    <lu_1.LuTriangleAlert className="h-4 w-4"/>
                    <react_1.AlertTitle>
                      This will overwrite version {activeMethod.version} of this
                      manufacturing method
                    </react_1.AlertTitle>
                  </react_1.Alert>
                  <Form_1.Item name="itemId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Source Item"], ["Source Item"])))} type={type} blacklist={__spreadArray([itemId], configurableItemIds, true)} includeInactive={includeInactive} replenishmentSystem="Make" onChange={function (value) {
                if (value) {
                    getSourceMakeMethods(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setSourceMakeMethods([]);
                    setSelectedSourceMethod(null);
                }
            }}/>
                  <form_1.SelectControlled name="sourceId" options={sourceMakeMethods} label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Source Version"], ["Source Version"])))} value={selectedSourceMethod !== null && selectedSourceMethod !== void 0 ? selectedSourceMethod : undefined} onChange={function (value) {
                if (value) {
                    setSelectedSourceMethod(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setSelectedSourceMethod(null);
                }
            }} placeholder={sourceMakeMethods.length === 0
                ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Select an item first"], ["Select an item first"]))) : undefined}/>
                  <div className="flex items-center space-x-2">
                    <react_1.Checkbox id="include-inactive" checked={includeInactive} onCheckedChange={function (checked) {
                return setIncludeInactive(!!checked);
            }}/>
                    <label htmlFor="include-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Include Inactive
                    </label>
                  </div>

                  <AdvancedSection onChange={setHasMethodParts}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={getMethodModal.onClose} variant="secondary">
                  Cancel
                </react_1.Button>
                <form_1.Submit isDisabled={!hasMethodParts || !selectedSourceMethod} variant="destructive">
                  Confirm
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {saveMethodModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    saveMethodModal.onClose();
                    setTargetMakeMethods([]);
                    setSelectedTargetMethod(null);
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" fetcher={fetcher} action={path_1.path.to.makeMethodSave} validator={items_models_1.getMethodValidator} onSuccess={saveMethodModal.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>Save Method</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Save version {activeMethod.version} to another item's method
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <Form_1.Hidden name="sourceId" value={activeMethodId}/>
                <react_1.VStack spacing={4}>
                  <Form_1.Item name="itemId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Target Item"], ["Target Item"])))} type={type} includeInactive={includeInactive} blacklist={__spreadArray([itemId], configurableItemIds, true)} replenishmentSystem="Make" onChange={function (value) {
                if (value) {
                    getTargetMakeMethods(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setTargetMakeMethods([]);
                    setSelectedTargetMethod(null);
                }
            }}/>
                  <form_1.SelectControlled name="targetId" options={targetMakeMethods} label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Target Version"], ["Target Version"])))} value={selectedTargetMethod !== null && selectedTargetMethod !== void 0 ? selectedTargetMethod : undefined} onChange={function (value) {
                if (value) {
                    setSelectedTargetMethod(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setSelectedTargetMethod(null);
                }
            }} placeholder={targetMakeMethods.length === 0
                ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No draft versions available"], ["No draft versions available"]))) : undefined}/>
                  <div className="flex items-center space-x-2">
                    <react_1.Checkbox id="include-inactive" checked={includeInactive} onCheckedChange={function (checked) {
                return setIncludeInactive(!!checked);
            }}/>
                    <label htmlFor="include-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Include Inactive
                    </label>
                  </div>
                  <AdvancedSection onChange={setHasMethodParts}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={saveMethodModal.onClose} variant="secondary">
                  Cancel
                </react_1.Button>
                <form_1.Submit isDisabled={!hasMethodParts || !selectedTargetMethod}>
                  <macro_1.Trans>Confirm</macro_1.Trans>
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {newVersionModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    newVersionModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" fetcher={fetcher} action={"".concat(path_1.path.to.newMakeMethodVersion, "?methodToReplace=").concat(activeMethodId)} validator={items_models_1.makeMethodVersionValidator} defaultValues={{
                copyFromId: selectedVersion.id,
                activeVersionId: makeMethods.length === 1 ? selectedVersion.id : undefined,
                version: maxVersion + 1
            }} onSuccess={newVersionModal.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>New Version</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Create a new version of the manufacturing method
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <Form_1.Hidden name="copyFromId"/>
                <Form_1.Hidden name="activeVersionId"/>
                <react_1.VStack spacing={4}>
                  {makeMethods.length == 1 && (<react_1.Alert variant="warning">
                      <lu_1.LuTriangleAlert className="h-4 w-4"/>
                      <react_1.AlertTitle>
                        This will set the current version of the make method to{" "}
                        <MakeMethodVersionStatus_1.default status="Active"/> making it
                        read-only.
                      </react_1.AlertTitle>
                    </react_1.Alert>)}
                  <form_1.Number name="version" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["New Version"], ["New Version"])))} helperText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["The new version number of the method"], ["The new version number of the method"])))} minValue={maxVersion + 1} maxValue={100000} step={1}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={newVersionModal.onClose} variant="secondary">
                  Cancel
                </react_1.Button>
                <form_1.Submit>
                  <macro_1.Trans>Create Version</macro_1.Trans>
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {activeMethodModal.isOpen && (<Modals_1.Confirm action={"".concat(path_1.path.to.activeMethodVersion(selectedVersion.id), "?methodToReplace=").concat(activeMethodId)} confirmText={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Make Active"], ["Make Active"])))} title={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Set Version ", " as Active Version?"], ["Set Version ", " as Active Version?"])), selectedVersion.version)} text={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["This will make this version read-only and replace any material make methods with this version."], ["This will make this version read-only and replace any material make methods with this version."])))} isOpen onSubmit={function () {
                activeMethodModal.onClose();
                setSelectedVersion(activeMethod);
            }} onCancel={activeMethodModal.onClose}/>)}
    </react_2.Fragment>);
};
function AdvancedSection(_a) {
    var onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_2.useState)(true), billOfMaterial = _c[0], setBillOfMaterial = _c[1];
    var _d = (0, react_2.useState)(true), billOfProcess = _d[0], setBillOfProcess = _d[1];
    var _e = (0, react_2.useState)(true), parameters = _e[0], setParameters = _e[1];
    var _f = (0, react_2.useState)(true), tools = _f[0], setTools = _f[1];
    var _g = (0, react_2.useState)(true), steps = _g[0], setSteps = _g[1];
    var _h = (0, react_2.useState)(true), workInstructions = _h[0], setWorkInstructions = _h[1];
    var hasSelection = billOfMaterial ||
        (billOfProcess && (parameters || tools || steps || workInstructions));
    (0, react_2.useEffect)(function () {
        onChange === null || onChange === void 0 ? void 0 : onChange(hasSelection);
    }, [hasSelection, onChange]);
    var processChildren = [
        {
            name: "parameters",
            label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Parameters"], ["Parameters"]))),
            checked: parameters,
            onChange: setParameters
        },
        { name: "tools", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Tools"], ["Tools"]))), checked: tools, onChange: setTools },
        { name: "steps", label: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Steps"], ["Steps"]))), checked: steps, onChange: setSteps },
        {
            name: "workInstructions",
            label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Work Instructions"], ["Work Instructions"]))),
            checked: workInstructions,
            onChange: setWorkInstructions
        }
    ];
    return (<react_1.Collapsible className="w-full" open={open} onOpenChange={setOpen}>
      <react_1.CollapsibleTrigger asChild>
        <react_1.Button variant="ghost" className="w-full justify-start gap-2 px-0">
          <lu_1.LuChevronRight className={(0, react_1.cn)("h-4 w-4 transition-transform", open && "rotate-90")}/>
          Advanced
        </react_1.Button>
      </react_1.CollapsibleTrigger>
      <react_1.CollapsibleContent forceMount className={(0, react_1.cn)(!open && "hidden")}>
        <react_1.VStack spacing={2} className="pt-2">
          <div className="flex items-center space-x-2">
            <react_1.Checkbox id="billOfMaterial" name="billOfMaterial" checked={billOfMaterial} onCheckedChange={function (checked) { return setBillOfMaterial(!!checked); }}/>
            <label htmlFor="billOfMaterial" className="text-sm font-medium leading-none">
              Bill of Material
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <react_1.Checkbox id="billOfProcess" name="billOfProcess" checked={billOfProcess} onCheckedChange={function (checked) { return setBillOfProcess(!!checked); }}/>
            <label htmlFor="billOfProcess" className="text-sm font-medium leading-none">
              <macro_1.Trans>Bill of Process</macro_1.Trans>
            </label>
          </div>
          <react_1.VStack spacing={2} className="pl-6">
            {processChildren.map(function (_a) {
            var name = _a.name, label = _a.label, checked = _a.checked, onChange = _a.onChange;
            return (<div key={name} className="flex items-center space-x-2">
                <react_1.Checkbox id={name} name={name} disabled={!billOfProcess} checked={billOfProcess ? checked : false} onCheckedChange={function (val) { return onChange(!!val); }}/>
                <label htmlFor={name} className={(0, react_1.cn)("text-sm font-medium leading-none", !billOfProcess && "text-muted-foreground")}>
                  {label}
                </label>
              </div>);
        })}
          </react_1.VStack>
        </react_1.VStack>
      </react_1.CollapsibleContent>
    </react_1.Collapsible>);
}
exports.default = MakeMethodTools;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
