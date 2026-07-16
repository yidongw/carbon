"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewAttributeRoute;
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var Attributes_1 = require("~/modules/people/ui/Attributes");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function NewAttributeRoute() {
    var _a;
    var categoryId = (0, react_router_1.useParams)().categoryId;
    if (!categoryId)
        throw new Error("categoryId is not found");
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var attributesRouteData = (0, hooks_1.useRouteData)(path_1.path.to.attributes);
    return (<Attributes_1.AttributeForm initialValues={{
            name: "",
            // @ts-expect-error
            attributeDataTypeId: shared_1.DataType.Text.toString(),
            userAttributeCategoryId: categoryId,
            canSelfManage: false
        }} 
    // @ts-expect-error TS2322 - TODO: fix type
    dataTypes={(_a = attributesRouteData === null || attributesRouteData === void 0 ? void 0 : attributesRouteData.dataTypes) !== null && _a !== void 0 ? _a : []} onClose={onClose}/>);
}
