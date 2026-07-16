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
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var ai_1 = require("react-icons/ai");
var bi_1 = require("react-icons/bi");
var bs_1 = require("react-icons/bs");
var cg_1 = require("react-icons/cg");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var CustomFieldCategoryDetail = function (_a) {
    var _b;
    var customFieldTable = _a.customFieldTable, dataTypes = _a.dataTypes, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var table = (0, react_router_1.useParams)().table;
    if (!table)
        throw new Error("table is not found");
    var params = (0, hooks_1.useUrlParams)()[0];
    var getAttributeDataType = (0, react_2.useCallback)(function (id) {
        return dataTypes.find(function (dt) { return dt.id === id; });
    }, [dataTypes]);
    var fieldMap = (0, react_2.useMemo)(function () {
        return Array.isArray(customFieldTable.fields)
            ? customFieldTable.fields.reduce(function (acc, field) {
                var _a;
                if (!field)
                    return acc;
                var customField = field;
                return __assign(__assign({}, acc), (_a = {}, _a[customField.id] = __assign(__assign({}, customField), { dataType: getAttributeDataType(customField.dataTypeId) }), _a));
            }, {})
            : {};
    }, [customFieldTable.fields, getAttributeDataType]);
    var _c = (0, react_2.useState)(Array.isArray(customFieldTable.fields)
        ? customFieldTable.fields
            .sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
        })
            .map(function (field) { return field.id; })
        : []), sortOrder = _c[0], setSortOrder = _c[1];
    (0, react_2.useEffect)(function () {
        if (Array.isArray(customFieldTable.fields)) {
            var sorted = __spreadArray([], customFieldTable.fields, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                .map(function (field) { return field.id; });
            setSortOrder(sorted);
        }
    }, [customFieldTable.fields]);
    var onReorder = function (newOrder) {
        var updates = {};
        // Update all positions to ensure consistent ordering
        newOrder.forEach(function (id, index) {
            updates[id] = index + 1;
        });
        setSortOrder(newOrder);
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, { method: "post" });
    }, 2500, true);
    var deleteModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(), selectedCustomField = _d[0], setSelectedCustomField = _d[1];
    var onDelete = function (data) {
        setSelectedCustomField(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedCustomField(undefined);
        deleteModal.onClose();
    };
    var renderContextMenu = function (fieldId) {
        return (<>
        <react_1.MenuItem asChild>
          <react_router_1.Link to={"".concat(fieldId, "?").concat(params.toString())}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Custom Field</macro_1.Trans>
          </react_router_1.Link>
        </react_1.MenuItem>
        <react_1.MenuItem destructive onClick={function () { return onDelete(fieldMap[fieldId]); }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete Custom Field</macro_1.Trans>
        </react_1.MenuItem>
      </>);
    };
    return (<>
      <react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.DrawerContent>
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{customFieldTable.name}</react_1.DrawerTitle>
            <react_1.DrawerDescription>{customFieldTable.module}</react_1.DrawerDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            {Array.isArray(customFieldTable === null || customFieldTable === void 0 ? void 0 : customFieldTable.fields) && (<framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="space-y-2 w-full">
                {sortOrder.map(function (sortId) {
                var _a, _b, _c, _d, _e, _f, _g;
                return (<framer_motion_1.Reorder.Item key={sortId} value={sortId} className="rounded-lg w-full">
                      <react_1.HStack>
                        <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost"/>
                        <p className="flex-grow text-foreground flex items-center justify-between">
                          <span>{(_a = fieldMap[sortId]) === null || _a === void 0 ? void 0 : _a.name}</span>
                          {((_b = fieldMap[sortId]) === null || _b === void 0 ? void 0 : _b.required) && (<span className="text-muted-foreground text-xxs">
                              <macro_1.Trans>Required</macro_1.Trans>
                            </span>)}
                        </p>
                        <react_1.Button isDisabled leftIcon={(_d = getIcon((_c = fieldMap[sortId]) === null || _c === void 0 ? void 0 : _c.dataType)) !== null && _d !== void 0 ? _d : undefined} variant="ghost">
                          {(_g = (_f = (_e = fieldMap[sortId]) === null || _e === void 0 ? void 0 : _e.dataType) === null || _f === void 0 ? void 0 : _f.label) !== null && _g !== void 0 ? _g : "Unknown"}
                        </react_1.Button>
                        <react_1.ActionMenu>{renderContextMenu(sortId)}</react_1.ActionMenu>
                      </react_1.HStack>
                    </framer_motion_1.Reorder.Item>);
            })}
              </framer_motion_1.Reorder.Group>)}
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.Button asChild size="md">
              <components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Custom Field"], ["Custom Field"])))} to={"new?".concat(params === null || params === void 0 ? void 0 : params.toString())}/>
            </react_1.Button>
          </react_1.DrawerFooter>
        </react_1.DrawerContent>
      </react_1.Drawer>
      {selectedCustomField && selectedCustomField.id && (<Modals_1.ConfirmDelete isOpen={deleteModal.isOpen} action={path_1.path.to.deleteCustomField(table, selectedCustomField.id)} name={(_b = selectedCustomField === null || selectedCustomField === void 0 ? void 0 : selectedCustomField.name) !== null && _b !== void 0 ? _b : ""} text={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Are you sure you want to delete the ", " field?"], ["Are you sure you want to delete the ", " field?"])), selectedCustomField === null || selectedCustomField === void 0 ? void 0 : selectedCustomField.name)} onSubmit={onDeleteCancel} onCancel={onDeleteCancel}/>)}
    </>);
};
function getIcon(props) {
    if (!props)
        return null;
    var isBoolean = props.isBoolean, isDate = props.isDate, isNumeric = props.isNumeric, isText = props.isText, isUser = props.isUser, isCustomer = props.isCustomer, isSupplier = props.isSupplier;
    if (isBoolean)
        return <bs_1.BsToggleOn />;
    if (isDate)
        return <bs_1.BsCalendarDate />;
    if (isNumeric)
        return <ai_1.AiOutlineNumber />;
    if (isText)
        return <bi_1.BiText />;
    if (isUser)
        return <cg_1.CgProfile />;
    if (isCustomer)
        return <lu_1.LuSquareUser />;
    if (isSupplier)
        return <lu_1.LuContainer />;
}
exports.default = CustomFieldCategoryDetail;
var templateObject_1, templateObject_2, templateObject_3;
