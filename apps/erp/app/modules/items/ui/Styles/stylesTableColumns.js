"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STYLE_ITEM_UPDATE = void 0;
exports.buildDefaultStylesTableColumns = buildDefaultStylesTableColumns;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var tb_1 = require("react-icons/tb");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var InlineEditor_1 = require("~/components/InlineEditor");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var stylesTableConfig_1 = require("./stylesTableConfig");
exports.STYLE_ITEM_UPDATE = {
    action: path_1.path.to.bulkUpdateItems,
    idKey: "items"
};
function buildDefaultStylesTableColumns(_a) {
    var people = _a.people, tags = _a.tags, itemPostingGroups = _a.itemPostingGroups, templateOptions = _a.templateOptions, formatDate = _a.formatDate, translateReplenishment = _a.translateReplenishment, translateMethodType = _a.translateMethodType, translateTrackingType = _a.translateTrackingType;
    var itemPostingGroupOptions = itemPostingGroups.map(function (group) { return ({
        value: group.id,
        label: group.name
    }); });
    var columns = [
        {
            accessorKey: "id",
            header: "Style ID",
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack className="py-1 w-full min-w-0 max-w-[200px]" spacing={2}>
          <components_1.ItemThumbnail size="md" thumbnailPath={row.original.thumbnailPath} type="Style"/>
          <components_1.Hyperlink to={path_1.path.to.style(row.original.id)} className="min-w-0">
            <react_1.VStack spacing={0} className="min-w-0">
              <span className="w-full truncate">
                {row.original.readableIdWithRevision}
              </span>
              <div className="w-full truncate text-muted-foreground text-xs">
                {row.original.name}
              </div>
            </react_1.VStack>
          </components_1.Hyperlink>
        </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuBookMarked />
            }
        },
        {
            accessorKey: "templateName",
            header: "Template",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "picker",
                field: "templateId",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.templateId; },
                clearable: true,
                options: templateOptions,
                fallbackLabel: function (r) { return r.templateName; }
            }),
            meta: {
                icon: <lu_1.LuLayoutTemplate />
            }
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: function (item) { return (<div className="max-w-[320px] truncate">{item.getValue()}</div>); },
            meta: {
                icon: <lu_1.LuAlignJustify />
            }
        },
        {
            accessorKey: "replenishmentSystem",
            header: "Replenishment",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "enum",
                field: "replenishmentSystem",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.replenishmentSystem; },
                options: items_models_1.itemReplenishmentSystems.map(function (v) { return ({
                    value: v,
                    label: (<span className="flex items-center gap-2">
              <Icons_1.ReplenishmentSystemIcon type={v}/>
              {translateReplenishment(v)}
            </span>)
                }); }),
                renderInline: function (v) { return (<react_1.Badge variant="secondary">
            <Icons_1.ReplenishmentSystemIcon type={v} className="mr-2"/>
            <span>{translateReplenishment(v)}</span>
          </react_1.Badge>); }
            }),
            meta: {
                filter: {
                    type: "static",
                    options: items_models_1.itemReplenishmentSystems.map(function (type) { return ({
                        value: type,
                        label: (<react_1.Badge variant="secondary">
                <Icons_1.ReplenishmentSystemIcon type={type} className="mr-2"/>
                <span>{translateReplenishment(type)}</span>
              </react_1.Badge>)
                    }); })
                },
                icon: <lu_1.LuLoaderCircle />
            }
        },
        {
            accessorKey: "defaultMethodType",
            header: "Default Method",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "enum",
                field: "defaultMethodType",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.defaultMethodType; },
                options: function (row) {
                    return shared_1.methodType
                        .filter(function (type) {
                        var replenishment = row.replenishmentSystem;
                        if (replenishment === "Buy")
                            return type !== "Make to Order";
                        if (replenishment === "Make")
                            return type !== "Purchase to Order";
                        return true;
                    })
                        .map(function (type) { return ({
                        value: type,
                        label: (<span className="flex items-center gap-2">
                  <components_1.MethodIcon type={type}/>
                  {translateMethodType(type)}
                </span>)
                    }); });
                },
                renderInline: function (v) { return (<react_1.Badge variant="secondary">
            <components_1.MethodIcon type={v} className="mr-2"/>
            <span>{translateMethodType(v)}</span>
          </react_1.Badge>); }
            }),
            meta: {
                filter: {
                    type: "static",
                    options: shared_1.methodType.map(function (value) { return ({
                        value: value,
                        label: (<react_1.Badge variant="secondary">
                <components_1.MethodIcon type={value} className="mr-2"/>
                <span>{translateMethodType(value)}</span>
              </react_1.Badge>)
                    }); })
                },
                icon: <rx_1.RxCodesandboxLogo />
            }
        },
        {
            accessorKey: "itemTrackingType",
            header: "Tracking",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "enum",
                field: "itemTrackingType",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.itemTrackingType; },
                options: items_models_1.itemTrackingTypes.map(function (v) { return ({
                    value: v,
                    label: (<span className="flex items-center gap-2">
              <components_1.TrackingTypeIcon type={v}/>
              {translateTrackingType(v)}
            </span>)
                }); }),
                renderInline: function (v) { return (<react_1.Badge variant="secondary">
            <components_1.TrackingTypeIcon type={v} className="mr-2"/>
            <span>{translateTrackingType(v)}</span>
          </react_1.Badge>); }
            }),
            meta: {
                filter: {
                    type: "static",
                    options: items_models_1.itemTrackingTypes.map(function (type) { return ({
                        value: type,
                        label: (<react_1.Badge variant="secondary">
                <components_1.TrackingTypeIcon type={type} className="mr-2"/>
                <span>{translateTrackingType(type)}</span>
              </react_1.Badge>)
                    }); })
                },
                icon: <tb_1.TbTargetArrow />
            }
        },
        {
            accessorKey: "itemPostingGroupId",
            header: "Item Group",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "enum",
                field: "itemPostingGroupId",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.itemPostingGroupId; },
                clearable: true,
                options: itemPostingGroupOptions
            }),
            meta: {
                filter: {
                    type: "static",
                    options: itemPostingGroupOptions.map(function (group) { return ({
                        value: group.value,
                        label: <react_1.Badge variant="secondary">{group.label}</react_1.Badge>
                    }); })
                },
                icon: <lu_1.LuGroup />
            }
        },
        {
            accessorKey: "colors",
            header: "Color",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var colors = ((_b = row.original.colors) !== null && _b !== void 0 ? _b : []);
                if (!Array.isArray(colors) || colors.length === 0)
                    return null;
                return (<react_1.HStack spacing={1} className="flex-wrap">
            {colors.map(function (color) { return (<react_1.Badge key={color.id} variant="outline" title={color.colorCode}>
                {color.colorName || color.colorCode}
              </react_1.Badge>); })}
          </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuPalette />
            }
        },
        {
            accessorKey: "sizes",
            header: "Size",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var sizes = ((_b = row.original.sizes) !== null && _b !== void 0 ? _b : []);
                if (!Array.isArray(sizes) || sizes.length === 0)
                    return null;
                return (<react_1.HStack spacing={1} className="flex-wrap">
            {sizes.map(function (size) { return (<react_1.Badge key={size.id} variant="outline" className="font-mono" title={size.sizeName}>
                {size.sizeCode}
              </react_1.Badge>); })}
          </react_1.HStack>);
            },
            meta: {
                icon: <lu_1.LuRuler />
            }
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: function (_a) {
                var row = _a.row;
                return (<InlineEditor_1.TagsCell row={row.original} table="style" availableTags={tags}/>);
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
        },
        {
            accessorKey: "active",
            header: "Active",
            cell: (0, InlineEditor_1.editableCell)({
                kind: "boolean",
                field: "active",
                update: exports.STYLE_ITEM_UPDATE,
                value: function (r) { return r.active; }
            }),
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { value: "true", label: "Active" },
                        { value: "false", label: "Inactive" }
                    ]
                },
                pluralHeader: "Active Statuses",
                icon: <lu_1.LuCheck />
            }
        },
        {
            id: "createdBy",
            header: "Created By",
            cell: function (_a) {
                var row = _a.row;
                return <components_1.EmployeeAvatar employeeId={row.original.createdBy}/>;
            },
            meta: {
                filter: {
                    type: "static",
                    options: people.map(function (employee) { return ({
                        value: employee.id,
                        label: employee.name
                    }); })
                },
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: function (item) { return formatDate(item.getValue()); },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        },
        {
            id: "updatedBy",
            header: "Updated By",
            cell: function (_a) {
                var row = _a.row;
                return <components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>;
            },
            meta: {
                filter: {
                    type: "static",
                    options: people.map(function (employee) { return ({
                        value: employee.id,
                        label: employee.name
                    }); })
                },
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: function (item) { return formatDate(item.getValue()); },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        }
    ];
    if (columns.length < stylesTableConfig_1.defaultStylesTableSharedColumnKeys.length) {
        throw new Error("Styles table columns are incomplete");
    }
    return columns;
}
