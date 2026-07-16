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
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var stylesTableColumns_1 = require("./stylesTableColumns");
var StylesTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, tags = _a.tags, count = _a.count, itemPostingGroups = _a.itemPostingGroups;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var deleteItemModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedItem = _c[0], setSelectedItem = _c[1];
    var people = (0, stores_1.usePeople)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("style");
    var translateReplenishment = (0, react_2.useCallback)(function (v) {
        return v === "Buy" ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Buy"], ["Buy"]))) : v === "Make" ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])));
    }, [t]);
    var translateMethodType = (0, react_2.useCallback)(function (v) {
        return v === "Purchase to Order"
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Purchase to Order"], ["Purchase to Order"]))) : v === "Pull from Inventory"
            ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Pull from Inventory"], ["Pull from Inventory"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Make to Order"], ["Make to Order"])));
    }, [t]);
    var translateTrackingType = (0, react_2.useCallback)(function (v) {
        return v === "Inventory"
            ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Batch"], ["Batch"])));
    }, [t]);
    var templateFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        templateFetcher.load(path_1.path.to.api.templates);
    });
    var templateOptions = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = templateFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (template) {
            var _a;
            return ({
                value: template.id,
                label: template.name,
                helper: (_a = template.description) !== null && _a !== void 0 ? _a : ""
            });
        });
    }, [(_b = templateFetcher.data) === null || _b === void 0 ? void 0 : _b.data]);
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = (0, stylesTableColumns_1.buildDefaultStylesTableColumns)({
            people: people,
            tags: tags,
            itemPostingGroups: itemPostingGroups,
            templateOptions: templateOptions,
            formatDate: formatDate,
            translateReplenishment: translateReplenishment,
            translateMethodType: translateMethodType,
            translateTrackingType: translateTrackingType
        });
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        people,
        tags,
        itemPostingGroups,
        templateOptions,
        customColumns,
        formatDate,
        translateReplenishment,
        translateMethodType,
        translateTrackingType
    ]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    var onBulkUpdate = (0, react_2.useCallback)(function (selectedRows, field, value) {
        var formData = new FormData();
        selectedRows.forEach(function (row) {
            if (row.id)
                formData.append("items", row.id);
        });
        formData.append("field", field);
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateItems
        });
    }, [fetcher]);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) { return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
          <react_1.DropdownMenuLabel>
            <macro_1.Trans>Update</macro_1.Trans>
          </react_1.DropdownMenuLabel>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuGroup>
            <react_1.DropdownMenuSub>
              <react_1.DropdownMenuSubTrigger>
                <macro_1.Trans>Item Group</macro_1.Trans>
              </react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuPortal>
                <react_1.DropdownMenuSubContent>
                  {itemPostingGroups.map(function (group) { return (<react_1.DropdownMenuItem key={group.id} onClick={function () {
                return onBulkUpdate(selectedRows, "itemPostingGroupId", group.id);
            }}>
                      <span>{group.name}</span>
                    </react_1.DropdownMenuItem>); })}
                </react_1.DropdownMenuSubContent>
              </react_1.DropdownMenuPortal>
            </react_1.DropdownMenuSub>
            <react_1.DropdownMenuSub>
              <react_1.DropdownMenuSubTrigger>
                <macro_1.Trans>Replenishment</macro_1.Trans>
              </react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuPortal>
                <react_1.DropdownMenuSubContent>
                  {items_models_1.itemReplenishmentSystems.map(function (system) { return (<react_1.DropdownMenuItem key={system} onClick={function () {
                return onBulkUpdate(selectedRows, "replenishmentSystem", system);
            }}>
                      <react_1.DropdownMenuIcon icon={<Icons_1.ReplenishmentSystemIcon type={system}/>}/>
                      <span>{translateReplenishment(system)}</span>
                    </react_1.DropdownMenuItem>); })}
                </react_1.DropdownMenuSubContent>
              </react_1.DropdownMenuPortal>
            </react_1.DropdownMenuSub>
            <react_1.DropdownMenuSub>
              <react_1.DropdownMenuSubTrigger>
                <macro_1.Trans>Default Method Type</macro_1.Trans>
              </react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuPortal>
                <react_1.DropdownMenuSubContent>
                  {shared_1.methodType.map(function (type) { return (<react_1.DropdownMenuItem key={type} onClick={function () {
                return onBulkUpdate(selectedRows, "defaultMethodType", type);
            }}>
                      <react_1.DropdownMenuIcon icon={<components_1.MethodIcon type={type}/>}/>
                      <span>{translateMethodType(type)}</span>
                    </react_1.DropdownMenuItem>); })}
                </react_1.DropdownMenuSubContent>
              </react_1.DropdownMenuPortal>
            </react_1.DropdownMenuSub>
            <react_1.DropdownMenuSub>
              <react_1.DropdownMenuSubTrigger>
                <macro_1.Trans>Tracking Type</macro_1.Trans>
              </react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuPortal>
                <react_1.DropdownMenuSubContent>
                  {items_models_1.itemTrackingTypes.map(function (type) { return (<react_1.DropdownMenuItem key={type} onClick={function () {
                return onBulkUpdate(selectedRows, "itemTrackingType", type);
            }}>
                      <react_1.DropdownMenuIcon icon={<components_1.TrackingTypeIcon type={type}/>}/>
                      <span>{translateTrackingType(type)}</span>
                    </react_1.DropdownMenuItem>); })}
                </react_1.DropdownMenuSubContent>
              </react_1.DropdownMenuPortal>
            </react_1.DropdownMenuSub>
          </react_1.DropdownMenuGroup>
        </react_1.DropdownMenuContent>); }, [
        itemPostingGroups,
        onBulkUpdate,
        translateMethodType,
        translateReplenishment,
        translateTrackingType
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
          <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.style(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Style</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "parts")} destructive onClick={function () {
                setSelectedItem(row);
                deleteItemModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Style</macro_1.Trans>
          </react_1.MenuItem>
        </>); };
    }, [deleteItemModal, navigate, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["id"]
        }} defaultColumnVisibility={{
            description: false,
            active: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} primaryAction={permissions.can("create", "parts") && (<div className="flex items-center gap-2">
                <react_1.Button variant="secondary" leftIcon={<lu_1.LuGroup />} asChild>
                  <react_router_1.Link to={path_1.path.to.itemPostingGroups}>
                    <macro_1.Trans>Item Groups</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>
                <components_1.New label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Style"], ["Style"])))} to={path_1.path.to.newStyle}/>
              </div>)} renderActions={renderActions} renderContextMenu={renderContextMenu} getRowHref={function (row) { return (row.id ? path_1.path.to.style(row.id) : undefined); }} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Styles"], ["Styles"])))} table="style" withSavedView withSelectableRows/>
        {selectedItem && selectedItem.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteItem(selectedItem.id)} isOpen={deleteItemModal.isOpen} name={selectedItem.readableIdWithRevision} text={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), selectedItem.readableIdWithRevision)} onCancel={function () {
                deleteItemModal.onClose();
                setSelectedItem(null);
            }} onSubmit={function () {
                deleteItemModal.onClose();
                setSelectedItem(null);
            }}/>)}
      </>);
});
StylesTable.displayName = "StylesTable";
exports.default = StylesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
