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
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var resources_models_1 = require("~/modules/resources/resources.models");
var path_1 = require("~/utils/path");
var TrainingStatus_1 = require("./TrainingStatus");
// Training inline edits go through the shared training bulk-update action.
var TRAINING_UPDATE = {
    action: path_1.path.to.bulkUpdateTraining,
    idKey: "ids"
};
var TrainingsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, tags = _a.tags;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedTraining = _c[0], setSelectedTraining = _c[1];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.training(row.original.id)}>
            {row.original.name}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookOpen />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "status",
                    update: TRAINING_UPDATE,
                    value: function (r) { return r.status; },
                    options: resources_models_1.trainingStatus.map(function (v) { return ({
                        value: v,
                        label: <TrainingStatus_1.default status={v}/>
                    }); }),
                    renderInline: function (v) { return (<TrainingStatus_1.default status={v}/>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "Draft", label: <TrainingStatus_1.default status="Draft"/> },
                            { value: "Active", label: <TrainingStatus_1.default status="Active"/> },
                            {
                                value: "Archived",
                                label: <TrainingStatus_1.default status="Archived"/>
                            }
                        ]
                    },
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "type",
                    update: TRAINING_UPDATE,
                    value: function (r) { return r.type; },
                    options: resources_models_1.trainingType.map(function (v) { return ({
                        value: v,
                        label: (<react_1.Badge variant={v === "Mandatory" ? "default" : "secondary"}>
                {v}
              </react_1.Badge>)
                    }); }),
                    renderInline: function (v) { return (<react_1.Badge variant={v === "Mandatory" ? "default" : "secondary"}>
              {v}
            </react_1.Badge>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "Mandatory", label: "Mandatory" },
                            { value: "Optional", label: "Optional" }
                        ]
                    },
                    icon: <lu_1.LuShapes />
                }
            },
            {
                accessorKey: "frequency",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Frequency"], ["Frequency"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "frequency",
                    update: TRAINING_UPDATE,
                    value: function (r) { return r.frequency; },
                    options: resources_models_1.trainingFrequency.map(function (v) { return ({
                        value: v,
                        label: <react_1.Badge variant="secondary">{v}</react_1.Badge>
                    }); }),
                    renderInline: function (v) { return <react_1.Badge variant="secondary">{v}</react_1.Badge>; }
                }),
                meta: {
                    icon: <lu_1.LuRepeat />,
                    filter: {
                        type: "static",
                        options: [
                            { value: "Once", label: "Once" },
                            { value: "Quarterly", label: "Quarterly" },
                            { value: "Annual", label: "Annual" }
                        ]
                    }
                }
            },
            {
                accessorKey: "estimatedDuration",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Duration"], ["Duration"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "estimatedDuration",
                    update: TRAINING_UPDATE,
                    value: function (r) {
                        return r.estimatedDuration != null ? String(r.estimatedDuration) : "";
                    }
                }),
                meta: {
                    icon: <lu_1.LuClock />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="training" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="training" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [tags, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.training(row.id)));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Training</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedTraining(row);
                });
                deleteDisclosure.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Training</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, permissions, deleteDisclosure]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Training"], ["Training"])))} to={path_1.path.to.newTraining}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Training"], ["Training"])))} table="training" withSavedView/>
      {deleteDisclosure.isOpen && selectedTraining && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteTraining(selectedTraining.id)} isOpen onCancel={function () {
                setSelectedTraining(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedTraining(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedTraining.name) !== null && _b !== void 0 ? _b : "training"} text="Are you sure you want to delete this training?"/>)}
    </>);
});
TrainingsTable.displayName = "TrainingsTable";
exports.default = TrainingsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
