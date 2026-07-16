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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useItemsSubmodules;
var macro_1 = require("@lingui/react/macro");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
function useItemsSubmodules(opts) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var hidden = ((_a = companySettings === null || companySettings === void 0 ? void 0 : companySettings.hiddenSubmodules) !== null && _a !== void 0 ? _a : []);
    var addSavedViewsToRoutes = (0, useSavedViews_1.useSavedViews)().addSavedViewsToRoutes;
    var itemsRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Manage"], ["Manage"]))),
            routes: [
                {
                    name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Parts"], ["Parts"]))),
                    to: path_1.path.to.parts,
                    icon: <ai_1.AiOutlinePartition />,
                    table: "part"
                },
                {
                    name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Materials"], ["Materials"]))),
                    to: path_1.path.to.materials,
                    icon: <lu_1.LuAtom />,
                    table: "material"
                },
                {
                    name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Tools"], ["Tools"]))),
                    to: path_1.path.to.tools,
                    icon: <lu_1.LuHammer />,
                    table: "tool"
                },
                {
                    name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Consumables"], ["Consumables"]))),
                    to: path_1.path.to.consumables,
                    icon: <lu_1.LuPizza />,
                    table: "consumable"
                },
                {
                    name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Templates"], ["Templates"]))),
                    to: path_1.path.to.templates,
                    icon: <lu_1.LuLayoutTemplate />
                },
                {
                    name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Styles"], ["Styles"]))),
                    to: path_1.path.to.styles,
                    icon: <lu_1.LuShirt />
                }
            ]
        },
        {
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Style Properties"], ["Style Properties"]))),
            routes: [
                {
                    name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Colors"], ["Colors"]))),
                    to: path_1.path.to.styleColors,
                    icon: <lu_1.LuPalette />,
                    role: "employee"
                },
                {
                    name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Sizes"], ["Sizes"]))),
                    to: path_1.path.to.styleSizes,
                    icon: <lu_1.LuRuler />,
                    role: "employee"
                }
            ]
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Material Properties"], ["Material Properties"]))),
            routes: [
                {
                    name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Dimensions"], ["Dimensions"]))),
                    to: path_1.path.to.materialDimensions,
                    icon: <lu_1.LuAxis3D />,
                    role: "employee"
                },
                {
                    name: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Finishes"], ["Finishes"]))),
                    to: path_1.path.to.materialFinishes,
                    icon: <lu_1.LuDessert />,
                    role: "employee"
                },
                {
                    name: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Grades"], ["Grades"]))),
                    to: path_1.path.to.materialGrades,
                    icon: <lu_1.LuBeef />,
                    role: "employee"
                },
                {
                    name: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Shapes"], ["Shapes"]))),
                    to: path_1.path.to.materialForms,
                    icon: <lu_1.LuShapes />,
                    role: "employee"
                },
                {
                    name: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Substances"], ["Substances"]))),
                    to: path_1.path.to.materialSubstances,
                    icon: <lu_1.LuGlassWater />,
                    role: "employee"
                },
                {
                    name: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Types"], ["Types"]))),
                    to: path_1.path.to.materialTypes,
                    icon: <lu_1.LuPuzzle />,
                    role: "employee"
                }
            ]
        },
        {
            name: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Configure"], ["Configure"]))),
            routes: [
                {
                    name: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Item Groups"], ["Item Groups"]))),
                    to: path_1.path.to.itemPostingGroups,
                    role: "employee",
                    icon: <lu_1.LuGroup />
                },
                {
                    name: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Units"], ["Units"]))),
                    to: path_1.path.to.uoms,
                    role: "employee",
                    icon: <lu_1.LuRuler />
                }
            ]
        }
    ];
    var isVisible = function (route) {
        if (route.role && !permissions.is(route.role))
            return false;
        if (!(opts === null || opts === void 0 ? void 0 : opts.includeHidden) && route.to && hidden.includes(route.to)) {
            return false;
        }
        return true;
    };
    return {
        groups: itemsRoutes
            .map(function (group) { return (__assign(__assign({}, group), { routes: group.routes.filter(isVisible).map(addSavedViewsToRoutes) })); })
            .filter(function (group) { return group.routes.length > 0; })
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
