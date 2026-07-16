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
var AttributeCategoryDetail = function (_a) {
    var _b;
    var attributeCategory = _a.attributeCategory, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var attributeMap = (0, react_2.useMemo)(function () {
        return Array.isArray(attributeCategory.userAttribute)
            ? attributeCategory.userAttribute.reduce(
            // @ts-ignore
            function (acc, attribute) {
                var _a;
                if (!attribute)
                    return acc;
                return __assign(__assign({}, acc), (_a = {}, _a[attribute.id] = attribute, _a));
            }, {})
            : {};
    }, [attributeCategory]);
    var _c = (0, react_2.useState)(Array.isArray(attributeCategory.userAttribute)
        ? attributeCategory.userAttribute
            .sort(function (a, b) { return a.sortOrder - b.sortOrder; })
            .map(function (attribute) { return attribute.id; })
        : []), sortOrder = _c[0], setSortOrder = _c[1];
    (0, react_2.useEffect)(function () {
        if (Array.isArray(attributeCategory.userAttribute)) {
            var sorted = __spreadArray([], attributeCategory.userAttribute, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                .map(function (attribute) { return attribute.id; });
            setSortOrder(sorted);
        }
    }, [attributeCategory.userAttribute]);
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
    }, 1000, true);
    var deleteModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(), selectedAttribute = _d[0], setSelectedAttribute = _d[1];
    var onDelete = function (data) {
        setSelectedAttribute(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedAttribute(undefined);
        deleteModal.onClose();
    };
    var renderContextMenu = function (attributeId) {
        return (<>
        <react_1.MenuItem asChild>
          <react_router_1.Link to={attributeId}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Attribute</macro_1.Trans>
          </react_router_1.Link>
        </react_1.MenuItem>
        <react_1.MenuItem destructive onClick={function () { return onDelete(attributeMap[attributeId]); }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete Attribute</macro_1.Trans>
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
            <react_1.DrawerTitle>
              {attributeCategory.emoji ? (<span>{attributeCategory.emoji}</span>) : null}{" "}
              {attributeCategory.name}
            </react_1.DrawerTitle>
            <react_1.DrawerDescription>
              <react_1.Badge variant={attributeCategory.public ? "default" : "secondary"}>
                {attributeCategory.public ? (<macro_1.Trans>Public</macro_1.Trans>) : (<macro_1.Trans>Private</macro_1.Trans>)}
              </react_1.Badge>
            </react_1.DrawerDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            {Array.isArray(attributeCategory === null || attributeCategory === void 0 ? void 0 : attributeCategory.userAttribute) && (<framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="space-y-2 w-full">
                {sortOrder.map(function (sortId) {
                var _a, _b, _c, _d, _e;
                return (<framer_motion_1.Reorder.Item key={sortId} value={sortId} className="rounded-lg w-full">
                      <react_1.HStack>
                        <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost"/>
                        <p className="flex-grow text-foreground">
                          {
                    // @ts-ignore
                    (_a = attributeMap[sortId]) === null || _a === void 0 ? void 0 : _a.name}
                        </p>
                        <react_1.Button isDisabled leftIcon={getIcon(
                    // @ts-ignore
                    (_b = attributeMap[sortId]) === null || _b === void 0 ? void 0 : _b.attributeDataType)} variant="ghost">
                          {
                    // @ts-ignore
                    (_e = (_d = (_c = attributeMap[sortId]) === null || _c === void 0 ? void 0 : _c.attributeDataType) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Unknown"], ["Unknown"])))}
                        </react_1.Button>
                        <react_1.ActionMenu>{renderContextMenu(sortId)}</react_1.ActionMenu>
                      </react_1.HStack>
                    </framer_motion_1.Reorder.Item>);
            })}
              </framer_motion_1.Reorder.Group>)}
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <components_1.New to={"new?".concat(params.toString())} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Attribute"], ["Attribute"])))}/>
          </react_1.DrawerFooter>
        </react_1.DrawerContent>
      </react_1.Drawer>
      {selectedAttribute && selectedAttribute.id && (<Modals_1.ConfirmDelete isOpen={deleteModal.isOpen} action={path_1.path.to.deleteAttribute(selectedAttribute.id)} name={(_b = selectedAttribute === null || selectedAttribute === void 0 ? void 0 : selectedAttribute.name) !== null && _b !== void 0 ? _b : ""} text={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Are you sure you want to deactivate the ", " attribute?"], ["Are you sure you want to deactivate the ", " attribute?"])), selectedAttribute === null || selectedAttribute === void 0 ? void 0 : selectedAttribute.name)} onCancel={onDeleteCancel}/>)}
    </>);
};
function getIcon(_a) {
    var isBoolean = _a.isBoolean, isDate = _a.isDate, isNumeric = _a.isNumeric, isText = _a.isText, isUser = _a.isUser;
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
}
exports.default = AttributeCategoryDetail;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
