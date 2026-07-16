"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDocumentsSubmodules;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var path_1 = require("~/utils/path");
function useDocumentsSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var documentsRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["All Documents"], ["All Documents"]))),
            to: path_1.path.to.documents,
            icon: <lu_1.LuFolder />
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["My Documents"], ["My Documents"]))),
            to: path_1.path.to.documents,
            q: "my",
            icon: <lu_1.LuFolderHeart />
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Recent"], ["Recent"]))),
            to: path_1.path.to.documents,
            q: "recent",
            icon: <lu_1.LuClock />
        },
        {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Pinned"], ["Pinned"]))),
            to: path_1.path.to.documents,
            q: "starred",
            icon: <lu_1.LuPin />
        },
        {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Trash"], ["Trash"]))),
            to: path_1.path.to.documents,
            q: "trash",
            icon: <lu_1.LuTrash />
        }
    ];
    return { links: documentsRoutes };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
