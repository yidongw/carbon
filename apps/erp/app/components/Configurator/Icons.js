"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorDataTypeIcon = ConfiguratorDataTypeIcon;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
function ConfiguratorDataTypeIcon(_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "numeric":
            return <lu_1.LuHash className={(0, react_1.cn)("w-4 h-4 text-blue-600", className)}/>;
        case "text":
            return <lu_1.LuType className={(0, react_1.cn)("w-4 h-4 text-green-600", className)}/>;
        case "boolean":
            return (<lu_1.LuToggleLeft className={(0, react_1.cn)("w-4 h-4 text-purple-600", className)}/>);
        case "enum":
        case "list":
            return <lu_1.LuList className={(0, react_1.cn)("w-4 h-4 text-orange-600", className)}/>;
        case "date":
            return <lu_1.LuCalendar className={(0, react_1.cn)("w-4 h-4 text-red-600", className)}/>;
        case "material":
            return <lu_1.LuAtom className={(0, react_1.cn)("w-4 h-4 text-yellow-600", className)}/>;
        default:
            return null;
    }
}
