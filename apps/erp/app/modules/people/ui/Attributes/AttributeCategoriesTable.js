"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bi_1 = require("react-icons/bi");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var AttributeCategoriesTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(), selectedCategory = _c[0], setSelectedCategory = _c[1];
    var onDelete = function (data) {
        setSelectedCategory(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedCategory(undefined);
        deleteModal.onClose();
    };
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Category"], ["Category"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id} className="flex items-center gap-2">
              {row.original.emoji ? (<span className="text-base">{row.original.emoji}</span>) : (<lu_1.LuListChecks />)}{" "}
              <span>{row.original.name}</span>
            </components_1.Hyperlink>);
                }
            },
            {
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Attributes"], ["Attributes"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<react_1.HStack className="text-xs text-muted-foreground">
              <lu_1.LuListChecks />
              <span>
                {Array.isArray(row.original.userAttribute)
                            ? ((_c = (_b = row.original.userAttribute) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0)
                            : 0}{" "}
                <macro_1.Trans>Attributes</macro_1.Trans>
              </span>
              <react_1.Button variant="secondary" size="sm" onClick={function () {
                            navigate("".concat(path_1.path.to.attributeCategoryList(row.original.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
                        }}>
                <macro_1.Trans>Edit</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>);
                }
            },
            {
                accessorKey: "public",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Visibility"], ["Visibility"]))),
                cell: function (item) {
                    var _a;
                    var isPublic = ((_a = item.getValue()) === null || _a === void 0 ? void 0 : _a.toString()) === "true";
                    return (<react_1.Badge variant={isPublic ? undefined : "outline"}>
                {isPublic ? <macro_1.Trans>Public</macro_1.Trans> : <macro_1.Trans>Private</macro_1.Trans>}
              </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Public"], ["Public"]))), value: "true" },
                            { label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Private"], ["Private"]))), value: "false" }
                        ]
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Visibilities"], ["Visibilities"])))
                }
            }
        ];
    }, [navigate, params, t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.newAttributeForCategory(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
              <react_1.MenuIcon icon={<bi_1.BiAddToQueue />}/>
              <macro_1.Trans>New Attribute</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.attributeCategoryList(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
              <react_1.MenuIcon icon={<bs_1.BsListUl />}/>
              <macro_1.Trans>View Attributes</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem onClick={function () {
                navigate(path_1.path.to.attributeCategory(row.id));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Category</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={row.protected || !permissions.can("delete", "users")} onClick={function () { return onDelete(row); }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Category</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count !== null && count !== void 0 ? count : 0} primaryAction={permissions.can("update", "people") && (<components_1.New label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Category"], ["Category"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Attributes"], ["Attributes"])))}/>
        {selectedCategory && selectedCategory.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteAttributeCategory(selectedCategory.id)} name={(_b = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.name) !== null && _b !== void 0 ? _b : ""} text={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Are you sure you want to deactivate the ", " attribute category?"], ["Are you sure you want to deactivate the ", " attribute category?"])), selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.name)} isOpen={deleteModal.isOpen} onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
      </>);
});
AttributeCategoriesTable.displayName = "AttributeCategoriesTable";
exports.default = AttributeCategoriesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
