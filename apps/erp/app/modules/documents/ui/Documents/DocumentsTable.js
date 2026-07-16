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
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var documents_models_1 = require("../../documents.models");
var DocumentCreateForm_1 = require("./DocumentCreateForm");
var useDocument_1 = require("./useDocument");
var DocumentsTable = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var data = _a.data, count = _a.count, labels = _a.labels, extensions = _a.extensions;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var filter = params.get("q");
    // put rows in state for use with optimistic ui updates
    var _d = (0, react_2.useState)(data), rows = _d[0], setRows = _d[1];
    // we have to do this useEffect silliness since we're putitng rows
    // in state for optimistic ui updates
    (0, react_2.useEffect)(function () {
        setRows(data);
    }, [data]);
    var _e = (0, useDocument_1.useDocument)(), canUpdate = _e.canUpdate, canDelete = _e.canDelete, deleteLabel = _e.deleteLabel, download = _e.download, edit = _e.edit, view = _e.view, favorite = _e.favorite, label = _e.label, setLabel = _e.setLabel;
    var people = (0, stores_1.usePeople)()[0];
    var moveDocumentModal = (0, react_1.useDisclosure)();
    var deleteDocumentModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(null), selectedDocument = _f[0], setSelectedDocument = _f[1];
    var labelOptions = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = labels.map(function (_a) {
            var label = _a.label;
            return ({
                value: label,
                label: label
            });
        })) !== null && _a !== void 0 ? _a : [];
    }, [labels]);
    var onDeleteLabel = (0, react_2.useCallback)(function (e, row, label) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    // optimistically update the UI and then make the mutation
                    setRows(function (prev) {
                        var _a, _b;
                        var index = prev.findIndex(function (item) { return item.id === row.id; });
                        var updated = __spreadArray([], prev, true);
                        var labelIndex = (_a = updated[index].labels) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return item === label; });
                        if (labelIndex) {
                            (_b = updated[index].labels) === null || _b === void 0 ? void 0 : _b.splice(labelIndex, 1);
                        }
                        return updated;
                    });
                    // mutate the database
                    return [4 /*yield*/, deleteLabel(row, label)];
                case 1:
                    // mutate the database
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [deleteLabel]);
    var onLabel = (0, react_2.useCallback)(function (row, labels) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // optimistically update the UI and then make the mutation
                    setRows(function (prev) {
                        var index = prev.findIndex(function (item) { return item.id === row.id; });
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, updated[index]), { labels: labels.sort() });
                        return updated;
                    });
                    // mutate the database
                    return [4 /*yield*/, label(row, labels)];
                case 1:
                    // mutate the database
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [label]);
    // TODO: rows shouldn't be in state -- we should use optimistic updates like purchase order favorites
    var onFavorite = (0, react_2.useCallback)(function (row) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // optimistically update the UI and then make the mutation
                    setRows(function (prev) {
                        var index = prev.findIndex(function (item) { return item.id === row.id; });
                        var updated = __spreadArray([], prev, true);
                        updated[index] = __assign(__assign({}, updated[index]), { favorite: !updated[index].favorite });
                        return filter === "starred"
                            ? updated.filter(function (item) { return item.favorite === true; })
                            : updated;
                    });
                    // mutate the database
                    return [4 /*yield*/, favorite(row)];
                case 1:
                    // mutate the database
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [favorite, filter]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
              {row.original.favorite ? (<lu_1.LuPin className="cursor-pointer w-4 h-4 outline-foreground fill-foreground flex-shrink-0" onClick={function () { return onFavorite(row.original); }}/>) : (<lu_1.LuPin className="cursor-pointer w-4 h-4 text-muted-foreground flex-shrink-0" onClick={function () { return onFavorite(row.original); }}/>)}
              <DocumentIcon_1.default className="flex-shrink-0" type={row.original.type}/>
              <components_1.Hyperlink onClick={function () { return view(row.original); }} className="max-w-[260px] truncate">
                <>{row.original.name}</>
              </components_1.Hyperlink>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "sourceDocument",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Source Document"], ["Source Document"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.sourceDocument &&
                        row.original.sourceDocumentId && (<react_router_1.Link to={getDocumentLocation(row.original
                            .sourceDocument, row.original.sourceDocumentId)} prefetch="intent" className="group flex items-center gap-1">
                <Enumerable_1.Enumerable value={row.original.sourceDocument}/>{" "}
                <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-4 h-4 text-foreground">
                  <lu_1.LuExternalLink />
                </span>
              </react_router_1.Link>);
                },
                meta: {
                    icon: <lu_1.LuFileText />,
                    filter: {
                        type: "static",
                        options: documents_models_1.documentSourceTypes === null || documents_models_1.documentSourceTypes === void 0 ? void 0 : documents_models_1.documentSourceTypes.map(function (type) { return ({
                            value: type,
                            label: <Enumerable_1.Enumerable value={type}/>
                        }); })
                    }
                }
            },
            {
                id: "labels",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Labels"], ["Labels"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<react_1.HStack spacing={1}>
              {(_b = row.original.labels) === null || _b === void 0 ? void 0 : _b.map(function (label) { return (<react_1.Badge key={label} variant="secondary" className="cursor-pointer" onClick={function () { return setLabel(label); }}>
                  {label}
                  <react_1.BadgeCloseButton onClick={function (e) { return onDeleteLabel(e, row.original, label); }}/>
                </react_1.Badge>); })}
              <react_1.Popover>
                <react_1.PopoverTrigger>
                  <react_1.Badge variant="secondary" className="cursor-pointer px-1">
                    <io_1.IoMdAdd />
                  </react_1.Badge>
                </react_1.PopoverTrigger>
                <react_1.PopoverContent className="w-[300px] p-0">
                  {/* TODO: we should have a CreateableMultiSelect component for this */}

                  <CreatableCommand options={labelOptions} selected={(_c = row.original.labels) !== null && _c !== void 0 ? _c : []} onChange={function (newValue) {
                            var _a;
                            return onLabel(row.original, __spreadArray(__spreadArray([], ((_a = row.original.labels) !== null && _a !== void 0 ? _a : []), true), [
                                newValue
                            ], false));
                        }} onCreateOption={function (newValue) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, onLabel(row.original, __spreadArray(__spreadArray([], ((_a = row.original.labels) !== null && _a !== void 0 ? _a : []), true), [
                                            newValue
                                        ], false))];
                                    case 1:
                                        _b.sent();
                                        revalidator.revalidate();
                                        return [2 /*return*/];
                                }
                            });
                        }); }}/>
                </react_1.PopoverContent>
              </react_1.Popover>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuTag />,
                    filter: {
                        type: "static",
                        options: labelOptions,
                        isArray: true
                    }
                }
            },
            {
                accessorKey: "size",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Size"], ["Size"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (0, utils_1.convertKbToString)((_b = row.original.size) !== null && _b !== void 0 ? _b : 0);
                },
                meta: {
                    icon: <lu_1.LuRuler />
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuFileText />,
                    filter: {
                        type: "static",
                        options: shared_1.documentTypes.map(function (type) { return ({
                            label: (<react_1.HStack spacing={2}>
                    <DocumentIcon_1.default type={type}/>
                    <span>{type}</span>
                  </react_1.HStack>),
                            value: type
                        }); })
                    }
                }
            },
            {
                accessorKey: "extension",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["File Extension"], ["File Extension"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuFileText />,
                    filter: {
                        type: "static",
                        options: (0, utils_1.filterEmpty)(extensions).map(function (extension) { return ({
                            label: extension,
                            value: extension
                        }); })
                    }
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    icon: <lu_1.LuUsers />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            }
        ];
        // Don't put the revalidator in the deps array
    }, [
        extensions,
        labelOptions,
        onDeleteLabel,
        onFavorite,
        onLabel,
        people,
        setLabel,
        view
    ]);
    var defaultColumnVisibility = {
        type: false,
        extension: false,
        createdAt: false,
        updatedAt: false,
        updatedBy: false,
        description: false
    };
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
          <react_1.MenuItem disabled={canUpdate(row)} onClick={function () { return edit(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem onClick={function () { return download(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuDownload />}/>
            <macro_1.Trans>Download</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem onClick={function () {
                onFavorite(row);
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPin />}/>
            <macro_1.Trans>Favorite</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={canDelete(row)} onClick={function () {
                setSelectedDocument(row);
                moveDocumentModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            {filter !== "trash" ? (<macro_1.Trans>Move to Trash</macro_1.Trans>) : (<macro_1.Trans>Restore from Trash</macro_1.Trans>)}
          </react_1.MenuItem>
          <react_1.MenuItem disabled={canDelete(row)} destructive onClick={function () {
                setSelectedDocument(row);
                deleteDocumentModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuCircleX />}/>
            <macro_1.Trans>Permanently Delete</macro_1.Trans>
          </react_1.MenuItem>
        </>); };
    }, [
        canUpdate,
        canDelete,
        filter,
        edit,
        download,
        onFavorite,
        moveDocumentModal,
        deleteDocumentModal
    ]);
    return (<>
        <components_1.Table count={count} columns={columns} data={rows} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "documents") && <DocumentCreateForm_1.default />} renderContextMenu={renderContextMenu} title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Documents"], ["Documents"])))}/>

        {selectedDocument && selectedDocument.id && (<>
            {moveDocumentModal.isOpen && filter !== "trash" && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteDocument(selectedDocument.id)} isOpen name={(_b = selectedDocument.name) !== null && _b !== void 0 ? _b : ""} text={"Are you sure you want to move ".concat(selectedDocument.name, " to the trash?")} onCancel={function () {
                    moveDocumentModal.onClose();
                    setSelectedDocument(null);
                }} onSubmit={function () {
                    moveDocumentModal.onClose();
                    setSelectedDocument(null);
                }}/>)}

            {moveDocumentModal.isOpen && filter === "trash" && (<Modals_1.Confirm action={path_1.path.to.documentRestore(selectedDocument.id)} isOpen title={"Restore ".concat(selectedDocument.name)} text={"Are you sure you want to restore ".concat(selectedDocument.name, " from the trash?")} confirmText="Restore" onCancel={function () {
                    moveDocumentModal.onClose();
                    setSelectedDocument(null);
                }} onSubmit={function () {
                    moveDocumentModal.onClose();
                    setSelectedDocument(null);
                }}/>)}

            {deleteDocumentModal.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteDocumentPermanently(selectedDocument.id)} isOpen name={(_c = selectedDocument.name) !== null && _c !== void 0 ? _c : ""} text={"Are you sure you want to delete ".concat(selectedDocument.name, " permanently? This cannot be undone.")} onCancel={function () {
                    deleteDocumentModal.onClose();
                    setSelectedDocument(null);
                }} onSubmit={function () {
                    deleteDocumentModal.onClose();
                    setSelectedDocument(null);
                }}/>)}
          </>)}
      </>);
});
var CreatableCommand = function (_a) {
    var options = _a.options, selected = _a.selected, onChange = _a.onChange, onCreateOption = _a.onCreateOption;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(""), search = _b[0], setSearch = _b[1];
    var isExactMatch = options.some(function (option) { return option.value.toLowerCase() === search.toLowerCase(); });
    return (<react_1.Command>
      <react_1.CommandInput value={search} onValueChange={setSearch} placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
      <react_1.CommandGroup>
        {options.map(function (option) {
            var isSelected = !!(selected === null || selected === void 0 ? void 0 : selected.includes(option.value));
            return (<react_1.CommandItem value={option.label} key={option.value} onSelect={function () {
                    if (!isSelected)
                        onChange(option.value);
                }}>
              {option.label}
              <rx_1.RxCheck className={(0, react_1.cn)("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}/>
            </react_1.CommandItem>);
        })}
        {!isExactMatch && !!search && (<react_1.CommandItem onSelect={function () {
                onCreateOption(search);
            }} value={search}>
            <span>
              <macro_1.Trans>Create</macro_1.Trans>
            </span>
            <span className="ml-1 font-bold">{search}</span>
          </react_1.CommandItem>)}
      </react_1.CommandGroup>
    </react_1.Command>);
};
DocumentsTable.displayName = "DocumentsTable";
exports.default = DocumentsTable;
function getDocumentLocation(sourceDocument, sourceDocumentId) {
    switch (sourceDocument) {
        case "Part":
            return path_1.path.to.part(sourceDocumentId);
        case "Material":
            return path_1.path.to.material(sourceDocumentId);
        case "Tool":
            return path_1.path.to.tool(sourceDocumentId);
        case "Consumable":
            return path_1.path.to.consumable(sourceDocumentId);
        case "Gauge Calibration Record":
            return path_1.path.to.gaugeCalibrationRecord(sourceDocumentId);
        case "Job":
            return path_1.path.to.job(sourceDocumentId);
        // case "Service":
        //   return path.to.service(sourceDocumentId);
        case "Purchase Order":
            return path_1.path.to.purchaseOrder(sourceDocumentId);
        case "Purchasing Request for Quote":
            return path_1.path.to.purchasingRfqDetails(sourceDocumentId);
        case "Purchase Invoice":
            return path_1.path.to.purchaseInvoice(sourceDocumentId);
        case "Quote":
            return path_1.path.to.quote(sourceDocumentId);
        case "Request for Quote":
            return path_1.path.to.salesRfq(sourceDocumentId);
        case "Sales Order":
            return path_1.path.to.salesOrder(sourceDocumentId);
        case "Sales Invoice":
            return path_1.path.to.salesInvoice(sourceDocumentId);
        case "Supplier Quote":
            return path_1.path.to.supplierQuote(sourceDocumentId);
        default:
            return "#";
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
