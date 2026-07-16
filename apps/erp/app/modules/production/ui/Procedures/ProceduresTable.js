"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var tb_1 = require("react-icons/tb");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Process_1 = require("~/components/Form/Process");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var ProcedureStatus_1 = require("./ProcedureStatus");
// Procedure inline edits go through the shared procedure bulk-update action.
var PROCEDURE_UPDATE = {
    action: path_1.path.to.bulkUpdateProcedure,
    idKey: "ids"
};
var ProceduresTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, tags = _a.tags, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var processes = (0, Process_1.useProcesses)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedProcedure = _c[0], setSelectedProcedure = _c[1];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex flex-col gap-0">
            <components_1.Hyperlink to={path_1.path.to.procedure(row.original.id)}>
              {row.original.name}
            </components_1.Hyperlink>
            <span className="text-sm text-muted-foreground">
              Version {row.original.version}
            </span>
          </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "processId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Process"], ["Process"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = processes.find(function (p) { return p.value === row.original.processId; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : null}/>);
                },
                meta: {
                    icon: <tb_1.TbRoute />,
                    filter: {
                        type: "static",
                        options: processes
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "status",
                    update: PROCEDURE_UPDATE,
                    value: function (r) { return r.status; },
                    options: production_models_1.procedureStatus.map(function (status) { return ({
                        value: status,
                        label: <ProcedureStatus_1.default status={status}/>
                    }); }),
                    renderInline: function (v) { return (<ProcedureStatus_1.default status={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "assignee",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="procedure" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="procedure" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                id: "versions",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Versions"], ["Versions"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    var versions = (_b = row.original) === null || _b === void 0 ? void 0 : _b.versions;
                    return (<react_1.HoverCard>
              <react_1.HoverCardTrigger>
                <react_1.Badge variant="secondary" className="cursor-pointer">
                  {(_c = versions === null || versions === void 0 ? void 0 : versions.length) !== null && _c !== void 0 ? _c : 0} Version
                  {(versions === null || versions === void 0 ? void 0 : versions.length) === 1 ? "" : "s"}
                  <lu_1.LuEllipsisVertical className="w-3 h-3 ml-2"/>
                </react_1.Badge>
              </react_1.HoverCardTrigger>
              <react_1.HoverCardContent>
                <div className="flex flex-col w-full gap-4 text-sm">
                  {(versions !== null && versions !== void 0 ? versions : [])
                            .sort(function (a, b) { return a.version - b.version; })
                            .map(function (version) { return (<div key={version.id} className="flex items-center justify-between gap-2">
                        <components_1.Hyperlink to={path_1.path.to.procedure(version.id)} className="flex items-center justify-start gap-1">
                          Version {version.version}
                        </components_1.Hyperlink>
                        <div className="flex items-center justify-end">
                          <ProcedureStatus_1.default status={version.status}/>
                        </div>
                      </div>); })}
                </div>
              </react_1.HoverCardContent>
            </react_1.HoverCard>);
                },
                meta: {
                    icon: <lu_1.LuGitPullRequest />
                }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [processes, tags, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "production")} onClick={function () {
                navigate("".concat(path_1.path.to.procedure(row.id)));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Procedure
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedProcedure(row);
                });
                deleteDisclosure.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Procedure
          </react_1.MenuItem>
        </>);
    }, [navigate, permissions, deleteDisclosure]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "production") && (<components_1.New label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Procedure"], ["Procedure"])))} to={path_1.path.to.newProcedure}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Procedures"], ["Procedures"])))} table="procedure" withSavedView/>
      {deleteDisclosure.isOpen && selectedProcedure && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteProcedure(selectedProcedure.id)} isOpen onCancel={function () {
                setSelectedProcedure(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedProcedure(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedProcedure.name) !== null && _b !== void 0 ? _b : "procedure"} text="Are you sure you want to delete this procedure?"/>)}
    </>);
});
ProceduresTable.displayName = "ProceduresTable";
exports.default = ProceduresTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
