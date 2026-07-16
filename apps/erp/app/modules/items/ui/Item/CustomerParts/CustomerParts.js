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
var Editable_1 = require("~/components/Editable");
var Grid_1 = require("~/components/Grid");
var path_1 = require("~/utils/path");
var useCustomerParts_1 = require("./useCustomerParts");
var CustomerParts = function (_a) {
    var customerParts = _a.customerParts, itemId = _a.itemId;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, useCustomerParts_1.default)(), canEdit = _b.canEdit, onCellEdit = _b.onCellEdit, canDelete = _b.canDelete;
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "customer.id",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="justify-between min-w-[100px]">
            <components_1.CustomerAvatar customerId={row.original.customerId}/>
            <div className="relative w-6 h-5">
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit purchase order line type"], ["Edit purchase order line type"])))} icon={<lu_1.LuEllipsisVertical />} size="md" className="absolute right-[-1px] top-[-6px]" variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent>
                  <react_1.DropdownMenuItem onClick={function () {
                            return navigate(path_1.path.to.customerPart(itemId, row.original.id));
                        }} disabled={!canEdit}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                    Edit Customer Part
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () {
                            return navigate(path_1.path.to.deleteCustomerPart(itemId, row.original.id));
                        }} destructive disabled={!canDelete}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                    Delete Customer Part
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </div>
          </react_1.HStack>);
                }
            },
            {
                accessorKey: "customerPartId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customer ID"], ["Customer ID"]))),
                cell: function (item) { return item.getValue(); }
            },
            {
                accessorKey: "customerPartRevision",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer Revision"], ["Customer Revision"]))),
                cell: function (item) { return item.getValue(); }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [canDelete, canEdit, itemId, navigate, t]);
    var editableComponents = (0, react_2.useMemo)(function () { return ({
        customerPartId: (0, Editable_1.EditableText)(onCellEdit),
        customerPartRevision: (0, Editable_1.EditableText)(onCellEdit)
    }); }, [onCellEdit]);
    return (<>
      <react_1.Card className="w-full">
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Customer Parts</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            {canEdit && <components_1.New to={path_1.path.to.newCustomerPart(itemId)}/>}
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <Grid_1.default data={customerParts} columns={columns} canEdit={canEdit} editableComponents={editableComponents} onNewRow={canEdit
            ? function () { return navigate(path_1.path.to.newCustomerPart(itemId)); }
            : undefined}/>
        </react_1.CardContent>
      </react_1.Card>
      <react_router_1.Outlet />
    </>);
};
exports.default = CustomerParts;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
